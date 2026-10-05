"""Where each user's tracker lives.

A tracker is one JSON document ({lastUpdated, tasks}). With DATABASE_URL set (Render +
Neon), each Clerk user has one JSONB row in `trackers`. Without it (local dev), everyone
shares the local data.js file. mutate() does read-modify-write as one locked step so
concurrent saves can't clobber each other.

`task_data` (id = 1) is the single tracker from before accounts existed; manage.py
`claim` moves it into one user's account.
"""

import copy
import json
import os
import threading
from collections import defaultdict
from contextlib import contextmanager
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data.js"
DATA_MARKER = "window.TASK_DATA = "
DATA_HEADER = """// Task data for the Gantt tracker. Local copy; the live site keeps its data in Postgres.
// Body after the marker must stay strict JSON: backend/storage.py parses and rewrites it.
"""
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
EMPTY = {"lastUpdated": None, "tasks": []}

_file_lock = threading.Lock()
_local_chat_counts: dict[tuple[str, str], int] = defaultdict(int)


def empty() -> dict:
    return copy.deepcopy(EMPTY)


# ---- local file ----

def read_file(path: Path = DATA_FILE) -> dict:
    if not path.exists():
        return empty()
    body = path.read_text().split(DATA_MARKER, 1)[1]
    return json.loads(body.strip().rstrip(";"))


def write_file(data: dict, path: Path = DATA_FILE) -> None:
    path.write_text(f"{DATA_HEADER}{DATA_MARKER}{json.dumps(data, indent=2)};\n")


# ---- Postgres ----

def _connect():
    import psycopg  # only needed when DATABASE_URL is set

    return psycopg.connect(DATABASE_URL)


def init_db() -> None:
    with _connect() as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS trackers (user_id TEXT PRIMARY KEY, data JSONB NOT NULL)")
        conn.execute(
            "CREATE TABLE IF NOT EXISTS chat_usage ("
            " user_id TEXT NOT NULL, day DATE NOT NULL, count INT NOT NULL, PRIMARY KEY (user_id, day))"
        )


# ---- public API ----

def load(user_id: str) -> dict:
    if not DATABASE_URL:
        return read_file()
    with _connect() as conn:
        row = conn.execute("SELECT data FROM trackers WHERE user_id = %s", (user_id,)).fetchone()
    return row[0] if row else empty()


def save(user_id: str, data: dict) -> None:
    with mutate(user_id) as current:
        current.clear()
        current.update(data)


@contextmanager
def mutate(user_id: str):
    """Yield the user's tracker; whatever it holds on exit is saved (unless an error is raised)."""
    if not DATABASE_URL:
        with _file_lock:
            data = read_file()
            yield data
            write_file(data)
        return
    with _connect() as conn, conn.transaction():
        conn.execute(
            "INSERT INTO trackers (user_id, data) VALUES (%s, %s) ON CONFLICT (user_id) DO NOTHING",
            (user_id, json.dumps(EMPTY)),
        )
        data = conn.execute("SELECT data FROM trackers WHERE user_id = %s FOR UPDATE", (user_id,)).fetchone()[0]
        yield data
        conn.execute("UPDATE trackers SET data = %s WHERE user_id = %s", (json.dumps(data), user_id))


def count_chat(user_id: str, day: str) -> int:
    """Record one Owl Post message for the user today and return today's total."""
    if not DATABASE_URL:
        _local_chat_counts[(user_id, day)] += 1
        return _local_chat_counts[(user_id, day)]
    with _connect() as conn:
        return conn.execute(
            "INSERT INTO chat_usage (user_id, day, count) VALUES (%s, %s, 1)"
            " ON CONFLICT (user_id, day) DO UPDATE SET count = chat_usage.count + 1 RETURNING count",
            (user_id, day),
        ).fetchone()[0]


def claim_legacy(user_id: str) -> int:
    """Move the pre-accounts tracker (task_data id 1) into this user's account. Returns task count."""
    with _connect() as conn, conn.transaction():
        if not conn.execute("SELECT to_regclass('task_data')").fetchone()[0]:
            raise RuntimeError("No pre-accounts tracker found.")
        row = conn.execute("SELECT data FROM task_data WHERE id = 1 FOR UPDATE").fetchone()
        if not row:
            raise RuntimeError("The pre-accounts tracker was already claimed.")
        existing = conn.execute("SELECT data FROM trackers WHERE user_id = %s", (user_id,)).fetchone()
        if existing and existing[0].get("tasks"):
            raise RuntimeError("That account already has tasks; not overwriting them.")
        conn.execute(
            "INSERT INTO trackers (user_id, data) VALUES (%s, %s)"
            " ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data",
            (user_id, json.dumps(row[0])),
        )
        conn.execute("DELETE FROM task_data WHERE id = 1")
        return len(row[0].get("tasks", []))
