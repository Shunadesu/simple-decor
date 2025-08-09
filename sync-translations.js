const fs = require('fs');
const path = require('path');

// Import the resources
const { resources } = require('./client/src/i18n-resources.js');

const languages = ['en', 'vi', 'ko', 'zh', 'ja'];

languages.forEach(lang => {
  const translationData = resources[lang]?.translation || {};
  const filePath = path.join(__dirname, 'client', 'public', 'locales', `${lang}.json`);
  
  // Write with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(translationData, null, 2), 'utf8');
  
  console.log(`✅ Updated ${lang}.json with ${Object.keys(translationData).length} top-level keys`);
});

console.log('\n🎉 All translation files synced successfully!');
