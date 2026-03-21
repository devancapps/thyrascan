import {
  normalizeIngredientText,
  classifyIngredients,
} from "../ingredientMatcher";

// ─── normalizeIngredientText ──────────────────────────────────────────────────

describe("normalizeIngredientText", () => {
  it("lowercases input", () => {
    expect(normalizeIngredientText("SOY LECITHIN")).toBe("soy lecithin");
  });

  it("flattens parentheses to spaces", () => {
    // parens become spaces; the result is "soy  non-gmo " before trim normalization
    // but we collapse multiple spaces, so result is "soy non-gmo"
    expect(normalizeIngredientText("soy (non-gmo)")).toBe("soy non-gmo");
  });

  it("flattens brackets to spaces", () => {
    expect(normalizeIngredientText("soy [organic]")).toBe("soy organic");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeIngredientText("soy   lecithin")).toBe("soy lecithin");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeIngredientText("  soy  ")).toBe("soy");
  });

  it("handles empty string", () => {
    expect(normalizeIngredientText("")).toBe("");
  });
});

// ─── classifyIngredients — empty / missing input ──────────────────────────────

describe("classifyIngredients — empty input", () => {
  it("returns empty array for empty string", () => {
    expect(classifyIngredients("", "hashimotos")).toHaveLength(0);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(classifyIngredients("   ", "hashimotos")).toHaveLength(0);
  });

  it("returns empty array for clean ingredient list", () => {
    const result = classifyIngredients(
      "water, sugar, salt, rice flour",
      "hashimotos",
    );
    expect(result).toHaveLength(0);
  });
});

// ─── classifyIngredients — soy detection ────────────────────────────────────

describe("classifyIngredients — soy", () => {
  it("detects soy lecithin", () => {
    const result = classifyIngredients("soy lecithin, sugar", "hashimotos");
    expect(result.some((r) => r.category === "soy")).toBe(true);
  });

  it("detects soybean oil", () => {
    const result = classifyIngredients("soybean oil, salt", "hypothyroidism");
    expect(result.some((r) => r.category === "soy")).toBe(true);
  });

  it("does NOT match 'soy' inside unrelated words (word-boundary safety)", () => {
    // 'destroy' contains 'soy' as a substring — must not match
    const result = classifyIngredients("water to destroy bacteria", "hashimotos");
    expect(result.some((r) => r.category === "soy")).toBe(false);
  });

  it("detects soybean as standalone ingredient", () => {
    // The database matches "soybean" as a pattern
    const result = classifyIngredients("wheat, soybeans, corn", "hashimotos");
    expect(result.some((r) => r.category === "soy")).toBe(true);
  });
});

// ─── classifyIngredients — gluten detection ──────────────────────────────────

describe("classifyIngredients — gluten", () => {
  it("detects wheat", () => {
    const result = classifyIngredients("enriched wheat flour, salt", "hashimotos");
    expect(result.some((r) => r.category === "gluten")).toBe(true);
  });

  it("detects barley", () => {
    const result = classifyIngredients("barley malt, water", "hashimotos");
    expect(result.some((r) => r.category === "gluten")).toBe(true);
  });

  it("detects wheat gluten as a label ingredient", () => {
    // "wheat gluten" is a direct pattern in the database
    const result = classifyIngredients("wheat gluten, water", "hashimotos");
    expect(result.some((r) => r.category === "gluten")).toBe(true);
  });
});

// ─── classifyIngredients — goitrogen detection ───────────────────────────────

describe("classifyIngredients — goitrogens", () => {
  it("detects concentrated kale", () => {
    // Database only flags concentrated forms (kale powder, kale extract, etc.)
    const result = classifyIngredients("kale powder, olive oil", "hashimotos");
    expect(result.some((r) => r.category === "goitrogen")).toBe(true);
  });

  it("detects broccoli", () => {
    const result = classifyIngredients("broccoli extract, water", "hashimotos");
    expect(result.some((r) => r.category === "goitrogen")).toBe(true);
  });
});

// ─── classifyIngredients — iodine_excess detection ──────────────────────────

describe("classifyIngredients — iodine excess", () => {
  it("detects kelp", () => {
    const result = classifyIngredients("kelp powder, sea salt", "hashimotos");
    expect(result.some((r) => r.category === "iodine_excess")).toBe(true);
  });

  it("does NOT match 'kelp' inside unrelated words", () => {
    const result = classifyIngredients("helped restore minerals", "hashimotos");
    expect(result.some((r) => r.category === "iodine_excess")).toBe(false);
  });
});

// ─── classifyIngredients — deduplication ─────────────────────────────────────

describe("classifyIngredients — deduplication", () => {
  it("deduplicates the same ingredient matched via multiple patterns", () => {
    // Both 'soy' and 'soy lecithin' refer to the same entry
    const result = classifyIngredients("soy lecithin, soy protein", "hashimotos");
    const soyMatches = result.filter((r) => r.entryId.startsWith("soy_lecithin") || r.category === "soy");
    // No entry should appear twice
    const ids = result.map((r) => r.entryId);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});

// ─── classifyIngredients — condition filtering ───────────────────────────────

describe("classifyIngredients — condition filtering", () => {
  it("exploring condition returns matches for all relevant categories", () => {
    const result = classifyIngredients("soy lecithin, kelp", "exploring");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns matched ingredient with required fields", () => {
    const result = classifyIngredients("soy lecithin", "hashimotos");
    expect(result.length).toBeGreaterThan(0);
    const match = result[0];
    expect(match).toHaveProperty("entryId");
    expect(match).toHaveProperty("displayName");
    expect(match).toHaveProperty("category");
    expect(match).toHaveProperty("severity");
    expect(match).toHaveProperty("confidence");
    expect(match).toHaveProperty("explanation");
    expect(match).toHaveProperty("matchedPattern");
    expect(typeof match.medicationInteraction).toBe("boolean");
  });
});

// ─── classifyIngredients — parenthetical ingredients ─────────────────────────

describe("classifyIngredients — parenthetical ingredients", () => {
  it("detects ingredients listed inside parentheses", () => {
    // Common format: "enriched flour (wheat flour, niacin, ...)"
    const result = classifyIngredients(
      "enriched flour (wheat flour, iron, riboflavin), water",
      "hashimotos",
    );
    expect(result.some((r) => r.category === "gluten")).toBe(true);
  });

  it("detects soy inside parenthetical sub-ingredient list", () => {
    const result = classifyIngredients(
      "chocolate coating (sugar, cocoa butter, soy lecithin)",
      "hashimotos",
    );
    expect(result.some((r) => r.category === "soy")).toBe(true);
  });
});
