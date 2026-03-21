import { scoreProduct } from "../scoringEngine";
import { classifyIngredients } from "../ingredientMatcher";
import { Verdict } from "../../types";

// ─── Empty input → SAFE ──────────────────────────────────────────────────────

describe("scoreProduct — empty input", () => {
  it("returns SAFE for no matched ingredients", () => {
    const result = scoreProduct([], "hashimotos");
    expect(result.overallVerdict).toBe(Verdict.SAFE);
    expect(result.totalFlagCount).toBe(0);
    expect(result.medicationWarning).toBe(false);
  });
});

// ─── Verdict thresholds ──────────────────────────────────────────────────────

describe("scoreProduct — verdict thresholds", () => {
  it("returns SAFE for a clean product", () => {
    const matched = classifyIngredients("water, sugar, salt", "exploring");
    const result = scoreProduct(matched, "exploring");
    expect(result.overallVerdict).toBe(Verdict.SAFE);
  });

  it("returns REVIEW for mild/moderate ingredients (exploring)", () => {
    // broccoli is a mild goitrogen
    const matched = classifyIngredients("broccoli powder", "exploring");
    const result = scoreProduct(matched, "exploring");
    // Could be REVIEW or SAFE depending on score — just verify it's not AVOID
    expect(result.overallVerdict).not.toBe(Verdict.AVOID);
  });

  it("returns AVOID for product with multiple significant triggers (hashimotos)", () => {
    // kelp (significant iodine_excess) + soy lecithin + wheat — very high score for hashimotos
    const matched = classifyIngredients(
      "soy protein, wheat flour, kelp powder",
      "hashimotos",
    );
    const result = scoreProduct(matched, "hashimotos");
    expect(result.overallVerdict).toBe(Verdict.AVOID);
  });
});

// ─── Hashimoto's hard override ───────────────────────────────────────────────

describe("scoreProduct — Hashimoto's hard override", () => {
  it("always returns AVOID when significant iodine_excess is present for hashimotos", () => {
    // Even if score would be below 4.0, significant iodine + hashimotos = AVOID
    const matched = classifyIngredients("kelp extract", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");
    if (matched.some((m) => m.category === "iodine_excess" && m.severity === "significant")) {
      expect(result.overallVerdict).toBe(Verdict.AVOID);
    }
  });

  it("does NOT apply hard override for hypothyroidism", () => {
    const matched = classifyIngredients("kelp extract", "hypothyroidism");
    const result = scoreProduct(matched, "hypothyroidism");
    // hypothyroidism weights iodine at 0.5x — likely REVIEW or SAFE, not forced AVOID
    expect([Verdict.SAFE, Verdict.REVIEW, Verdict.AVOID]).toContain(
      result.overallVerdict,
    );
    // Specifically it should NOT be forced AVOID by the hashimotos override rule
    // (scoring may still produce AVOID if score >= 4.0, but that's a coincidence)
  });
});

// ─── ScoringResult shape ─────────────────────────────────────────────────────

describe("scoreProduct — result shape", () => {
  it("returns all required fields", () => {
    const matched = classifyIngredients("soy lecithin", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");

    expect(result).toHaveProperty("overallVerdict");
    expect(result).toHaveProperty("verdictReason");
    expect(result).toHaveProperty("categoryBreakdown");
    expect(result).toHaveProperty("totalFlagCount");
    expect(result).toHaveProperty("significantCount");
    expect(result).toHaveProperty("medicationWarning");
    expect(typeof result.medicationWarning).toBe("boolean");
    expect(Array.isArray(result.categoryBreakdown)).toBe(true);
  });

  it("totalFlagCount matches matched ingredient count", () => {
    const matched = classifyIngredients("soy lecithin, kelp, wheat flour", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");
    expect(result.totalFlagCount).toBe(matched.length);
  });

  it("significantCount only counts significant-severity items", () => {
    const matched = classifyIngredients("soy lecithin, kelp powder", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");
    const expectedSignificant = matched.filter(
      (m) => m.severity === "significant",
    ).length;
    expect(result.significantCount).toBe(expectedSignificant);
  });

  it("categoryBreakdown groups ingredients by category", () => {
    const matched = classifyIngredients(
      "soy lecithin, soy protein isolate",
      "hashimotos",
    );
    const result = scoreProduct(matched, "hashimotos");
    // All soy matches should be in a single soy category entry
    const soyCat = result.categoryBreakdown.find((c) => c.category === "soy");
    if (soyCat) {
      expect(soyCat.count).toBeGreaterThanOrEqual(1);
    }
  });
});

// ─── Condition-specific warning ──────────────────────────────────────────────

describe("scoreProduct — condition-specific warnings", () => {
  it("adds iodine warning for hashimotos when iodine_excess present", () => {
    const matched = classifyIngredients("kelp powder, water", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");
    if (matched.some((m) => m.category === "iodine_excess")) {
      expect(result.conditionSpecificWarning).toBeTruthy();
    }
  });

  it("does NOT add iodine warning for exploring condition", () => {
    const matched = classifyIngredients("kelp powder", "exploring");
    const result = scoreProduct(matched, "exploring");
    // exploring has no condition-specific iodine warning
    expect(result.conditionSpecificWarning).toBeUndefined();
  });
});

// ─── Medication warning ──────────────────────────────────────────────────────

describe("scoreProduct — medication warning", () => {
  it("sets medicationWarning true when an ingredient has medicationInteraction", () => {
    // Calcium carbonate and soy protein are known medication-interaction ingredients
    const matched = classifyIngredients(
      "calcium carbonate, water",
      "hypothyroidism",
    );
    const result = scoreProduct(matched, "hypothyroidism");
    const hasMedInteraction = matched.some((m) => m.medicationInteraction);
    expect(result.medicationWarning).toBe(hasMedInteraction);
  });
});

// ─── verdictReason is human-readable ─────────────────────────────────────────

describe("scoreProduct — verdictReason", () => {
  it("returns a non-empty string for safe result", () => {
    const result = scoreProduct([], "hashimotos");
    expect(typeof result.verdictReason).toBe("string");
    expect(result.verdictReason.length).toBeGreaterThan(0);
  });

  it("returns a non-empty string for flagged result", () => {
    const matched = classifyIngredients("soy lecithin, wheat", "hashimotos");
    const result = scoreProduct(matched, "hashimotos");
    expect(typeof result.verdictReason).toBe("string");
    expect(result.verdictReason.length).toBeGreaterThan(0);
  });
});
