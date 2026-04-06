#!/usr/bin/env python3
"""
JobBot — AI-powered PM job search and application pipeline.

Usage:
  python main.py run        # Full pipeline: search → score → queue for review
  python main.py search     # Search for new jobs only
  python main.py score      # Score any unscored jobs
  python main.py draft      # Generate cover letters for all approved jobs
  python main.py dashboard  # Open the web dashboard
  python main.py stats      # Show application stats
  python main.py setup      # Check configuration
"""

import json
import sys
import time
import webbrowser
from pathlib import Path
from threading import Timer

import typer
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import print as rprint

# Ensure imports work when run from jobbot/ directory
sys.path.insert(0, str(Path(__file__).parent.parent))

from jobbot.src import config, tracker, scorer, sender
from jobbot.src.searcher import RawJob, search_all_sources

app = typer.Typer(help="JobBot — AI-powered PM job application pipeline", add_completion=False)
console = Console()


def _check_config() -> bool:
    missing = config.validate_config()
    if missing:
        console.print(f"\n[red]Missing required config:[/red] {', '.join(missing)}")
        console.print("Copy [cyan].env.example[/cyan] to [cyan].env[/cyan] and fill in the values.\n")
        return False
    return True


def _check_resume() -> bool:
    try:
        resume = config.get_resume()
        if "[Your Name]" in resume or len(resume) < 200:
            console.print("\n[yellow]Warning:[/yellow] resume.md looks like it hasn't been filled in yet.")
            console.print("Edit [cyan]resume.md[/cyan] with your actual experience before running.\n")
            return False
        return True
    except FileNotFoundError as e:
        console.print(f"\n[red]Error:[/red] {e}\n")
        return False


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

@app.command()
def setup():
    """Check your configuration and print what's missing."""
    console.print(Panel("[bold]JobBot Setup Check[/bold]", style="blue"))

    checks = [
        ("ANTHROPIC_API_KEY", bool(config.ANTHROPIC_API_KEY), "Required for scoring and cover letters"),
        ("ADZUNA_APP_ID", bool(config.ADZUNA_APP_ID), "Free key at developer.adzuna.com"),
        ("ADZUNA_APP_KEY", bool(config.ADZUNA_APP_KEY), "Free key at developer.adzuna.com"),
        ("GMAIL_ADDRESS", bool(config.GMAIL_ADDRESS), "Your Gmail address for sending applications"),
        ("GMAIL_APP_PASSWORD", bool(config.GMAIL_APP_PASSWORD), "Gmail app password (not your regular password)"),
        ("YOUR_NAME", bool(config.YOUR_NAME), "Your name for cover letter signatures"),
    ]

    t = Table(show_header=True, header_style="bold")
    t.add_column("Setting")
    t.add_column("Status")
    t.add_column("Notes")
    for name, ok, note in checks:
        status = "[green]Set[/green]" if ok else "[red]Missing[/red]"
        t.add_row(name, status, note)
    console.print(t)

    resume_ok = _check_resume()
    console.print(f"\nresume.md: {'[green]Ready[/green]' if resume_ok else '[red]Not filled in[/red]'}")

    tracker.init_db()
    console.print(f"\nDatabase: [green]Ready[/green] at {config.DB_PATH}")
    console.print(f"\nSettings: country={config.ADZUNA_COUNTRY}, min_score={config.MIN_SCORE_TO_DRAFT}, jobs_per_search={config.JOBS_PER_SEARCH}")


@app.command()
def search():
    """Search all job boards for new PM roles and save them to the database."""
    if not _check_config():
        raise typer.Exit(1)

    tracker.init_db()
    console.print("\n[bold]Searching for PM jobs...[/bold]\n")

    jobs = search_all_sources(verbose=True)
    new_count = 0

    for raw_job in jobs:
        if not tracker.job_exists(raw_job.id):
            j = tracker.Job(
                id=raw_job.id,
                title=raw_job.title,
                company=raw_job.company,
                location=raw_job.location,
                url=raw_job.url,
                description=raw_job.description,
                source=raw_job.source,
                found_at=raw_job.found_at,
                status=tracker.STATUS_NEW,
                contact_email=raw_job.contact_email,
            )
            tracker.save_job(j)
            new_count += 1

    console.print(f"\n[green]Done.[/green] Found {len(jobs)} jobs, [bold]{new_count} new[/bold] saved to database.")
    console.print("Run [cyan]python main.py score[/cyan] to score them with Claude.")


