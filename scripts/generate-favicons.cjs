const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
const srcAssetsDir = path.resolve(__dirname, '../src/assets');

const candidatePaths = [
  process.env.LOGO_SOURCE,
  path.resolve(publicDir, 'logo.png'),
  path.resolve(srcAssetsDir, 'logo.png'),
].filter(Boolean);

const srcPath = candidatePaths.find((p) => fs.existsSync(p));

async function generate() {
  if (!srcPath || !fs.existsSync(srcPath)) {
    console.log('Notice: Logo source not found, existing favicons in public/ are retained.');
    return;
  }

  // Exact circle coordinates measured from uploaded image:
  // left: 24, top: 22, width: 973, height: 972
  const size = 972;
  const left = 24;
  const top = 22;

  // Extract square bounded by the circular gold emblem
  const cropped = await sharp(srcPath)
    .extract({ left, top, width: size, height: size })
    .toBuffer();

  // Create an anti-aliased circular alpha mask so corners outside the gold circle are transparent
  const r = size / 2;
  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r - 1}" fill="white"/></svg>`
  );

  const masked = await sharp(cropped)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Create destinations
  await sharp(masked).resize(1024, 1024).png({ quality: 95 }).toFile(path.join(publicDir, 'logo.png'));
  await sharp(masked).resize(512, 512).png({ quality: 95 }).toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(masked).resize(192, 192).png({ quality: 95 }).toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(masked).resize(180, 180).png({ quality: 95 }).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(masked).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  await sharp(masked).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(masked).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Also copy to src/assets for app usage
  if (fs.existsSync(srcAssetsDir)) {
    await sharp(masked).resize(512, 512).png().toFile(path.join(srcAssetsDir, 'logo.png'));
  }

  // Build standard multi-resolution ICO file (16, 32, 48) containing raw PNG streams
  const png16 = await sharp(masked).resize(16, 16).png().toBuffer();
  const png32 = await sharp(masked).resize(32, 32).png().toBuffer();
  const png48 = await sharp(masked).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // Generate a standalone vector SVG favicon
  const svgFavicon = generateSvgFavicon();
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');

  console.log('✓ Successfully generated all favicon and logo assets:');
  console.log('  - public/favicon.ico');
  console.log('  - public/favicon.svg');
  console.log('  - public/favicon-16x16.png');
  console.log('  - public/favicon-32x32.png');
  console.log('  - public/favicon-48x48.png');
  console.log('  - public/apple-touch-icon.png (180x180)');
  console.log('  - public/icon-192.png');
  console.log('  - public/icon-512.png');
  console.log('  - public/logo.png (1024x1024)');
}

function createIco(images) {
  // ICO header: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Type (1 = ICO)
  // 4-5: Number of images
  const numImages = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(numImages, 4);

  // Directory entries: 16 bytes per image
  const dirSize = 16 * numImages;
  let offset = 6 + dirSize;

  const dirBuffers = [];
  const imgBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // Width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Image data offset

    dirBuffers.push(entry);
    imgBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirBuffers, ...imgBuffers]);
}

function generateSvgFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="45%" stop-color="#FBBF24"/>
      <stop offset="85%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#731E15"/>
      <stop offset="70%" stop-color="#5C160F"/>
      <stop offset="100%" stop-color="#360B07"/>
    </radialGradient>
    <linearGradient id="flame" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="40%" stop-color="#F59E0B"/>
      <stop offset="90%" stop-color="#FEF08A"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
    <linearGradient id="arch" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F5"/>
      <stop offset="100%" stop-color="#EFE8DD"/>
    </linearGradient>
  </defs>

  <!-- Circular Medallion Background -->
  <circle cx="60" cy="60" r="58" fill="url(#bgGlow)"/>

  <!-- Outer Mani-Mala Jewel Border -->
  <circle cx="60" cy="60" r="56" stroke="url(#gold)" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="51" stroke="url(#gold)" stroke-width="1" stroke-dasharray="2 3" opacity="0.85"/>
  <circle cx="60" cy="60" r="46" stroke="url(#gold)" stroke-width="1.2" opacity="0.9"/>

  <!-- Inner Astrological Rays -->
  <g opacity="0.75" stroke="url(#gold)" stroke-width="0.9">
    <line x1="60" y1="14" x2="60" y2="20"/>
    <line x1="60" y1="100" x2="60" y2="106"/>
    <line x1="14" y1="60" x2="20" y2="60"/>
    <line x1="100" y1="60" x2="106" y2="60"/>
    <line x1="27" y1="27" x2="32" y2="32"/>
    <line x1="88" y1="88" x2="93" y2="93"/>
    <line x1="27" y1="93" x2="32" y2="88"/>
    <line x1="88" y1="32" x2="93" y2="27"/>
  </g>

  <!-- Monument Vimana Arch -->
  <path d="M60 22 C52 32, 40 40, 40 58 L40 84 L80 84 L80 58 C80 40, 68 32, 60 22 Z" fill="url(#arch)" stroke="url(#gold)" stroke-width="1.8"/>
  <path d="M60 34 C54 42, 47 47, 47 62 L47 84 L73 84 L73 62 C73 47, 66 42, 60 34 Z" fill="#5C160F" stroke="#FBBF24" stroke-width="1"/>

  <!-- Poornakalasha Finial Spire -->
  <path d="M60 16 L63 22 L57 22 Z" fill="url(#gold)"/>
  <circle cx="60" cy="15" r="2" fill="#FEF08A"/>

  <!-- Base Plinth -->
  <path d="M30 84 L90 84 L86 89 L34 89 Z" fill="url(#gold)"/>

  <!-- Akhand Jyoti (Sacred Flame) -->
  <path d="M60 46 C56 54, 54 60, 54 68 C54 74, 57 77, 60 77 C63 77, 66 74, 66 68 C66 60, 64 54, 60 46 Z" fill="url(#flame)"/>
  <circle cx="60" cy="67" r="2.5" fill="#FFFBEB"/>

  <!-- Diya Lamp Base -->
  <path d="M51 75 C51 80, 69 80, 69 75 Z" fill="url(#gold)"/>
</svg>`;
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
