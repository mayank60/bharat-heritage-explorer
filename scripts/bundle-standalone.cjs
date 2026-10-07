const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const distHtmlPath = path.join(distDir, 'index.html');
const standaloneHtmlPath = path.resolve(__dirname, '../standalone.html');
const distStandaloneHtmlPath = path.join(distDir, 'standalone.html');

if (!fs.existsSync(distHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

let html = fs.readFileSync(distHtmlPath, 'utf8');

// Inline CSS assets
html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi, (match, href) => {
  const cleanHref = href.startsWith('/') ? href.slice(1) : href;
  const cssPath = path.join(distDir, cleanHref);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    return `<style>\n${cssContent}\n</style>`;
  }
  return match;
});

// Inline JS module assets
html = html.replace(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const jsPath = path.join(distDir, cleanSrc);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    return `<script type="module">\n${jsContent}\n</script>`;
  }
  return match;
});

// Remove external modulepreloads to avoid offline network errors
html = html.replace(/<link[^>]+rel=["']modulepreload["'][^>]*>/gi, '');

// Write inlined standalone file to dist directory
fs.writeFileSync(distStandaloneHtmlPath, html, 'utf8');

// Ensure all monument images exist in dist/src/assets/images and dist/assets/images
const srcImagesDir = path.resolve(__dirname, '../src/assets/images');
const distSrcImagesDir = path.join(distDir, 'src/assets/images');
const distAssetsImagesDir = path.join(distDir, 'assets/images');

if (fs.existsSync(srcImagesDir)) {
  fs.mkdirSync(distSrcImagesDir, { recursive: true });
  fs.mkdirSync(distAssetsImagesDir, { recursive: true });
  const files = fs.readdirSync(srcImagesDir);
  let copiedCount = 0;
  for (const file of files) {
    fs.copyFileSync(path.join(srcImagesDir, file), path.join(distSrcImagesDir, file));
    fs.copyFileSync(path.join(srcImagesDir, file), path.join(distAssetsImagesDir, file));
    copiedCount++;
  }
  console.log(`✓ Copied ${copiedCount} monument assets to dist/src/assets/images & dist/assets/images`);
}

console.log('✓ 100% Self-Contained Standalone HTML successfully generated:');
console.log('  - dist/standalone.html (Size: ' + (html.length / 1024).toFixed(2) + ' KB)');
console.log('  - dist/index.html (Size: ' + (fs.statSync(distHtmlPath).size / 1024).toFixed(2) + ' KB)');