@app.command()
def score(limit: int = typer.Option(100, help="Max number of jobs to score in this run")):
    """Score unscored jobs using Claude. Costs ~$0.01-0.03 per job."""
    if not _check_config():
        raise typer.Exit(1)

    tracker.init_db()
    resume = config.get_resume()

    # Get all new (unscored) jobs
    new_jobs = tracker.get_jobs_by_status(tracker.STATUS_NEW)
    if not new_jobs:
        console.print("[yellow]No new jobs to score.[/yellow] Run [cyan]python main.py search[/cyan] first.")
        return

    to_score = new_jobs[:limit]
    console.print(f"\n[bold]Scoring {len(to_score)} jobs with Claude...[/bold]\n")

    scored = 0
    skipped = 0
    cost_estimate = len(to_score) * 0.02

    console.print(f"Estimated cost: ~${cost_estimate:.2f}\n")

    for i, job in enumerate(to_score, 1):
        console.print(f"[{i}/{len(to_score)}] {job.title} @ {job.company}...", end=" ")
        try:
            result = scorer.score_job(
                title=job.title,
                company=job.company,
                location=job.location,
                description=job.description,
                resume=resume,
            )
            tracker.update_score(
                job_id=job.id,
                score=result.score,
                headline=result.headline,
                strengths=json.dumps(result.strengths),
                gaps=json.dumps(result.gaps),
                recommendation=result.recommendation,
            )
            color = "green" if result.score >= 7.5 else "yellow" if result.score >= 5 else "red"
            console.print(f"[{color}]{result.score:.1f}[/{color}] — {result.recommendation}")
            scored += 1
            time.sleep(0.3)  # avoid rate limits
        except Exception as e:
            console.print(f"[red]Error:[/red] {e}")
            skipped += 1

    console.print(f"\n[green]Done.[/green] Scored {scored} jobs, {skipped} errors.")
    console.print("Open the dashboard to review: [cyan]python main.py dashboard[/cyan]")


@app.command()
def draft(min_score: float = typer.Option(None, help="Min score to draft (default: from .env)")):
    """Generate cover letters for all approved jobs using Claude."""
    if not _check_config():
        raise typer.Exit(1)

    tracker.init_db()
    threshold = min_score or config.MIN_SCORE_TO_DRAFT
    resume = config.get_resume()

    approved = tracker.get_jobs_by_status(tracker.STATUS_APPROVED)
    if not approved:
        console.print("[yellow]No approved jobs to draft.[/yellow] Approve some in the dashboard first.")
        return

    console.print(f"\n[bold]Drafting cover letters for {len(approved)} approved jobs...[/bold]\n")

    for i, job in enumerate(approved, 1):
        console.print(f"[{i}/{len(approved)}] {job.title} @ {job.company}...", end=" ")
        try:
            result = scorer.write_cover_letter(
                title=job.title,
                company=job.company,
                description=job.description,
                resume=resume,
            )
            tracker.update_cover_letter(
                job_id=job.id,
                subject=result.subject,
                body=result.body,
                contact_email=result.contact_email,
            )
            console.print("[green]Done[/green]")
            time.sleep(0.3)
        except Exception as e:
            console.print(f"[red]Error:[/red] {e}")

    console.print(f"\n[green]All drafted.[/green] Review and send from the dashboard.")


