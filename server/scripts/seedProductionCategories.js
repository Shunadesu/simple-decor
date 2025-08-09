const mongoose = require('mongoose');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Production categories data
const categories = [
  {
    name: {
      en: "Storage & Organization",
      vi: "Lưu trữ & Tổ chức"
    },
    slug: "storage-organization",
    description: {
      en: "Beautiful and functional storage solutions for your home",
      vi: "Giải pháp lưu trữ đẹp và tiện dụng cho ngôi nhà của bạn"
    },
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/storage-category.jpg",
      publicId: "storage-category"
    },
    isActive: true,
    displayOrder: 1,
    seoTitle: {
      en: "Storage & Organization Solutions | Simple Decor",
      vi: "Giải pháp Lưu trữ & Tổ chức | Simple Decor"
    },
    seoDescription: {
      en: "Discover our collection of storage and organization products",
      vi: "Khám phá bộ sưu tập sản phẩm lưu trữ và tổ chức"
    }
  },
  {
    name: {
      en: "Decorative Items",
      vi: "Đồ trang trí"
    },
    slug: "decorative-items",
    description: {
      en: "Elegant decorative pieces to enhance your living space",
      vi: "Những món đồ trang trí tinh tế để tôn lên không gian sống"
    },
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/decorative-category.jpg",
      publicId: "decorative-category"
    },
    isActive: true,
    displayOrder: 2,
    seoTitle: {
      en: "Home Decorative Items | Simple Decor",
      vi: "Đồ trang trí nhà cửa | Simple Decor"
    },
    seoDescription: {
      en: "Beautiful decorative items for modern homes",
      vi: "Đồ trang trí đẹp cho ngôi nhà hiện đại"
    }
  },
  {
    name: {
      en: "Kitchen & Dining",
      vi: "Nhà bếp & Ăn uống"
    },
    slug: "kitchen-dining",
    description: {
      en: "Premium kitchenware and dining accessories",
      vi: "Đồ dùng nhà bếp và phụ kiện ăn uống cao cấp"
    },
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/kitchen-category.jpg",
      publicId: "kitchen-category"
    },
    isActive: true,
    displayOrder: 3,
    seoTitle: {
      en: "Kitchen & Dining Accessories | Simple Decor",
      vi: "Phụ kiện Nhà bếp & Ăn uống | Simple Decor"
    },
    seoDescription: {
      en: "High-quality kitchen and dining products",
      vi: "Sản phẩm nhà bếp và ăn uống chất lượng cao"
    }
  },
  {
    name: {
      en: "Furniture",
      vi: "Nội thất"
    },
    slug: "furniture",
    description: {
      en: "Stylish and functional furniture pieces",
      vi: "Những món nội thất phong cách và tiện dụng"
    },
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/furniture-category.jpg",
      publicId: "furniture-category"
    },
    isActive: true,
    displayOrder: 4,
    seoTitle: {
      en: "Modern Furniture Collection | Simple Decor",
      vi: "Bộ sưu tập Nội thất hiện đại | Simple Decor"
    },
    seoDescription: {
      en: "Contemporary furniture for modern living",
      vi: "Nội thất đương đại cho cuộc sống hiện đại"
    }
  },
  {
    name: {
      en: "Home Accessories",
      vi: "Phụ kiện gia đình"
    },
    slug: "home-accessories",
    description: {
      en: "Essential accessories to complete your home",
      vi: "Những phụ kiện thiết yếu để hoàn thiện ngôi nhà"
    },
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/accessories-category.jpg",
      publicId: "accessories-category"
    },
    isActive: true,
    displayOrder: 5,
    seoTitle: {
      en: "Home Accessories & Decor | Simple Decor",
      vi: "Phụ kiện & Trang trí nhà | Simple Decor"
    },
    seoDescription: {
      en: "Complete your home with our accessories collection",
      vi: "Hoàn thiện ngôi nhà với bộ sưu tập phụ kiện"
    }
  }
];

async function seedProductionCategories() {
  try {
    console.log('🌱 Starting production categories seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing categories (optional - remove if you want to keep existing)
    // await ProductCategory.deleteMany({});
    // console.log('🗑️ Cleared existing categories');

    // Insert categories
    const createdCategories = [];
    
    for (const categoryData of categories) {
      // Check if category already exists
      const existingCategory = await ProductCategory.findOne({ slug: categoryData.slug });
      
      if (existingCategory) {
        console.log(`⏭️ Category "${categoryData.slug}" already exists, skipping...`);
        createdCategories.push(existingCategory);
      } else {
        const category = new ProductCategory(categoryData);
        const savedCategory = await category.save();
        createdCategories.push(savedCategory);
        console.log(`✅ Created category: ${categoryData.name.en}`);
      }
    }

    console.log(`🎉 Successfully seeded ${createdCategories.length} categories!`);
    console.log('\n📋 Created categories:');
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name.en} (${cat.slug})`);
    });

    return createdCategories;

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedProductionCategories()
    .then(() => {
      console.log('✅ Categories seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Categories seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedProductionCategories;
