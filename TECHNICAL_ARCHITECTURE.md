# ThyraScan — Technical Architecture & System Design
**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-21

---

## 1. Architecture Overview

ThyraScan is a **React Native / Expo** iOS-first mobile application. It inherits the core infrastructure from the ADHD Food Scanner codebase and replaces the domain-specific business logic (ingredient detection, verdict generation) with a new thyroid-focused engine.

**Stack:**
- **Runtime:** React Native 0.83+ / Expo SDK 55
- **Language:** TypeScript (strict mode)
- **Auth:** Firebase Authentication (email + Apple Sign In)
- **Database:** Firestore (user profiles, scan history)
- **Subscriptions:** RevenueCat (monthly IAP)
- **Barcode Data:** OpenFoodFacts public API (no key required)
- **Navigation:** React Navigation v7 (native stack + bottom tabs)
- **Build/Deploy:** EAS Build + EAS Submit

**All processing is client-side.** There is no proprietary backend server. The ingredient classification engine runs entirely on device, which means:
- No server costs
- Instant response after API fetch
- Full offline capability for re-viewing past results
- Database updates require app updates (acceptable for v1)

---

## 2. What Is Reused From Source Codebase

| Module | File(s) | Reuse Status |
|--------|---------|-------------|
| Firebase config | `src/firebase/config.ts` | Reuse, swap env vars |
| Firebase auth wrappers | `src/firebase/auth.ts` | Reuse as-is |
| Firestore wrappers | `src/firebase/firestore.ts` | Reuse, extend schema |
| Auth context/hook | `src/hooks/useAuth.ts` | Reuse as-is |
| Subscription context/hook | `src/hooks/useSubscription.ts` | Reuse as-is |
| Scan limit hook | `src/hooks/useScanLimit.ts` | Reuse as-is |
| Scan limit logic | `src/logic/scanLimiter.ts` | Reuse as-is |
| RevenueCat service | `src/services/revenueCat.ts` | Reuse, swap API keys |
| OpenFoodFacts service | `src/services/openFoodFacts.ts` | Reuse as-is |
| App navigation | `src/navigation/AppNavigator.tsx` | Reuse as-is |
| Tab navigation | `src/navigation/MainTabNavigator.tsx` | Reuse as-is |
| BarcodeOverlay component | `src/components/BarcodeOverlay.tsx` | Reuse as-is |
| ErrorCard component | `src/components/ErrorCard.tsx` | Reuse as-is |
| LoadingSpinner component | `src/components/LoadingSpinner.tsx` | Reuse as-is |
| ProductCard component | `src/components/ProductCard.tsx` | Reuse as-is |
| ScanButton component | `src/components/ScanButton.tsx` | Reuse as-is |
| App entry | `App.tsx`, `index.ts` | Reuse, update app name |
| Build config | `babel.config.js`, `tsconfig.json` | Reuse as-is |

**Files to rewrite or significantly modify:**

| Module | File(s) | Action |
|--------|---------|--------|
| Trigger detection | `src/logic/triggerDetection.ts` | **Full rewrite** |
| Verdict generation | `src/logic/verdictGenerator.ts` | **Full rewrite** |
| Design system | `src/styles/theme.ts` | Brand color update |
| Type definitions | `src/types/index.ts` | Extend with new types |
| All screens | `src/screens/*.tsx` | Update copy + extend UI |
| VerdictBadge | `src/components/VerdictBadge.tsx` | Update for new verdict semantics |
| TriggerList | `src/components/TriggerList.tsx` | Replace with `IngredientBreakdown` |
| Onboarding | `src/screens/OnboardingScreen.tsx` | Full rewrite (multi-step) |
| Home | `src/screens/HomeScreen.tsx` | Update copy, add condition display |
| Result | `src/screens/ResultScreen.tsx` | Extend with explanation cards |
| App config | `app.config.ts`, `eas.json` | New name, bundle ID, keys |

---

## 3. Revised Architecture for ThyraScan

