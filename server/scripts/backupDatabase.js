const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

async function backupDatabase() {
  try {
    console.log('💾 Starting database backup...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create backup directory
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    // Fetch all data
    console.log('📂 Fetching categories...');
    const categories = await ProductCategory.find({}).lean();
    
    console.log('📦 Fetching products...');
    const products = await Product.find({}).lean();

    // Create backup object
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        database: mongoose.connection.name,
        version: '1.0.0',
        totalCategories: categories.length,
        totalProducts: products.length
      },
      categories,
      products
    };

    // Write backup file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completed successfully!');
    console.log(`📁 Backup file: ${backupFile}`);
    console.log(`📊 Categories: ${categories.length}`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`💾 File size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);

    return {
      success: true,
      file: backupFile,
      categories: categories.length,
      products: products.length
    };

  } catch (error) {
    console.error('❌ Backup failed:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  backupDatabase()
    .then((result) => {
      if (result.success) {
        console.log('✅ Database backup completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Database backup failed!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Database backup failed:', error);
      process.exit(1);
    });
}

module.exports = backupDatabase;
