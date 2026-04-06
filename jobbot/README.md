# JobBot — AI-powered PM Job Search Pipeline

Finds PM jobs, scores them against your resume with Claude, generates personalized cover letters, and tracks your applications — all from a clean web dashboard.

---

## Quick Start

### 1. Install dependencies
```bash
cd jobbot
pip install -r requirements.txt
```

### 2. Configure your environment
```bash
cp .env.example .env
# Edit .env with your API keys (see below)
```

### 3. Fill in your resume
```bash
# Edit resume.md — replace all placeholder text with your real experience
# The more specific you are, the better the scoring and cover letters will be
```

### 4. Check setup
```bash
python main.py setup
```

### 5. Run the pipeline
```bash
python main.py run
```

### 6. Open the dashboard to review jobs
```bash
python main.py dashboard
# Opens http://localhost:5000 in your browser
```

---

## API Keys You Need

| Key | Where to get it | Cost |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com | ~$5-10/month |
| `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` | developer.adzuna.com | Free |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App passwords | Free |

---

## Commands

| Command | What it does |
|---|---|
| `python main.py run` | Full pipeline: search → score → queue for review |
| `python main.py run --auto-draft` | Same, plus auto-generates cover letters for high-scoring jobs |
| `python main.py search` | Search job boards only |
| `python main.py score` | Score unscored jobs with Claude |
| `python main.py draft` | Generate cover letters for approved jobs |
| `python main.py dashboard` | Open the web dashboard |
| `python main.py stats` | Show pipeline stats |
| `python main.py setup` | Check your configuration |

---

## How the Pipeline Works

```
python main.py run
        │
        ├── 1. SEARCH  ─── Adzuna + Remotive + The Muse APIs
        │                  Pulls PM jobs posted in the last 7 days
        │                  Deduplicates against your local database
        │
        ├── 2. SCORE   ─── Claude reads each JD vs. your resume
        │                  Returns: score (1-10), strengths, gaps, recommendation
        │
        └── 3. DASHBOARD ─ You review scored jobs at localhost:5000
                           Approve → Claude drafts personalized cover letter
                           Review cover letter → Send to hiring manager
```

---

## The Dashboard

- **Pending Review** — Jobs scored by Claude, sorted by fit. Approve or skip.
- **Approved** — Click "Draft Cover Letter" to have Claude write a personalized email.
- **Drafted** — Review the letter, enter the recipient email, and send.
- **Sent** — Full history of applications sent.

---

## Scheduling (Run Daily)

### On Mac/Linux — add to crontab:
```bash
crontab -e
# Add this line (runs at 8am daily):
0 8 * * * cd /path/to/thyrascan/jobbot && python main.py run >> /tmp/jobbot.log 2>&1
```

### On Windows — Task Scheduler:
Create a task that runs `python main.py run` daily.

---

## Cost Estimate

- ~$0.01–0.03 per job scored (Claude Sonnet)
- ~$0.03–0.05 per cover letter generated
- 50 jobs/day scored + 10 cover letters = ~$1.50/day max
- Typical usage: $5–15/month total

---

## Tips for Better Results

1. **Fill in your resume.md in detail.** Include specific metrics ("grew DAU 40%"), not just job titles.
2. **Be specific in the "What I'm Looking For" section.** This drives the scoring.
3. **Set MIN_SCORE_TO_DRAFT=7.0** to focus on high-fit roles only.
4. **Always review cover letters** before sending. Claude does well but you know your voice.
5. **Update contact_email manually** if the JD doesn't include one — check the company's careers page.
