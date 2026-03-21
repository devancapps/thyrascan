# ThyraScan — Data & Risk Scoring Model Specification
**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-21

---

## 1. Overview and Guardrails

### What this model does
ThyraScan's scoring model classifies packaged food ingredients against a curated database of ingredients that current dietary research links to thyroid disruption. It produces a structured result that drives the app's verdict display.

### What this model does NOT do
- It does not diagnose thyroid conditions.
- It does not replace clinical dietary advice.
- It does not assess portions, preparation methods, or cumulative dietary load.
- It does not claim that any product is "safe" — only that it contains no ingredients currently in the database.
- It does not model individual variation in thyroid sensitivity.

### Design principles
1. **Conservative over liberal.** When uncertain, flag it and explain the uncertainty rather than hiding it.
2. **Explainability over black box.** Every flag has a human-readable explanation.
3. **Condition-aware, not universal.** The same product can have different weights for Hashimoto's vs hypothyroidism.
4. **Transparent about gaps.** The database is curated, not exhaustive. The app communicates this.
5. **Severity is directional, not clinical.** "Significant" means the ingredient is widely discussed in thyroid dietary literature — not that consuming it will cause harm.

---

## 2. Ingredient Categories

ThyraScan v1 uses 7 categories, chosen based on frequency in thyroid dietary research literature and presence in packaged food ingredient lists.

---

### Category 1: Goitrogens

**Definition:** Substances that interfere with thyroid hormone synthesis by inhibiting iodine uptake or thyroid peroxidase activity.

**Clinical context:**
- Most relevant for hypothyroidism and Hashimoto's
- Cooking significantly reduces goitrogenic potency in cruciferous vegetables — but these often appear in packaged foods as concentrates or supplements where cooking benefit is absent
- Raw/concentrated forms (juices, powders, supplements) carry more concern than cooked whole foods

**Packaged food appearances:** Green juices, superfood powders, smoothie supplements, fermented foods, cold-pressed products.

**v1 ingredient patterns:**

| Display Name | Patterns | Severity | Confidence | Caveat |
|---|---|---|---|---|
| Broccoli (concentrated) | `broccoli powder`, `broccoli extract`, `broccoli juice` | moderate | medium | Cooked broccoli in normal amounts is lower concern |
| Kale (concentrated) | `kale powder`, `kale juice`, `kale extract` | moderate | medium | As with broccoli — concentration matters |
| Cauliflower (concentrated) | `cauliflower powder`, `cauliflower extract` | mild | low | Minimal presence in packaged foods |
| Millet | `millet`, `millet flour` | moderate | medium | Significant goitrogen; common in gluten-free products |
| Cassava / Tapioca | `cassava`, `tapioca starch`, `cassava flour` | mild | low | Low concern in processed amounts |
| Turnip (concentrated) | `turnip powder`, `turnip extract` | mild | low | Rarely in packaged foods |
| Spinach (concentrated) | `spinach powder`, `spinach extract`, `spinach juice` | mild | low | Also an oxalate and absorption concern |

**Note:** Whole broccoli, kale, or cauliflower listed as ingredients in cooked/processed foods (e.g., "broccoli" in a frozen meal) are moderate concern, not significant — the scoring engine should assign `moderate` severity when the pattern is just `"broccoli"` (not concentrated), and apply a caveat note about preparation.

---

### Category 2: Soy

**Definition:** Soy and soy-derived ingredients containing isoflavones that mimic estrogen and interfere with thyroid hormone metabolism; may also reduce levothyroxine absorption.

**Clinical context:**
- Soy isoflavones inhibit thyroid peroxidase
- Soy protein directly impairs levothyroxine absorption when consumed within 4 hours of the medication
- This is one of the most evidence-supported thyroid dietary concerns
- Soy lecithin is widely debated — emulsifier doses are much lower than therapeutic isoflavone doses; classified as `mild`

