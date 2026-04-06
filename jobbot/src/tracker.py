"""
SQLite-backed application tracker.
All DB access goes through here.
"""

import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime
from typing import Generator

from . import config


# Job status flow: new → scored → approved | rejected → drafted → sent → responded
STATUS_NEW = "new"
STATUS_SCORED = "scored"
STATUS_APPROVED = "approved"
STATUS_REJECTED = "rejected"
STATUS_DRAFTED = "drafted"
STATUS_SENT = "sent"
STATUS_RESPONDED = "responded"


@dataclass
class Job:
    id: str
    title: str
    company: str
    location: str
    url: str
    description: str
    source: str
    found_at: str
    status: str
    score: float | None = None
    score_headline: str = ""
    score_strengths: str = ""   # JSON array stored as string
    score_gaps: str = ""        # JSON array stored as string
    recommendation: str = ""
    cover_letter_subject: str = ""
    cover_letter_body: str = ""
    contact_email: str = ""
    email_sent_at: str = ""
    notes: str = ""


@contextmanager
def _db() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(str(config.DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with _db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT DEFAULT '',
                url TEXT DEFAULT '',
                description TEXT DEFAULT '',
                source TEXT DEFAULT '',
                found_at TEXT DEFAULT '',
                status TEXT DEFAULT 'new',
                score REAL,
                score_headline TEXT DEFAULT '',
                score_strengths TEXT DEFAULT '[]',
                score_gaps TEXT DEFAULT '[]',
                recommendation TEXT DEFAULT '',
                cover_letter_subject TEXT DEFAULT '',
                cover_letter_body TEXT DEFAULT '',
                contact_email TEXT DEFAULT '',
                email_sent_at TEXT DEFAULT '',
                notes TEXT DEFAULT ''
            )
        """)


def _row_to_job(row: sqlite3.Row) -> Job:
    return Job(**dict(row))


def save_job(job: "Job | None" = None, **kwargs) -> None:
    """Insert or ignore a job. Does not overwrite existing records."""
    if job is None:
        raise ValueError("Provide a Job instance")
    with _db() as conn:
        conn.execute(
            """INSERT OR IGNORE INTO jobs
               (id, title, company, location, url, description, source, found_at, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (job.id, job.title, job.company, job.location, job.url,
             job.description, job.source, job.found_at, STATUS_NEW),
        )


def update_score(job_id: str, score: float, headline: str, strengths: str, gaps: str, recommendation: str) -> None:
    with _db() as conn:
        conn.execute(
            """UPDATE jobs SET
               score=?, score_headline=?, score_strengths=?, score_gaps=?,
               recommendation=?, status=?
               WHERE id=?""",
            (score, headline, strengths, gaps, recommendation, STATUS_SCORED, job_id),
        )


def update_cover_letter(job_id: str, subject: str, body: str, contact_email: str) -> None:
    with _db() as conn:
        conn.execute(
            """UPDATE jobs SET
               cover_letter_subject=?, cover_letter_body=?, contact_email=?, status=?
               WHERE id=?""",
            (subject, body, contact_email, STATUS_DRAFTED, job_id),
        )


def set_status(job_id: str, status: str) -> None:
    with _db() as conn:
        conn.execute("UPDATE jobs SET status=? WHERE id=?", (status, job_id))


def mark_sent(job_id: str) -> None:
    with _db() as conn:
        conn.execute(
            "UPDATE jobs SET status=?, email_sent_at=? WHERE id=?",
            (STATUS_SENT, datetime.utcnow().isoformat(), job_id),
        )


def get_jobs_by_status(status: str) -> list[Job]:
    with _db() as conn:
        rows = conn.execute(
            "SELECT * FROM jobs WHERE status=? ORDER BY score DESC, found_at DESC",
            (status,),
        ).fetchall()
    return [_row_to_job(r) for r in rows]


def get_all_jobs(limit: int = 200) -> list[Job]:
    with _db() as conn:
        rows = conn.execute(
            "SELECT * FROM jobs ORDER BY found_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [_row_to_job(r) for r in rows]


def get_job(job_id: str) -> Job | None:
    with _db() as conn:
        row = conn.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
    return _row_to_job(row) if row else None


def job_exists(job_id: str) -> bool:
    with _db() as conn:
        row = conn.execute("SELECT 1 FROM jobs WHERE id=?", (job_id,)).fetchone()
    return row is not None


def get_stats() -> dict:
    with _db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
        by_status = conn.execute(
            "SELECT status, COUNT(*) as n FROM jobs GROUP BY status"
        ).fetchall()
        avg_score = conn.execute(
            "SELECT AVG(score) FROM jobs WHERE score IS NOT NULL"
        ).fetchone()[0]
    return {
        "total": total,
        "by_status": {r["status"]: r["n"] for r in by_status},
        "avg_score": round(avg_score, 2) if avg_score else 0,
    }
