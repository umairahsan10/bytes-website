#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sanity.io integration for Bytes Platform Blog...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Note: Replace the values above with your actual Sanity project credentials
# You can get these from your Sanity project settings at https://sanity.io/manage
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Go to https://sanity.io and create a new project');
console.log('2. Copy your Project ID and Dataset name from Settings > API');
console.log('3. Create an API token with read permissions');
console.log('4. Update the values in .env.local with your actual credentials');
console.log('5. Run "npm run dev" to start your Next.js app');
console.log('6. Navigate to /studio and run "npm install && npm run dev" to start Sanity Studio');
console.log('\n📖 See SANITY_SETUP.md for detailed instructions');

console.log('\n🎉 Sanity.io integration setup complete!'); 