**Packaged food appearances:** Protein bars, meal replacements, soy milk, tofu-based products, edamame snacks, Asian sauces, many processed foods use soy lecithin.

| Display Name | Patterns | Severity | Confidence | Medication? | Caveat |
|---|---|---|---|---|---|
| Soy Protein | `soy protein`, `soy protein isolate`, `soy protein concentrate`, `isolated soy protein` | significant | high | Yes | — |
| Soybean | `soybean`, `soybeans`, `soya`, `soy flour`, `textured soy` | significant | high | Yes | — |
| Tofu / Tempeh | `tofu`, `tempeh`, `edamame`, `miso` | significant | high | Yes | — |
| Soy Sauce | `soy sauce`, `tamari`, `shoyu` | moderate | medium | No | Fermented soy is lower isoflavone content |
| Soy Lecithin | `soy lecithin`, `sunflower lecithin` | mild | medium | No | Emulsifier doses are much lower; most practitioners consider it low risk |

---

### Category 3: Gluten

**Definition:** Gluten-containing grains linked to intestinal permeability and autoimmune cross-reactivity — particularly relevant for Hashimoto's given the high Hashimoto's/celiac comorbidity rate (~30%).

**Clinical context:**
- Not a direct thyroid disruptor at the hormone level
- Strong evidence for autoimmune cross-reactivity between gliadin antibodies and thyroglobulin antibodies
- Most relevant for Hashimoto's (autoimmune condition)
- Lower weight for plain hypothyroidism without autoimmune component
- Standard FDA allergen labeling means "Contains Wheat" statements are reliable signals

**Packaged food appearances:** Breads, pasta, sauces, seasonings (malt vinegar), beer, many processed foods.

| Display Name | Patterns | Severity | Confidence | Caveat |
|---|---|---|---|---|
| Wheat | `wheat`, `wheat flour`, `whole wheat`, `wheat starch`, `wheat gluten`, `vital wheat gluten` | significant | high | — |
| Barley | `barley`, `barley malt`, `malt`, `malt extract`, `malted barley` | significant | high | — |
| Rye | `rye`, `rye flour` | significant | high | — |
| Spelt | `spelt`, `spelt flour` | significant | high | — |
| Semolina / Farro | `semolina`, `farro`, `durum wheat`, `kamut`, `einkorn` | significant | high | — |
| Triticale | `triticale` | significant | medium | Less common grain |
| Oats (cross-contaminated) | `oats`, `oat flour`, `rolled oats` | moderate | low | Oats are naturally gluten-free but often cross-contaminated. Flag unless labeled "certified gluten-free" |

**Note on oats:** Flag `oats` as `moderate` with a caveat, not `significant`, because pure oats don't contain gluten. The risk is contamination. The app cannot determine if oats are certified GF from ingredients text alone.

---

### Category 4: Excess Iodine

**Definition:** Iodine-rich ingredients, primarily marine-derived, that can trigger or exacerbate autoimmune thyroid flares in Hashimoto's patients. Also a concern for people with iodine-induced hyperthyroidism.

**Clinical context:**
- Hashimoto's-specific concern — excess iodine can accelerate autoimmune attacks on thyroid tissue
- NOT a concern for most straightforward hypothyroid patients (some are prescribed iodine supplementation)
- This is the most Hashimoto's-specific category in the entire database
- Scoring weight for `hypothyroidism` condition is 0.5x; for `hashimotos` it is 2.0x

**Packaged food appearances:** Sushi-adjacent products, health supplements, superfood blends, Asian condiments.

| Display Name | Patterns | Severity | Confidence | Conditions | Caveat |
|---|---|---|---|---|---|
| Kelp | `kelp`, `kelp powder`, `kelp extract` | significant | high | hashimotos only | — |
| Seaweed | `seaweed`, `nori`, `wakame`, `dulse`, `kombu`, `hijiki` | significant | high | hashimotos only | — |
| Spirulina | `spirulina` | significant | high | hashimotos only | Often added to green superfood blends |
| Chlorella | `chlorella` | significant | medium | hashimotos only | Also a heavy metal chelation supplement |
| Bladderwrack | `bladderwrack` | significant | high | hashimotos only | — |
| Iodized Salt | `iodized salt` | moderate | medium | hashimotos | Low dose compared to supplements; worth flagging |