@app.command()
def run(
    skip_search: bool = typer.Option(False, "--skip-search", help="Skip search, only score existing jobs"),
    auto_draft: bool = typer.Option(False, "--auto-draft", help="Auto-draft cover letters for high-scoring jobs"),
):
    """
    Full pipeline: search → score → (optionally auto-draft).
    After this, open the dashboard to review and approve applications.
    """
    if not _check_config() or not _check_resume():
        raise typer.Exit(1)

    tracker.init_db()

    if not skip_search:
        console.print(Panel("[bold]Step 1 of 3 — Searching for PM jobs[/bold]", style="blue"))
        jobs = search_all_sources(verbose=True)
        new_count = 0
        for raw_job in jobs:
            if not tracker.job_exists(raw_job.id):
                j = tracker.Job(
                    id=raw_job.id,
                    title=raw_job.title,
                    company=raw_job.company,
                    location=raw_job.location,
                    url=raw_job.url,
                    description=raw_job.description,
                    source=raw_job.source,
                    found_at=raw_job.found_at,
                    status=tracker.STATUS_NEW,
                    contact_email=raw_job.contact_email,
                )
                tracker.save_job(j)
                new_count += 1
        console.print(f"\n[green]Found {len(jobs)} jobs, {new_count} new.[/green]\n")
    else:
        console.print("[yellow]Skipping search.[/yellow]\n")

    console.print(Panel("[bold]Step 2 of 3 — Scoring with Claude[/bold]", style="blue"))
    new_jobs = tracker.get_jobs_by_status(tracker.STATUS_NEW)
    if new_jobs:
        resume = config.get_resume()
        console.print(f"Scoring {len(new_jobs)} jobs... (~${len(new_jobs)*0.02:.2f} estimated)\n")
        for i, job in enumerate(new_jobs, 1):
            console.print(f"  [{i}/{len(new_jobs)}] {job.title[:40]} @ {job.company[:20]}...", end=" ")
            try:
                result = scorer.score_job(
                    title=job.title,
                    company=job.company,
                    location=job.location,
                    description=job.description,
                    resume=resume,
                )
                tracker.update_score(
                    job_id=job.id,
                    score=result.score,
                    headline=result.headline,
                    strengths=json.dumps(result.strengths),
                    gaps=json.dumps(result.gaps),
                    recommendation=result.recommendation,
                )
                color = "green" if result.score >= 7.5 else "yellow" if result.score >= 5 else "red"
                console.print(f"[{color}]{result.score:.1f}[/{color}]")
                time.sleep(0.3)
            except Exception as e:
                console.print(f"[red]error[/red] ({e})")
    else:
        console.print("No new jobs to score.\n")

    if auto_draft:
        console.print(Panel("[bold]Step 3 of 3 — Auto-drafting cover letters[/bold]", style="blue"))
        # Auto-approve and draft jobs above threshold
        scored_jobs = tracker.get_jobs_by_status(tracker.STATUS_SCORED)
        high_scoring = [j for j in scored_jobs if j.score and j.score >= config.MIN_SCORE_TO_DRAFT]
        console.print(f"Auto-drafting {len(high_scoring)} jobs with score ≥ {config.MIN_SCORE_TO_DRAFT}\n")
        resume = config.get_resume()
        for job in high_scoring:
            tracker.set_status(job.id, tracker.STATUS_APPROVED)
            try:
                result = scorer.write_cover_letter(
                    title=job.title,
                    company=job.company,
                    description=job.description,
                    resume=resume,
                )
                tracker.update_cover_letter(
                    job_id=job.id,
                    subject=result.subject,
                    body=result.body,
                    contact_email=result.contact_email,
                )
                console.print(f"  [green]Drafted[/green] {job.title} @ {job.company}")
            except Exception as e:
                console.print(f"  [red]Error[/red] {job.title}: {e}")
    else:
        console.print(Panel("[bold]Step 3 of 3 — Review in Dashboard[/bold]", style="blue"))

    # Summary
    stats = tracker.get_stats()
    console.print(f"""
[bold green]Pipeline complete![/bold green]

  Total jobs tracked:  {stats['total']}
  Pending your review: {stats['by_status'].get('scored', 0)}
  Approved:            {stats['by_status'].get('approved', 0) + stats['by_status'].get('drafted', 0)}
  Applications sent:   {stats['by_status'].get('sent', 0)}

Open your dashboard:  [cyan]python main.py dashboard[/cyan]
""")


@app.command()
def stats():
    """Show application pipeline statistics."""
    tracker.init_db()
    s = tracker.get_stats()

    console.print(Panel("[bold]JobBot Stats[/bold]", style="blue"))

    t = Table(show_header=True, header_style="bold")
    t.add_column("Status")
    t.add_column("Count", justify="right")
    for status, count in sorted(s["by_status"].items()):
        t.add_row(status, str(count))
    console.print(t)

    console.print(f"\nTotal jobs tracked: [bold]{s['total']}[/bold]")
    console.print(f"Average fit score:  [bold]{s['avg_score']}[/bold] / 10")


@app.command()
def dashboard():
    """Start the web dashboard at http://localhost:5000"""
    tracker.init_db()
    console.print("\n[bold]Starting JobBot dashboard...[/bold]")
    console.print("Opening [cyan]http://localhost:5000[/cyan] in your browser\n")
    console.print("Press [bold]Ctrl+C[/bold] to stop.\n")

    Timer(1.5, lambda: webbrowser.open("http://localhost:5000")).start()

    # Import here to avoid circular issues
    import os
    os.environ.setdefault("FLASK_ENV", "production")

    from jobbot.dashboard.app import app as flask_app
    flask_app.run(host="0.0.0.0", port=5000, debug=False)


if __name__ == "__main__":
    app()
