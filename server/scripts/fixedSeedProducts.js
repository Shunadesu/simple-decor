const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Fixed production products data with correct schema structure
const products = [
  {
    name: {
      en: "Bamboo Storage Basket Set",
      vi: "Bộ giỏ lưu trữ tre"
    },
    slug: "bamboo-storage-basket-set",
    description: {
      en: "Set of 3 handwoven bamboo baskets perfect for organizing your home. Made from sustainable bamboo with natural finish.",
      vi: "Bộ 3 giỏ tre thủ công hoàn hảo để tổ chức ngôi nhà. Làm từ tre bền vững với lớp hoàn thiện tự nhiên."
    },
    categorySlug: "home-decor",
    material: "Bamboo",
    moisture: "< 12%",
    packaging: "Carton box",
    price: {
      amount: 39.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=500",
        public_id: "bamboo-basket-1",
        alt: "Bamboo Storage Basket Set",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 50,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 30,
        width: 20,
        height: 15,
        unit: "cm"
      },
      weight: {
        value: 1.2,
        unit: "kg"
      },
      color: "Natural",
      finish: "Natural bamboo"
    },
    features: [
      "Eco-friendly bamboo construction",
      "Set of 3 different sizes",
      "Handwoven craftsmanship", 
      "Natural finish",
      "Lightweight yet durable"
    ],
    tags: ["bamboo", "storage", "eco-friendly", "handmade", "organization"],
    isActive: true,
    isFeatured: true,
    status: "published"
  },
  {
    name: {
      en: "Cotton Rope Storage Bin",
      vi: "Thùng lưu trữ dây cotton"
    },
    slug: "cotton-rope-storage-bin",
    description: {
      en: "Large cotton rope storage bin with handles. Perfect for toys, laundry, or general storage. Soft and safe for children.",
      vi: "Thùng lưu trữ dây cotton lớn có tay cầm. Hoàn hảo cho đồ chơi, quần áo hoặc lưu trữ chung. Mềm mại và an toàn cho trẻ em."
    },
    categorySlug: "home-decor",
    material: "100% Cotton Rope",
    moisture: "< 10%",
    packaging: "Carton box",
    price: {
      amount: 29.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        public_id: "cotton-bin-1",
        alt: "Cotton Rope Storage Bin",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 75,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 35,
        height: 30,
        unit: "cm"
      },
      weight: {
        value: 0.8,
        unit: "kg"
      },
      color: "Natural White",
      finish: "Soft cotton"
    },
    features: [
      "100% natural cotton rope",
      "Sturdy handles for easy carrying",
      "Machine washable",
      "Child-safe materials",
      "Collapsible for storage"
    ],
    tags: ["cotton", "storage", "bin", "children", "washable"],
    isActive: true,
    isFeatured: false,
    status: "published"
  },
  {
    name: {
      en: "Macrame Wall Hanging",
      vi: "Trang trí tường macrame"
    },
    slug: "macrame-wall-hanging",
    description: {
      en: "Handcrafted macrame wall hanging made from natural cotton cord. Adds bohemian charm to any room.",
      vi: "Trang trí tường macrame thủ công làm từ dây cotton tự nhiên. Thêm nét quyến rũ bohemian cho bất kỳ căn phòng nào."
    },
    categorySlug: "home-decor",
    material: "Natural Cotton Cord",
    moisture: "< 8%",
    packaging: "Protective tube",
    price: {
      amount: 29.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        public_id: "macrame-wall-1",
        alt: "Macrame Wall Hanging",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 30,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 60,
        width: 5,
        height: 80,
        unit: "cm"
      },
      weight: {
        value: 0.5,
        unit: "kg"
      },
      color: "Natural",
      finish: "Cotton cord"
    },
    features: [
      "Handcrafted design",
      "Natural cotton cord",
      "Bohemian style",
      "Easy to hang",
      "Unique patterns"
    ],
    tags: ["macrame", "wall", "decoration", "bohemian", "handmade"],
    isActive: true,
    isFeatured: true,
    status: "published"
  },
  {
    name: {
      en: "Wooden Cutting Board Set",
      vi: "Bộ thớt gỗ"
    },
    slug: "wooden-cutting-board-set",
    description: {
      en: "Premium acacia wood cutting board set. Food-safe finish and beautiful grain patterns make these perfect for both prep and serving.",
      vi: "Bộ thớt gỗ keo cao cấp. Lớp hoàn thiện an toàn thực phẩm và hoa văn đẹp làm cho chúng hoàn hảo cho cả chuẩn bị và phục vụ."
    },
    categorySlug: "kitchen-dining",
    material: "Acacia Wood",
    moisture: "< 12%",
    packaging: "Gift box",
    price: {
      amount: 59.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500",
        public_id: "cutting-board-1",
        alt: "Wooden Cutting Board Set",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 40,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 40,
        width: 30,
        height: 2,
        unit: "cm"
      },
      weight: {
        value: 2.1,
        unit: "kg"
      },
      color: "Natural Wood",
      finish: "Food-safe oil"
    },
    features: [
      "Food-safe acacia wood",
      "Beautiful natural grain",
      "Set of 2 boards",
      "Knife-friendly surface",
      "Reversible design"
    ],
    tags: ["wood", "cutting", "board", "kitchen", "acacia"],
    isActive: true,
    isFeatured: false,
    status: "published"
  },
  {
    name: {
      en: "Minimalist Side Table",
      vi: "Bàn cạnh tối giản"
    },
    slug: "minimalist-side-table",
    description: {
      en: "Clean-lined side table with oak veneer top and white metal legs. Perfect for modern living spaces.",
      vi: "Bàn cạnh thiết kế đơn giản với mặt gỗ sồi và chân kim loại trắng. Hoàn hảo cho không gian sống hiện đại."
    },
    categorySlug: "furniture",
    material: "Oak Veneer, Steel",
    moisture: "< 12%",
    packaging: "Flat pack box",
    price: {
      amount: 109.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        public_id: "side-table-1",
        alt: "Minimalist Side Table",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 20,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 45,
        width: 45,
        height: 55,
        unit: "cm"
      },
      weight: {
        value: 8.5,
        unit: "kg"
      },
      color: "Oak/White",
      finish: "Matte veneer"
    },
    features: [
      "Oak veneer top",
      "Powder-coated steel legs",
      "Minimalist design",
      "Easy assembly",
      "Scratch-resistant surface"
    ],
    tags: ["furniture", "table", "minimalist", "oak", "modern"],
    isActive: true,
    isFeatured: true,
    status: "published"
  },
  {
    name: {
      en: "Ceramic Plant Pot Set",
      vi: "Bộ chậu cây gốm"
    },
    slug: "ceramic-plant-pot-set",
    description: {
      en: "Set of 3 ceramic plant pots in different sizes. Modern white finish with drainage holes and matching saucers.",
      vi: "Bộ 3 chậu cây gốm với kích cỡ khác nhau. Hoàn thiện màu trắng hiện đại với lỗ thoát nước và đĩa lót phù hợp."
    },
    categorySlug: "home-decor",
    material: "Ceramic",
    moisture: "N/A",
    packaging: "Protective packaging",
    price: {
      amount: 42.99,
      currency: "USD"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
        public_id: "plant-pots-1",
        alt: "Ceramic Plant Pot Set",
        isPrimary: true
      }
    ],
    stock: {
      quantity: 60,
      minOrder: 1,
      isAvailable: true
    },
    specifications: {
      dimensions: {
        length: 18,
        width: 18,
        height: 16,
        unit: "cm"
      },
      weight: {
        value: 2.8,
        unit: "kg"
      },
      color: "White",
      finish: "Matte ceramic"
    },
    features: [
      "Set of 3 different sizes",
      "Drainage holes",
      "Matching saucers",
      "Modern white finish",
      "Indoor/outdoor use"
    ],
    tags: ["ceramic", "plant", "pot", "garden", "white"],
    isActive: true,
    isFeatured: false,
    status: "published"
  }
];

