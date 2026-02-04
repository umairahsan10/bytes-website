const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images to convert for services/app and services/web pages
const imagesToConvert = [
  // App page images
  'public/assets/appdev/chat-image.png',
  'public/assets/appdev/user-profile.jpg',
  'public/assets/app-hero-img.png',
  'public/assets/newimages/mobileapp.png',
  'public/assets/react-native-icon.png',
  'public/assets/flutter-icon.png',
  'public/assets/swift-icon.png',
  'public/assets/kotlin-icon.png',
  'public/assets/nodejs-icon.png',
  'public/assets/firebase-icon.png',
  'public/assets/mongodb-icon.png',
  'public/assets/aws-icon.png',
  'public/assets/app-img-3.png',
  
  // Web page images
  'public/assets/newimages/laptop.png',
  'public/assets/newimages/whychoseus.png',
  'public/assets/WebDev/buildwithus.png',
  
  // Marketing page images
  'public/assets/Marketing/market(2).png',
  'public/assets/Marketing/smm.png',
  'public/assets/Marketing/PPC_Management.png',
  
  // SEO page images
  'public/assets/seo-img-1.png',
  'public/assets/seo-handshake.png',
  
  // Advanced Services page images
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
    await sharp(fullPath)
      .webp({ quality: 95 }) // High quality for optimal visual fidelity
      .toFile(outputPath);
    
    const inputStats = fs.statSync(fullPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✅ Converted: ${inputPath} → .webp (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function convertAll() {
  console.log('🚀 Starting WebP conversion...\n');
  
  for (const imagePath of imagesToConvert) {
    await convertToWebP(imagePath);
  }
  
  console.log('\n✨ Conversion complete!');
  console.log('\n💡 Note: Original images are preserved. You can delete them after verifying the WebP versions work correctly.');
}

convertAll();
