const mongoose = require('mongoose');
const seedProductionCategories = require('./seedProductionCategories');
const seedProductionProducts = require('./seedProductionProducts');
require('dotenv').config();

async function seedAllProductionData() {
  try {
    console.log('🚀 Starting complete production data seeding...');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🗄️ Database:', process.env.MONGODB_URI ? 'Connected' : 'Not configured');
    
    const startTime = Date.now();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Step 1: Seed Categories
    console.log('\n📂 Step 1: Seeding Categories...');
    const categories = await seedProductionCategories();
    console.log(`✅ Categories completed: ${categories.length} categories`);

    // Wait a moment for categories to be fully processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Seed Products
    console.log('\n📦 Step 2: Seeding Products...');
    const products = await seedProductionProducts();
    console.log(`✅ Products completed: ${products.length} products`);

    // Summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n🎉 Production data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   ├── Categories: ${categories.length}`);
    console.log(`   ├── Products: ${products.length}`);
    console.log(`   ├── Duration: ${duration}s`);
    console.log(`   └── Database: ${mongoose.connection.name}`);

    return {
      categories,
      products,
      duration,
      success: true
    };

  } catch (error) {
    console.error('❌ Production data seeding failed:', error);
    return {
      error: error.message,
      success: false
    };
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Command line options
const args = process.argv.slice(2);
const options = {
  categoriesOnly: args.includes('--categories-only'),
  productsOnly: args.includes('--products-only'),
  force: args.includes('--force'),
  help: args.includes('--help')
};

// Help text
if (options.help) {
  console.log(`
🌱 Production Data Seeder

Usage: node seedProductionData.js [options]

Options:
  --categories-only    Seed only categories
  --products-only      Seed only products  
  --force              Force seed (overwrite existing)
  --help               Show this help

Examples:
  node seedProductionData.js                    # Seed everything
  node seedProductionData.js --categories-only  # Categories only
  node seedProductionData.js --products-only    # Products only
  node seedProductionData.js --force            # Force overwrite
`);
  process.exit(0);
}

// Run specific operations based on options
async function runSeeding() {
  try {
    if (options.categoriesOnly) {
      console.log('🏷️ Seeding categories only...');
      await seedProductionCategories();
    } else if (options.productsOnly) {
      console.log('📦 Seeding products only...');
      await seedProductionProducts();
    } else {
      // Run complete seeding
      await seedAllProductionData();
    }
    
    console.log('✅ Seeding operation completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding operation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeeding();
}

module.exports = {
  seedAllProductionData,
  seedProductionCategories,
  seedProductionProducts
};
