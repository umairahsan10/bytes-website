#!/usr/bin/env node

/**
 * Font Download Script
 * Downloads external fonts locally for better performance
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

// Ensure fonts directory exists
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
  console.log('✓ Created fonts directory');
}

/**
 * Download a file from URL
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🔤 Downloading External Fonts...\n');

  const fonts = [
    {
      url: 'https://fonts.cdnfonts.com/s/91326/GOLDROPSPERSONALUSE-Regular.woff',
      filename: 'goldrops-regular.woff',
      name: 'Goldrops Regular'
    },
    {
      url: 'https://fonts.cdnfonts.com/s/91326/GOLDROPSPERSONALUSE-Regular.woff2',
      filename: 'goldrops-regular.woff2',
      name: 'Goldrops Regular (WOFF2)'
    }
  ];

  for (const font of fonts) {
    const destPath = path.join(FONTS_DIR, font.filename);
    
    try {
      console.log(`⬇️  Downloading ${font.name}...`);
      await downloadFile(font.url, destPath);
      
      const stats = fs.statSync(destPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✓ Saved to: ${font.filename} (${sizeKB} KB)\n`);
    } catch (error) {
      console.log(`   ⚠️  Could not download ${font.name}: ${error.message}\n`);
    }
  }

  console.log('✨ Font download complete!');
  console.log('\n💡 Next step: Update globals.css to use local fonts');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