```
ThyraScan
├── App.tsx                          ← Root providers
│   ├── SafeAreaProvider
│   ├── AuthProvider
│   ├── SubscriptionProvider
│   ├── UserProfileProvider           ← NEW: exposes condition + preferences
│   └── NavigationContainer
│
├── src/
│   ├── firebase/
│   │   ├── config.ts                ← Swap env vars
│   │   ├── auth.ts                  ← Reuse
│   │   └── firestore.ts             ← Extend schema (condition field)
│   │
│   ├── services/
│   │   ├── openFoodFacts.ts         ← Reuse
│   │   └── revenueCat.ts            ← Reuse, swap keys
│   │
│   ├── logic/                       ← CORE DOMAIN — all rewritten
│   │   ├── ingredientDatabase.ts    ← NEW: master ingredient list by category
│   │   ├── ingredientMatcher.ts     ← NEW: tokenized matching engine
│   │   ├── scoringEngine.ts         ← NEW: condition-aware scoring
│   │   ├── verdictGenerator.ts      ← REWRITE: uses scoring output
│   │   └── scanLimiter.ts           ← Reuse
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               ← Reuse
│   │   ├── useSubscription.ts       ← Reuse
│   │   ├── useScanLimit.ts          ← Reuse
│   │   └── useUserProfile.ts        ← NEW: condition, preferences
│   │
│   ├── components/
│   │   ├── BarcodeOverlay.tsx       ← Reuse
│   │   ├── ErrorCard.tsx            ← Reuse
│   │   ├── LoadingSpinner.tsx       ← Reuse
│   │   ├── ProductCard.tsx          ← Reuse
│   │   ├── ScanButton.tsx           ← Reuse
│   │   ├── VerdictBadge.tsx         ← Update labels/colors
│   │   ├── IngredientBreakdown.tsx  ← NEW: replaces TriggerList
│   │   ├── IngredientExplanation.tsx← NEW: expandable "why" card
│   │   ├── CategoryPill.tsx         ← NEW: category label chip
│   │   └── MedicationWarning.tsx    ← NEW: levothyroxine absorption banner
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx         ← Reuse (add Onboarding flow)
│   │   └── MainTabNavigator.tsx     ← Reuse
│   │
│   ├── screens/
│   │   ├── OnboardingScreen.tsx     ← REWRITE (multi-step)
│   │   ├── ConditionSelectScreen.tsx← NEW: step 2 of onboarding
│   │   ├── LoginScreen.tsx          ← Light copy update
│   │   ├── HomeScreen.tsx           ← Update copy + condition badge
│   │   ├── ScannerScreen.tsx        ← Reuse (minimal changes)
│   │   ├── ResultScreen.tsx         ← EXTEND (explanation cards)
│   │   ├── HistoryScreen.tsx        ← Light update
│   │   ├── ProfileScreen.tsx        ← Update + add condition setting
│   │   ├── PaywallScreen.tsx        ← Update copy
│   │   └── DisclaimerScreen.tsx     ← NEW: full disclaimer/about
│   │
│   ├── styles/
│   │   └── theme.ts                 ← Update brand colors
│   │
│   └── types/
│       └── index.ts                 ← Extend with new types
```

---

## 4. Scanning Flow

```
User taps "Scan" on HomeScreen
        │
        ▼
ScannerScreen mounts
  • Request camera permission (expo-camera)
  • CameraView live preview with BarcodeOverlay
  • processingRef mutex prevents double-scan
        │
[barcode detected] ─── canScan === false ──→ navigate to Paywall
        │
        ▼
fetchProduct(barcode)                    [openFoodFacts.ts]
  GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json
  → returns { productName, ingredientsText }
  → throws ProductNotFoundError | NetworkError
        │
        ▼
classifyIngredients(ingredientsText, userCondition)   [ingredientMatcher.ts]
  → tokenizes ingredients text
  → matches against ingredientDatabase
  → returns MatchedIngredient[]
        │
        ▼
scoreProduct(matchedIngredients, userCondition)       [scoringEngine.ts]
  → computes categoryScores{}
  → computes overallSeverity
  → applies condition-specific weights
  → returns ScoringResult
        │
        ▼
generateVerdict(scoringResult)                        [verdictGenerator.ts]
  → returns Verdict (SAFE | REVIEW | AVOID)
  → returns verdictMessage string
  → returns medicationWarning boolean
        │
        ▼
Fire-and-forget (non-blocking):
  recordScan(userId)          [Firestore daily limit increment]
  saveScanResult(userId, ...) [Firestore history — premium only]
        │
        ▼
navigation.replace("Result", {
  productName, verdict, matchedIngredients,
  scoringResult, medicationWarning
})
```

