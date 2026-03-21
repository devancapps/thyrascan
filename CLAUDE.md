# ThyraScan — CLAUDE.md

This file tells Claude Code everything it needs to build, extend, and maintain this codebase effectively. Read this before making any changes.

---

## Project Purpose

ThyraScan is an iOS-first React Native / Expo food scanner app for people managing **Hashimoto's thyroiditis** and **hypothyroidism**. Users scan a product barcode and get a clear, condition-aware assessment of whether the product contains ingredients that current dietary research links to thyroid disruption.

**ThyraScan is an educational label-literacy tool. It is not a medical device, diagnostic tool, or treatment advisor.**

---

## Product Positioning

- **Feel:** Calm, trustworthy, clinical without being cold. Like a knowledgeable friend who has done the research.
- **Tone:** Informative, never alarmist. Supportive, never preachy. Honest about uncertainty.
- **Users:** Adults with thyroid conditions — informed, health-engaged, skeptical of pseudoscience.
- **Trust signals:** Medical disclaimers are visible and repeated. All claims are qualified. Uncertainty is surfaced, not hidden.

---

## Tech Stack

- **React Native 0.83+ / Expo SDK 55** (TypeScript strict)
- **Firebase Auth** (email + Apple Sign In)
- **Firestore** (user profiles, scan history)
- **RevenueCat** (subscription management)
- **OpenFoodFacts** (barcode product lookup — public API, no auth)
- **React Navigation v7** (native stack + bottom tabs)
- **EAS Build** for iOS distribution

---

## Folder Structure

```
src/
├── firebase/        — config, auth, firestore wrappers
├── services/        — openFoodFacts, revenueCat (external API calls)
├── logic/           — pure functions: ingredient DB, matching, scoring, verdict
├── hooks/           — React contexts: useAuth, useSubscription, useScanLimit, useUserProfile
├── navigation/      — AppNavigator, MainTabNavigator
├── screens/         — one file per screen
├── components/      — shared UI components
├── styles/          — theme.ts (single source of truth for colors/spacing)
└── types/           — TypeScript types and enums
```

---

## Architecture Conventions

### Context providers (top-level, in App.tsx):
1. `SafeAreaProvider`
2. `AuthProvider` — Firebase auth state
3. `SubscriptionProvider` — RevenueCat premium status
4. `UserProfileProvider` — user's condition + onboarding state
5. `NavigationContainer`

### Business logic lives in `src/logic/` — never in components or screens.
Pure functions only. No side effects. No React imports.

### The classification engine has 3 layers — keep them separate:
1. `ingredientDatabase.ts` — the data (ingredient entries, patterns, explanations)
2. `ingredientMatcher.ts` — the matching algorithm (text → MatchedIngredient[])
3. `scoringEngine.ts` — the scoring (MatchedIngredient[] → ScoringResult)

### Never skip the scoring layer.
`ResultScreen` always receives a full `ScoringResult` object. Don't pass raw arrays of matched ingredients to UI components — let the scoring engine produce the structured output first.

### Navigation param passing:
`ScannerScreen` → `ResultScreen` must pass the full `ScoringResult` and `MatchedIngredient[]` arrays. Do not recompute scoring in the result screen.

### Firestore writes are fire-and-forget from the scanner.
`recordScan()` and `saveScanResult()` are called without `await` in `ScannerScreen`. They must never block navigation to the result. Catch and log errors with `console.warn`.

---

## Coding Standards

- **TypeScript strict mode is required.** No `any`, no `unknown` without type guards.
- **All new types go in `src/types/index.ts`** — never define types inline in component files.
- **React Native StyleSheet** for all styles. Never use inline style objects except for dynamic values.
- **No hardcoded strings in JSX.** Product copy goes in the component but must be easy to find and update.
- **Async functions must handle errors.** Never leave a Promise floating without `.catch()` or try/catch.
- **No `console.log` in production paths.** Use `console.warn` for non-critical failures and `console.error` for unexpected errors.
- **`__DEV__` guard any debug-only logging.**

---

## The Ingredient Database (`src/logic/ingredientDatabase.ts`)

