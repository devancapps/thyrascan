"""
Claude-powered job scoring and cover letter generation.
All LLM calls live here. No side effects — callers handle DB writes.
"""

import json
import re
from dataclasses import dataclass

import anthropic

from . import config


_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
    return _client


@dataclass
class ScoreResult:
    score: float          # 1.0 – 10.0
    headline: str         # one-line verdict
    strengths: list[str]  # 2-3 bullet points
    gaps: list[str]       # 1-2 concerns
    recommendation: str   # STRONG_YES | YES | MAYBE | NO


@dataclass
class CoverLetterResult:
    subject: str
    body: str
    contact_email: str    # extracted from JD if present, else ""


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

SCORE_SYSTEM = """You are a sharp, no-nonsense career coach helping a Product Manager evaluate job fit.
You read job descriptions critically and compare them against the candidate's resume with honest, specific analysis.
You never over-inflate scores. A 10 means "nearly perfect fit." A 5 means "possible but real gaps."
Return ONLY valid JSON — no markdown, no explanation outside the JSON."""

SCORE_PROMPT = """Resume:
{resume}

---

Job Title: {title}
Company: {company}
Location: {location}
Job Description:
{description}

---

Evaluate this job fit. Return this exact JSON structure:
{{
  "score": <float 1.0-10.0>,
  "headline": "<one sentence: why this is or isn't a good fit>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "gaps": ["<gap or concern 1>", "<gap or concern 2>"],
  "recommendation": "<STRONG_YES | YES | MAYBE | NO>"
}}

Scoring guide:
9-10: Nearly perfect match — apply immediately
7-8: Strong fit — worth a personalized application
5-6: Partial fit — apply only if interested in the company/domain
3-4: Significant gaps — stretch role, apply only if you want the challenge
1-2: Not a fit — don't waste time

Be honest. Factor in: seniority alignment, domain match, required skills, location/remote fit."""


def score_job(
    title: str,
    company: str,
    location: str,
    description: str,
    resume: str,
) -> ScoreResult:
    prompt = SCORE_PROMPT.format(
        resume=resume[:4000],  # keep within context limits
        title=title,
        company=company,
        location=location,
        description=description[:3000],
    )

    client = _get_client()
    message = client.messages.create(
        model=config.CLAUDE_MODEL,
        max_tokens=512,
        system=SCORE_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if Claude adds them
    raw = re.sub(r"^```[a-z]*\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: extract score with regex if JSON is malformed
        score_match = re.search(r'"score"\s*:\s*([0-9.]+)', raw)
        score = float(score_match.group(1)) if score_match else 5.0
        return ScoreResult(
            score=score,
            headline="Could not parse full analysis.",
            strengths=[],
            gaps=[],
            recommendation="MAYBE",
        )

    return ScoreResult(
        score=float(data.get("score", 5.0)),
        headline=data.get("headline", ""),
        strengths=data.get("strengths", []),
        gaps=data.get("gaps", []),
        recommendation=data.get("recommendation", "MAYBE"),
    )


# ---------------------------------------------------------------------------
# Cover letter generation
# ---------------------------------------------------------------------------

COVER_LETTER_SYSTEM = """You are an expert PM career coach writing job application emails.
Your emails are direct, confident, and specific — never generic. You highlight the candidate's most
relevant experience for THIS specific role. You write like a sharp professional, not a robot.
Never use phrases like "I am writing to express my interest" or "I believe I would be a great fit."
Return ONLY valid JSON — no markdown, no explanation outside the JSON."""

COVER_LETTER_PROMPT = """Resume:
{resume}

---

Job Title: {title}
Company: {company}
Job Description:
{description}

---

Write a compelling application email for this PM role. Return this exact JSON:
{{
  "subject": "<email subject line — specific, not generic>",
  "body": "<full email body — 3-4 paragraphs, plain text, no bullet points in the email itself>",
  "contact_email": "<extract any hiring/apply email from the JD, or empty string>"
}}

Email guidelines:
- Opening: Hook with a specific observation about the company or role (1-2 sentences)
- Para 2: Most relevant experience — specific metrics and outcomes, not duties
- Para 3: Why THIS company specifically — show you did homework
- Closing: Clear call to action, 1 sentence
- Tone: Confident, direct, human. Like a message from a strong PM who knows their value.
- Length: 200-280 words max. Recruiters skim.
- Sign off with: {your_name}"""


def write_cover_letter(
    title: str,
    company: str,
    description: str,
    resume: str,
) -> CoverLetterResult:
    prompt = COVER_LETTER_PROMPT.format(
        resume=resume[:4000],
        title=title,
        company=company,
        description=description[:3000],
        your_name=config.YOUR_NAME or "Your Name",
    )

    client = _get_client()
    message = client.messages.create(
        model=config.CLAUDE_MODEL,
        max_tokens=1024,
        system=COVER_LETTER_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    raw = re.sub(r"^```[a-z]*\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return CoverLetterResult(
            subject=f"Application: {title} at {company}",
            body=raw,
            contact_email="",
        )

    return CoverLetterResult(
        subject=data.get("subject", f"Application: {title} at {company}"),
        body=data.get("body", ""),
        contact_email=data.get("contact_email", ""),
    )
