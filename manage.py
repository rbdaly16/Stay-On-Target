"""Copy a user's tracker between the live database and the local data.js.

  python manage.py pull  [--email E]   # live tracker -> local data.js (overwrites local file)
  python manage.py push  [--email E]   # local data.js -> live tracker (overwrites live data)
  python manage.py claim --email E     # move the pre-accounts tracker into E's account

--email defaults to OWNER_EMAIL. Needs the Neon connection string (DATABASE_URL in the
shell, or NEON_STAY_ON_TARGET_DATABASE_URL / DATABASE_URL in a .env) and CLERK_SECRET_KEY
(to look up the account by email). The user must have signed in to the site once.
"""

import argparse
import os
import sys

from backend import config

os.environ.setdefault("DATABASE_URL", config.env("DATABASE_URL", "NEON_STAY_ON_TARGET_DATABASE_URL"))

from backend import auth, storage  # noqa: E402  (storage reads DATABASE_URL at import)

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("command", choices=["pull", "push", "claim"])
parser.add_argument("--email", default=config.env("OWNER_EMAIL"))
args = parser.parse_args()

if not storage.DATABASE_URL:
    sys.exit("No database URL found; see the usage notes above.")
if not args.email:
    sys.exit("Pass --email or set OWNER_EMAIL in .env.")
user_id = auth.user_id_for_email(args.email)
if not user_id:
    sys.exit(f"No Clerk account for {args.email}. Sign in to the site with it first.")

storage.init_db()
if args.command == "claim":
    print(f"Moved {storage.claim_legacy(user_id)} tasks into {args.email}'s account.")
elif args.command == "push":
    data = storage.read_file()
    if input(f"Overwrite {args.email}'s live tracker with {len(data['tasks'])} local tasks? [y/N] ").lower() != "y":
        sys.exit("Cancelled.")
    storage.save(user_id, data)
    print(f"Pushed {len(data['tasks'])} tasks.")
else:
    data = storage.load(user_id)
    storage.write_file(data)
    print(f"Pulled {len(data['tasks'])} tasks into data.js.")
