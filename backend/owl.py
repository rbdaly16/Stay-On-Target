"""Owl Post: turns a chat message into task updates.

Sends the conversation plus current tasks to gpt5.6-luna via Portkey (Responses API).
The model returns a reply and proposed changes; apply_changes validates them before
anything is written.
"""

import json
import os
import re
import urllib.error
import urllib.request
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
MODEL = "gpt5.6-luna"
PORTKEY_URL = "https://api.portkey.ai/v1/responses"
TIMEZONE = ZoneInfo(os.environ.get("APP_TIMEZONE", "America/New_York"))

CATEGORIES = ["Work", "School", "Job Search", "Personal"]
STATUSES = ["Not started", "In progress", "Blocked", "Done"]
PRIORITIES = ["High", "Medium", "Low"]
def _roster(filename: str) -> list[str]:
    return re.findall(r"^  (\w+): \{", (ROOT / "frontend" / filename).read_text(), re.M)


# Helper characters per page theme; each task stores one helper per theme in `helpers`.
ROSTERS = {"hp": _roster("characters.js"), "sw": _roster("characters_sw.js")}
DEFAULT_HELPER = {"hp": "hermione", "sw": "yoda"}
THEME_FLAVOR = {"hp": "Hogwarts", "sw": "Star Wars"}


def local_today() -> date:
    """Today in the user's timezone (Render servers run on UTC)."""
    return datetime.now(TIMEZONE).date()


def load_api_key() -> str:
    if os.environ.get("PORTKEY_API_KEY"):
        return os.environ["PORTKEY_API_KEY"].strip()
    for folder in (ROOT, *ROOT.parents):
        env = folder / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                if line.startswith("PORTKEY_API_KEY="):
                    return line.split("=", 1)[1].strip().strip("'\"")
    raise RuntimeError("PORTKEY_API_KEY is not set")


SYSTEM_PROMPT = """You manage the user's personal task tracker (a Gantt chart with Harry Potter and Star Wars themes).
Today is {today_long} ({today}).

The user either reports progress ("finished X", "started Y", "didn't touch Z"), asks to add or change tasks,
or asks planning questions ("what's coming up this week?", "how should I prioritize?").

Rules for updates:
- Match each item to an existing task id. If it's unclear which task they mean, ask instead of guessing.
- Record what they said as a short, plain note on that task (include "didn't work on it" reports too).
- Change status only when implied: started -> "In progress", finished -> "Done", stuck -> "Blocked".
- Change deadline, start, priority, title, or category only if the user says so. Resolve weekday names to the
  next upcoming date in YYYY-MM-DD.
- Only create a new task when the user clearly asks for or describes a new task. Give it two helpers, the
  characters best suited to it, each with a 1-2 sentence playful reason: "hp" chosen from {hp_characters},
  and "sw" chosen from {sw_characters}.
- For planning questions, answer from the tasks: weigh deadlines, priority, overdue items, and tasks with
  no recent notes. Make no changes.
- Keep replies short and friendly; a light {flavor} flavor is welcome.

Allowed values: category {categories}; status {statuses}; priority {priorities}.

Current data:
{data}

Respond with ONLY a JSON object of this shape:
{{
  "reply": "message to the user",
  "updates": [{{"id": "existing-id", "note": "optional note", "status": "...", "priority": "...",
               "start": "YYYY-MM-DD", "deadline": "YYYY-MM-DD", "title": "...", "category": "..."}}],
  "new_tasks": [{{"title": "...", "category": "...", "status": "...", "priority": "...",
                 "start": "YYYY-MM-DD", "deadline": "YYYY-MM-DD", "note": "optional",
                 "helpers": {{"hp": {{"character": "key", "reason": "..."}},
                             "sw": {{"character": "key", "reason": "..."}}}}}}]
}}
Omit fields in an update that don't change. Use empty lists when there is nothing to change."""


