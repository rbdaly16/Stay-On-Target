"""Clerk sign-in: verifies the session token the browser sends with each API call.

The frontend gets a short-lived token from Clerk (Clerk.session.getToken()) and sends it
as `Authorization: Bearer <token>`. We check its signature against Clerk's public keys
(JWKS), its expiry, and that it was issued to one of our own origins (`azp`). The user id
is the token's `sub`. The secret key is only needed for Clerk's Backend API (manage.py).
"""

import base64
import json
import urllib.parse
import urllib.request
from functools import lru_cache

import jwt
from fastapi import HTTPException, Request

from .config import env

PUBLISHABLE_KEY = env("CLERK_PUBLISHABLE_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
SECRET_KEY = env("CLERK_SECRET_KEY")
AUTHORIZED_PARTIES = {
    o.strip().rstrip("/")
    for o in env(
        "APP_ORIGINS",
        default="https://hogwarts-task-map.onrender.com,http://127.0.0.1:8765,http://localhost:8765",
    ).split(",")
    if o.strip()
}


def frontend_api() -> str:
    """Clerk's Frontend API host, encoded in the publishable key: pk_<env>_<base64 host + '$'>."""
    encoded = PUBLISHABLE_KEY.split("_", 2)[2]
    host = base64.b64decode(encoded + "=" * (-len(encoded) % 4)).decode()
    return host.rstrip("$")


@lru_cache(maxsize=1)
def _jwks_client() -> jwt.PyJWKClient:
    return jwt.PyJWKClient(f"https://{frontend_api()}/.well-known/jwks.json", cache_keys=True)


def verify_token(token: str) -> str:
    """Return the Clerk user id for a valid session token, else raise jwt.PyJWTError."""
    key = _jwks_client().get_signing_key_from_jwt(token).key
    claims = jwt.decode(token, key, algorithms=["RS256"], leeway=10, options={"require": ["exp", "iat", "sub"]})
    if claims.get("azp") and claims["azp"].rstrip("/") not in AUTHORIZED_PARTIES:
        raise jwt.InvalidTokenError(f"token issued for another site: {claims['azp']}")
    return claims["sub"]


def current_user(request: Request) -> str:
    """FastAPI dependency: the signed-in user's id, or 401."""
    scheme, _, token = request.headers.get("Authorization", "").partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Please sign in.")
    try:
        return verify_token(token)
    except (jwt.PyJWTError, ValueError, IndexError):
        raise HTTPException(status_code=401, detail="Please sign in again.")


def clerk_api(path: str, **params) -> object:
    """GET from Clerk's Backend API (needs CLERK_SECRET_KEY)."""
    if not SECRET_KEY:
        raise RuntimeError("CLERK_SECRET_KEY is not set")
    url = f"https://api.clerk.com/v1{path}" + (f"?{urllib.parse.urlencode(params, doseq=True)}" if params else "")
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {SECRET_KEY}", "User-Agent": "stay-on-target/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.load(resp)


def user_id_for_email(email: str) -> str | None:
    users = clerk_api("/users", email_address=[email])
    return users[0]["id"] if users else None
