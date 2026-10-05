"""FastAPI app: serves the frontend, each user's task API, and Owl Post chat.

Sign-in is handled by Clerk (see auth.py); every /api/ route except /api/config works on
the signed-in user's own tracker only. The page shell and scripts are public; they hold
no task data.

Local:  .venv/bin/uvicorn backend.main:app --port 8765   (run from gannt_chart/)
Render: see render.yaml.

Env vars: CLERK_PUBLISHABLE_KEY (or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), DATABASE_URL (Neon
Postgres; unset = shared local data.js), PORTKEY_API_KEY, APP_ORIGINS (allowed token
origins), CHAT_DAILY_LIMIT (Owl Post messages per user per day, default 60),
APP_TIMEZONE (default America/New_York).
"""

import os
import time
import urllib.error

from . import config  # noqa: F401  (loads .env before the modules below read settings)
from fastapi import Depends, FastAPI
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from . import auth, owl, storage

FRONTEND = storage.ROOT / "frontend"
CHAT_DAILY_LIMIT = int(config.env("CHAT_DAILY_LIMIT", default="60"))
# Stamped onto script/stylesheet URLs so every deploy loads fresh, matching files.
ASSET_VERSION = os.environ.get("RENDER_GIT_COMMIT", "")[:8] or str(int(time.time()))

if not auth.PUBLISHABLE_KEY:
    raise RuntimeError("CLERK_PUBLISHABLE_KEY must be set.")
if config.ON_RENDER and not storage.DATABASE_URL:
    raise RuntimeError("DATABASE_URL must be set on Render; its disk is wiped on every restart.")

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.middleware("http")
async def revalidate(request, call_next):
    """Browsers must check for a newer version on every load (cheap 304 if unchanged), so
    a deploy never leaves someone running stale scripts that don't match each other."""
    response = await call_next(request)
    response.headers.setdefault("Cache-Control", "no-cache")
    return response


@app.on_event("startup")
def startup() -> None:
    if storage.DATABASE_URL:
        storage.init_db()


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/api/config")
def public_config():
    """What the browser needs to load Clerk. Both values are public by design."""
    return {"publishableKey": auth.PUBLISHABLE_KEY, "frontendApi": auth.frontend_api()}


@app.get("/api/data")
def get_data(user_id: str = Depends(auth.current_user)):
    return storage.load(user_id)


@app.post("/api/chat")
def chat(payload: dict, user_id: str = Depends(auth.current_user)):
    if storage.count_chat(user_id, owl.local_today().isoformat()) > CHAT_DAILY_LIMIT:
        return JSONResponse({"error": f"Daily limit of {CHAT_DAILY_LIMIT} messages reached; back tomorrow"}, status_code=429)
    messages = [m for m in payload.get("messages", []) if m.get("role") in ("user", "assistant")]
    try:
        plan = owl.call_model(messages, storage.load(user_id), payload.get("theme", "hp"))
        # Re-read under lock when applying, so nothing saved during the model call is lost.
        with storage.mutate(user_id) as data:
            changes = owl.apply_changes(data, plan)
            # Safeguard: never silently drop a new task that's missing required fields.
            for new in plan.get("new_tasks") or []:
                if missing := owl.missing_new_task_fields(new):
                    title = str(new.get("title") or "").strip() or "the new task"
                    plan["reply"] = (plan.get("reply", "") + f"\n\nI haven't added \"{title}\" yet. I still need its "
                                     f"{', '.join(missing)}. (Categories: {', '.join(owl.CATEGORIES)}; "
                                     f"priorities: {', '.join(owl.PRIORITIES)}.)").strip()
            snapshot = dict(data)
        return {"reply": plan.get("reply", ""), "changes": changes, "data": snapshot}
    except urllib.error.HTTPError as e:
        return JSONResponse({"error": f"Model request failed ({e.code})"}, status_code=502)
    except Exception as e:  # surface failures in the chat panel instead of hanging it
        return JSONResponse({"error": str(e)}, status_code=500)


@app.get("/login")
def old_login_page():
    """The pre-Clerk password page; old bookmarks land on the app, which shows Clerk sign-in."""
    return RedirectResponse("/", status_code=303)


@app.get("/")
def index():
    html = (FRONTEND / "index.html").read_text()
    html = html.replace('.js"></script>', f'.js?v={ASSET_VERSION}"></script>')
    html = html.replace('href="styles.css"', f'href="styles.css?v={ASSET_VERSION}"')
    return HTMLResponse(html)


app.mount("/", StaticFiles(directory=FRONTEND), name="frontend")
