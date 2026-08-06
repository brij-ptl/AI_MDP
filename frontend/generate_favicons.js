const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = Buffer.from(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 4 C 12 4 4 20 4 32 C 4 48 16 60 32 60 C 20 60 8 48 8 32 C 8 20 18 8 32 4 Z" fill="#1B6F65" />
  <circle cx="38" cy="20" r="6" fill="#1B6F65" />
  <path d="M28 56 C 24 36 38 24 58 26 C 60 42 46 56 28 56 Z" stroke="#1B6F65" stroke-width="2.5" fill="none" stroke-linejoin="round" />
  <path d="M28 56 C 36 46 48 36 58 26" stroke="#1B6F65" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
`);

async function generateFavicons() {
  const publicDir = path.join(__dirname, 'public');
  
  // favicon-16x16.png
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  // favicon-32x32.png
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  // apple-touch-icon.png
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  // android-chrome-192x192.png
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  // android-chrome-512x512.png
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  
  // Create a 32x32 ico file
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  
  console.log('Favicons generated successfully.');
}

generateFavicons().catch(console.error);