---

### Category 5: Endocrine Disruptors

**Definition:** Synthetic chemicals and additives with evidence of hormonal interference that may affect thyroid hormone pathways.

**Clinical context:**
- Less direct than other categories — these are systemic endocrine concerns, not thyroid-specific
- Confidence tends to be `medium` or `low` for food-grade exposures
- Include because the audience is informed and proactively seeks this information
- This category should use `confidence: "low"` liberally and caveats generously

**Packaged food appearances:** Processed and ultra-processed foods, shelf-stable products.

| Display Name | Patterns | Severity | Confidence | Caveat |
|---|---|---|---|---|
| Artificial Dyes | `red 40`, `yellow 5`, `yellow 6`, `blue 1`, `blue 2`, `red no. 40`, `fd&c red`, `fd&c yellow`, `fd&c blue`, `allura red`, `tartrazine`, `sunset yellow`, `brilliant blue` | moderate | medium | Research primarily in ADHD context; hormonal effects less studied |
| Sodium Benzoate | `sodium benzoate` | moderate | low | Preservative; some studies suggest endocrine effects at high doses |
| BHA / BHT | `bha`, `bht`, `butylated hydroxyanisole`, `butylated hydroxytoluene` | mild | low | Antioxidant preservatives; animal studies show thyroid effects at high doses |
| Carrageenan | `carrageenan` | mild | low | Common emulsifier; animal studies suggest intestinal inflammation |
| Polysorbate 80 | `polysorbate 80` | mild | low | Emulsifier; gut microbiome disruption possible at high doses |

---

### Category 6: Absorption Blockers

**Definition:** Ingredients that directly impair levothyroxine (Synthroid, Tirosint) absorption when consumed within 4 hours of taking the medication.

**Clinical context:**
- This is a clinically documented, high-confidence category
- Calcium and iron are the most significant and best-studied
- High fiber content (psyllium, etc.) also slows absorption
- The app cannot know *when* the user took their medication, so all absorption blockers receive `medicationInteraction: true` and trigger the `MedicationWarning` banner
- Most relevant for `hypothyroidism` (higher weight 1.5x) because that population is almost universally on levothyroxine

**Packaged food appearances:** Fortified foods, dairy products, antacids, protein supplements, fiber-enriched products.

| Display Name | Patterns | Severity | Confidence | Medication? |
|---|---|---|---|---|
| Calcium (high) | `calcium carbonate`, `calcium citrate`, `calcium phosphate`, `tricalcium phosphate`, `calcium caseinate` | significant | high | Yes |
| Iron (supplemental) | `ferrous sulfate`, `ferrous fumarate`, `ferrous gluconate`, `iron`, `reduced iron`, `electrolytic iron` | significant | high | Yes |
| Psyllium / High Fiber | `psyllium`, `psyllium husk`, `glucomannan` | moderate | medium | Yes |
| Magnesium (antacid) | `magnesium hydroxide`, `magnesium oxide` | mild | medium | Yes |
| Aluminum (antacid) | `aluminum hydroxide`, `aluminum silicate` | mild | medium | Yes |

**Display note:** When `medicationInteraction: true`, show a special MedicationWarning banner component on ResultScreen:
> "Contains ingredients that may reduce levothyroxine absorption. Take medication at least 4 hours before or after consuming this product."

---

### Category 7: Inflammatory Additives

**Definition:** Highly processed additives that may promote systemic inflammation, relevant because chronic inflammation is a driver of autoimmune thyroid activity in Hashimoto's.

**Clinical context:**
- Lowest weight category — association is indirect and evidence is primarily observational
- Included because the Hashimoto's audience actively seeks this information
- Use `confidence: "low"` for most entries
- Weight: 0.8x for Hashimoto's, 0.6x for hypothyroidism

