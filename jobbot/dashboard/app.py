"""
Flask web dashboard for reviewing, approving, and tracking job applications.
Run with: python -m jobbot.dashboard.app  (or via main.py dashboard command)
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from flask import Flask, jsonify, redirect, render_template, request, url_for

from jobbot.src import tracker, scorer, sender, config

app = Flask(__name__)


@app.route("/")
def index():
    stats = tracker.get_stats()
    pending = tracker.get_jobs_by_status(tracker.STATUS_SCORED)
    approved = tracker.get_jobs_by_status(tracker.STATUS_APPROVED)
    drafted = tracker.get_jobs_by_status(tracker.STATUS_DRAFTED)
    sent = tracker.get_jobs_by_status(tracker.STATUS_SENT)
    return render_template(
        "index.html",
        stats=stats,
        pending=pending,
        approved=approved,
        drafted=drafted,
        sent=sent,
    )


@app.route("/job/<job_id>")
def job_detail(job_id):
    job = tracker.get_job(job_id)
    if not job:
        return "Job not found", 404
    strengths = json.loads(job.score_strengths or "[]")
    gaps = json.loads(job.score_gaps or "[]")
    return render_template("job_detail.html", job=job, strengths=strengths, gaps=gaps)


@app.route("/approve/<job_id>", methods=["POST"])
def approve(job_id):
    tracker.set_status(job_id, tracker.STATUS_APPROVED)
    return redirect(url_for("index"))


@app.route("/reject/<job_id>", methods=["POST"])
def reject(job_id):
    tracker.set_status(job_id, tracker.STATUS_REJECTED)
    return redirect(url_for("index"))


@app.route("/draft/<job_id>", methods=["POST"])
def draft(job_id):
    job = tracker.get_job(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    resume = config.get_resume()
    result = scorer.write_cover_letter(
        title=job.title,
        company=job.company,
        description=job.description,
        resume=resume,
    )
    tracker.update_cover_letter(
        job_id=job_id,
        subject=result.subject,
        body=result.body,
        contact_email=result.contact_email,
    )
    return redirect(url_for("job_detail", job_id=job_id))


@app.route("/send/<job_id>", methods=["POST"])
def send(job_id):
    job = tracker.get_job(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    to_email = request.form.get("to_email") or job.contact_email
    if not to_email:
        return jsonify({"error": "No recipient email address provided"}), 400

    try:
        sender.send_application_email(
            to_address=to_email,
            subject=job.cover_letter_subject,
            body=job.cover_letter_body,
        )
        tracker.mark_sent(job_id)
        return redirect(url_for("index"))
    except sender.EmailSendError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats")
def api_stats():
    return jsonify(tracker.get_stats())


@app.route("/api/jobs")
def api_jobs():
    status = request.args.get("status")
    if status:
        jobs = tracker.get_jobs_by_status(status)
    else:
        jobs = tracker.get_all_jobs()
    return jsonify([j.__dict__ for j in jobs])


if __name__ == "__main__":
    tracker.init_db()
    app.run(debug=True, port=5000)