---

## 5. Ingredient Classification Engine

### 5.1 Database Structure (`ingredientDatabase.ts`)

```typescript
export type TriggerCategory =
  | "goitrogen"
  | "soy"
  | "gluten"
  | "iodine_excess"
  | "endocrine_disruptor"
  | "absorption_blocker"
  | "inflammatory_additive";

export type ConfidenceLevel = "high" | "medium" | "low";
export type SeverityLevel = "significant" | "moderate" | "mild";

export interface IngredientEntry {
  id: string;
  displayName: string;
  category: TriggerCategory;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  // Which conditions this is most relevant for
  conditions: ("hashimotos" | "hypothyroidism" | "both")[];
  patterns: string[];           // lowercase match strings
  wholeWordOnly: boolean;       // use word-boundary matching
  explanation: string;          // 1–2 sentence plain-English explanation
  caveat?: string;              // optional nuance (e.g., "less concern if cooked")
  medicationInteraction?: boolean; // flags levothyroxine absorption risk
}
```

**Example entries:**

```typescript
{
  id: "soy_isoflavone",
  displayName: "Soy",
  category: "soy",
  severity: "significant",
  confidence: "high",
  conditions: ["both"],
  patterns: ["soy protein", "soy isolate", "soy flour", "soybean", "soy lecithin", "tofu", "tempeh", "edamame", "miso", "soya"],
  wholeWordOnly: false,
  explanation: "Soy isoflavones can interfere with thyroid hormone production and may reduce the effectiveness of thyroid medication.",
  caveat: "Soy lecithin in small amounts is considered lower risk by many practitioners.",
  medicationInteraction: true,
},
{
  id: "kelp",
  displayName: "Kelp / Seaweed",
  category: "iodine_excess",
  severity: "significant",
  confidence: "high",
  conditions: ["hashimotos"],
  patterns: ["kelp", "seaweed", "nori", "dulse", "wakame", "kombu", "spirulina", "chlorella", "bladderwrack"],
  wholeWordOnly: true,
  explanation: "High iodine content from seaweeds can trigger or worsen Hashimoto's autoimmune flares in iodine-sensitive individuals.",
  caveat: "Iodine concern is primarily relevant for Hashimoto's, not straightforward hypothyroidism.",
},
```

### 5.2 Matching Engine (`ingredientMatcher.ts`)

**Why not simple `String.includes()`:**
The source app uses naive `lowerText.includes(pattern)` which can produce false positives. For example:
- `"soy"` matching inside `"destroy"` (incorrect)
- `"miso"` matching inside `"compromising"` (incorrect)

**ThyraScan uses tokenized matching:**

```typescript
export function classifyIngredients(
  ingredientsText: string,
  condition: UserCondition
): MatchedIngredient[] {
  const normalized = normalizeIngredientText(ingredientsText);
  const matched: MatchedIngredient[] = [];

  for (const entry of INGREDIENT_DATABASE) {
    // Skip entries not relevant to this condition
    if (!isRelevantForCondition(entry, condition)) continue;

    for (const pattern of entry.patterns) {
      const found = entry.wholeWordOnly
        ? matchWholeWord(normalized, pattern)
        : normalized.includes(pattern);

      if (found) {
        matched.push({
          entryId: entry.id,
          displayName: entry.displayName,
          category: entry.category,
          severity: entry.severity,
          confidence: entry.confidence,
          explanation: entry.explanation,
          caveat: entry.caveat,
          medicationInteraction: entry.medicationInteraction ?? false,
          matchedPattern: pattern,
        });
        break; // First pattern match is enough — avoid duplicates
      }
    }
  }

  return deduplicateByEntryId(matched);
}

function normalizeIngredientText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[()[\]]/g, " ")   // flatten brackets
    .replace(/\s+/g, " ")       // collapse whitespace
    .trim();
}

function matchWholeWord(text: string, pattern: string): boolean {
  // Treat non-alphanumeric as word boundaries
  const escaped = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
  return regex.test(text);
}
```

