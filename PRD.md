# ThyraScan — Product Requirements Document
**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-21

---

## 1. Product Vision

ThyraScan is a **label literacy tool** for people managing thyroid conditions — primarily Hashimoto's thyroiditis and hypothyroidism. It empowers users to make informed food choices by scanning product barcodes and instantly surfacing ingredients that current dietary research links to thyroid disruption.

ThyraScan does not diagnose, treat, or prescribe. It is a **calm, trustworthy, educational companion** — not an alarm system. It helps users translate complex ingredient lists into clear, condition-aware guidance they can act on in the grocery aisle.

**Tagline:** *Know what's in your food. Protect your thyroid.*

---

## 2. Problem Statement

People with Hashimoto's and hypothyroidism face a chronic, low-grade challenge: the foods and ingredients they encounter every day — soy, gluten, iodine-rich additives, goitrogenic compounds — can interfere with thyroid hormone production, medication absorption, or autoimmune inflammatory response. Yet:

- Ingredient lists are long, technical, and hard to parse in a store.
- Research-backed guidance (avoid goitrogens, limit soy isoflavones, watch iodine) is scattered across medical papers and patient forums with varying quality.
- No mainstream food app surfaces thyroid-specific ingredient concerns.
- People with these conditions tend to be highly engaged, medically curious, and underserved by generic "healthy eating" tools.

**ThyraScan closes this gap with a fast barcode scan, a condition-aware ingredient analysis, and a clear, non-alarmist result.**

---

## 3. Target Users

### Primary Audience
- Adults (18–65) diagnosed with **Hashimoto's thyroiditis** or **hypothyroidism**
- People on levothyroxine (Synthroid, Tirosint) or other thyroid hormone replacement therapy
- Individuals who have been told by an endocrinologist or functional medicine doctor to "watch their diet" and want practical help doing so

### Secondary Audience
- Caregivers, spouses, or parents shopping for a family member with a thyroid condition
- People recently diagnosed and still learning what to avoid
- Health-conscious individuals without a diagnosis who are symptomatic or have family history

### Market Context
- ~20 million Americans have a thyroid condition; ~60% are undiagnosed or undertreated
- Hashimoto's is the most common autoimmune disease in the US
- This audience skews female (80%), tends to be highly health-engaged, and actively seeks food/lifestyle guidance

---

## 4. User Personas

### Persona 1: Maya, 34 — Newly Diagnosed Hashimoto's
**Background:** Marketing manager, diagnosed 6 months ago after years of unexplained fatigue. Recently started levothyroxine. Her endocrinologist mentioned "watch the soy and gluten" but gave no practical specifics.
**Goals:** Understand which specific ingredients to avoid. Feel less overwhelmed at the grocery store. Avoid accidentally undercutting her medication.
**Pain points:** Can't memorize everything. Doesn't trust generic "clean eating" apps. Feels anxious about making a wrong choice.
**Quote:** "I just want to pick up a salad dressing and know if I should buy it."

