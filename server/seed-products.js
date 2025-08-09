const mongoose = require('mongoose');
const Product = require('./models/Product');
const ProductCategory = require('./models/ProductCategory');
require('dotenv').config();

const sampleProducts = [
  {
    name: {
      en: 'Storage Basket Large',
      vi: 'Giỏ đựng đồ lớn'
    },
    description: {
      en: 'Large storage basket for household items, perfect for organizing your home',
      vi: 'Giỏ đựng đồ lớn cho vật dụng gia đình, hoàn hảo để tổ chức ngôi nhà của bạn'
    },
    category: 'storage-baskets',
    material: 'Rattan tự nhiên',
    price: {
      amount: 15.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 40,
        width: 30,
        height: 25,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      }
    },
    moisture: '< 12%',
    packaging: 'Carton box',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Storage Basket Large',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 100,
      minOrder: 1,
      maxOrder: 50,
      isAvailable: true
    },
    keywords: ['storage', 'basket', 'home', 'organization'],
    tags: ['new', 'popular', 'eco-friendly'],
    status: 'published',
    isFeatured: true,
    isActive: true
  },
  {
    name: {
      en: 'Decorative Wall Basket',
      vi: 'Giỏ trang trí tường'
    },
    description: {
      en: 'Beautiful decorative wall basket, perfect for adding natural charm to your home',
      vi: 'Giỏ trang trí tường đẹp, hoàn hảo để thêm sự quyến rũ tự nhiên cho ngôi nhà của bạn'
    },
    category: 'decorative-items',
    material: 'Bamboo',
    price: {
      amount: 25.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 50,
        width: 20,
        height: 5,
        unit: 'cm'
      },
      weight: {
        value: 0.5,
        unit: 'kg'
      }
    },
    moisture: '< 10%',
    packaging: 'Bubble wrap + carton',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Decorative Wall Basket',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 50,
      minOrder: 1,
      maxOrder: 20,
      isAvailable: true
    },
    keywords: ['decorative', 'wall', 'basket', 'home', 'decoration'],
    tags: ['featured', 'decorative', 'wall'],
    status: 'published',
    isFeatured: true,
    isActive: true
  },
  {
    name: {
      en: 'Kitchen Storage Basket',
      vi: 'Giỏ lưu trữ nhà bếp'
    },
    description: {
      en: 'Practical kitchen storage basket for organizing kitchen items',
      vi: 'Giỏ lưu trữ nhà bếp thực tế để tổ chức các vật dụng nhà bếp'
    },
    category: 'kitchen-ware',
    material: 'Rattan + metal',
    price: {
      amount: 18.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 25,
        height: 20,
        unit: 'cm'
      },
      weight: {
        value: 1.2,
        unit: 'kg'
      }
    },
    moisture: '< 12%',
    packaging: 'Carton box',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Kitchen Storage Basket',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 75,
      minOrder: 1,
      maxOrder: 30,
      isAvailable: true
    },
    keywords: ['kitchen', 'storage', 'basket', 'organization'],
    tags: ['kitchen', 'storage', 'practical'],
    status: 'published',
    isFeatured: true,
    isActive: true
  },
  {
    name: {
      en: 'Coffee Table Basket',
      vi: 'Giỏ bàn cà phê'
    },
    description: {
      en: 'Elegant coffee table basket for living room decoration',
      vi: 'Giỏ bàn cà phê thanh lịch để trang trí phòng khách'
    },
    category: 'furniture',
    material: 'Rattan tự nhiên',
    price: {
      amount: 32.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 60,
        width: 40,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 1.5,
        unit: 'kg'
      }
    },
    moisture: '< 12%',
    packaging: 'Carton box',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Coffee Table Basket',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 30,
      minOrder: 1,
      maxOrder: 10,
      isAvailable: true
    },
    keywords: ['coffee', 'table', 'basket', 'furniture', 'living room'],
    tags: ['furniture', 'coffee table', 'elegant'],
    status: 'published',
    isFeatured: true,
    isActive: true
  },
  {
    name: {
      en: 'Small Storage Basket',
      vi: 'Giỏ đựng đồ nhỏ'
    },
    description: {
      en: 'Small storage basket for organizing small items',
      vi: 'Giỏ đựng đồ nhỏ để tổ chức các vật dụng nhỏ'
    },
    category: 'storage-baskets',
    material: 'Rattan tự nhiên',
    price: {
      amount: 12.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 20,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 0.4,
        unit: 'kg'
      }
    },
    moisture: '< 12%',
    packaging: 'Carton box',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Small Storage Basket',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 150,
      minOrder: 1,
      maxOrder: 100,
      isAvailable: true
    },
    keywords: ['small', 'storage', 'basket', 'organization'],
    tags: ['small', 'storage', 'popular'],
    status: 'published',
    isFeatured: false,
    isActive: true
  },
  {
    name: {
      en: 'Decorative Vase',
      vi: 'Bình hoa trang trí'
    },
    description: {
      en: 'Beautiful decorative vase for your home',
      vi: 'Bình hoa trang trí đẹp cho ngôi nhà của bạn'
    },
    category: 'decorative-items',
    material: 'Ceramic',
    price: {
      amount: 28.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 20,
        width: 20,
        height: 30,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      }
    },
    moisture: '< 8%',
    packaging: 'Bubble wrap + carton',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Decorative Vase',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 40,
      minOrder: 1,
      maxOrder: 15,
      isAvailable: true
    },
    keywords: ['decorative', 'vase', 'home', 'decoration'],
    tags: ['decorative', 'vase', 'elegant'],
    status: 'published',
    isFeatured: false,
    isActive: true
  }
];

async function seedProducts() {
  try {
    console.log('Starting product seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get category references
    const categories = await ProductCategory.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    console.log('Found categories:', Object.keys(categoryMap));
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const categoryId = categoryMap[productData.category];
      if (!categoryId) {
        console.log(`Category not found: ${productData.category}`);
        continue;
      }
      
      const product = new Product({
        ...productData,
        category: categoryId
      });
      
      await product.save();
      createdProducts.push(product);
      console.log(`Created product: ${product.name.en}`);
    }
    
    console.log(`\nSeeding completed! Created ${createdProducts.length} products`);
    
    // Verify featured products
    const featuredProducts = await Product.find({ isFeatured: true, status: 'published' });
    console.log(`\nFeatured products: ${featuredProducts.length}`);
    featuredProducts.forEach(product => {
      console.log(`- ${product.name.en} (${product.category})`);
    });
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts }; 