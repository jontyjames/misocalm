const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Find the source image - try PNG first, then create from SVG
async function findSource() {
  // Check for logo in icons directory first
  const iconsPng = path.join(ICONS_DIR, 'MisoCalm-logo-v1.png');
  if (fs.existsSync(iconsPng)) return iconsPng;

  const pngPath = path.join(__dirname, '..', 'public', 'MisoCalm-logo-v1.png');
  if (fs.existsSync(pngPath)) return pngPath;

  // Try other locations
  const altPaths = [
    path.join(ICONS_DIR, 'icon.png'),
    path.join(ICONS_DIR, 'logo.png'),
  ];
  for (const p of altPaths) {
    if (fs.existsSync(p)) return p;
  }

  // Use SVG as source
  const svgPath = path.join(ICONS_DIR, 'icon.svg');
  if (fs.existsSync(svgPath)) return svgPath;

  throw new Error('No source image found');
}

async function generateIcons() {
  const source = await findSource();
  console.log('Source:', source);

  // Ensure icons directory exists
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    await sharp(source)
      .resize(size, size, { fit: 'contain', background: { r: 3, g: 7, b: 18, alpha: 1 } })
      .png()
      .toFile(path.join(ICONS_DIR, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Maskable icons (with padding for safe zone - 10% padding on each side)
  const maskableSizes = [
    { name: 'maskable-192x192.png', size: 192 },
    { name: 'maskable-512x512.png', size: 512 },
  ];

  for (const { name, size } of maskableSizes) {
    const innerSize = Math.round(size * 0.8); // 80% of total for safe zone
    const padding = Math.round(size * 0.1);

    const inner = await sharp(source)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 3, g: 7, b: 18, alpha: 1 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 3, g: 7, b: 18, alpha: 255 },
      },
    })
      .composite([{ input: inner, left: padding, top: padding }])
      .png()
      .toFile(path.join(ICONS_DIR, name));
    console.log(`Generated ${name} (${size}x${size} maskable)`);
  }

  console.log('Done! All icons generated.');
}

generateIcons().catch(console.error);
