// ─── Verdict ────────────────────────────────────────────────────────────────

export enum Verdict {
  SAFE = "SAFE",
  REVIEW = "REVIEW",
  AVOID = "AVOID",
}

// ─── User condition ──────────────────────────────────────────────────────────

export type UserCondition = "hashimotos" | "hypothyroidism" | "exploring";

// ─── Ingredient classification ───────────────────────────────────────────────

export type TriggerCategory =
  | "goitrogen"
  | "soy"
  | "gluten"
  | "iodine_excess"
  | "endocrine_disruptor"
  | "absorption_blocker"
  | "inflammatory_additive";

export type SeverityLevel = "significant" | "moderate" | "mild";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface IngredientEntry {
  id: string;
  displayName: string;
  category: TriggerCategory;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  conditions: Array<"hashimotos" | "hypothyroidism" | "both">;
  patterns: string[];
  wholeWordOnly: boolean;
  explanation: string;
  caveat?: string;
  medicationInteraction?: boolean;
}

export interface MatchedIngredient {
  entryId: string;
  displayName: string;
  category: TriggerCategory;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  explanation: string;
  caveat?: string;
  medicationInteraction: boolean;
  matchedPattern: string;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface CategoryScore {
  category: TriggerCategory;
  label: string;
  count: number;
  highestSeverity: SeverityLevel;
  ingredients: MatchedIngredient[];
}

export interface ScoringResult {
  overallVerdict: Verdict;
  verdictReason: string;
  categoryBreakdown: CategoryScore[];
  totalFlagCount: number;
  significantCount: number;
  medicationWarning: boolean;
  conditionSpecificWarning?: string;
}

// ─── Firestore / user ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  condition: UserCondition;
  subscriptionStatus: "free" | "premium";
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface DailyScanRecord {
  date: string;
  count: number;
}

// ─── OpenFoodFacts ───────────────────────────────────────────────────────────

export interface OpenFoodFactsProduct {
  productName: string;
  ingredientsText: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingCondition: undefined;
  OnboardingHowItWorks: undefined;
  Login: undefined;
  MainTabs: undefined;
  Scanner: undefined;
  Result: {
    productName: string;
    barcode: string;
    verdict: Verdict;
    matchedIngredients: MatchedIngredient[];
    scoringResult: ScoringResult;
    fromHistory?: boolean;
    scannedAtLabel?: string;
  };
  Paywall: undefined;
  Disclaimer: undefined;
};

export type MainTabParamList = {
  Scan: undefined;
  History: undefined;
  Account: undefined;
};
