const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const appdevDir = path.join(assetsDir, 'appdev');
const newimagesDir = path.join(assetsDir, 'newimages');

const images = [
  // App dev images
  { input: path.join(appdevDir, 'chat-image.png'), output: path.join(appdevDir, 'chat-image.webp') },
  { input: path.join(appdevDir, 'user-profile.jpg'), output: path.join(appdevDir, 'user-profile.webp') },
  
  // Main app images
  { input: path.join(assetsDir, 'app-hero-img.png'), output: path.join(assetsDir, 'app-hero-img.webp') },
  { input: path.join(assetsDir, 'app-img-3.png'), output: path.join(assetsDir, 'app-img-3.webp') },
  
  // Mobile app image
  { input: path.join(newimagesDir, 'mobileapp.png'), output: path.join(newimagesDir, 'mobileapp.webp') },
  
  // Technology stack icons
  { input: path.join(assetsDir, 'react-native-icon.png'), output: path.join(assetsDir, 'react-native-icon.webp') },
  { input: path.join(assetsDir, 'flutter-icon.png'), output: path.join(assetsDir, 'flutter-icon.webp') },
  { input: path.join(assetsDir, 'swift-icon.png'), output: path.join(assetsDir, 'swift-icon.webp') },
  { input: path.join(assetsDir, 'kotlin-icon.png'), output: path.join(assetsDir, 'kotlin-icon.webp') },
  { input: path.join(assetsDir, 'nodejs-icon.png'), output: path.join(assetsDir, 'nodejs-icon.webp') },
  { input: path.join(assetsDir, 'firebase-icon.png'), output: path.join(assetsDir, 'firebase-icon.webp') },
  { input: path.join(assetsDir, 'mongodb-icon.png'), output: path.join(assetsDir, 'mongodb-icon.webp') },
  { input: path.join(assetsDir, 'aws-icon.png'), output: path.join(assetsDir, 'aws-icon.webp') },
];

async function convertImages() {
  console.log('Starting image conversion...\n');
  
  for (const { input, output } of images) {
    if (!fs.existsSync(input)) {
      console.log(`⚠️  Skipping ${path.basename(input)} - file not found`);
      continue;
    }
    
    try {
      await sharp(input)
        .webp({ quality: 85 })
        .toFile(output);
      
      const inputStats = fs.statSync(input);
      const outputStats = fs.statSync(output);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${path.basename(input)} → ${path.basename(output)}`);
      console.log(`   Size: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${reduction}% reduction)\n`);
    } catch (error) {
      console.error(`❌ Error converting ${path.basename(input)}:`, error.message);
    }
  }
  
  console.log('Image conversion complete!');
}

convertImages().catch(console.error);