**Packaged food appearances:** Ultra-processed foods, fast food seasoning packets, diet products.

| Display Name | Patterns | Severity | Confidence | Caveat |
|---|---|---|---|---|
| MSG | `monosodium glutamate`, `msg`, `hydrolyzed protein` | mild | low | Evidence for thyroid effect is weak; included for awareness |
| High Fructose Corn Syrup | `high fructose corn syrup`, `high-fructose corn syrup`, `hfcs` | mild | low | Blood sugar instability can stress thyroid axis |
| Aspartame | `aspartame`, `aspartyl phenylalanine` | mild | low | Animal studies only; functional medicine community concern |
| Sucralose | `sucralose`, `splenda` | mild | low | Gut microbiome effects; indirect thyroid association |
| Artificial Trans Fats | `partially hydrogenated`, `hydrogenated vegetable oil` | mild | medium | Inflammatory; largely phased out but still appears |

---

## 3. Confidence Levels

| Level | Meaning | How to display |
|-------|---------|----------------|
| `high` | Multiple clinical studies, established medical consensus, or FDA/regulatory classification | No modifier in UI |
| `medium` | Multiple observational studies or strong functional medicine consensus | No modifier in UI (v1 simplicity) |
| `low` | Preliminary evidence, single studies, primarily animal data, or contested | Add caveat note; consider adding `?` to severity badge (v2) |

**Rule:** Default to `low` when uncertain. Upgrade to `medium` when you can cite at least 2 independent published studies in humans. Upgrade to `high` when the concern is recognized by a major professional organization (ATA, AACE) or is FDA-documented.

---

## 4. Severity Levels

| Level | Score value | Meaning |
|-------|-------------|---------|
| `significant` | 3 | Widely recognized in thyroid dietary literature; direct mechanism; commonly included in clinical dietary guidance |
| `moderate` | 2 | Supported by research; not universally recommended to eliminate; context-dependent |
| `mild` | 1 | Preliminary or indirect evidence; included for awareness; no strong clinical recommendation |

**Rule:** Default to `mild` for new entries. Upgrade to `moderate` when evidence is consistent across studies. Upgrade to `significant` only when clinical guidance (e.g., endocrinology dietitians) recommends avoidance.

---

## 5. Scoring Formula

### Step 1: Match ingredients
Run `ingredientMatcher.ts` against the product's ingredient text. Returns `MatchedIngredient[]`.

### Step 2: Filter by condition
Entries with `conditions: ["hashimotos"]` are excluded when `userCondition === "hypothyroidism"`, and vice versa. Entries with `conditions: ["both"]` are always included. `exploring` gets everything.

### Step 3: Deduplicate
Remove duplicate entries by `entryId`. If multiple patterns in the same entry match, only one `MatchedIngredient` is created.

### Step 4: Compute weighted category scores

For each category that has at least one match:
```
categoryScore = highestSeverityScore × categoryWeight[condition]
```

Where:
```
highestSeverityScore = max(SEVERITY_SCORE[ingredient.severity]) for all ingredients in category
SEVERITY_SCORE = { significant: 3, moderate: 2, mild: 1 }
```

### Step 5: Sum total weighted score
```
totalWeightedScore = sum(categoryScore for all matched categories)
```

### Step 6: Apply verdict rules

```
IF matchedIngredients.length === 0
  → SAFE

ELSE IF condition === "hashimotos"
   AND any ingredient has category === "iodine_excess" AND severity === "significant"
  → AVOID (hard override)

ELSE IF totalWeightedScore >= 4.0
  → AVOID

ELSE IF totalWeightedScore >= 1.5
  → REVIEW

ELSE
  → SAFE
```

### Step 7: Set medication warning
```
medicationWarning = any ingredient has medicationInteraction === true
```

---

## 6. Sample Scoring Walkthrough

### Product A: Protein powder (soy-based)

