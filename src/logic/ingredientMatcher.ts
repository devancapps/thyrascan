/**
 * ThyraScan Ingredient Matcher
 *
 * Matches a product's ingredients text against the ingredient database.
 * Uses word-boundary matching for entries with wholeWordOnly: true to
 * prevent false positives (e.g. "soy" inside "destroy").
 */

import { IngredientEntry, MatchedIngredient, UserCondition } from "../types";
import { INGREDIENT_DATABASE } from "./ingredientDatabase";

// ─── Normalization ────────────────────────────────────────────────────────────

/**
 * Normalize raw ingredient text before matching:
 * - lowercase
 * - flatten parentheses/brackets to spaces (ingredient sub-lists)
 * - collapse runs of whitespace
 */
export function normalizeIngredientText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Matching helpers ─────────────────────────────────────────────────────────

/**
 * Word-boundary match — treats any non-alphanumeric character as a boundary.
 * Prevents "soy" matching inside "destroy", "kelp" inside "helped", etc.
 */
function matchWholeWord(text: string, pattern: string): boolean {
  const escaped = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
  return regex.test(text);
}

function matchSubstring(text: string, pattern: string): boolean {
  return text.includes(pattern);
}

// ─── Condition filtering ──────────────────────────────────────────────────────

function isRelevantForCondition(
  entry: IngredientEntry,
  condition: UserCondition,
): boolean {
  if (condition === "exploring") return true;
  return entry.conditions.some(
    (c) => c === "both" || c === condition,
  );
}

// ─── Deduplication ────────────────────────────────────────────────────────────

function deduplicateByEntryId(
  matches: MatchedIngredient[],
): MatchedIngredient[] {
  const seen = new Set<string>();
  return matches.filter((m) => {
    if (seen.has(m.entryId)) return false;
    seen.add(m.entryId);
    return true;
  });
}

// ─── Main classifier ──────────────────────────────────────────────────────────

/**
 * Classify a product's ingredients text against the thyroid ingredient database.
 *
 * @param ingredientsText  Raw ingredients string from OpenFoodFacts
 * @param condition        The user's thyroid condition
 * @returns                Array of matched ingredients (deduplicated)
 */
export function classifyIngredients(
  ingredientsText: string,
  condition: UserCondition,
): MatchedIngredient[] {
  if (!ingredientsText || ingredientsText.trim().length === 0) {
    return [];
  }

  const normalized = normalizeIngredientText(ingredientsText);
  const matches: MatchedIngredient[] = [];

  for (const entry of INGREDIENT_DATABASE) {
    if (!isRelevantForCondition(entry, condition)) continue;

    let firstMatch: string | null = null;

    for (const pattern of entry.patterns) {
      const found = entry.wholeWordOnly
        ? matchWholeWord(normalized, pattern)
        : matchSubstring(normalized, pattern);

      if (found) {
        firstMatch = pattern;
        break; // first pattern match per entry is enough
      }
    }

    if (firstMatch !== null) {
      matches.push({
        entryId: entry.id,
        displayName: entry.displayName,
        category: entry.category,
        severity: entry.severity,
        confidence: entry.confidence,
        explanation: entry.explanation,
        caveat: entry.caveat,
        medicationInteraction: entry.medicationInteraction ?? false,
        matchedPattern: firstMatch,
      });
    }
  }

  return deduplicateByEntryId(matches);
}
