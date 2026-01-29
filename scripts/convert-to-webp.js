const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images used in byte-suites page
const images = [
  'bytesuite-hero.png',
  'lead-management.png',
  'bytebot-ai.png',
  'communication-hub.jpg',
  'Analytics.jpg',
  'Business.jpg',
  'ai-intelligence.png',
  'revenue-tools.png',
  'conversion-design.png',
  'consultants.jpg',
  'sales-teams.png',
  'smb.png',
  'ecommerce.png',
  'api-architecture.png',
  'security.png',
  'user-experience.png',
  'erp-solutions.png',
  'erp-needs.png'
];

const publicDir = path.join(__dirname, '..', 'public', 'assets');

async function convertToWebP() {
  console.log('Starting image conversion to WebP...\n');
  
  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, image.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${image} - File not found, skipping...`);
      continue;
    }
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const stats = fs.statSync(inputPath);
      const newStats = fs.statSync(outputPath);
      const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(2);
      
      console.log(`✓ ${image} -> ${path.basename(outputPath)}`);
      console.log(`  Size: ${(stats.size / 1024).toFixed(2)}KB -> ${(newStats.size / 1024).toFixed(2)}KB (${reduction}% reduction)\n`);
    } catch (error) {
      console.error(`✗ Error converting ${image}:`, error.message, '\n');
    }
  }
  
  console.log('Conversion complete!');
}

convertToWebP();
