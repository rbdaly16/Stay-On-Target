# Gantt Task Tracker

- `frontend/`: `index.html`, `app.js`, `styles.css`, `characters.js` (Labubus), `chat.js` (Owl Post), `login.html`. Plain JS, no build step.
- `backend/`: FastAPI. `main.py` (routes + password login), `storage.py` (Postgres when `DATABASE_URL` is set, else local `data.js`), `owl.py` (gpt5.6-luna via Portkey Responses API; validates model-proposed changes).
- Local run: `.venv/bin/uvicorn backend.main:app --port 8765` from `gannt_chart/` (preview config "gantt"). No `APP_PASSWORD` locally = no login.
- Deployed on Render (free web service, `gannt_chart/render.yaml`) with data in a free Neon Postgres database.
- GitHub: this folder alone is published to its own private repo, rbdaly16/Stay-On-Target (remote `hogwarts`); Render deploys from it with `git subtree push --prefix=gannt_chart hogwarts main`, run from the my-app root. Never push the my-app repo itself. `data.js` and `.env` are gitignored and must never be committed.

## Where to make updates
- Once the live site exists, **the live Postgres database is the source of truth**. Before editing for the user, run `.venv/bin/python manage.py pull` (live → `data.js`), edit `data.js`, then `manage.py push` (asks for confirmation; overwrites live). `manage.py` reads the Neon connection string from `NEON_STAY_ON_TARGET_DATABASE_URL` in the repo-root `.env` (Neon project "Stay on Target"). If that isn't set up, ask the user to make the update through Owl Post instead.
- `data.js` body after `window.TASK_DATA = ` must stay strict JSON (quoted keys, no trailing commas).
- The user may also update through Owl Post; it follows the same rules below.

## Daily check-ins
When the user reports what they did (or didn't) work on:
- Match each item to an existing task in `data.js`. If an item doesn't clearly match one, ask before creating a new task.
- Append a note `{ date: "<today YYYY-MM-DD>", text: "..." }` to that task's `notes` with what they said, briefly and in plain words. Add notes for "didn't work on it" too.
- Change `status` only when the report implies it (started → "In progress", finished → "Done", stuck → "Blocked").
- Change `deadline`, `priority`, or `start` only if the user says so.
- Set `lastUpdated` to today's date.
- Afterward, summarize what changed (and push to live if using manage.py).

## Helpers
Every task gets a `helper: { character, reason }`: the Harry Potter character best suited to it, shown as a Labubu with `reason` (1–2 sentences) as hover text. `character` must be a key in `frontend/characters.js`. If a better fit isn't there yet, add a Labubu for it (same SVG layering as the others). Never use image generation.

## Planning questions
For "what's coming up this week/month" or "how should I prioritize", read `data.js` and answer from it. Rank by deadline, priority, and overdue status, and note anything that's blocked or hasn't been touched lately.

## Allowed values
- category: Work | School | Job Search | Personal
- status: Not started | In progress | Blocked | Done
- priority: High | Medium | Low

If a new value is needed, add it to `GROUP_ORDER` in `frontend/app.js` and the lists in `backend/owl.py` as well.
