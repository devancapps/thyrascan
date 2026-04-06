import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DB_PATH = DATA_DIR / "jobs.db"
RESUME_PATH = BASE_DIR / "resume.md"

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
YOUR_NAME = os.getenv("YOUR_NAME", "")
ADZUNA_COUNTRY = os.getenv("ADZUNA_COUNTRY", "us")
MIN_SCORE_TO_DRAFT = float(os.getenv("MIN_SCORE_TO_DRAFT", "6.5"))
JOBS_PER_SEARCH = int(os.getenv("JOBS_PER_SEARCH", "50"))

CLAUDE_MODEL = "claude-sonnet-4-6"

# PM-specific search terms
PM_SEARCH_QUERIES = [
    "product manager",
    "senior product manager",
    "group product manager",
    "principal product manager",
    "director of product",
]


def get_resume() -> str:
    if not RESUME_PATH.exists():
        raise FileNotFoundError(
            f"Resume not found at {RESUME_PATH}. "
            "Copy resume.md and fill it in before running."
        )
    return RESUME_PATH.read_text()


def validate_config() -> list[str]:
    """Returns list of missing required config values."""
    missing = []
    if not ANTHROPIC_API_KEY:
        missing.append("ANTHROPIC_API_KEY")
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        missing.append("ADZUNA_APP_ID / ADZUNA_APP_KEY")
    return missing
