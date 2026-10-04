"""Where the task document lives.

The whole tracker is one JSON document ({lastUpdated, tasks}). With DATABASE_URL set
(Render), it is a single JSONB row in Postgres; otherwise it is the local data.js file.
mutate() does read-modify-write as one locked step so concurrent saves can't clobber.
"""

import json
import os
import threading
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


# ---- local file ----

def read_file(path: Path = DATA_FILE) -> dict:
    if not path.exists():
        return dict(EMPTY, tasks=[])
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
        conn.execute("CREATE TABLE IF NOT EXISTS task_data (id INT PRIMARY KEY, data JSONB NOT NULL)")
        conn.execute(
            "INSERT INTO task_data (id, data) VALUES (1, %s) ON CONFLICT (id) DO NOTHING",
            (json.dumps(EMPTY),),
        )


def _db_read(conn, lock: bool = False) -> dict:
    row = conn.execute("SELECT data FROM task_data WHERE id = 1" + (" FOR UPDATE" if lock else "")).fetchone()
    return row[0]


def _db_write(conn, data: dict) -> None:
    conn.execute("UPDATE task_data SET data = %s WHERE id = 1", (json.dumps(data),))


# ---- public API ----

def load() -> dict:
    if DATABASE_URL:
        with _connect() as conn:
            return _db_read(conn)
    return read_file()


def save(data: dict) -> None:
    if DATABASE_URL:
        with _connect() as conn:
            _db_write(conn, data)
    else:
        with _file_lock:
            write_file(data)


@contextmanager
def mutate():
    """Yield the current data; whatever it holds on exit is saved (unless an error is raised)."""
    if DATABASE_URL:
        with _connect() as conn, conn.transaction():
            data = _db_read(conn, lock=True)
            yield data
            _db_write(conn, data)
    else:
        with _file_lock:
            data = read_file()
            yield data
            write_file(data)