### Persona 2: Linda, 52 — Long-term Hypothyroid, Medically Savvy
**Background:** Teacher, on thyroid medication for 12 years. Has done a lot of research. Follows a few thyroid-specific dietitians on Instagram. Wants to check specific products she's not sure about.
**Goals:** Spot iodine-heavy ingredients (she has Hashimoto's, not just hypothyroid). Quickly validate products she's considering.
**Pain points:** Existing nutrition apps don't flag thyroid-specific concerns. Has to do manual research for every new product.
**Quote:** "I already know the rules — I just need a faster way to check a label."

### Persona 3: James, 41 — Caregiver, Wife Diagnosed
**Background:** Accountant, shops for his family. His wife was diagnosed with hypothyroidism 2 years ago. He does most of the grocery shopping and wants to make good choices for her.
**Goals:** Scan products quickly without needing to understand the science deeply. High confidence, low effort.
**Pain points:** Doesn't know the ingredient names to look for. Feels overwhelmed by conflicting online information.
**Quote:** "I just want a green light or a red light."

### Persona 4: Sophie, 28 — Subclinical / Symptomatic
**Background:** Graduate student, not yet diagnosed but has family history of Hashimoto's and is experiencing fatigue, hair loss, and brain fog. Eating thyroid-supportive foods as a precaution.
**Goals:** Learn what to look for. Build good habits before a potential diagnosis.
**Pain points:** Overwhelmed by contradictory information online. Wants something evidence-adjacent, not pseudoscience.
**Quote:** "I'm not officially diagnosed but I want to be proactive."

---

## 5. Core Pain Points

1. **Ingredient lists are opaque.** Most users cannot identify goitrogenic compounds, soy isoflavones, or iodine-rich additives by name at a glance.
2. **Research is scattered and contested.** Thyroid dietary guidance lives in medical journals, patient forums, and dietitian blogs — with significant variation in authority and currency.
3. **Generic nutrition apps have no thyroid context.** MyFitnessPal, Cronometer, etc. show macros and calories but have no concept of thyroid disruption.
4. **Medication interaction is invisible.** Calcium, iron, high-fiber, and soy content within ~4 hours of levothyroxine significantly impairs drug absorption — nothing flags this.
5. **Decision fatigue is real.** Thyroid patients often have brain fog, fatigue, and cognitive load issues. They need fast, clear, low-effort guidance.

---

## 6. Jobs To Be Done

| Job | When | Outcome |
|-----|------|---------|
| "Scan this product and tell me if it's okay for my thyroid" | In-store, 30 seconds | Clear verdict, high confidence |
| "Explain why this ingredient is a concern" | After seeing a flagged item | Education, builds trust |
| "Check if this contains gluten" | Celiac/Hashimoto's overlap | Binary yes/no, fast |
| "Review what I've been eating" | At home, weekly | History of scans, patterns |
| "Understand what Hashimoto's means for my diet" | Just diagnosed | Onboarding education |
| "Does this interfere with my medication?" | After scanning a product | Medication absorption context |

---

## 7. v1 Goals

### Primary
- Ship a working iOS barcode scanner that returns condition-aware thyroid ingredient analysis
- Achieve a first-scan experience under 10 seconds from app launch
- Support Hashimoto's and Hypothyroidism as distinct user conditions
- Build a defensible, medically-grounded ingredient database (v1 scope: ~60 ingredient patterns across 5 categories)
- Establish trust through medical disclaimers, explainability, and non-alarmist UI tone

### Secondary
- Implement freemium monetization ($4.99/mo) with RevenueCat (reused from source codebase)
- Store scan history for premium users
- Implement clean onboarding with condition selection
- Launch in the App Store with strong metadata (title, description, screenshots) to capture thyroid condition search traffic

---

## 8. Non-Goals (v1)

- **Not a diagnostic tool.** ThyraScan will never suggest a user has or doesn't have a thyroid condition.
- **Not a medication advisor.** ThyraScan will not tell users to adjust their medication.
- **Not a meal planner.** No recipe suggestions, no grocery lists.
- **Not a full nutritional database.** Macros, calories, vitamins are out of scope.
- **Not Android-first.** iOS only for v1; Android after validating product-market fit.
- **Not real-time research updates.** The ingredient database is curated and versioned, not auto-synced from PubMed.
- **No barcode-less manual ingredient search** (v2).
- **No fresh produce scanning** (no barcode = out of scope v1).
- **No community features** — no forums, no shared scans, no reviews.
- **No wearable integrations** (e.g., Apple Health sync — v3+).

---

## 9. User Stories

### Onboarding
- As a new user, I want to select my thyroid condition (Hashimoto's / Hypothyroidism / Just exploring) so the app knows which ingredients to prioritize.
- As a new user, I want a brief, calm explanation of what the app does and doesn't do so I trust it appropriately.
- As a new user, I want to sign up with Apple Sign In so I don't have to create a password.

### Scanning
- As a user, I want to point my phone at a barcode and get a result in under 5 seconds so I can decide while I'm still in the store.
- As a user, I want to see a clear verdict (Safe / Review / Avoid) immediately after scanning so I don't have to read the whole ingredient list.
- As a user, I want to know which specific ingredients were flagged so I can see what triggered the result.
- As a user, I want to know *why* each flagged ingredient matters for my thyroid so I can learn over time.
- As a user, if a product isn't in the database, I want a clear message explaining that rather than a false "Safe" result.

### Results
- As a user, I want the result screen to feel calm and educational, not alarming, even when a product is flagged.
- As a user, I want to see how many ingredients were flagged and in which categories (e.g., goitrogens, iodine).
- As a user with Hashimoto's, I want to know if a product contains significant iodine since that's a specific concern for my condition.
- As a user on levothyroxine, I want a note if the product contains ingredients that can interfere with medication absorption.

### History (Premium)
- As a premium user, I want to see all my past scans with their verdicts so I can track patterns over time.
- As a premium user, I want to tap a past scan and see its full result detail again.

### Profile / Settings
- As a user, I want to change my thyroid condition selection after onboarding if my situation changes.
- As a user, I want to see my account info, subscription status, and easily manage or cancel my subscription.
- As a user, I want to read the full disclaimer/about page so I understand the app's scope and limitations.

### Free / Premium
- As a free user, I want to get 5 scans/day so I can try the app meaningfully before upgrading.
- As a free user who has run out of scans, I want to understand what premium offers before being asked to pay.
- As a premium user, I want unlimited scans and scan history.

---

## 10. Prioritized Features

### P0 — Must ship at launch
| Feature | Rationale |
|---------|-----------|
| Barcode scan + OpenFoodFacts lookup | Core value |
| Thyroid ingredient database (v1) | Core value |
| SAFE / REVIEW / AVOID verdict | Core value |
| Condition-aware flagging (Hashimoto's vs Hypothyroidism) | Differentiator |
| Per-ingredient explanations | Trust + education |
| Firebase auth (email + Apple Sign In) | Auth infrastructure |
| Free scan limit (5/day) + RevenueCat paywall | Monetization |
| Medical disclaimer (prominent, repeated) | Legal + trust |
| Condition selection in onboarding | Personalization |
| Product Not Found handling | Data quality UX |

### P1 — Ship at launch if time allows
| Feature | Rationale |
|---------|-----------|
| Scan history (premium) | Core premium value |
| Condition change in Settings | User control |
| Iodine-specific warning for Hashimoto's | Condition differentiation |
| Medication absorption warning | High value for levothyroxine users |
| Onboarding educational screen about dietary approach | Trust building |

### P2 — v1.1 or v2
| Feature | Rationale |
|---------|-----------|
| Manual ingredient search (no barcode) | Useful but complex |
| Favorites / bookmarked products | Power user retention |
| Annual subscription option | Monetization optimization |
| Android support | Market expansion |
| Push notification reminders | Engagement |

### P3 — Future
| Feature | Rationale |
|---------|-----------|
| Apple Health integration | Platform differentiation |
| Dietitian-reviewed database | Credibility signal |
| Exportable scan report (PDF) | Clinical use case |
| Community / shared lists | Network effects |

---

## 11. Success Metrics

### Acquisition
- App Store conversion rate from product page > 4%
- Organic search rank for "thyroid food scanner", "Hashimoto's food app"

### Activation
- % users who complete onboarding and complete first scan > 70%
- Time-to-first-scan from download < 3 minutes

### Engagement
- D7 retention > 25%
- D30 retention > 15%
- Average scans per active user per week > 4

### Monetization
- Free-to-paid conversion > 5% within 30 days
- Monthly churn < 10%
- MRR growth month-over-month

### Quality / Trust
- App Store rating > 4.5 stars
- Support tickets about "wrong result" < 2% of scans
- No App Store rejection for medical claims

---

## 12. Risks and Assumptions

### Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OpenFoodFacts data gaps (missing products, incomplete ingredients) | High | High | Clear "Not Found" UX; manual search in v2 |
| App Store rejection for health claims | Medium | High | All claims framed as educational; no diagnostic language; prominent disclaimer |
| Ingredient database inaccuracy leads to false "Safe" | Medium | High | Conservative matching; "when in doubt, flag it" policy; disclaimer |
| User misinterprets app results as medical advice | Medium | High | Repeated, contextual disclaimers; "Review with your doctor" CTA |
| Low OpenFoodFacts coverage for niche products | High | Medium | "Not Found" = neutral prompt to check label manually |
| RevenueCat/Apple subscription friction at checkout | Low | Medium | Standard App Store payment flow, already tested in source codebase |
| Thyroid dietary science evolves | Low | Medium | Version ingredient database; build update mechanism early |

### Assumptions
- OpenFoodFacts covers enough mainstream US/EU packaged products to provide value v1
- Users are willing to pay $4.99/mo for specialized dietary guidance for a chronic condition
- A single ingredient classification engine works across both Hashimoto's and hypothyroidism with condition-specific highlighting
- Users understand and accept that the app is educational, not diagnostic
- The ADHD Food Scanner codebase infrastructure (auth, subscriptions, scan limits, navigation) is stable and reusable