**Ingredients text:** "Soy protein isolate, maltodextrin, calcium carbonate, soy lecithin, sucralose, vitamin B12"

**User condition:** Hashimoto's

**Match results:**
| Entry | Category | Severity | Med? |
|-------|----------|----------|------|
| Soy Protein Isolate | soy | significant | Yes |
| Calcium Carbonate | absorption_blocker | significant | Yes |
| Soy Lecithin | soy | mild | No |
| Sucralose | inflammatory_additive | mild | No |

**Scoring:**

| Category | Highest Severity | Weight (Hashimoto's) | Category Score |
|----------|-----------------|----------------------|----------------|
| soy | significant (3) | 1.5 | 4.5 |
| absorption_blocker | significant (3) | 1.2 | 3.6 |
| inflammatory_additive | mild (1) | 0.8 | 0.8 |

**Total weighted score:** 4.5 + 3.6 + 0.8 = **8.9**

**Verdict:** AVOID (score ≥ 4.0)

**Medication warning:** YES

**Verdict reason:** "Contains significant soy and absorption-blocking ingredients commonly associated with thyroid disruption."

---

### Product B: Gluten-free oat bar

**Ingredients text:** "Oats (certified gluten-free), brown rice syrup, almonds, dates, sunflower seeds, sunflower lecithin, sea salt"

**User condition:** Hypothyroidism

**Match results:**
| Entry | Category | Severity | Notes |
|-------|----------|----------|-------|
| Oats | gluten | moderate | Pattern match; oats flagged with caveat |

**Scoring:**

| Category | Highest Severity | Weight (Hypothyroidism) | Category Score |
|----------|-----------------|--------------------------|----------------|
| gluten | moderate (2) | 0.8 | 1.6 |

**Total weighted score:** **1.6**

**Verdict:** REVIEW (score ≥ 1.5)

**Medication warning:** NO

**Verdict reason:** "Contains oats, which may be cross-contaminated with gluten."

**Caveat shown in expansion:** "These oats are labeled certified gluten-free — if confirmed, gluten concern is significantly lower. The app flags oats due to common cross-contamination risk."

---

### Product C: Soda with artificial dyes

**Ingredients text:** "Carbonated water, high fructose corn syrup, caramel color, red 40, citric acid, sodium benzoate, caffeine"

**User condition:** Hashimoto's

**Match results:**
| Entry | Category | Severity |
|-------|----------|----------|
| High Fructose Corn Syrup | inflammatory_additive | mild |
| Red 40 | endocrine_disruptor | moderate |
| Sodium Benzoate | endocrine_disruptor | moderate |

**Scoring:**

| Category | Highest Severity | Weight (Hashimoto's) | Category Score |
|----------|-----------------|----------------------|----------------|
| inflammatory_additive | mild (1) | 0.8 | 0.8 |
| endocrine_disruptor | moderate (2) | 1.0 | 2.0 |

**Total weighted score:** 0.8 + 2.0 = **2.8**

**Verdict:** REVIEW (1.5 ≤ score < 4.0)

**Verdict reason:** "Contains artificial additives linked to endocrine disruption in some research."

---

### Product D: Plain rice crackers

**Ingredients text:** "Brown rice, sunflower oil, sea salt"

**User condition:** Hypothyroidism

**Match results:** None

**Verdict:** SAFE

**Verdict reason:** "No thyroid-related ingredients found in our database."

---

### Product E: Sushi seaweed snack (Hashimoto's user)

**Ingredients text:** "Roasted seaweed (nori), sesame oil, sea salt"

**User condition:** Hashimoto's

**Match results:**
| Entry | Category | Severity |
|-------|----------|----------|
| Seaweed / Nori | iodine_excess | significant |

**Hard override rule triggered:** `hashimotos` + `iodine_excess` + `significant` → **AVOID**

**Verdict reason:** "Contains seaweed, which is very high in iodine. Excess iodine is associated with triggering Hashimoto's flares."

---

## 7. How Uncertainty Should Be Communicated

### In the ingredient explanation:
Low-confidence entries use hedged language:
> "Some research suggests [ingredient] may affect thyroid function, though the evidence is preliminary. Discuss with your healthcare provider if you consume this regularly."

### In the caveat field:
> "This concern is based on animal studies and functional medicine practice rather than large clinical trials."

### For the "mild + low confidence" combination:
Consider showing these as an informational row rather than a full "flagged ingredient" card — a secondary section titled "Worth being aware of" rather than "Flagged Ingredients."

### For products with only `mild` + `low confidence` flags:
Verdict should be `REVIEW`, not `AVOID`, with a clearly qualified message:
> "Contains some ingredients that appear in thyroid-focused dietary discussions, though evidence for these specific items is limited."

### For empty results:
**Never say "This product is safe."**
Always say: **"No thyroid-related ingredients found in our current database."**

The distinction is critical for trust. Users who are medically literate will immediately notice if the app implies a comprehensive clearance it can't provide.

---

## 8. Explainability Output Format

Every `ScoringResult` includes:

```typescript
{
  overallVerdict: "AVOID",
  verdictReason: "Contains significant soy and absorption-blocking ingredients.",
  categoryBreakdown: [
    {
      category: "soy",
      label: "Soy",
      count: 2,
      highestSeverity: "significant",
      ingredients: [
        {
          displayName: "Soy Protein Isolate",
          severity: "significant",
          explanation: "Soy isoflavones can interfere with thyroid hormone production...",
          caveat: "Soy lecithin in small amounts is generally considered lower risk.",
          medicationInteraction: true,
        },
        {
          displayName: "Soy Lecithin",
          severity: "mild",
          explanation: "Soy lecithin is an emulsifier derived from soy...",
          caveat: "Dose in food products is typically much lower than therapeutic doses.",
          medicationInteraction: false,
        }
      ]
    },
    {
      category: "absorption_blocker",
      label: "Absorption Blockers",
      count: 1,
      highestSeverity: "significant",
      ingredients: [...]
    }
  ],
  totalFlagCount: 3,
  significantCount: 2,
  medicationWarning: true,
  conditionSpecificWarning: null,
}
```

---

## 9. Database Versioning and Updates

### v1 database scope
- ~60 ingredient patterns across 7 categories
- Focus on packaged food ingredients (not fresh produce, supplements)
- US/EU packaging naming conventions prioritized

### Update process (post-launch)
- Ingredient database changes require an app update (no remote config v1)
- Each update bumps `DATABASE_VERSION` constant in `ingredientDatabase.ts`
- Entry `id` values are immutable — changing an ID is a breaking change for scan history records
- New entries can be added without breaking existing records
- Severity/confidence changes are logged in a CHANGELOG comment at the top of `ingredientDatabase.ts`

### What triggers a database update
- New clinical guidance from ATA, AACE, or equivalent body
- User-reported false positives or false negatives (tracked via app feedback)
- New evidence in peer-reviewed literature (high bar — not every new preprint)
- Addition of new ingredient categories (requires product decision)

---

## 10. False Positive and False Negative Policy

### False positive (flagged something that isn't a concern)
- More acceptable than a false negative from a user trust perspective — users can dismiss it
- Should be mitigated by using `confidence: "low"` and good caveat text
- Caveat notes like "low amounts in processed foods are generally less concerning" reduce alarm
- User feedback mechanism (v2) will help track these

### False negative (missed something that is a concern)
- Higher risk — user might assume "Safe" means comprehensively reviewed
- Mitigated by the "No thyroid-related ingredients found in our **current database**" phrasing
- The disclaimer reinforces that the database is not exhaustive
- Conservative matching (flag when uncertain) reduces false negatives

### Policy: When uncertain, flag it conservatively.
Better to show a `REVIEW` with a good caveat than to miss a significant ingredient. The explainability layer turns false positives into educational opportunities rather than alarmist noise.