def call_model(messages: list[dict], data: dict, theme: str = "hp") -> dict:
    today = local_today()
    system = SYSTEM_PROMPT.format(
        today=today.isoformat(),
        today_long=today.strftime("%A, %B %-d, %Y"),
        hp_characters=", ".join(ROSTERS["hp"]),
        sw_characters=", ".join(ROSTERS["sw"]),
        flavor=THEME_FLAVOR.get(theme, THEME_FLAVOR["hp"]),
        categories=CATEGORIES,
        statuses=STATUSES,
        priorities=PRIORITIES,
        data=json.dumps(data, indent=1),
    )
    body = {
        "model": MODEL,
        # JSON mode requires "json" to appear in the input messages, so the prompt goes there.
        "input": [{"role": "system", "content": system}]
        + [{"role": m["role"], "content": m["content"]} for m in messages[-12:]],
        "text": {"format": {"type": "json_object"}},
    }
    key = load_api_key()
    req = urllib.request.Request(
        PORTKEY_URL,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
            "x-portkey-api-key": key,
            "User-Agent": "gantt-tracker/1.0",  # Portkey's CDN rejects Python's default agent
        },
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        result = json.load(resp)
    text = "".join(
        part.get("text", "")
        for item in result.get("output", [])
        if item.get("type") == "message"
        for part in item.get("content", [])
    )
    return json.loads(text)


def valid_date(s) -> bool:
    try:
        date.fromisoformat(s)
        return True
    except (TypeError, ValueError):
        return False


def clean_fields(src: dict) -> dict:
    """Keep only well-formed field values from a model-proposed update."""
    out = {}
    for field, allowed in (("status", STATUSES), ("priority", PRIORITIES), ("category", CATEGORIES)):
        if src.get(field) in allowed:
            out[field] = src[field]
    for field in ("start", "deadline"):
        if valid_date(src.get(field)):
            out[field] = src[field]
    if isinstance(src.get("title"), str) and src["title"].strip():
        out["title"] = src["title"].strip()
    return out


def slugify(title: str, taken: set) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "task"
    slug, n = base, 2
    while slug in taken:
        slug, n = f"{base}-{n}", n + 1
    return slug


def clean_helpers(raw) -> dict:
    """One valid helper per theme, falling back to a default character."""
    raw = raw if isinstance(raw, dict) else {}
    out = {}
    for theme, roster in ROSTERS.items():
        h = raw.get(theme) if isinstance(raw.get(theme), dict) else {}
        out[theme] = {
            "character": h.get("character") if h.get("character") in roster else DEFAULT_HELPER[theme],
            "reason": str(h.get("reason") or "Always ready to help."),
        }
    return out


def apply_changes(data: dict, plan: dict) -> list[str]:
    today = local_today().isoformat()
    by_id = {t["id"]: t for t in data["tasks"]}
    changes = []

    for upd in plan.get("updates") or []:
        task = by_id.get(upd.get("id"))
        if not task:
            continue
        for field, value in clean_fields(upd).items():
            if task.get(field) != value:
                changes.append(f"{task['title']}: {field} → {value}")
                task[field] = value
        if isinstance(upd.get("note"), str) and upd["note"].strip():
            task.setdefault("notes", []).append({"date": today, "text": upd["note"].strip()})
            changes.append(f"{task['title']}: added note")

    for new in plan.get("new_tasks") or []:
        fields = clean_fields(new)
        if not fields.get("title") or not fields.get("deadline"):
            continue
        task = {
            "id": slugify(fields["title"], set(by_id)),
            "title": fields["title"],
            "category": fields.get("category", "Personal"),
            "status": fields.get("status", "Not started"),
            "priority": fields.get("priority", "Medium"),
            "start": fields.get("start", today),
            "deadline": fields["deadline"],
            "helpers": clean_helpers(new.get("helpers")),
            "description": "",
            "notes": [{"date": today, "text": new["note"].strip()}] if isinstance(new.get("note"), str) and new["note"].strip() else [],
        }
        data["tasks"].append(task)
        by_id[task["id"]] = task
        changes.append(f"Added task: {task['title']}")

    if changes:
        data["lastUpdated"] = today
    return changes
