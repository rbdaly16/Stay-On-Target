"""Copy tasks between the local data.js and the live Postgres database.

  python manage.py push   # local data.js  -> live database (overwrites live data)
  python manage.py pull   # live database  -> local data.js (overwrites local file)

Needs the Neon connection string: DATABASE_URL in the shell, or NEON_STAY_ON_TARGET_DATABASE_URL
(or DATABASE_URL) in gannt_chart/.env or a parent folder's .env.
"""

import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ENV_KEYS = ("NEON_STAY_ON_TARGET_DATABASE_URL=", "DATABASE_URL=")


def find_database_url() -> str:
    for folder in (HERE, *HERE.parents):
        env = folder / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                if line.startswith(ENV_KEYS):
                    return line.split("=", 1)[1].strip().strip("'\"")
    return ""


if not os.environ.get("DATABASE_URL"):
    os.environ["DATABASE_URL"] = find_database_url()

from backend import storage  # noqa: E402  (reads DATABASE_URL at import)

if not storage.DATABASE_URL or sys.argv[1:] not in (["push"], ["pull"]):
    sys.exit(__doc__)

storage.init_db()
if sys.argv[1] == "push":
    data = storage.read_file()
    if input(f"Overwrite the live database with {len(data['tasks'])} local tasks? [y/N] ").lower() != "y":
        sys.exit("Cancelled.")
    storage.save(data)
    print(f"Pushed {len(data['tasks'])} tasks.")
else:
    data = storage.load()
    storage.write_file(data)
    print(f"Pulled {len(data['tasks'])} tasks into data.js.")
