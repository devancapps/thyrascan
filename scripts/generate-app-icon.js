#!/usr/bin/env node
/**
 * Generates all ThyraScan brand assets using the teal gradient + thyroid gland design.
 *
 * Outputs:
 *   assets/icon.png                   — 1024×1024 App Store icon
 *   assets/splash-icon.png            — 1284×2778 splash screen
 *   assets/android-icon-foreground.png — 1024×1024 transparent + white symbol
 *   assets/android-icon-background.png — 1024×1024 solid teal
 *   assets/android-icon-monochrome.png  — 1024×1024 white on black
 *
 * Sharp is not in package.json (native deps break EAS build). To regenerate locally:
 *   npm install sharp --no-save && node scripts/generate-app-icon.js
 */

const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// ── THYROID GLAND SYMBOL ───────────────────────────────────────────────────
// Paths are in a 100×100 coordinate space.
// Bounding box: x ≈ 16–84, y ≈ 36–73.  Visual center: (50, 54.5)
function thyroidPaths() {
  return `
    <path d="M50,58 C43,44 22,38 19,52 C16,66 37,73 50,64 Z" fill="white"/>
    <path d="M50,58 C57,44 78,38 81,52 C84,66 63,73 50,64 Z" fill="white"/>
    <ellipse cx="50" cy="62" rx="4" ry="8" fill="white" fill-opacity="0.4"/>
    <path d="M46,56 C42,50 37,44 33,40" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.65"/>
    <path d="M54,56 C58,50 63,44 67,40" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.65"/>
    <circle cx="33" cy="39" r="3" fill="white" fill-opacity="0.65"/>
    <circle cx="67" cy="39" r="3" fill="white" fill-opacity="0.65"/>
  `;
}

// ── 1. APP STORE ICON (1024×1024) ─────────────────────────────────────────
// Uses the full 100×100 viewBox so proportions exactly match the brand-preview icon.
async function generateIcon() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d4be"/>
      <stop offset="100%" stop-color="#0a9685"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)"/>
  ${thyroidPaths()}
</svg>`;
  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(`${ASSETS}/icon.png`);
  console.log('✓ icon.png');
}

// ── 2. SPLASH SCREEN (1284×2778) ──────────────────────────────────────────
// Symbol centered at 40% of screen height, text stacked below.
async function generateSplash() {
  const W = 1284;
  const H = 2778;

  // Scale 100-unit symbol box to 480px wide
  const sc = 4.8;
  // Center of symbol in 100-unit space: (50, 54.5)
  // Target center: horizontal midpoint, 40% down
  const cx = W / 2;
  const cy = H * 0.40;
  const tx = cx - 50 * sc;
  const ty = cy - 54.5 * sc;

  // Symbol bottom (y=73 in 100-unit space) → ty + 73*sc
  const symbolBottom = ty + 73 * sc;
  const nameY    = symbolBottom + 110;
  const taglineY = nameY + 110;
  const bylineY  = H - 160;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d4be"/>
      <stop offset="100%" stop-color="#0a9685"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${sc})">
    ${thyroidPaths()}
  </g>
  <text x="${cx}" y="${nameY.toFixed(0)}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="108" font-weight="700" fill="white"
        text-anchor="middle" letter-spacing="-2">ThyraScan</text>
  <text x="${cx}" y="${taglineY.toFixed(0)}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="56" fill="white" fill-opacity="0.55"
        text-anchor="middle">Thyroid-aware food scanning</text>
  <text x="${cx}" y="${bylineY}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="48" fill="white" fill-opacity="0.3"
        text-anchor="middle" letter-spacing="1">by SafeScan Systems</text>
</svg>`;
  await sharp(Buffer.from(svg)).resize(W, H).png().toFile(`${ASSETS}/splash-icon.png`);
  console.log('✓ splash-icon.png');
}

// ── 3. ANDROID FOREGROUND (1024×1024, transparent background) ─────────────
// Symbol scaled to fit within the 72% safe zone (≈ 737px), centered.
async function generateAndroidForeground() {
  const SIZE = 1024;
  const symbolSize = 620; // fits comfortably within safe zone
  const sc = symbolSize / 100;
  const tx = SIZE / 2 - 50 * sc;
  const ty = SIZE / 2 - 54.5 * sc;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${sc})">
    ${thyroidPaths()}
  </g>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${ASSETS}/android-icon-foreground.png`);
  console.log('✓ android-icon-foreground.png');
}

// ── 4. ANDROID BACKGROUND (1024×1024, solid teal) ─────────────────────────
async function generateAndroidBackground() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#14b8a6"/>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${ASSETS}/android-icon-background.png`);
  console.log('✓ android-icon-background.png');
}

// ── 5. ANDROID MONOCHROME (1024×1024, white symbol on black) ──────────────
async function generateAndroidMonochrome() {
  const SIZE = 1024;
  const symbolSize = 620;
  const sc = symbolSize / 100;
  const tx = SIZE / 2 - 50 * sc;
  const ty = SIZE / 2 - 54.5 * sc;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="black"/>
  <g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${sc})">
    ${thyroidPaths()}
  </g>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${ASSETS}/android-icon-monochrome.png`);
  console.log('✓ android-icon-monochrome.png');
}

async function main() {
  console.log('Generating ThyraScan brand assets...\n');
  await Promise.all([
    generateIcon(),
    generateSplash(),
    generateAndroidForeground(),
    generateAndroidBackground(),
    generateAndroidMonochrome(),
  ]);
  console.log('\nAll assets written to assets/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