async function seedFixedProducts() {
  try {
    console.log('🌱 Starting fixed production products seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const categories = await ProductCategory.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('📋 Found categories:', Object.keys(categoryMap));

    // Insert products
    const createdProducts = [];
    
    for (const productData of products) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ slug: productData.slug });
      
      if (existingProduct) {
        console.log(`⏭️ Product "${productData.slug}" already exists, skipping...`);
        createdProducts.push(existingProduct);
        continue;
      }

      // Find category
      const categoryId = categoryMap[productData.categorySlug];
      if (!categoryId) {
        console.log(`❌ Category "${productData.categorySlug}" not found for product "${productData.name.en}"`);
        continue;
      }

      // Prepare product data
      const productToCreate = {
        ...productData,
        category: categoryId
      };
      delete productToCreate.categorySlug;

      const product = new Product(productToCreate);
      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
      console.log(`✅ Created product: ${productData.name.en}`);
    }

    console.log(`🎉 Successfully seeded ${createdProducts.length} products!`);
    console.log('\n📋 Created products:');
    createdProducts.forEach(product => {
      console.log(`   - ${product.name.en} (${product.slug})`);
    });

    return createdProducts;

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedFixedProducts()
    .then(() => {
      console.log('✅ Fixed products seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fixed products seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedFixedProducts;