This is the most important file in the app. Handle it carefully.

### Structure of every entry:
```typescript
{
  id: string;             // unique slug, never change once shipped
  displayName: string;    // shown to user
  category: TriggerCategory;
  severity: "significant" | "moderate" | "mild";
  confidence: "high" | "medium" | "low";
  conditions: ("hashimotos" | "hypothyroidism" | "both")[];
  patterns: string[];     // lowercase, tested in order
  wholeWordOnly: boolean; // always true unless the pattern is always a substring
  explanation: string;    // 1–2 sentences, plain English, no medical authority claims
  caveat?: string;        // optional nuance — shows when explanation expands
  medicationInteraction?: boolean;
}
```

### Adding a new ingredient:
1. Check the existing database — is there already an entry for this ingredient or category?
2. Add the most specific patterns first in the `patterns` array.
3. If `wholeWordOnly: false`, verify the pattern cannot match inside unrelated words.
4. Write the `explanation` in the voice of a knowledgeable friend, not a medical journal.
5. Include a `caveat` if the science is contested or context-dependent.
6. Set `confidence: "low"` if the evidence is preliminary or primarily observational.
7. Write a unit test in `src/logic/__tests__/ingredientMatcher.test.ts`.

### Removing or changing an ingredient entry:
- **Never change the `id` field.** Scan history records reference it.
- If the evidence changes, update `confidence` and `caveat`, not `severity`.
- Removing an entry is a breaking change — the explanation card will disappear from existing history records. Flag this in a PR comment.

---

## The Scoring Engine (`src/logic/scoringEngine.ts`)

### Scoring is condition-aware.
Each category has a weight multiplier per `UserCondition`. `hashimotos` weights `iodine_excess` at 2.0x. `hypothyroidism` weights `absorption_blocker` at 1.5x. Do not flatten these weights without a product decision.

### Verdict thresholds (do not change without a product decision):
- `score < 1.5` → `SAFE`
- `1.5 ≤ score < 4.0` → `REVIEW`
- `score ≥ 4.0` → `AVOID`
- Exception: any `significant` severity `iodine_excess` ingredient with `condition === "hashimotos"` → always `AVOID`

### The scorer does not access Firestore or make network calls.
It is a pure function. Keep it that way.

---

## Health Language Rules — CRITICAL

These rules are non-negotiable. Violating them risks App Store rejection and user harm.

### NEVER say:
- "This product is dangerous for your thyroid."
- "You should not eat this."
- "This product will harm your health."
- "This is safe for Hashimoto's patients."
- "Medically recommended to avoid."
- "Clinically proven."
- Anything that implies a diagnosis or treatment recommendation.

### ALWAYS say:
- "May affect..." / "Has been linked to..." / "Some research suggests..."
- "Discuss with your healthcare provider."
- "For educational purposes only."
- "Based on current dietary research."
- "Review with your doctor before making dietary changes."

### Verdict labels specifically:
- `SAFE` means "No flagged ingredients found in our database." NOT "This product is safe for thyroid patients."
- `REVIEW` means "Contains ingredients worth discussing with your healthcare provider."
- `AVOID` means "Contains ingredients that current dietary research commonly identifies as thyroid-disruptive."

### The disclaimer must appear:
1. On the ResultScreen (bottom of every result)
2. On the Paywall / upgrade screen
3. On the Disclaimer/About screen (full version)
4. During onboarding (before first scan)

### Never hide the disclaimer behind a toggle or in small print only.
The minimum disclaimer text is:
> "ThyraScan is an educational tool. It is not a medical device and does not provide medical advice. Always consult your healthcare provider about dietary choices related to your condition."

---

## UI Conventions

### Design system is in `src/styles/theme.ts`. No magic numbers in component files.
Use `spacing.md`, `colors.primary`, `borderRadius.lg`, etc.

### Verdict colors:
- `SAFE` → `colors.verdictSafe` (soft green)
- `REVIEW` → `colors.verdictReview` (amber/warm yellow — NOT orange or red)
- `AVOID` → `colors.verdictAvoid` (muted red)

