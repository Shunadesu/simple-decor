const mongoose = require('mongoose');
const Product = require('./models/Product');
const ProductCategory = require('./models/ProductCategory');
require('dotenv').config();

// Old category mapping
const oldCategoryMapping = {
  'storage-baskets': {
    name: { en: 'Storage Baskets', vi: 'Giỏ Đựng Đồ' },
    description: { en: 'Storage and organization solutions', vi: 'Giải pháp lưu trữ và tổ chức' },
    slug: 'storage-baskets'
  },
  'decorative-items': {
    name: { en: 'Decorative Items', vi: 'Đồ Trang Trí' },
    description: { en: 'Home decoration and accessories', vi: 'Đồ trang trí và phụ kiện nhà' },
    slug: 'decorative-items'
  },
  'kitchen-ware': {
    name: { en: 'Kitchen Ware', vi: 'Đồ Dùng Nhà Bếp' },
    description: { en: 'Kitchen utensils and accessories', vi: 'Đồ dùng và phụ kiện nhà bếp' },
    slug: 'kitchen-ware'
  },
  'furniture': {
    name: { en: 'Furniture', vi: 'Nội Thất' },
    description: { en: 'Home furniture and furnishings', vi: 'Nội thất và đồ đạc nhà' },
    slug: 'furniture'
  },
  'other': {
    name: { en: 'Other', vi: 'Khác' },
    description: { en: 'Other miscellaneous items', vi: 'Các mặt hàng khác' },
    slug: 'other'
  }
};

async function migrateCategories() {
  try {
    console.log('Starting category migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create categories if they don't exist
    const categoryMap = {};
    
    for (const [oldCategory, categoryData] of Object.entries(oldCategoryMapping)) {
      let category = await ProductCategory.findOne({ slug: categoryData.slug });
      
      if (!category) {
        category = new ProductCategory({
          ...categoryData,
          isActive: true,
          isFeatured: false,
          order: 0
        });
        await category.save();
        console.log(`Created category: ${categoryData.name.en}`);
      } else {
        console.log(`Category already exists: ${categoryData.name.en}`);
      }
      
      categoryMap[oldCategory] = category._id;
    }
    
    // Update products to use new category references
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);
    
    let updatedCount = 0;
    for (const product of products) {
      if (typeof product.category === 'string' && categoryMap[product.category]) {
        product.category = categoryMap[product.category];
        await product.save();
        updatedCount++;
        console.log(`Updated product: ${product.name.en}`);
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} products`);
    
    // Verify migration
    const verifyProducts = await Product.find({}).populate('category');
    console.log('\nVerification:');
    verifyProducts.forEach(product => {
      console.log(`- ${product.name.en}: ${product.category ? product.category.name.en : 'No category'}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateCategories();
}

module.exports = { migrateCategories }; 