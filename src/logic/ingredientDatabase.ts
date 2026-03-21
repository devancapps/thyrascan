/**
 * ThyraScan Ingredient Database — v1
 *
 * Each entry has an immutable `id`. Never change an id after shipping —
 * scan history records reference it. Add new entries freely; remove carefully.
 *
 * Confidence guide:
 *   high   — multiple clinical studies or professional org (ATA/AACE) guidance
 *   medium — multiple observational studies or strong functional medicine consensus
 *   low    — preliminary / animal data / contested — always add a caveat
 *
 * Severity guide:
 *   significant — widely recognized, direct mechanism, included in clinical guidance
 *   moderate    — supported by research, context-dependent
 *   mild        — indirect or preliminary — shown for awareness only
 */

import { IngredientEntry } from "../types";

export const INGREDIENT_DATABASE: IngredientEntry[] = [
  // ── GOITROGENS ────────────────────────────────────────────────────────────

  {
    id: "broccoli_concentrated",
    displayName: "Concentrated Broccoli",
    category: "goitrogen",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["broccoli powder", "broccoli extract", "broccoli juice", "broccoli sprout"],
    wholeWordOnly: false,
    explanation:
      "Broccoli contains goitrogenic compounds that may inhibit thyroid hormone production in concentrated forms.",
    caveat:
      "Cooked broccoli in normal food amounts is generally lower concern. Powders and extracts are more concentrated.",
  },
  {
    id: "kale_concentrated",
    displayName: "Concentrated Kale",
    category: "goitrogen",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["kale powder", "kale juice", "kale extract", "kale chips"],
    wholeWordOnly: false,
    explanation:
      "Kale is a goitrogenic cruciferous vegetable. Concentrated forms found in powders and juices may have a stronger effect on thyroid hormone production.",
    caveat:
      "Cooked kale in typical meal portions is generally lower concern than raw or concentrated forms.",
  },
  {
    id: "millet",
    displayName: "Millet",
    category: "goitrogen",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["millet", "millet flour", "pearl millet", "foxtail millet"],
    wholeWordOnly: true,
    explanation:
      "Millet contains flavonoids that can suppress thyroid function by inhibiting thyroid peroxidase activity. It is a common ingredient in gluten-free products.",
    caveat:
      "Occasional consumption is likely low risk; regular daily consumption in large amounts is more of a concern.",
  },
  {
    id: "cassava",
    displayName: "Cassava / Tapioca",
    category: "goitrogen",
    severity: "mild",
    confidence: "low",
    conditions: ["both"],
    patterns: ["cassava", "cassava flour", "tapioca starch", "tapioca flour"],
    wholeWordOnly: true,
    explanation:
      "Cassava contains cyanogenic glucosides that can act as goitrogens, particularly in populations with iodine deficiency.",
    caveat:
      "Processed tapioca starch in typical packaged food amounts is considered low risk by most practitioners.",
  },
  {
    id: "spinach_concentrated",
    displayName: "Concentrated Spinach",
    category: "goitrogen",
    severity: "mild",
    confidence: "low",
    conditions: ["both"],
    patterns: ["spinach powder", "spinach extract", "spinach juice"],
    wholeWordOnly: false,
    explanation:
      "Spinach is mildly goitrogenic and is also high in oxalates that may affect mineral absorption.",
    caveat:
      "Normal culinary amounts of spinach are generally fine. Concentrated supplement forms are worth noting.",
  },

  // ── SOY ───────────────────────────────────────────────────────────────────

  {
    id: "soy_protein",
    displayName: "Soy Protein",
    category: "soy",
    severity: "significant",
    confidence: "high",
    conditions: ["both"],
    patterns: [
      "soy protein",
      "soy protein isolate",
      "soy protein concentrate",
      "isolated soy protein",
      "textured soy protein",
      "textured vegetable protein",
      "tvp",
    ],
    wholeWordOnly: false,
    explanation:
      "Soy isoflavones can inhibit thyroid peroxidase, an enzyme essential for thyroid hormone production. Soy protein may also reduce levothyroxine absorption when consumed close to medication time.",
    medicationInteraction: true,
  },
  {
    id: "soybean",
    displayName: "Soybean",
    category: "soy",
    severity: "significant",
    confidence: "high",
    conditions: ["both"],
    patterns: [
      "soybean",
      "soybeans",
      "soya",
      "soy flour",
      "whole soy",
      "tofu",
      "tempeh",
      "edamame",
      "miso",
    ],
    wholeWordOnly: true,
    explanation:
      "Whole soy and minimally processed soy foods contain significant levels of isoflavones that may interfere with thyroid hormone metabolism.",
    medicationInteraction: true,
  },
  {
    id: "soy_sauce",
    displayName: "Soy Sauce",
    category: "soy",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["soy sauce", "tamari", "shoyu"],
    wholeWordOnly: false,
    explanation:
      "Fermented soy products contain lower isoflavone levels than unfermented soy, but are still worth noting for thyroid-conscious individuals.",
    caveat:
      "Fermentation reduces isoflavone content. Small amounts as a seasoning are generally lower concern than whole soy foods.",
  },
  {
    id: "soy_lecithin",
    displayName: "Soy Lecithin",
    category: "soy",
    severity: "mild",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["soy lecithin"],
    wholeWordOnly: false,
    explanation:
      "Soy lecithin is an emulsifier extracted from soy. It contains trace isoflavones.",
    caveat:
      "The dose of isoflavones in food-grade soy lecithin is much lower than in whole soy. Most thyroid practitioners consider it low risk.",
  },

  // ── GLUTEN ────────────────────────────────────────────────────────────────

  {
    id: "wheat",
    displayName: "Wheat / Gluten",
    category: "gluten",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos", "both"],
    patterns: [
      "wheat",
      "wheat flour",
      "whole wheat",
      "wheat starch",
      "wheat gluten",
      "vital wheat gluten",
      "enriched flour",
      "unbleached flour",
      "bleached flour",
      "durum wheat",
      "semolina",
      "spelt",
      "kamut",
      "einkorn",
      "farro",
    ],
    wholeWordOnly: true,
    explanation:
      "Gluten-containing grains are linked to autoimmune cross-reactivity in Hashimoto's. Antibodies to gliadin (a gluten protein) may cross-react with thyroid tissue, potentially worsening autoimmune activity.",
    caveat:
      "Gluten is primarily a concern for those with Hashimoto's due to the autoimmune component, or those with confirmed celiac disease or non-celiac gluten sensitivity.",
  },
  {
    id: "barley_malt",
    displayName: "Barley / Malt",
    category: "gluten",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos", "both"],
    patterns: ["barley", "barley malt", "malt", "malt extract", "malted barley", "malt vinegar"],
    wholeWordOnly: true,
    explanation:
      "Barley and malt contain gluten and carry the same autoimmune cross-reactivity concerns as wheat for those with Hashimoto's.",
  },
  {
    id: "rye",
    displayName: "Rye",
    category: "gluten",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos", "both"],
    patterns: ["rye", "rye flour", "rye bread"],
    wholeWordOnly: true,
    explanation:
      "Rye contains gluten and is linked to the same autoimmune concerns as wheat and barley in people with Hashimoto's.",
  },
  {
    id: "oats",
    displayName: "Oats",
    category: "gluten",
    severity: "moderate",
    confidence: "low",
    conditions: ["hashimotos", "both"],
    patterns: ["oats", "oat flour", "rolled oats", "oatmeal", "oat bran"],
    wholeWordOnly: true,
    explanation:
      "Oats are naturally gluten-free but are frequently cross-contaminated during processing. Unspecified oats in ingredient lists may carry gluten.",
    caveat:
      "If the label states 'certified gluten-free oats,' the concern is significantly lower. The app flags oats due to the high frequency of cross-contamination in conventional oat processing.",
  },

  // ── IODINE EXCESS ─────────────────────────────────────────────────────────
  // NOTE: These are weighted 2.0x for Hashimoto's, 0.5x for hypothyroidism

  {
    id: "kelp",
    displayName: "Kelp",
    category: "iodine_excess",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos"],
    patterns: ["kelp", "kelp powder", "kelp extract"],
    wholeWordOnly: true,
    explanation:
      "Kelp is extremely high in iodine. For people with Hashimoto's, excess iodine can trigger or worsen autoimmune thyroid flares.",
  },
  {
    id: "seaweed",
    displayName: "Seaweed / Nori",
    category: "iodine_excess",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos"],
    patterns: ["seaweed", "nori", "wakame", "dulse", "kombu", "hijiki", "arame"],
    wholeWordOnly: true,
    explanation:
      "Marine algae and seaweeds are among the most concentrated dietary sources of iodine. Excess iodine is associated with triggering Hashimoto's flares in susceptible individuals.",
  },
  {
    id: "spirulina",
    displayName: "Spirulina",
    category: "iodine_excess",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos"],
    patterns: ["spirulina"],
    wholeWordOnly: true,
    explanation:
      "Spirulina is a blue-green algae high in iodine and commonly added to green superfood powders and health drinks.",
    caveat:
      "Iodine content varies significantly by source and processing. Still flagged due to consistently high iodine profile.",
  },
  {
    id: "chlorella",
    displayName: "Chlorella",
    category: "iodine_excess",
    severity: "moderate",
    confidence: "medium",
    conditions: ["hashimotos"],
    patterns: ["chlorella"],
    wholeWordOnly: true,
    explanation:
      "Chlorella is a freshwater algae with moderate iodine content. It is a common ingredient in green superfood blends.",
    caveat:
      "Iodine content is lower than marine seaweeds, but worth noting for those monitoring iodine intake.",
  },
  {
    id: "bladderwrack",
    displayName: "Bladderwrack",
    category: "iodine_excess",
    severity: "significant",
    confidence: "high",
    conditions: ["hashimotos"],
    patterns: ["bladderwrack"],
    wholeWordOnly: true,
    explanation:
      "Bladderwrack is a seaweed supplement with very high iodine content, sometimes marketed for thyroid support — but likely harmful for Hashimoto's.",
  },
  {
    id: "iodized_salt",
    displayName: "Iodized Salt",
    category: "iodine_excess",
    severity: "moderate",
    confidence: "medium",
    conditions: ["hashimotos"],
    patterns: ["iodized salt"],
    wholeWordOnly: false,
    explanation:
      "Iodized salt adds supplemental iodine. While iodine is essential for thyroid function, excess intake from multiple sources may be a concern for Hashimoto's.",
    caveat:
      "A small amount of iodized salt in a single product is unlikely to be a significant concern on its own.",
  },

  // ── ENDOCRINE DISRUPTORS ──────────────────────────────────────────────────

  {
    id: "artificial_dyes",
    displayName: "Artificial Food Dyes",
    category: "endocrine_disruptor",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: [
      "red 40", "red no. 40", "allura red", "fd&c red no. 40", "fd&c red 40",
      "yellow 5", "yellow no. 5", "tartrazine", "fd&c yellow no. 5", "fd&c yellow 5",
      "yellow 6", "yellow no. 6", "sunset yellow", "fd&c yellow no. 6",
      "blue 1", "blue no. 1", "brilliant blue", "fd&c blue no. 1",
      "blue 2", "blue no. 2", "indigo carmine", "fd&c blue no. 2",
    ],
    wholeWordOnly: false,
    explanation:
      "Some artificial food dyes have been studied for potential endocrine-disrupting properties, though evidence for direct thyroid effects in humans at food-grade doses is limited.",
    caveat:
      "The strongest evidence for these dyes is in the context of neurobehavioral effects. Their thyroid impact in humans at typical dietary doses is not yet well established.",
  },
  {
    id: "sodium_benzoate",
    displayName: "Sodium Benzoate",
    category: "endocrine_disruptor",
    severity: "moderate",
    confidence: "low",
    conditions: ["both"],
    patterns: ["sodium benzoate"],
    wholeWordOnly: false,
    explanation:
      "Sodium benzoate is a preservative with some evidence of endocrine-disrupting activity in animal studies.",
    caveat:
      "Evidence for thyroid-specific effects in humans at food-grade doses is limited. Included for awareness.",
  },
  {
    id: "bha_bht",
    displayName: "BHA / BHT",
    category: "endocrine_disruptor",
    severity: "mild",
    confidence: "low",
    conditions: ["both"],
    patterns: ["bha", "bht", "butylated hydroxyanisole", "butylated hydroxytoluene"],
    wholeWordOnly: true,
    explanation:
      "BHA and BHT are antioxidant preservatives. Animal studies have shown thyroid effects at high doses.",
    caveat:
      "Evidence is primarily from animal studies at doses higher than typical food exposure. Included for awareness.",
  },

  // ── ABSORPTION BLOCKERS ───────────────────────────────────────────────────
  // medicationInteraction: true triggers the MedicationWarning banner

  {
    id: "calcium_supplement",
    displayName: "Supplemental Calcium",
    category: "absorption_blocker",
    severity: "significant",
    confidence: "high",
    conditions: ["both"],
    patterns: [
      "calcium carbonate",
      "calcium citrate",
      "calcium phosphate",
      "tricalcium phosphate",
      "calcium caseinate",
      "calcium sulfate",
    ],
    wholeWordOnly: false,
    explanation:
      "Supplemental calcium directly impairs levothyroxine absorption. Clinical guidelines recommend taking thyroid medication at least 4 hours apart from calcium-containing products.",
    medicationInteraction: true,
  },
  {
    id: "iron_supplement",
    displayName: "Supplemental Iron",
    category: "absorption_blocker",
    severity: "significant",
    confidence: "high",
    conditions: ["both"],
    patterns: [
      "ferrous sulfate",
      "ferrous fumarate",
      "ferrous gluconate",
      "reduced iron",
      "electrolytic iron",
      "carbonyl iron",
    ],
    wholeWordOnly: false,
    explanation:
      "Iron supplements are well-documented to reduce levothyroxine absorption. Fortified foods with supplemental iron should be consumed well away from thyroid medication.",
    medicationInteraction: true,
  },
  {
    id: "psyllium",
    displayName: "Psyllium / Glucomannan",
    category: "absorption_blocker",
    severity: "moderate",
    confidence: "medium",
    conditions: ["both"],
    patterns: ["psyllium", "psyllium husk", "glucomannan", "konjac"],
    wholeWordOnly: true,
    explanation:
      "High-fiber supplements like psyllium and glucomannan can slow the absorption of medications including levothyroxine if consumed at similar times.",
    caveat:
      "This is primarily a concern if consumed within a few hours of taking thyroid medication.",
    medicationInteraction: true,
  },

  // ── INFLAMMATORY ADDITIVES ────────────────────────────────────────────────

  {
    id: "msg",
    displayName: "MSG",
    category: "inflammatory_additive",
    severity: "mild",
    confidence: "low",
    conditions: ["both"],
    patterns: ["monosodium glutamate", "msg"],
    wholeWordOnly: true,
    explanation:
      "MSG is a flavor enhancer. Some functional medicine practitioners recommend limiting it for inflammatory conditions, though direct thyroid evidence in humans is weak.",
    caveat:
      "Evidence for thyroid-specific effects is limited. Included because it is commonly discussed in thyroid dietary communities.",
  },
  {
    id: "hfcs",
    displayName: "High Fructose Corn Syrup",
    category: "inflammatory_additive",
    severity: "mild",
    confidence: "low",
    conditions: ["both"],
    patterns: ["high fructose corn syrup", "high-fructose corn syrup", "hfcs"],
    wholeWordOnly: false,
    explanation:
      "High fructose corn syrup promotes blood sugar instability, which places stress on the endocrine system and may have indirect effects on thyroid function.",
    caveat:
      "No direct thyroid mechanism is established. Included due to its role in systemic inflammation and metabolic stress.",
  },
  {
    id: "trans_fat",
    displayName: "Partially Hydrogenated Oils",
    category: "inflammatory_additive",
    severity: "mild",
    confidence: "medium",
    conditions: ["both"],
    patterns: [
      "partially hydrogenated",
      "partially hydrogenated oil",
      "hydrogenated vegetable oil",
    ],
    wholeWordOnly: false,
    explanation:
      "Partially hydrogenated oils (trans fats) are pro-inflammatory. Systemic inflammation can worsen autoimmune thyroid conditions.",
    caveat:
      "Trans fats have been largely phased out of the US food supply but may still appear in older processed food formulations.",
  },
];
