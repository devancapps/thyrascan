# ThyraScan — UI/UX Design Specification
**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-21

---

## 1. Design Philosophy

ThyraScan operates at the intersection of health anxiety and information hunger. The people who need this app have often been living with symptoms for years before diagnosis. They are medically literate, skeptical of pseudoscience, and emotionally invested in managing their condition.

**The design must be:**
- **Calm.** No alarmist reds, no warning sirens, no aggressive CTAs.
- **Trustworthy.** Evidence of rigor in the details. Nothing feels like a wellness influencer's brand.
- **Efficient.** Brain fog is real for this audience. One-tap actions, no unnecessary steps.
- **Educational.** The result is the beginning of understanding, not just a verdict to accept.
- **Honest about limits.** Disclaimers are visible but not anxiety-inducing. They communicate scope, not danger.

---

## 2. Brand Identity

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `colors.primary` | `#6B48CC` | Primary CTA, active tab, icons |
| `colors.primaryDark` | `#5236A8` | Primary button press state |
| `colors.primaryLight` | `#EDE9FA` | Light backgrounds, icon containers |
| `colors.background` | `#FFFFFF` | Screen backgrounds |
| `colors.secondaryBackground` | `#F7F6FC` | Card backgrounds, tab bar, list rows |
| `colors.textPrimary` | `#1A1A2E` | Headlines, primary body text |
| `colors.textSecondary` | `#6B7280` | Supporting text, timestamps, hints |
| `colors.border` | `#E8E5F0` | Card borders, dividers |
| `colors.verdictSafe` | `#2ECC71` | Safe verdict (soft green) |
| `colors.verdictReview` | `#D97706` | Review verdict (warm amber) |
| `colors.verdictAvoid` | `#DC4B4B` | Avoid verdict (muted red — NOT full #EF4444) |
| `colors.verdictSafeBg` | `#EAFAF1` | Safe verdict background |
| `colors.verdictReviewBg` | `#FEF3C7` | Review verdict background |
| `colors.verdictAvoidBg` | `#FEF0F0` | Avoid verdict background |
| `colors.error` | `#EF4444` | Destructive actions only (delete, sign out) |
| `colors.white` | `#FFFFFF` | — |
| `colors.black` | `#000000` | — |

**Rationale for purple primary:** Purple/violet is the thyroid awareness ribbon color. It creates immediate brand recognition for the target audience and differentiates from health app green clichés.

### Typography
- **Headlines:** System font (SF Pro), weight 700–800
- **Body:** System font, weight 400–500
- **Captions/Labels:** 11–13px, weight 500–600, `colors.textSecondary`
- **Verdict labels:** All-caps, weight 800, letter-spacing 1.5

### Iconography
- Ionicons (already in source codebase via `@expo/vector-icons`)
- Thyroid-specific icon: butterfly or leaf + shield combination (custom SVG for app icon)

---

## 3. Information Architecture

```
ThyraScan
├── Onboarding (unauthenticated, first launch)
│   ├── Welcome Screen
│   ├── Condition Select Screen
│   └── How It Works Screen
│
├── Login / Sign Up
│
└── Main App (authenticated)
    ├── Tab: Scan (HomeScreen)
    ├── Tab: History (HistoryScreen) [premium]
    ├── Tab: Account (ProfileScreen)
    │
    ├── Scanner (modal, from Scan tab)
    ├── Result (pushed from Scanner or History)
    ├── Paywall (modal, from anywhere)
    └── Disclaimer (pushed from Profile → About)
```

---

## 4. Screen Designs

---

### 4.1 Onboarding — Welcome Screen

**Purpose:** First impression. Communicate what the app does in one scroll.

**Layout:**
```
[status bar]

[Illustration or lottie: simplified butterfly / thyroid gland + shield]

THYRASCAN                          ← small, uppercase, colors.primary
Know what's in your food.          ← 30px bold, textPrimary
Protect your thyroid.              ← 30px bold, textPrimary

Supporting text (16px, textSecondary, centered, 2 lines):
"A label scanner for people managing Hashimoto's
and hypothyroid conditions."

[Feature row: ✓  Scan food barcodes in seconds]
[Feature row: ✓  Detect thyroid-disrupting ingredients]
[Feature row: ✓  Understand what you're eating]

[Get Started button — full width, 56px, colors.primary]

"Already have an account? Sign In" ← link text, center
```

**Design notes:**
- No stock photography. Flat illustration or minimal animation only.
- The "Know what's in your food" headline does not mention the word "dangerous" or "harmful."
- Feature rows use `Ionicons checkmark-circle` in `colors.primary`.

---

### 4.2 Onboarding — Condition Select Screen

**Purpose:** Capture the user's condition so the scoring engine can weight ingredients correctly. This is the most important personalization touchpoint.

**Layout:**
```
[back arrow, top left]

Which of these describes you?        ← 26px bold, textPrimary, top padding

Help us personalize your results.    ← 16px, textSecondary

[Card: radio-style]
  [butterfly icon, colors.primary]
  Hashimoto's Thyroiditis
  "Autoimmune condition affecting thyroid function"

[Card: radio-style]
  [thyroid icon]
  Hypothyroidism
  "Underactive thyroid, often managed with medication"

[Card: radio-style]
  [compass/explore icon]
  Just Exploring
  "Curious about thyroid-supportive eating"

[Continue button — full width, 56px, disabled until selection made]

"You can change this later in your account settings." ← 12px, textSecondary, center
```

**Interaction:**
- Tapping a card selects it (border highlight in `colors.primary`, card background `colors.primaryLight`)
- Continue button becomes active on selection
- Selection is saved to Firestore immediately after login

**Design notes:**
- Do not label any condition as "worse" or "more serious." They are equal options.
- The "Just Exploring" option is important — do not hide it or make it feel like a lesser choice.

---

### 4.3 Onboarding — How It Works Screen

**Purpose:** Brief education + set expectations before first scan. Shown once, before the user reaches the main app.

**Layout:**
```
[back arrow]

How ThyraScan works               ← 26px bold

Step cards (3, stacked):

[1]  Scan a barcode
     Point your camera at any packaged food.

[2]  We analyze the ingredients
     We check for thyroid-related ingredients from
     current dietary research.

[3]  You get a clear result
     SAFE, REVIEW, or AVOID — with explanations
     for every flagged ingredient.

[Disclaimer card, soft purple background:]
  ℹ ThyraScan is an educational tool, not a medical device.
    Results are based on dietary research, not clinical evaluation.
    Always consult your healthcare provider.

[Start Scanning button — full width]
```

---

### 4.4 Home Screen (Scan Tab)

**Purpose:** The daily driver. Fast, clean, single CTA.

**Layout:**
```
[safe area]

[ThyraScan logo — small wordmark, top left]
[Condition pill, top right: "Hashimoto's" or "Hypothyroidism"]

                [shield + scan icon, 80px circle, primaryLight bg]

                ThyraScan
                Scan a barcode to check for
                thyroid-related ingredients

[Scan Now button — full width, 64px, colors.primary, scan icon left]

[Free scans remaining: "3 of 5 free scans remaining today"]  ← 14px, textSecondary
OR
[Premium badge: ★ Unlimited Scans]  ← 14px, #D97706 (amber)
```

**States:**
- `canScan === false`: Button shows "Upgrade to Scan More" and taps to Paywall. Button opacity 0.7, not disabled (still tappable).
- `subscriptionLoading`: Full screen `<LoadingSpinner />` — same as source codebase.

**Design notes:**
- The condition pill at top right is a persistent reminder that the app knows the user's condition. It builds trust.
- Do not show the condition on every screen — just Home is enough.

---

### 4.5 Scanner Screen

**Purpose:** Camera viewfinder with barcode detection.

**Reuse BarcodeOverlay.tsx unchanged.** Corner brackets in `colors.primary`.

**Additional overlay elements:**
- Close (×) button top left — white, circular semi-opaque background (same as source)
- Instruction text at bottom: "Align barcode within frame" — white, 16px

**Loading overlay (after scan detected):**
```
[full screen dark overlay]
[centered white card, 16px radius]
  [ActivityIndicator, colors.primary]
  Looking up product...
```

**Error overlay:**
```
[full screen dark overlay]
[ErrorCard centered]
  "Product not found in database."
  [Try Again button]
  [Go Back link]
```

**Special error state — no ingredient data:**
```
[full screen dark overlay]
[Card centered]
  ℹ No ingredient information found.

  This product exists in the database but has no
  ingredient data yet.

  Check the label directly before consuming.
  [Got it → goes back to scanner]
```

---

### 4.6 Result Screen

**Purpose:** The payoff. Show verdict clearly, explain flagged ingredients, educate.

This screen is substantially extended from the source codebase.

**Layout (scrollable):**
```
[SafeAreaView]
[Header — only shown when fromHistory === true: ← History]

[ProductCard]
  PRODUCT
  [product name — 20px bold]
  [scanned at timestamp — if from history]

[VerdictBadge — large, centered]
  [icon] [SAFE / REVIEW / AVOID]

[Verdict reason — 16px, textSecondary, centered, 2 lines max]
  e.g. "Contains ingredients associated with thyroid disruption."

[MedicationWarning banner — conditional]
  ⚠ May affect levothyroxine absorption
  [Learn More chevron]

[Category Breakdown row]
  [CategoryPill: "Soy ×2"] [CategoryPill: "Goitrogens ×1"]

[Flagged Ingredients section]
  [IngredientExplanation card × N — expandable]

[No flags section — if verdict is SAFE]
  ✓ No thyroid-related ingredients found.
  This product doesn't contain any ingredients
  in our current database.

[Disclaimer card]
  ℹ For educational purposes only. Not medical advice.
    Always review dietary choices with your healthcare
    provider, especially if you are on medication.

[Footer — only shown when NOT fromHistory]
  [Scan Another button — full width]
```

---

### 4.7 IngredientExplanation Card (Component)

**Default state (collapsed):**
```
[Card row]
  [category icon, 36px, primaryLight bg]
  [Soy Protein Isolate]          [SIGNIFICANT badge]
  [chevron-down]
```

**Expanded state:**
```
[Card]
  [category icon] [Soy Protein Isolate] [SIGNIFICANT] [chevron-up]

  "Soy isoflavones can interfere with thyroid hormone
  production and may reduce the effectiveness of thyroid
  medication."

  [amber pill: ⚠ Medication interaction possible]     ← conditional

  [gray text — caveat, if present:]
  Note: Soy lecithin in small amounts is generally
  considered lower risk by most practitioners.
```

**Severity badge colors:**
- `SIGNIFICANT` → muted red background, `colors.verdictAvoid` text
- `MODERATE` → amber background, `colors.verdictReview` text
- `MILD` → light gray background, `colors.textSecondary` text

---

### 4.8 History Screen (Premium)

**Purpose:** Let premium users review past scans and see patterns.

**Layout:**
```
Scan History                        ← 24px bold, left aligned

[FlatList of ProductCards]
  [product name]      [SAFE / REVIEW / AVOID badge]
  [timestamp]

[Empty state:]
  [scan icon, 48px, textSecondary]
  No scans yet.
  Start scanning products to build your history.

[Non-premium gate:]
  [lock icon, 64px, textSecondary]
  Premium Feature
  "Access your full scan history with a Premium subscription."
  [Upgrade to Premium button]
```

---

### 4.9 Profile / Account Screen

**Purpose:** Account management, subscription status, condition settings, disclaimer access.

**Free user layout:**
```
Account                             ← 28px bold

[Avatar circle — first initial, colors.primary bg]
[user@email.com]
[Free Plan badge]

[Upgrade Card — white, elevated]
  ★ Upgrade to Premium
  Get unlimited access to all features
  [benefit list]
  $4.99/month
  [View Subscription Options]

[Settings Card]
  [row: My Condition]   [Hashimoto's  ›]
  [row: About ThyraScan]             [›]
  [row: Disclaimer]                  [›]
  [row: Privacy Policy]              [›]

[Danger Zone Card]
  [row: Sign Out]        [›]
  [row: Delete Account]  [›] ← red text
```

**Premium user layout:**
```
Account                             ← 28px bold

[Avatar circle]
[user@email.com]

[Premium card: ★ Premium Active]
  Unlimited scans · Full history access

[Settings Card — same rows as above]

[Danger Zone Card — same]
```

---

### 4.10 Paywall Screen

**Layout:**
```
[X close button — top right]

[★ icon in amber container]
Go Premium

Unlock the full ThyraScan experience

[Feature rows:]
  [scan icon]  Unlimited Scans
               Scan as many products as you need, every day
  [time icon]  Scan History
               Review all your past scans anytime
  [heart icon] Support the Research
               Help us keep the ingredient database up to date

$4.99 /month

[Footer — sticky]
  [Subscribe Now — $4.99/mo button]
  [Restore Purchase link]
  [Legal subscription renewal text — 11px]
  [Privacy Policy · Terms of Use links]
```

---

### 4.11 Disclaimer Screen

**Purpose:** Full, readable disclaimer for transparency. Linked from Profile → About.

**Content structure:**
1. What ThyraScan is (educational label tool)
2. What ThyraScan is not (medical device, diagnostic tool)
3. About the ingredient database (research-based, periodically updated, not exhaustive)
4. How to use ThyraScan responsibly (alongside your healthcare provider)
5. Contact / feedback
6. App version

---

## 5. Microcopy Recommendations

### Verdict messages (ResultScreen, under badge):

| Verdict | Message |
|---------|---------|
| SAFE | "No thyroid-related ingredients found in our database." |
| REVIEW | "Contains ingredients worth discussing with your healthcare provider." |
| AVOID | "Contains ingredients commonly identified as thyroid-disruptive in dietary research." |

**Never say:**
- "This product is safe."
- "Do not eat this."
- "Dangerous for your thyroid."

### Category labels (CategoryPill):

| Category | Pill Label |
|----------|-----------|
| `goitrogen` | "Goitrogens" |
| `soy` | "Soy" |
| `gluten` | "Gluten" |
| `iodine_excess` | "Excess Iodine" |
| `endocrine_disruptor` | "Endocrine Disruptors" |
| `absorption_blocker` | "Absorption Blockers" |
| `inflammatory_additive` | "Inflammatory Additives" |

### Scan limit messaging:

| State | Message |
|-------|---------|
| 5 scans left | "5 of 5 free scans remaining today" |
| 1 scan left | "1 of 5 free scans remaining today" |
| 0 scans left | "You've used your free scans for today" |
| Premium | "★ Unlimited Scans" |

### Product not found:
> "This product isn't in our database yet. Check the label directly — and consider scanning again if the product gets updated."

### No ingredient data:
> "This product exists in the database but has no ingredient information. Check the label directly before consuming."

### Onboarding condition descriptions:

| Condition | Subtitle |
|-----------|---------|
| Hashimoto's | "Autoimmune thyroid condition — we'll flag iodine and immune triggers." |
| Hypothyroidism | "Underactive thyroid — we'll focus on goitrogens and medication interactions." |
| Just Exploring | "No formal diagnosis — we'll show all thyroid-relevant findings." |

---

## 6. Low-Cognitive-Load Design Principles

ThyraScan's users often experience brain fog, fatigue, and cognitive overload as symptoms of their condition. Every design decision should minimize mental effort.

1. **One primary action per screen.** Home has one button. Scanner has one interaction. Result has one CTA.
2. **Verdict is the first thing seen.** The VerdictBadge is above the fold on ResultScreen.
3. **Details are progressive.** Ingredient explanations are collapsed by default. Users can expand if they want detail.
4. **No walls of text.** Explanations are 1–2 sentences. Caveats are optional and secondary.
5. **Persistent condition display.** The condition pill on HomeScreen reminds users the app is personalized without requiring them to remember it.
6. **Colors carry meaning.** Green/amber/muted-red communicate verdict before text is read.
7. **Empty states are helpful, not punishing.** "No flagged ingredients" should feel like a win, not a data error.

---

## 7. Accessibility

- **Minimum touch target:** 44×44pt (all interactive elements)
- **Color contrast:** WCAG AA minimum for all text/background combinations
- **Verdict communication:** Never use color alone — always pair with icon and text label
- **Dynamic type:** Support iOS Dynamic Type sizes for all text elements
- **VoiceOver labels:** All custom components must have `accessibilityLabel` and `accessibilityRole` props
- **Reduce Motion:** Respect `AccessibilityInfo.isReduceMotionEnabled` for any lottie/animated elements
- **Expandable cards:** `accessibilityHint="Double tap to expand ingredient details"` on collapsed state

---

## 8. Trust-Building Patterns

### Visible disclaimer positioning
The disclaimer appears at the bottom of every ResultScreen — not buried, not hidden, but secondary to the content so it doesn't overwhelm.

### Confidence signals in the UI
- Category pills surface the type of concern, not just a verdict
- Caveat notes ("less concern if cooked") show the app knows nuance
- "Low confidence" ingredients could have a subtle `?` modifier on their severity badge

### "Discuss with your doctor" CTA
ResultScreen should include a low-profile link: *"Discuss these findings with your healthcare provider →"* This normalizes the doctor relationship rather than positioning the app as a replacement.

### Database transparency
In the Disclaimer screen: "Our ingredient database is based on dietary research and is updated periodically. It is not exhaustive and does not cover all possible thyroid-related ingredients."

### Honest "not found" messaging
When a product isn't in OpenFoodFacts, the app says "not in our database" — not "this product is safe." The distinction matters and users will notice if the app implies a product is clear when it simply has no data.

---

## 9. Navigation Transitions

- Scan → Result: `slide_from_right` (standard push)
- Home → Scanner: `slide_from_bottom` (modal presentation)
- Any → Paywall: `slide_from_bottom`, `presentation: "modal"`
- History item → Result: `slide_from_right`
- All other stack transitions: `slide_from_right`

---

## 10. Animation and Motion

Keep motion minimal. This audience values calm over delight.

- **ResultScreen verdict reveal:** Fade in VerdictBadge (200ms, `opacity: 0 → 1`) after a brief loading moment. No bounce, no spring animation.
- **Expandable card:** Simple height animation (200ms) using `LayoutAnimation.easeInEaseOut()`.
- **Loading spinner:** Standard `ActivityIndicator` only. No custom lottie unless explicitly added later.
- **No skeleton loaders** for v1 — `LoadingSpinner` is sufficient.

---

## 11. Screen States Summary

| Screen | Loading | Error | Empty | Populated |
|--------|---------|-------|-------|-----------|
| Home | Full screen spinner (subscription loading) | — | — | Scan button + limit info |
| Scanner | Permission request | ErrorCard overlay | — | Camera view |
| Result | Loading overlay (during API call) | ErrorCard overlay | Safe (no flags) | Verdict + breakdown |
| History | LoadingSpinner | — | Empty scan list illustration | FlatList |
| Profile | LoadingSpinner | — | — | Avatar + settings |
| Paywall | LoadingSpinner (purchase in progress) | Alert (purchase error) | — | Feature list + CTA |
