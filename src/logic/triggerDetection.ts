const TRIGGER_PATTERNS: Array<{ patterns: string[]; displayName: string }> = [
  { patterns: ["red 40", "red no. 40", "allura red", "fd&c red no. 40", "fd&c red 40"], displayName: "Red 40" },
  { patterns: ["yellow 5", "yellow no. 5", "tartrazine", "fd&c yellow no. 5", "fd&c yellow 5"], displayName: "Yellow 5" },
  { patterns: ["yellow 6", "yellow no. 6", "sunset yellow", "fd&c yellow no. 6", "fd&c yellow 6"], displayName: "Yellow 6" },
  { patterns: ["blue 1", "blue no. 1", "brilliant blue", "fd&c blue no. 1", "fd&c blue 1"], displayName: "Blue 1" },
  { patterns: ["blue 2", "blue no. 2", "indigo carmine", "fd&c blue no. 2", "fd&c blue 2", "indigotine"], displayName: "Blue 2" },
  { patterns: ["sodium benzoate"], displayName: "Sodium Benzoate" },
  { patterns: ["monosodium glutamate", "msg"], displayName: "MSG" },
  { patterns: ["high fructose corn syrup", "high-fructose corn syrup", "hfcs"], displayName: "High Fructose Corn Syrup" },
  { patterns: ["aspartame"], displayName: "Aspartame" },
];

export function detectTriggers(ingredientsText: string): string[] {
  if (!ingredientsText || ingredientsText.trim().length === 0) return [];

  const lowerText = ingredientsText.toLowerCase();
  const found: string[] = [];

  for (const { patterns, displayName } of TRIGGER_PATTERNS) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        found.push(displayName);
        break;
      }
    }
  }

  return found;
}
