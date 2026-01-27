const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// GIF file to convert
const gifPath = 'public/assets/newimages/binary_loop.gif';
const outputPath = 'public/assets/newimages/binary_loop.webp';

async function convertGifToWebP() {
  const fullGifPath = path.join(__dirname, gifPath);
  const fullOutputPath = path.join(__dirname, outputPath);
  
  // Check if file exists
  if (!fs.existsSync(fullGifPath)) {
    console.log(`⚠️  GIF file not found: ${gifPath}`);
    return;
  }

  console.log('🚀 Converting GIF to animated WebP...\n');

  try {
    // Using ffmpeg for animated WebP conversion (more reliable than sharp for GIFs)
    // If ffmpeg is not available, we'll use sharp with a fallback
    
    try {
      // Try ffmpeg first (best quality for animated GIFs)
      console.log('Attempting conversion with ffmpeg...');
      execSync(`ffmpeg -i "${fullGifPath}" -vcodec libwebp -filter:v fps=fps=20 -lossless 0 -compression_level 6 -q:v 90 -loop 0 -preset default -an -vsync 0 "${fullOutputPath}"`, {
        stdio: 'pipe'
      });
      
      const inputStats = fs.statSync(fullGifPath);
      const outputStats = fs.statSync(fullOutputPath);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✅ Converted with ffmpeg: ${gifPath} → .webp (${savings}% smaller)`);
      console.log(`   Original: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   WebP: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (ffmpegError) {
      console.log('⚠️  ffmpeg not found or failed, trying sharp...\n');
      
      // Fallback to sharp (may not preserve animation)
      await sharp(fullGifPath, { animated: true })
        .webp({ quality: 90, lossless: false })
        .toFile(fullOutputPath);
      
      const inputStats = fs.statSync(fullGifPath);
      const outputStats = fs.statSync(fullOutputPath);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✅ Converted with sharp: ${gifPath} → .webp (${savings}% smaller)`);
      console.log(`   Note: Animation may not be preserved with sharp. Install ffmpeg for better results.`);
    }
    
    console.log('\n💡 Installation instructions for ffmpeg:');
    console.log('   Windows: choco install ffmpeg  (or download from ffmpeg.org)');
    console.log('   Mac: brew install ffmpeg');
    console.log('   Linux: sudo apt install ffmpeg');
    
  } catch (error) {
    console.error(`❌ Error converting GIF:`, error.message);
    console.log('\n💡 Make sure you have either:');
    console.log('   1. ffmpeg installed (recommended for animated GIFs)');
    console.log('   2. sharp package installed (npm install sharp)');
  }
}

convertGifToWebP();
