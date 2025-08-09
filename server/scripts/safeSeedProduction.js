const backupDatabase = require('./backupDatabase');
const { seedAllProductionData } = require('./seedProductionData');

async function safeSeedProduction() {
  try {
    console.log('🛡️ Starting safe production seeding with backup...');
    
    // Step 1: Create backup
    console.log('\n💾 Step 1: Creating database backup...');
    const backupResult = await backupDatabase();
    
    if (!backupResult.success) {
      throw new Error(`Backup failed: ${backupResult.error}`);
    }
    
    console.log(`✅ Backup created successfully: ${backupResult.file}`);
    
    // Step 2: Seed data
    console.log('\n🌱 Step 2: Seeding production data...');
    const seedResult = await seedAllProductionData();
    
    if (!seedResult.success) {
      throw new Error(`Seeding failed: ${seedResult.error}`);
    }
    
    console.log('✅ Production data seeded successfully!');
    
    // Final summary
    console.log('\n🎉 Safe seeding completed!');
    console.log('📊 Summary:');
    console.log(`   ├── Backup: ${backupResult.file}`);
    console.log(`   ├── Categories: ${seedResult.categories.length}`);
    console.log(`   ├── Products: ${seedResult.products.length}`);
    console.log(`   └── Duration: ${seedResult.duration}s`);
    
    return {
      success: true,
      backup: backupResult,
      seed: seedResult
    };
    
  } catch (error) {
    console.error('❌ Safe seeding failed:', error);
    console.log('\n🔄 If seeding failed, you can restore from backup:');
    console.log('   node scripts/restoreDatabase.js [backup-file]');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if called directly
if (require.main === module) {
  safeSeedProduction()
    .then((result) => {
      if (result.success) {
        console.log('✅ Safe production seeding completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Safe production seeding failed!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Safe production seeding failed:', error);
      process.exit(1);
    });
}

module.exports = safeSeedProduction;
