# Gantt Task Tracker

- `frontend/`: `index.html`, `app.js`, `styles.css`, `themes.js` (wording for each theme: `hp` Harry Potter, `sw` Star Wars, `hindu` Hindu/South Indian, `dragon` Empyrean, `wof` Wings of Fire; picker in header, saved in localStorage), `characters.js` / `characters_sw.js` / `characters_dragon.js` (cute chibi characters via `characterSVG`/`chibiSVG`; dragons use `kind: "dragon"`), `characters_hindu.js` (Tanjore-style deity medallions via `medallionSVG`), and `characters_wof.js` (cute chibi dragons via `dragonSVG`), `chat.js` (Owl Post / Holocomm), `auth.js` (Clerk sign-in, `apiFetch` adds the session token). Plain JS, no build step. Each theme's styling is `:root[data-theme="<id>"]` overrides in `styles.css` (dark-theme readability fixes are shared by `sw` and `dragon`). `celebrate.js` plays a themed scene (`SCENES` map: X-wing vs. Death Star / Hedwig / kolam + diyas + petals / lightning + Tairn) when a task newly shows as Done in a browser; preview with `?celebrate` in the URL.
- Art: the user doesn't want Labubus anywhere. Use cute chibi characters (or chibi dragons); the Hindu medallions stay as they are.
- To add a theme, use the `add-gantt-theme` skill (`my-app/.claude/skills/add-gantt-theme/`). Adding a theme touches: `themes.js`, a roster file + `<script>` in `index.html` (+ Google Fonts link), `ROSTERS`/`RENDERERS` in `app.js`, `SCENES` in `celebrate.js`, CSS overrides, and `ROSTERS`/`DEFAULT_HELPER`/`THEME_FLAVOR`/`HELPER_GUIDE` in `backend/owl.py`; then give every existing task a helper for the new theme (pull, edit, push).
- `backend/`: FastAPI. `main.py` (routes, per-user Owl Post daily limit), `auth.py` (verifies Clerk session tokens via JWKS + `azp`; user id = token `sub`), `storage.py` (one tracker per Clerk user in Neon table `trackers`; without `DATABASE_URL`, everyone shares local `data.js`), `owl.py` (gpt5.6-luna via Portkey Responses API; validates model-proposed changes), `config.py` (loads `.env` files locally).
- Accounts: Clerk (dev instance, app "Stay on Target"; email + Google). Keys in the root `.env`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (secret is only used by `manage.py`). Every API route works on the signed-in user's own tracker only; never take a user id from the request body.
- Local run: `.venv/bin/uvicorn backend.main:app --port 8765` from `gannt_chart/` (preview config "gantt"). Sign-in still goes through Clerk; Claude can't sign in (external account), so test auth with self-minted tokens instead.
- Deployed on Render (free web service, `gannt_chart/render.yaml`) with data in a free Neon Postgres database.
- GitHub: this folder alone is published to its own private repo, rbdaly16/Stay-On-Target (remote `hogwarts`), which Render deploys from. Publish changes with `git subtree push --prefix=gannt_chart hogwarts main`, run from the my-app root. Never push the my-app repo itself. `data.js` and `.env` are gitignored and must never be committed.

## Where to make updates
- Once the live site exists, **the live Postgres database is the source of truth**. Before editing for the user, run `.venv/bin/python manage.py pull` (their live tracker → `data.js`), edit `data.js`, then `manage.py push` (asks for confirmation; overwrites live). Both take `--email` (default `OWNER_EMAIL` in the root `.env`). `manage.py` reads the Neon connection string from `NEON_STAY_ON_TARGET_DATABASE_URL` in the repo-root `.env` (Neon project "Stay on Target"). If that isn't set up, ask the user to make the update through Owl Post instead.
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
Every task gets `helpers: { hp, sw, hindu, dragon, wof }`, each `{ character, reason }`: the character best suited to it in that theme, with `reason` (1–2 sentences) as hover text. Keys come from the matching roster file. If a better fit isn't there yet, draw one (same SVG approach as the others). Never use image generation.
- Hindu theme: deities are never drawn as cartoons or chibis (the user chose reverent Tanjore-style symbol medallions). Reasons must be accurate to each deity's traditional role as understood in South India, and never joke about a deity.
- Wings of Fire theme: all three arcs are fair game (through The Flames of Hope).
- Empyrean theme: the user and Meghna have read through Onyx Storm, so later-book facts are fine; prefer verified facts (signets, dragon breeds) over memory.

## Planning questions
For "what's coming up this week/month" or "how should I prioritize", read `data.js` and answer from it. Rank by deadline, priority, and overdue status, and note anything that's blocked or hasn't been touched lately.

## Allowed values
- category: Work | School | Job Search | Personal | Uncategorized
- deadline and start may be null: a quick-captured task (title only) is Uncategorized, Medium, undated, and shows a "No deadline yet" tag instead of a bar until it gets a deadline. Never invent a deadline.
- status: Not started | In progress | Blocked | Done
- priority: High | Medium | Low

If a new value is needed, add it to `GROUP_ORDER` in `frontend/app.js` and the lists in `backend/owl.py` as well.
