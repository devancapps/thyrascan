#!/usr/bin/env node
/**
 * Generates a 1024×1024 PNG app store icon matching the OnboardingScreen leaf icon:
 * - Background: #E8F8F0 (iconContainer)
 * - Leaf: Ionicons "leaf" in #4CAF7A (colors.primary)
 * - No transparency, no rounded corners (App Store requirements)
 *
 * Sharp is not in package.json (native deps break EAS build). To regenerate locally:
 *   npm install sharp --no-save && node scripts/generate-app-icon.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZE = 1024;
const BACKGROUND = '#E8F8F0';
const LEAF_COLOR = '#4CAF7A';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'icon.png');

// On screen: leaf 64px inside 120px container → leaf is ~53% of container
// On 1024px: leaf size ≈ 1024 * (64/120) ≈ 546
const LEAF_SIZE = (SIZE * 64) / 120;
const LEAF_VIEWBOX = 512;
const SCALE = LEAF_SIZE / LEAF_VIEWBOX;
const OFFSET = (SIZE - LEAF_SIZE) / 2;

// Ionicons filled leaf path (viewBox 0 0 512 512)
const LEAFLET_PATH =
  'M161.35 242a16 16 0 0122.62-.68c73.63 69.36 147.51 111.56 234.45 133.07 11.73-32 12.77-67.22 2.64-101.58-13.44-45.59-44.74-85.31-90.49-114.86-40.84-26.38-81.66-33.25-121.15-39.89-49.82-8.38-96.88-16.3-141.79-63.85-5-5.26-11.81-7.37-18.32-5.66-7.44 2-12.43 7.88-14.82 17.6-5.6 22.75-2 86.51 13.75 153.82 25.29 108.14 65.65 162.86 95.06 189.73 38 34.69 87.62 53.9 136.93 53.9a186 186 0 0027.77-2.04c41.71-6.32 76.43-27.27 96-57.75-89.49-23.28-165.94-67.55-242-139.16a16 16 0 01-.65-22.65zM467.43 384.19c-16.83-2.59-33.13-5.84-49-9.77a157.71 157.71 0 01-12.13 25.68c-.73 1.25-1.5 2.49-2.29 3.71a584.21 584.21 0 0058.56 12 16 16 0 104.87-31.62z';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BACKGROUND}"/>
  <g transform="translate(${OFFSET}, ${OFFSET}) scale(${SCALE})">
    <path d="${LEAFLET_PATH}" fill="${LEAF_COLOR}"/>
  </g>
</svg>
`;

async function main() {
  const buf = Buffer.from(svg);
  await sharp(buf)
    .resize(SIZE, SIZE)
    .flatten({ background: BACKGROUND })
    .png()
    .toFile(OUTPUT_PATH);
  console.log('Written:', OUTPUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
