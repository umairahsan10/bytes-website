#!/usr/bin/env node

/**
 * Image Optimization Script
 * Generates responsive image variants for better web performance
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_TO_OPTIMIZE = [
  {
    input: 'public/assets/newimages/laptop.png',
    outputDir: 'public/assets/newimages/optimized',
    outputName: 'laptop',
    sizes: [400, 800, 1200, 1600], // Widths for responsive images
    formats: ['webp'], // Output formats - WebP only
  },
  {
    input: 'public/assets/newimages/whychoseus.png',
    outputDir: 'public/assets/newimages/optimized',
    outputName: 'whychoseus',
    sizes: [384, 448, 512, 768],
    formats: ['webp'],
  },
  {
    input: 'public/assets/WebDev/buildwithus.png',
    outputDir: 'public/assets/WebDev/optimized',
    outputName: 'buildwithus',
    sizes: [640, 1024, 1536, 1920],
    formats: ['webp'],
  },
];

// Quality settings
const QUALITY_SETTINGS = {
  webp: 85,
  png: 90,
  jpeg: 85,
};

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

/**
 * Optimize a single image
 */
async function optimizeImage(config) {
  const { input, outputDir, outputName, sizes, formats } = config;

  console.log(`\n🖼️  Processing: ${input}`);

  // Check if input file exists
  if (!fs.existsSync(input)) {
    console.error(`❌ File not found: ${input}`);
    return;
  }

  // Ensure output directory exists
  ensureDirectoryExists(outputDir);

  // Get original image metadata
  const metadata = await sharp(input).metadata();
  console.log(`   Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

  let successCount = 0;

  // Generate images for each size and format
  for (const size of sizes) {
    // Skip if size is larger than original
    if (size > metadata.width) {
      console.log(`   ⊗ Skipping ${size}px (larger than original)`);
      continue;
    }

    for (const format of formats) {
      const outputPath = path.join(outputDir, `${outputName}-${size}.${format}`);
      
      try {
        const quality = QUALITY_SETTINGS[format] || 85;
        
        await sharp(input)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toFormat(format, { quality })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`   ✓ ${outputName}-${size}.${format} (${sizeMB} MB)`);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Failed to create ${outputPath}:`, error.message);
      }
    }
  }

  console.log(`   Generated ${successCount} optimized variants`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Image Optimization\n');
  console.log('='.repeat(50));

  const startTime = Date.now();

  for (const config of IMAGES_TO_OPTIMIZE) {
    try {
      await optimizeImage(config);
    } catch (error) {
      console.error(`❌ Error processing ${config.input}:`, error.message);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Optimization complete in ${duration}s`);
  console.log('\n💡 Next steps:');
  console.log('   1. Check the optimized/ folders for generated images');
  console.log('   2. Update your Image components to use the optimized variants');
  console.log('   3. Test on different devices to verify loading performance');
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
