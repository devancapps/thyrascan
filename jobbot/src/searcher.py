"""
Job board API integrations.
Sources: Adzuna (requires free API key), Remotive (no auth needed).
"""

import hashlib
import time
from dataclasses import dataclass
from datetime import datetime

import requests

from . import config


@dataclass
class RawJob:
    id: str
    title: str
    company: str
    location: str
    url: str
    description: str
    source: str
    found_at: str
    contact_email: str = ""


def _make_id(source: str, external_id: str) -> str:
    return hashlib.md5(f"{source}:{external_id}".encode()).hexdigest()


# ---------------------------------------------------------------------------
# Adzuna
# ---------------------------------------------------------------------------

def search_adzuna(query: str, results_per_page: int = 50) -> list[RawJob]:
    if not config.ADZUNA_APP_ID or not config.ADZUNA_APP_KEY:
        return []

    url = (
        f"https://api.adzuna.com/v1/api/jobs/{config.ADZUNA_COUNTRY}/search/1"
        f"?app_id={config.ADZUNA_APP_ID}"
        f"&app_key={config.ADZUNA_APP_KEY}"
        f"&results_per_page={results_per_page}"
        f"&what={requests.utils.quote(query)}"
        f"&sort_by=date"
        f"&max_days_old=7"
        f"&content-type=application/json"
    )

    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[searcher] Adzuna error for '{query}': {e}")
        return []

    jobs = []
    for item in data.get("results", []):
        job_id = _make_id("adzuna", item.get("id", item.get("redirect_url", "")))
        jobs.append(RawJob(
            id=job_id,
            title=item.get("title", ""),
            company=item.get("company", {}).get("display_name", "Unknown"),
            location=item.get("location", {}).get("display_name", ""),
            url=item.get("redirect_url", ""),
            description=item.get("description", ""),
            source="adzuna",
            found_at=datetime.utcnow().isoformat(),
        ))
    return jobs


# ---------------------------------------------------------------------------
# Remotive (remote jobs, no auth needed)
# ---------------------------------------------------------------------------

def search_remotive(query: str) -> list[RawJob]:
    url = f"https://remotive.com/api/remote-jobs?search={requests.utils.quote(query)}&limit=50"
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[searcher] Remotive error for '{query}': {e}")
        return []

    jobs = []
    for item in data.get("jobs", []):
        job_id = _make_id("remotive", str(item.get("id", "")))
        jobs.append(RawJob(
            id=job_id,
            title=item.get("title", ""),
            company=item.get("company_name", "Unknown"),
            location=item.get("candidate_required_location", "Remote"),
            url=item.get("url", ""),
            description=item.get("description", ""),
            source="remotive",
            found_at=datetime.utcnow().isoformat(),
        ))
    return jobs


# ---------------------------------------------------------------------------
# The Muse (no auth for basic use)
# ---------------------------------------------------------------------------

def search_the_muse(query: str) -> list[RawJob]:
    url = f"https://www.themuse.com/api/public/jobs?category=Product&page=1&level=Senior+Level&level=Mid+Level&api_key=public"
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[searcher] The Muse error: {e}")
        return []

    query_lower = query.lower()
    jobs = []
    for item in data.get("results", []):
        title = item.get("name", "")
        if not any(term in title.lower() for term in ["product manager", "pm", "product lead"]):
            continue

        job_id = _make_id("themuse", str(item.get("id", "")))
        company = item.get("company", {}).get("name", "Unknown")
        locations = item.get("locations", [])
        location = locations[0].get("name", "Remote") if locations else "Remote"
        refs = item.get("refs", {})

        jobs.append(RawJob(
            id=job_id,
            title=title,
            company=company,
            location=location,
            url=refs.get("landing_page", ""),
            description=item.get("contents", ""),
            source="themuse",
            found_at=datetime.utcnow().isoformat(),
        ))
    return jobs


# ---------------------------------------------------------------------------
# Aggregate all sources
# ---------------------------------------------------------------------------

def search_all_sources(verbose: bool = True) -> list[RawJob]:
    all_jobs: list[RawJob] = []
    seen_ids: set[str] = set()

    sources = [
        ("Adzuna", lambda q: search_adzuna(q, config.JOBS_PER_SEARCH)),
        ("Remotive", search_remotive),
        ("The Muse", search_the_muse),
    ]

    for source_name, search_fn in sources:
        for query in config.PM_SEARCH_QUERIES[:3]:  # top 3 queries per source
            if verbose:
                print(f"  Searching {source_name} for '{query}'...")
            try:
                results = search_fn(query)
                for job in results:
                    if job.id not in seen_ids:
                        seen_ids.add(job.id)
                        all_jobs.append(job)
                time.sleep(0.5)  # be polite to APIs
            except Exception as e:
                print(f"  [!] {source_name} failed: {e}")

    return all_jobs
