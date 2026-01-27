const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images to convert (from the byte-suites page)
const imagesToConvert = [
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

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

async function convertImage(filename) {
  const inputPath = path.join(assetsDir, filename);
  const outputPath = path.join(assetsDir, filename.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return;
  }

  // Check if webp already exists
  if (fs.existsSync(outputPath)) {
    console.log(`✓ ${filename} - WebP already exists`);
    return;
  }

  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ Converted ${filename} → ${path.basename(outputPath)} (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Error converting ${filename}:`, error.message);
  }
}

async function convertAll() {
  console.log('🚀 Starting image conversion to WebP format...\n');
  
  for (const filename of imagesToConvert) {
    await convertImage(filename);
  }
  
  console.log('\n✅ Conversion complete!');
  console.log('\n📝 Note: The original files are kept. Delete them manually if you want to save space.');
}

convertAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
