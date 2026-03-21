/**
 * ThyraScan Scoring Engine
 *
 * Pure function: MatchedIngredient[] + UserCondition → ScoringResult
 * No side effects. No network calls. No React imports.
 *
 * Verdict thresholds (do not change without a product decision):
 *   score < 1.5        → SAFE
 *   1.5 ≤ score < 4.0  → REVIEW
 *   score ≥ 4.0        → AVOID
 *
 * Hard override: any significant iodine_excess ingredient + hashimotos → AVOID
 */

import {
  CategoryScore,
  MatchedIngredient,
  ScoringResult,
  SeverityLevel,
  TriggerCategory,
  UserCondition,
  Verdict,
} from "../types";

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<TriggerCategory, string> = {
  goitrogen: "Goitrogens",
  soy: "Soy",
  gluten: "Gluten",
  iodine_excess: "Excess Iodine",
  endocrine_disruptor: "Endocrine Disruptors",
  absorption_blocker: "Absorption Blockers",
  inflammatory_additive: "Inflammatory Additives",
};

// ─── Severity scores ──────────────────────────────────────────────────────────

const SEVERITY_SCORE: Record<SeverityLevel, number> = {
  significant: 3,
  moderate: 2,
  mild: 1,
};

// ─── Condition-specific category weights ─────────────────────────────────────

const CATEGORY_WEIGHTS: Record<UserCondition, Partial<Record<TriggerCategory, number>>> = {
  hashimotos: {
    goitrogen: 1.0,
    soy: 1.5,
    gluten: 1.5,
    iodine_excess: 2.0,
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.2,
    inflammatory_additive: 0.8,
  },
  hypothyroidism: {
    goitrogen: 1.0,
    soy: 1.2,
    gluten: 0.8,
    iodine_excess: 0.5,
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.5,
    inflammatory_additive: 0.6,
  },
  exploring: {
    goitrogen: 1.0,
    soy: 1.0,
    gluten: 1.0,
    iodine_excess: 1.0,
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.0,
    inflammatory_additive: 0.7,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHighestSeverity(ingredients: MatchedIngredient[]): SeverityLevel {
  const order: SeverityLevel[] = ["significant", "moderate", "mild"];
  for (const level of order) {
    if (ingredients.some((i) => i.severity === level)) return level;
  }
  return "mild";
}

function buildVerdictReason(
  verdict: Verdict,
  breakdown: CategoryScore[],
  condition: UserCondition,
): string {
  if (breakdown.length === 0) {
    return "No thyroid-related ingredients found in our current database.";
  }

  const topCategories = breakdown
    .slice(0, 2)
    .map((c) => c.label.toLowerCase())
    .join(" and ");

  switch (verdict) {
    case Verdict.AVOID:
      if (
        condition === "hashimotos" &&
        breakdown.some((c) => c.category === "iodine_excess")
      ) {
        return "Contains high-iodine ingredients associated with Hashimoto's flares.";
      }
      return `Contains significant ${topCategories} ingredients commonly associated with thyroid disruption.`;
    case Verdict.REVIEW:
      return `Contains ${topCategories} ingredients worth discussing with your healthcare provider.`;
    case Verdict.SAFE:
      return "No thyroid-related ingredients found in our current database.";
  }
}

function buildConditionWarning(
  breakdown: CategoryScore[],
  condition: UserCondition,
): string | undefined {
  if (condition === "hashimotos") {
    const iodineCategory = breakdown.find((c) => c.category === "iodine_excess");
    if (iodineCategory) {
      return "Iodine concern: excess iodine is specifically associated with Hashimoto's flares.";
    }
  }
  return undefined;
}

// ─── Verdict computation ──────────────────────────────────────────────────────

function computeVerdict(
  totalScore: number,
  ingredients: MatchedIngredient[],
  condition: UserCondition,
): Verdict {
  if (ingredients.length === 0) return Verdict.SAFE;

  // Hard override: significant iodine + Hashimoto's → always AVOID
  if (
    condition === "hashimotos" &&
    ingredients.some(
      (i) => i.category === "iodine_excess" && i.severity === "significant",
    )
  ) {
    return Verdict.AVOID;
  }

  if (totalScore >= 4.0) return Verdict.AVOID;
  if (totalScore >= 1.5) return Verdict.REVIEW;
  return Verdict.SAFE;
}

// ─── Main scorer ──────────────────────────────────────────────────────────────

export function scoreProduct(
  matchedIngredients: MatchedIngredient[],
  condition: UserCondition,
): ScoringResult {
  const weights = CATEGORY_WEIGHTS[condition];

  // Group by category
  const categoryMap = new Map<TriggerCategory, MatchedIngredient[]>();
  for (const ingredient of matchedIngredients) {
    const existing = categoryMap.get(ingredient.category) ?? [];
    categoryMap.set(ingredient.category, [...existing, ingredient]);
  }

  // Build category breakdown and sum score
  let totalWeightedScore = 0;
  const categoryBreakdown: CategoryScore[] = [];

  for (const [category, ingredients] of categoryMap.entries()) {
    const weight = weights[category] ?? 1.0;
    const highestSeverity = getHighestSeverity(ingredients);
    const categoryScore = SEVERITY_SCORE[highestSeverity] * weight;
    totalWeightedScore += categoryScore;

    categoryBreakdown.push({
      category,
      label: CATEGORY_LABELS[category],
      count: ingredients.length,
      highestSeverity,
      ingredients,
    });
  }

  // Sort breakdown: most severe category first
  categoryBreakdown.sort(
    (a, b) =>
      SEVERITY_SCORE[b.highestSeverity] - SEVERITY_SCORE[a.highestSeverity],
  );

  const verdict = computeVerdict(totalWeightedScore, matchedIngredients, condition);
  const medicationWarning = matchedIngredients.some((i) => i.medicationInteraction);

  return {
    overallVerdict: verdict,
    verdictReason: buildVerdictReason(verdict, categoryBreakdown, condition),
    categoryBreakdown,
    totalFlagCount: matchedIngredients.length,
    significantCount: matchedIngredients.filter((i) => i.severity === "significant").length,
    medicationWarning,
    conditionSpecificWarning: buildConditionWarning(categoryBreakdown, condition),
  };
}
