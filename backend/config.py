"""Environment settings. Import this before other backend modules.

On Render, everything comes from the service's environment variables. Locally, values
are also read from .env files in gannt_chart/ and its parent folders (real environment
variables always win).
"""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

for folder in (ROOT, *ROOT.parents):
    env = folder / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            key, sep, value = line.partition("=")
            if sep and key.strip() and not key.lstrip().startswith("#"):
                os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def env(*names: str, default: str = "") -> str:
    """First non-empty value among the given variable names."""
    return next((os.environ[n].strip() for n in names if os.environ.get(n, "").strip()), default)


ON_RENDER = bool(os.environ.get("RENDER"))