### Do not use raw red (#EF4444 full saturation) for anything that's not a destructive action.
Thyroid patients are anxious. Screaming red for food results will cause unnecessary distress.

### Cards use `cardStyle` from theme. Do not create new card patterns.

### Buttons use `buttonStyle` and `buttonTextStyle` from theme. Do not create custom button shapes.

### Loading states use `<LoadingSpinner />`. Do not create inline ActivityIndicators.

### Error states use `<ErrorCard />` with `onRetry` and `onDismiss` props.

### Never render a screen with no loading or empty state handled.
Every screen that fetches data must handle: loading, error, empty, and populated states.

---

## How New Features Should Be Added

### Before writing any code:
1. Check if the feature fits within ThyraScan's scope as a **label literacy tool, not a medical advisor**.
2. If the feature involves health guidance, dietary advice, or symptom tracking, get explicit product approval.
3. Check whether the feature requires a new screen, a new component, or can reuse existing ones.

### Feature checklist:
- [ ] New types added to `src/types/index.ts`
- [ ] Business logic is in `src/logic/` (pure functions)
- [ ] New Firestore fields documented in TECHNICAL_ARCHITECTURE.md
- [ ] Health language reviewed against the rules above
- [ ] Disclaimer visible if the feature shows any health-related output
- [ ] Empty, loading, and error states handled
- [ ] Existing `theme.ts` used for all styling

---

## What NOT To Do

- **Do not add features that track symptoms, lab values, or medication doses.** This moves the app into medical device territory.
- **Do not add an "AI-powered" analysis layer** that generates custom advice without a curated database behind it.
- **Do not create a new database format.** All ingredients go in `ingredientDatabase.ts` with the `IngredientEntry` interface.
- **Do not use `String.includes()` for ingredient matching.** Use `ingredientMatcher.ts` with `wholeWordOnly: true` for terms that could match inside unrelated words.
- **Do not call the scoring engine from inside the ingredient matcher.** They are separate layers.
- **Do not add navigation params that bypass the ScoringResult.** ResultScreen expects the full `ScoringResult` object.
- **Do not hardcode the user's condition in any component.** Always read from `useUserProfile()`.
- **Do not suppress medical disclaimers for UI cleanliness.** Find a layout solution instead.
- **Do not store RevenueCat API keys in `eas.json`.** Use EAS Secrets.
- **Do not store any health data beyond scan history.** No symptom logs, no journal entries, no custom lists of "foods I avoid."

---

## Consistency Priorities

When making a change, maintain consistency in this order:

1. **Health language rules** — always highest priority
2. **Data model integrity** — don't change `id` fields in the ingredient database
3. **Scoring logic integrity** — don't change thresholds without a product decision
4. **Design system** — always use `theme.ts` tokens
5. **TypeScript types** — update `types/index.ts` first, then fix downstream
6. **Error/loading states** — never ship a screen without them

---

## Common Gotchas

- `UserCondition` can be `null` during onboarding. Always guard against null before passing to the scoring engine.
- `openFoodFacts.ts` returns `ingredientsText: ""` (empty string) when the product exists but has no ingredients data. This is NOT a `ProductNotFoundError`. The matcher handles empty strings gracefully (returns `[]`). The UI should surface "No ingredient data found" not a full "Product not found" error.
- Apple Sign In is only available on physical iOS devices and in TestFlight/production. It will not work in the iOS Simulator. Test email auth in simulator; Apple Sign In on device only.
- RevenueCat requires a physical device for subscription testing. Use RevenueCat sandbox mode with a StoreKit configuration file for simulator testing.
- `onAuthStateChanged` fires before `UserProfileProvider` has loaded the condition from Firestore. `AppNavigator` must wait for all three: auth loaded, subscription loaded for user, AND user profile loaded.

---

## Related Documents

- `PRD.md` — Product requirements, user stories, success metrics
- `TECHNICAL_ARCHITECTURE.md` — Full system design, data models, implementation phases
- `UI_UX_DESIGN_SPEC.md` — Screen designs, flows, microcopy
- `DATA_RISK_SCORING_MODEL.md` — Ingredient categories, scoring rules, sample outputs
