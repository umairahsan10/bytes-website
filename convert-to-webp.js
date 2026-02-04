const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images to convert for advanced-services page
const imagesToConvert = [
  'public/assets/servicebg.png',
  'public/assets/Cybersecurity.jpg',
  'public/assets/Emerging_tech.png',
  'public/assets/wallpaper.jpg'
];

async function convertToWebP(inputPath) {
  const fullPath = path.join(__dirname, inputPath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${inputPath} - file not found`);
    return;
  }
  
  const ext = path.extname(fullPath);
  const outputPath = fullPath.replace(ext, '.webp');
  
  try {
    const inputStats = fs.statSync(fullPath);
    const inputSize = inputStats.size;
    
    await sharp(fullPath)
      .webp({ quality: 90 })
      .toFile(outputPath);
    
    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(1);
    
    console.log(`✅ Converted: ${inputPath}`);
    console.log(`   Original: ${(inputSize / 1024).toFixed(1)} KB`);
    console.log(`   WebP: ${(outputSize / 1024).toFixed(1)} KB`);
    console.log(`   Reduction: ${reduction}%\n`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function convertAll() {
  console.log('Starting WebP conversion for advanced-services page...\n');
  
  for (const image of imagesToConvert) {
    await convertToWebP(image);
  }
  
  console.log('Conversion complete!');
}

convertAll();
