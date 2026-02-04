const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToConvert = [
  {
    input: 'public/assets/bg.jpg',
    output: 'public/assets/optimized/bg.webp'
  },
  {
    input: 'public/assets/aboutUs/hero.jpg',
    output: 'public/assets/aboutUs/optimized/hero.webp'
  },
  {
    input: 'public/assets/aboutUs/image1.png',
    output: 'public/assets/aboutUs/optimized/image1.webp'
  },
  {
    input: 'public/assets/aboutUs/img2.png',
    output: 'public/assets/aboutUs/optimized/img2.webp'
  },
  {
    input: 'public/assets/aboutUs/tech-stack.png',
    output: 'public/assets/aboutUs/optimized/tech-stack.webp'
  },
  {
    input: 'public/assets/aboutUs/aboutus-contact.png',
    output: 'public/assets/aboutUs/optimized/aboutus-contact.webp'
  }
];

async function convertToWebP(inputPath, outputPath) {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);

    console.log(`✓ Converted: ${inputPath}`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Size reduction: ${reduction}%`);
    console.log(`  Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`  WebP: ${(outputStats.size / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('Converting about page images to WebP...\n');

  for (const image of imagesToConvert) {
    await convertToWebP(image.input, image.output);
  }

  console.log('Conversion complete!');
}

main();