---

## 6. Scoring Engine (`scoringEngine.ts`)

### Input
```typescript
interface ScoringInput {
  matchedIngredients: MatchedIngredient[];
  condition: UserCondition;
}
```

### Output
```typescript
interface ScoringResult {
  overallVerdict: Verdict;           // SAFE | REVIEW | AVOID
  verdictReason: string;             // One-line human explanation
  categoryBreakdown: CategoryScore[];
  totalFlagCount: number;
  significantCount: number;
  medicationWarning: boolean;
  conditionSpecificWarning?: string; // e.g., "Iodine concern for Hashimoto's"
}

interface CategoryScore {
  category: TriggerCategory;
  label: string;                 // "Goitrogens", "Soy", etc.
  count: number;
  highestSeverity: SeverityLevel;
  ingredients: MatchedIngredient[];
}
```

### Scoring Logic

```typescript
// Category weights — condition-aware
const CATEGORY_WEIGHTS: Record<UserCondition, Partial<Record<TriggerCategory, number>>> = {
  hashimotos: {
    goitrogen: 1.0,
    soy: 1.5,           // Soy more significant for Hashimoto's
    gluten: 1.5,        // Gluten more significant for autoimmune
    iodine_excess: 2.0, // Highest weight — Hashimoto's specific
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.2,
    inflammatory_additive: 0.8,
  },
  hypothyroidism: {
    goitrogen: 1.0,
    soy: 1.2,
    gluten: 0.8,        // Less critical without autoimmune component
    iodine_excess: 0.5, // Iodine supplementation may even be prescribed
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.5, // Higher weight — levothyroxine absorption matters
    inflammatory_additive: 0.6,
  },
  exploring: {
    // Balanced, no strong weighting
    goitrogen: 1.0,
    soy: 1.0,
    gluten: 1.0,
    iodine_excess: 1.0,
    endocrine_disruptor: 1.0,
    absorption_blocker: 1.0,
    inflammatory_additive: 0.7,
  },
};

// Severity scores
const SEVERITY_SCORE: Record<SeverityLevel, number> = {
  significant: 3,
  moderate: 2,
  mild: 1,
};

export function scoreProduct(input: ScoringInput): ScoringResult {
  const { matchedIngredients, condition } = input;
  const weights = CATEGORY_WEIGHTS[condition];

  // Build category breakdown
  const categoryMap = new Map<TriggerCategory, MatchedIngredient[]>();
  for (const ingredient of matchedIngredients) {
    const existing = categoryMap.get(ingredient.category) ?? [];
    categoryMap.set(ingredient.category, [...existing, ingredient]);
  }

  // Compute weighted score
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

  // Determine verdict
  const verdict = computeVerdict(totalWeightedScore, matchedIngredients, condition);
  const medicationWarning = matchedIngredients.some(i => i.medicationInteraction);

  return {
    overallVerdict: verdict,
    verdictReason: buildVerdictReason(verdict, categoryBreakdown, condition),
    categoryBreakdown,
    totalFlagCount: matchedIngredients.length,
    significantCount: matchedIngredients.filter(i => i.severity === "significant").length,
    medicationWarning,
    conditionSpecificWarning: buildConditionWarning(categoryBreakdown, condition),
  };
}

function computeVerdict(
  score: number,
  ingredients: MatchedIngredient[],
  condition: UserCondition
): Verdict {
  if (ingredients.length === 0) return Verdict.SAFE;

  // Fast-track AVOID for high-score iodine items in Hashimoto's
  if (
    condition === "hashimotos" &&
    ingredients.some(i => i.category === "iodine_excess" && i.severity === "significant")
  ) {
    return Verdict.AVOID;
  }

  if (score >= 4.0) return Verdict.AVOID;
  if (score >= 1.5) return Verdict.REVIEW;
  return Verdict.SAFE;
}
```

