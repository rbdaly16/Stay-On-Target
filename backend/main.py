"""FastAPI app: serves the frontend, the task API, Owl Post chat, and a password login.

Local:  .venv/bin/uvicorn backend.main:app --port 8765   (run from gannt_chart/)
Render: see render.yaml at the repo root.

Env vars: DATABASE_URL (Neon Postgres; unset = local data.js), APP_PASSWORD (required on Render),
SESSION_SECRET (signs the login cookie), PORTKEY_API_KEY, APP_TIMEZONE (default America/New_York).
"""

import hashlib
import hmac
import os
import secrets
import time
import urllib.error

from fastapi import FastAPI, Form, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from . import owl, storage

FRONTEND = storage.ROOT / "frontend"
ON_RENDER = bool(os.environ.get("RENDER"))
APP_PASSWORD = os.environ.get("APP_PASSWORD", "")
SESSION_SECRET = os.environ.get("SESSION_SECRET") or secrets.token_hex(32)
SESSION_DAYS = 30
COOKIE = "owl_session"
PUBLIC_PATHS = {"/login", "/healthz", "/styles.css", "/themes.js"}

if ON_RENDER and not APP_PASSWORD:
    raise RuntimeError("APP_PASSWORD must be set on Render so the site isn't public.")
if ON_RENDER and not storage.DATABASE_URL:
    raise RuntimeError("DATABASE_URL must be set on Render; its disk is wiped on every restart.")

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.on_event("startup")
def startup() -> None:
    if storage.DATABASE_URL:
        storage.init_db()


# ---- auth: one shared password, HMAC-signed expiring cookie ----

def _sign(expires: int) -> str:
    sig = hmac.new(SESSION_SECRET.encode(), str(expires).encode(), hashlib.sha256).hexdigest()
    return f"{expires}.{sig}"


def _valid(token: str | None) -> bool:
    try:
        expires, _ = token.split(".", 1)
        return int(expires) > time.time() and hmac.compare_digest(token, _sign(int(expires)))
    except (AttributeError, ValueError):
        return False


@app.middleware("http")
async def require_login(request: Request, call_next):
    if not APP_PASSWORD or request.url.path in PUBLIC_PATHS or _valid(request.cookies.get(COOKIE)):
        return await call_next(request)
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Please log in again."}, status_code=401)
    return RedirectResponse("/login", status_code=303)


@app.get("/login")
def login_page():
    if not APP_PASSWORD:  # local use without a password: nothing to log into
        return RedirectResponse("/", status_code=303)
    return FileResponse(FRONTEND / "login.html")


@app.post("/login")
def login(password: str = Form(...)):
    if not APP_PASSWORD or not hmac.compare_digest(password.encode(), APP_PASSWORD.encode()):
        time.sleep(1)  # slow down guessing
        return RedirectResponse("/login?error=1", status_code=303)
    resp = RedirectResponse("/", status_code=303)
    resp.set_cookie(COOKIE, _sign(int(time.time()) + SESSION_DAYS * 86400), max_age=SESSION_DAYS * 86400,
                    httponly=True, secure=ON_RENDER, samesite="lax")
    return resp


@app.post("/logout")
def logout():
    resp = RedirectResponse("/login", status_code=303)
    resp.delete_cookie(COOKIE)
    return resp


@app.get("/healthz")
def healthz():
    return {"ok": True}


# ---- API ----

@app.get("/api/data")
def get_data():
    return storage.load()


@app.post("/api/chat")
def chat(payload: dict):
    messages = [m for m in payload.get("messages", []) if m.get("role") in ("user", "assistant")]
    try:
        plan = owl.call_model(messages, storage.load(), payload.get("theme", "hp"))
        # Re-read under lock when applying, so nothing saved during the model call is lost.
        with storage.mutate() as data:
            changes = owl.apply_changes(data, plan)
            snapshot = dict(data)
        return {"reply": plan.get("reply", ""), "changes": changes, "data": snapshot}
    except urllib.error.HTTPError as e:
        return JSONResponse({"error": f"Model request failed ({e.code})"}, status_code=502)
    except Exception as e:  # surface failures in the chat panel instead of hanging it
        return JSONResponse({"error": str(e)}, status_code=500)


@app.get("/")
def index():
    return FileResponse(FRONTEND / "index.html")


app.mount("/", StaticFiles(directory=FRONTEND), name="frontend")
