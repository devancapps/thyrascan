/**
 * ThyraScan Verdict Generator
 *
 * Thin adapter: takes a ScoringResult and surfaces the verdict
 * and human-readable message. The heavy logic lives in scoringEngine.ts.
 *
 * HEALTH LANGUAGE RULES:
 *   - Never say "safe" as an absolute guarantee
 *   - Never say "dangerous" or "will harm"
 *   - Always frame as educational / "found in our database"
 */

import { ScoringResult, Verdict } from "../types";

export function getVerdictMessage(scoringResult: ScoringResult): string {
  return scoringResult.verdictReason;
}

export function getVerdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case Verdict.SAFE:
      return "SAFE";
    case Verdict.REVIEW:
      return "REVIEW";
    case Verdict.AVOID:
      return "AVOID";
  }
}

export function getVerdictAccessibilityLabel(verdict: Verdict): string {
  switch (verdict) {
    case Verdict.SAFE:
      return "Safe — no flagged ingredients found";
    case Verdict.REVIEW:
      return "Review — contains ingredients worth discussing with your doctor";
    case Verdict.AVOID:
      return "Avoid — contains ingredients commonly associated with thyroid disruption";
  }
}