---

## 7. Explainability Layer

Each result carries structured explanation data — not a black box verdict.

### ResultScreen receives:
```typescript
{
  productName: string;
  verdict: Verdict;
  scoringResult: ScoringResult;    // Full breakdown
  matchedIngredients: MatchedIngredient[];
  medicationWarning: boolean;
}
```

### UI components that render the explanation:

**`IngredientBreakdown`** — shows category pills and count:
```
[Soy ×2]  [Goitrogens ×1]  [Absorption Blocker ×1]
```

**`IngredientExplanation`** — expandable card per matched ingredient:
```
▶ Soy Protein Isolate  [SIGNIFICANT]
  "Soy isoflavones can interfere with thyroid hormone production..."
  ⚠ May reduce medication absorption
  ℹ Caveat: Soy lecithin in small amounts is considered lower risk.
```

**`MedicationWarning`** — top-level banner when `medicationInteraction === true`:
```
⚠ Contains ingredients that may affect levothyroxine absorption.
  Take medication at least 4 hours away from this product.
  [Learn More]
```

---

## 8. Data Models

### Firestore `users/{userId}`
```typescript
{
  id: string;
  email: string;
  condition: "hashimotos" | "hypothyroidism" | "exploring"; // NEW
  subscription_status: "free" | "premium";
  created_at: Timestamp;
  daily_scans: { date: string; count: number };
  onboarding_completed: boolean;   // NEW
}
```

### Firestore `scan_history/{docId}`
```typescript
{
  user_id: string;
  product_name: string;
  barcode: string;
  verdict: "SAFE" | "REVIEW" | "AVOID";  // changed CAUTION → REVIEW
  matched_ingredients: Array<{
    id: string;
    displayName: string;
    category: string;
    severity: string;
  }>;
  category_breakdown: Array<{
    category: string;
    count: number;
  }>;
  medication_warning: boolean;    // NEW
  condition_at_scan: string;      // NEW — snapshot user condition at time of scan
  scanned_at: Timestamp;
}
```

### TypeScript Types (`src/types/index.ts`)
```typescript
export enum Verdict {
  SAFE = "SAFE",
  REVIEW = "REVIEW",     // renamed from CAUTION
  AVOID = "AVOID",
}

export type UserCondition = "hashimotos" | "hypothyroidism" | "exploring";

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

// Updated navigation params
export type RootStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingCondition: undefined;
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
```

---

## 9. New Hooks

### `useUserProfile` (`src/hooks/useUserProfile.ts`)
```typescript
interface UserProfileContextType {
  condition: UserCondition | null;
  onboardingCompleted: boolean;
  loading: boolean;
  setCondition: (condition: UserCondition) => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
}
```
- Reads/writes from Firestore `users/{uid}`
- Exposed via React Context, wrapped around NavigationContainer
- `AppNavigator` checks `onboardingCompleted` to decide which screen stack to show

---

## 10. Implementation Phases

### Phase 1 — Infrastructure Setup (Days 1–3)
- [ ] Copy source codebase into new ThyraScan repo
- [ ] Update `app.config.ts`: new name, bundle ID `com.thyrascan.app`, icons
- [ ] Update `eas.json`: new EAS project ID, Firebase config, RevenueCat keys
- [ ] Update `src/styles/theme.ts`: new brand colors
- [ ] Update `src/types/index.ts`: add all new types
- [ ] Update Firestore schema (add `condition`, `onboarding_completed` to user doc)
- [ ] Update `firestore.ts`: add `setUserCondition()`, `getUserCondition()`, `markOnboardingComplete()`
- [ ] Build `useUserProfile` hook + context

