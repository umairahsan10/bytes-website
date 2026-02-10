const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Script to convert PNG/JPG images to WebP format
 * Run: node scripts/convert-to-webp.js
 */

const directories = [
  'public/assets/hero images',
  'public/assets/brands',
  'public/assets/Book',
  'public/assets/bytes-bot',
  'public/portfolio'
];

async function convertImage(inputPath, outputPath, quality = 85) {
  try {
    await sharp(inputPath)
      .webp({ quality: quality })
      .toFile(outputPath);
    console.log(`✓ Converted: ${inputPath} → ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  const absolutePath = path.join(__dirname, '..', dirPath);
  
  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠ Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(absolutePath);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const inputPath = path.join(absolutePath, file);
      const outputPath = path.join(absolutePath, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      // Skip if WebP already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⊘ Skipped (exists): ${file}`);
        continue;
      }
      
      await convertImage(inputPath, outputPath);
    }
  }
}

async function main() {
  console.log('🔄 Starting image conversion to WebP...\n');
  
  for (const dir of directories) {
    console.log(`\n📁 Processing: ${dir}`);
    await processDirectory(dir);
  }
  
  console.log('\n✅ Conversion complete!');
  console.log('\n📝 Note: Original files are kept. You can delete them after verifying WebP versions work correctly.');
}

main().catch(console.error);
