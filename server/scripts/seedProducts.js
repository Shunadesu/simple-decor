const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Sample categories data
const sampleCategories = [
  {
    name: {
      vi: 'Đồ nội thất gỗ',
      en: 'Wooden Furniture'
    },
    description: {
      vi: 'Các sản phẩm nội thất làm từ gỗ tự nhiên',
      en: 'Furniture made from natural wood'
    },
    slug: 'wooden-furniture',
    isActive: true
  },
  {
    name: {
      vi: 'Phụ kiện trang trí',
      en: 'Decorative Accessories'
    },
    description: {
      vi: 'Các phụ kiện trang trí nhà cửa',
      en: 'Home decorative accessories'
    },
    slug: 'decorative-accessories',
    isActive: true
  },
  {
    name: {
      vi: 'Đèn trang trí',
      en: 'Decorative Lighting'
    },
    description: {
      vi: 'Đèn trang trí cho không gian sống',
      en: 'Decorative lighting for living spaces'
    },
    slug: 'decorative-lighting',
    isActive: true
  }
];

// Sample products data
const sampleProducts = [
  {
    name: {
      vi: 'Bàn gỗ sồi tự nhiên',
      en: 'Natural Oak Table'
    },
    description: {
      vi: 'Bàn làm việc được làm từ gỗ sồi tự nhiên, thiết kế tối giản và hiện đại. Phù hợp cho văn phòng hoặc phòng học tại nhà.',
      en: 'Work desk made from natural oak wood with minimalist and modern design. Perfect for office or home study room.'
    },
    material: 'Gỗ sồi tự nhiên',
    price: {
      amount: 2500000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn gỗ sồi tự nhiên - góc chính',
        isPrimary: true
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn gỗ sồi tự nhiên - góc cạnh',
        isPrimary: false
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn gỗ sồi tự nhiên - chi tiết gỗ',
        isPrimary: false
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn gỗ sồi tự nhiên - không gian sử dụng',
        isPrimary: false
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 15
    },
    specifications: {
      dimensions: {
        length: 120,
        width: 60,
        height: 75,
        unit: 'cm'
      },
      weight: {
        value: 25,
        unit: 'kg'
      },
      color: 'Nâu gỗ tự nhiên'
    },
    moisture: '< 8%',
    packaging: 'Thùng carton chống sốc',
    status: 'published',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Ghế gỗ ergonomic',
      en: 'Ergonomic Wooden Chair'
    },
    description: {
      vi: 'Ghế làm việc ergonomic với thiết kế ôm lưng, được làm từ gỗ cao cấp. Đảm bảo sự thoải mái khi làm việc lâu.',
      en: 'Ergonomic work chair with back-supporting design, made from premium wood. Ensures comfort during long working hours.'
    },
    material: 'Gỗ cao su',
    price: {
      amount: 1800000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Ghế gỗ ergonomic',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 20
    },
    specifications: {
      dimensions: {
        length: 60,
        width: 60,
        height: 95,
        unit: 'cm'
      },
      weight: {
        value: 12,
        unit: 'kg'
      },
      color: 'Nâu đậm'
    },
    moisture: '< 10%',
    packaging: 'Thùng carton eco-friendly',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Đèn bàn vintage',
      en: 'Vintage Table Lamp'
    },
    description: {
      vi: 'Đèn bàn phong cách vintage với chân đế bằng gỗ và chụp đèn vải. Tạo không gian ấm cúng và lãng mạn.',
      en: 'Vintage style table lamp with wooden base and fabric lampshade. Creates cozy and romantic atmosphere.'
    },
    material: 'Gỗ + Vải',
    price: {
      amount: 650000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Đèn bàn vintage',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 30
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 25,
        height: 40,
        unit: 'cm'
      },
      weight: {
        value: 2,
        unit: 'kg'
      },
      color: 'Nâu + Trắng kem'
    },
    moisture: '< 5%',
    packaging: 'Hộp foam bảo vệ',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Kệ sách gỗ thông',
      en: 'Pine Wood Bookshelf'
    },
    description: {
      vi: 'Kệ sách 5 tầng làm từ gỗ thông tự nhiên. Thiết kế đơn giản, chắc chắn, phù hợp với mọi không gian.',
      en: '5-tier bookshelf made from natural pine wood. Simple, sturdy design suitable for any space.'
    },
    material: 'Gỗ thông tự nhiên',
    price: {
      amount: 1200000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Kệ sách gỗ thông',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 12
    },
    specifications: {
      dimensions: {
        length: 80,
        width: 30,
        height: 180,
        unit: 'cm'
      },
      weight: {
        value: 18,
        unit: 'kg'
      },
      color: 'Vàng gỗ tự nhiên'
    },
    moisture: '< 12%',
    packaging: 'Đóng gói tháo rời',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Lọ hoa gốm sứ',
      en: 'Ceramic Flower Vase'
    },
    description: {
      vi: 'Lọ hoa được làm thủ công từ gốm sứ cao cấp. Kiểu dáng thanh lịch, phù hợp trang trí bàn làm việc hoặc phòng khách.',
      en: 'Handcrafted flower vase made from premium ceramic. Elegant design suitable for desk or living room decoration.'
    },
    material: 'Gốm sứ cao cấp',
    price: {
      amount: 350000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Lọ hoa gốm sứ',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 25
    },
    specifications: {
      dimensions: {
        length: 15,
        width: 15,
        height: 25,
        unit: 'cm'
      },
      weight: {
        value: 1.5,
        unit: 'kg'
      },
      color: 'Trắng ngà'
    },
    moisture: '< 3%',
    packaging: 'Bọc bubble wrap an toàn',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Tranh treo tường minimalist',
      en: 'Minimalist Wall Art'
    },
    description: {
      vi: 'Bộ tranh treo tường phong cách minimalist, in trên canvas cao cấp. Mang lại cảm giác hiện đại và tinh tế cho không gian.',
      en: 'Minimalist style wall art set, printed on premium canvas. Brings modern and sophisticated feel to your space.'
    },
    material: 'Canvas + Khung gỗ',
    price: {
      amount: 480000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Tranh treo tường minimalist',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: false,
      quantity: 0
    },
    specifications: {
      dimensions: {
        length: 40,
        width: 60,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 2,
        unit: 'kg'
      },
      color: 'Đen trắng'
    },
    moisture: '< 2%',
    packaging: 'Hộp carton chuyên dụng',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Bàn làm việc cao cấp',
      en: 'Premium Work Desk'
    },
    description: {
      vi: 'Bàn làm việc cao cấp nhập khẩu từ châu Âu với thiết kế sang trọng và chất lượng vượt trội.',
      en: 'Premium work desk imported from Europe with luxury design and superior quality.'
    },
    material: 'Gỗ óc chó',
    price: {
      amount: 1299,
      currency: 'USD'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn làm việc cao cấp - góc chính',
        isPrimary: true
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn làm việc cao cấp - góc cạnh',
        isPrimary: false
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn làm việc cao cấp - chi tiết gỗ óc chó',
        isPrimary: false
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn làm việc cao cấp - ngăn kéo',
        isPrimary: false
      },
      {
        url: '/placeholder-product.svg',
        alt: 'Bàn làm việc cao cấp - trong phòng làm việc',
        isPrimary: false
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 5
    },
    specifications: {
      dimensions: {
        length: 140,
        width: 70,
        height: 80,
        unit: 'cm'
      },
      weight: {
        value: 35,
        unit: 'kg'
      },
      color: 'Nâu óc chó'
    },
    moisture: '< 6%',
    packaging: 'Thùng gỗ chuyên dụng',
    status: 'published',
    isActive: true,
    isFeatured: true
  },
  {
    name: {
      vi: 'Ghế da thật Italy',
      en: 'Genuine Italian Leather Chair'
    },
    description: {
      vi: 'Ghế da thật nhập khẩu từ Italy với chất lượng cao cấp và thiết kế tinh tế.',
      en: 'Genuine leather chair imported from Italy with premium quality and sophisticated design.'
    },
    material: 'Da thật + Khung thép',
    price: {
      amount: 899,
      currency: 'EUR'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Ghế da thật Italy',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 8
    },
    specifications: {
      dimensions: {
        length: 65,
        width: 65,
        height: 100,
        unit: 'cm'
      },
      weight: {
        value: 18,
        unit: 'kg'
      },
      color: 'Nâu da'
    },
    moisture: '< 3%',
    packaging: 'Hộp carton cao cấp',
    status: 'published',
    isActive: true,
    isFeatured: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-simpledecor');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
    console.log('Cleared existing products and categories');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await ProductCategory.insertMany(sampleCategories);
    console.log(`Created ${createdCategories.length} categories`);

    // Assign categories to products
    const productsWithCategories = sampleProducts.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id
    }));

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Products created:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name.vi} (ID: ${product._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