### Phase 2 — Core Logic (Days 4–8)
- [ ] Build `src/logic/ingredientDatabase.ts` (v1 database: ~60 ingredient patterns)
- [ ] Build `src/logic/ingredientMatcher.ts` (tokenized + word-boundary matching)
- [ ] Build `src/logic/scoringEngine.ts` (condition-aware weighted scoring)
- [ ] Rewrite `src/logic/verdictGenerator.ts` (consumes ScoringResult)
- [ ] Unit tests for matcher and scorer

### Phase 3 — New UI Components (Days 9–12)
- [ ] `IngredientBreakdown` component
- [ ] `IngredientExplanation` expandable card
- [ ] `CategoryPill` chip
- [ ] `MedicationWarning` banner
- [ ] Update `VerdictBadge` (REVIEW label, updated colors)
- [ ] Update `theme.ts` verdict colors

### Phase 4 — Screens (Days 13–20)
- [ ] Rewrite `OnboardingScreen.tsx` (multi-step: Welcome → Condition → How it works)
- [ ] New `ConditionSelectScreen.tsx`
- [ ] Update `HomeScreen.tsx` (condition badge, new copy)
- [ ] Update `ResultScreen.tsx` (IngredientBreakdown + Explanation cards + MedicationWarning)
- [ ] Update `ScannerScreen.tsx` (minimal changes, pass new params)
- [ ] Update `ProfileScreen.tsx` (condition display + change option)
- [ ] Update `HistoryScreen.tsx` (new verdict label)
- [ ] New `DisclaimerScreen.tsx`
- [ ] Update `PaywallScreen.tsx` (new copy)
- [ ] Update `LoginScreen.tsx` (new copy)

### Phase 5 — Navigation + Auth Gates (Days 21–23)
- [ ] Update `AppNavigator.tsx` to gate on `onboardingCompleted` + `userProfileReady`
- [ ] `UserProfileProvider` wrapping in `App.tsx`
- [ ] Condition change flow in Profile settings

### Phase 6 — Polish + Launch Prep (Days 24–30)
- [ ] Icons, splash screen, app store assets
- [ ] App Store metadata (title, description, keywords, screenshots)
- [ ] Privacy policy URL + terms URL updated in PaywallScreen
- [ ] Full disclaimer screen content
- [ ] EAS production build + TestFlight submission
- [ ] App Store submission

---

## 11. Environment Variables

```bash
# Firebase (via EXPO_PUBLIC_ prefix — inlined by Metro)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# RevenueCat (via app.config.ts extra → expo-constants)
REVENUECAT_API_KEY_IOS=
REVENUECAT_API_KEY_ANDROID=   # future

# EAS
EAS_PROJECT_ID=
```

**Security note:** Move RevenueCat keys from `eas.json` env block to EAS Secrets (`eas secret:create`) before production build. They are currently exposed in version control.

---

## 12. Testing Strategy

| Layer | Approach |
|-------|---------|
| `ingredientDatabase.ts` | Manual review against established dietary guidelines (ATA, functional medicine literature) |
| `ingredientMatcher.ts` | Unit tests: known ingredient strings → expected matches + non-matches |
| `scoringEngine.ts` | Unit tests: known MatchedIngredient arrays → expected ScoringResult |
| `verdictGenerator.ts` | Unit tests: known ScoringResult → expected Verdict |
| Screens | Manual device testing on iPhone; focus on edge cases (product not found, empty ingredients) |
| Subscription flow | RevenueCat sandbox testing on physical device |
| Auth flow | Firebase emulator for email; physical device for Apple Sign In |

**Regression test cases for matcher:**
```
"contains soy protein isolate"           → matches soy
"no soybeans used"                       → matches soy
"destroy all bacteria"                   → does NOT match soy
"made with kelp extract"                 → matches iodine_excess
"with a helping of happiness"            → does NOT match any
"wheat flour, barley malt, rye extract"  → matches gluten × 3
"calcium carbonate (350mg)"              → matches absorption_blocker
```
