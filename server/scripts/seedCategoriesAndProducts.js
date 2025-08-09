const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Categories based on the image provided
const sampleCategories = [
  {
    name: {
      vi: 'Trang trí nội thất',
      en: 'Home Decor'
    },
    description: {
      vi: 'Các sản phẩm trang trí nội thất, phụ kiện trang trí nhà cửa',
      en: 'Home decoration products and interior accessories'
    },
    slug: 'home-decor',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Home Decor Category'
    }
  },
  {
    name: {
      vi: 'Nội thất',
      en: 'Furniture'
    },
    description: {
      vi: 'Đồ nội thất cho gia đình, văn phòng và không gian sống',
      en: 'Furniture for home, office and living spaces'
    },
    slug: 'furniture',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Furniture Category'
    }
  },
  {
    name: {
      vi: 'Nhà bếp & Phòng ăn',
      en: 'Kitchen & Dining'
    },
    description: {
      vi: 'Dụng cụ nhà bếp, đồ dùng phòng ăn và phụ kiện nấu nướng',
      en: 'Kitchen utensils, dining items and cooking accessories'
    },
    slug: 'kitchen-dining',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Kitchen & Dining Category'
    }
  },
  {
    name: {
      vi: 'Phụ kiện thời trang',
      en: 'Fashion Accessories'
    },
    description: {
      vi: 'Phụ kiện thời trang, túi xách, đồng hồ và trang sức',
      en: 'Fashion accessories, bags, watches and jewelry'
    },
    slug: 'fashion-accessories',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Fashion Accessories Category'
    }
  },
  {
    name: {
      vi: 'Ngoài trời & Sân vườn',
      en: 'Outdoor & Garden'
    },
    description: {
      vi: 'Đồ dùng ngoài trời, trang trí sân vườn và cây cảnh',
      en: 'Outdoor items, garden decoration and plants'
    },
    slug: 'outdoor-garden',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Outdoor & Garden Category'
    }
  },
  {
    name: {
      vi: 'Quà tặng & Thủ công',
      en: 'Gift & Craft'
    },
    description: {
      vi: 'Đồ quà tặng, sản phẩm thủ công và đồ handmade',
      en: 'Gifts, handicraft products and handmade items'
    },
    slug: 'gift-craft',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Gift & Craft Category'
    }
  },
  {
    name: {
      vi: 'Giỏ & Túi đựng',
      en: 'Basket'
    },
    description: {
      vi: 'Giỏ đựng đồ, túi vải và các sản phẩm lưu trữ',
      en: 'Storage baskets, fabric bags and storage products'
    },
    slug: 'basket',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Basket Category'
    }
  },
  {
    name: {
      vi: 'Đèn chiếu sáng',
      en: 'Lighting'
    },
    description: {
      vi: 'Đèn trang trí, đèn chiếu sáng và thiết bị ánh sáng',
      en: 'Decorative lights, lighting fixtures and illumination equipment'
    },
    slug: 'lighting',
    isActive: true,
    image: {
      url: '/placeholder-category.svg',
      alt: 'Lighting Category'
    }
  }
];

// Sample products for each category
const sampleProducts = [
  // Home Decor Products
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
      isAvailable: true,
      quantity: 25
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
    isFeatured: true,
    categorySlug: 'home-decor'
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
      quantity: 30
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
    isFeatured: true,
    categorySlug: 'home-decor'
  },
  
  // Furniture Products
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
    isActive: true,
    isFeatured: true,
    categorySlug: 'furniture'
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
    isFeatured: true,
    categorySlug: 'furniture'
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
    isFeatured: true,
    categorySlug: 'furniture'
  },

  // Kitchen & Dining Products
  {
    name: {
      vi: 'Bộ dao nhà bếp Nhật Bản',
      en: 'Japanese Kitchen Knife Set'
    },
    description: {
      vi: 'Bộ dao nhà bếp cao cấp nhập khẩu từ Nhật Bản. Lưỡi dao sắc bén, cán gỗ chống trượt.',
      en: 'Premium kitchen knife set imported from Japan. Sharp blades with anti-slip wooden handles.'
    },
    material: 'Thép không gỉ + Gỗ',
    price: {
      amount: 1850000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Bộ dao nhà bếp Nhật Bản',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 18
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 25,
        height: 5,
        unit: 'cm'
      },
      weight: {
        value: 1.8,
        unit: 'kg'
      },
      color: 'Bạc + Nâu gỗ'
    },
    moisture: '< 5%',
    packaging: 'Hộp gỗ cao cấp',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'kitchen-dining'
  },
  {
    name: {
      vi: 'Bộ chén bát gốm Bát Tràng',
      en: 'Bat Trang Ceramic Dinnerware Set'
    },
    description: {
      vi: 'Bộ chén bát gốm sứ truyền thống Bát Tràng. Họa tiết cổ điển, an toàn cho sức khỏe.',
      en: 'Traditional Bat Trang ceramic dinnerware set. Classic patterns, safe for health.'
    },
    material: 'Gốm sứ Bát Tràng',
    price: {
      amount: 750000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Bộ chén bát gốm Bát Tràng',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 22
    },
    specifications: {
      dimensions: {
        length: 30,
        width: 30,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 3.5,
        unit: 'kg'
      },
      color: 'Trắng xanh cổ điển'
    },
    moisture: '< 2%',
    packaging: 'Thùng carton chống vỡ',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'kitchen-dining'
  },

  // Fashion Accessories Products
  {
    name: {
      vi: 'Túi xách da thật handmade',
      en: 'Handmade Genuine Leather Bag'
    },
    description: {
      vi: 'Túi xách da thật được làm thủ công bởi nghệ nhân. Thiết kế sang trọng, bền đẹp theo thời gian.',
      en: 'Genuine leather bag handcrafted by artisans. Luxurious design that ages beautifully over time.'
    },
    material: 'Da thật cao cấp',
    price: {
      amount: 1250000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Túi xách da thật handmade',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 15
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 12,
        height: 28,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      },
      color: 'Nâu đậm'
    },
    moisture: '< 3%',
    packaging: 'Túi vải bảo vệ',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'fashion-accessories'
  },
  {
    name: {
      vi: 'Đồng hồ gỗ tre thủ công',
      en: 'Handcrafted Bamboo Watch'
    },
    description: {
      vi: 'Đồng hồ làm từ tre tự nhiên, thân thiện với môi trường. Phong cách unique và bền bỉ.',
      en: 'Watch made from natural bamboo, eco-friendly. Unique style and durable construction.'
    },
    material: 'Tre tự nhiên + Kim loại',
    price: {
      amount: 680000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Đồng hồ gỗ tre thủ công',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 28
    },
    specifications: {
      dimensions: {
        length: 4,
        width: 4,
        height: 1,
        unit: 'cm'
      },
      weight: {
        value: 0.05,
        unit: 'kg'
      },
      color: 'Vàng tre tự nhiên'
    },
    moisture: '< 8%',
    packaging: 'Hộp gỗ sang trọng',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'fashion-accessories'
  },

  // Outdoor & Garden Products
  {
    name: {
      vi: 'Chậu cây composite chống thời tiết',
      en: 'Weather-resistant Composite Planter'
    },
    description: {
      vi: 'Chậu cây composite cao cấp chống thời tiết, phù hợp cho sân vườn ngoài trời. Bền bỉ và đẹp mắt.',
      en: 'High-quality weather-resistant composite planter, perfect for outdoor gardens. Durable and attractive.'
    },
    material: 'Composite chống thời tiết',
    price: {
      amount: 950000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Chậu cây composite chống thời tiết',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 20
    },
    specifications: {
      dimensions: {
        length: 50,
        width: 50,
        height: 45,
        unit: 'cm'
      },
      weight: {
        value: 8,
        unit: 'kg'
      },
      color: 'Xám đậm'
    },
    moisture: '< 1%',
    packaging: 'Bọc bubble wrap',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'outdoor-garden'
  },
  {
    name: {
      vi: 'Bộ dụng cụ làm vườn mini',
      en: 'Mini Gardening Tool Set'
    },
    description: {
      vi: 'Bộ dụng cụ làm vườn nhỏ gọn cho ban công và không gian hẹp. Chất liệu inox bền bỉ.',
      en: 'Compact gardening tool set for balconies and small spaces. Durable stainless steel construction.'
    },
    material: 'Inox + Nhựa ABS',
    price: {
      amount: 320000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Bộ dụng cụ làm vườn mini',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 35
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 15,
        height: 8,
        unit: 'cm'
      },
      weight: {
        value: 0.6,
        unit: 'kg'
      },
      color: 'Bạc + Xanh lá'
    },
    moisture: '< 2%',
    packaging: 'Túi vải tiện dụng',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'outdoor-garden'
  },

  // Gift & Craft Products
  {
    name: {
      vi: 'Hộp quà handmade vintage',
      en: 'Vintage Handmade Gift Box'
    },
    description: {
      vi: 'Hộp quà được làm thủ công theo phong cách vintage. Phù hợp để đựng quà tặng đặc biệt.',
      en: 'Handcrafted gift box in vintage style. Perfect for storing special presents.'
    },
    material: 'Giấy kraft + Vải lanh',
    price: {
      amount: 180000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Hộp quà handmade vintage',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 40
    },
    specifications: {
      dimensions: {
        length: 20,
        width: 15,
        height: 8,
        unit: 'cm'
      },
      weight: {
        value: 0.3,
        unit: 'kg'
      },
      color: 'Nâu vintage'
    },
    moisture: '< 5%',
    packaging: 'Bọc giấy tissue',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'gift-craft'
  },
  {
    name: {
      vi: 'Búp bê gỗ thủ công truyền thống',
      en: 'Traditional Handcrafted Wooden Doll'
    },
    description: {
      vi: 'Búp bê gỗ được chế tác thủ công theo truyền thống Việt Nam. Sản phẩm độc đáo mang giá trị văn hóa.',
      en: 'Wooden doll handcrafted following Vietnamese traditions. Unique product with cultural value.'
    },
    material: 'Gỗ tự nhiên + Vải',
    price: {
      amount: 420000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Búp bê gỗ thủ công truyền thống',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 12
    },
    specifications: {
      dimensions: {
        length: 8,
        width: 6,
        height: 18,
        unit: 'cm'
      },
      weight: {
        value: 0.2,
        unit: 'kg'
      },
      color: 'Đa màu truyền thống'
    },
    moisture: '< 8%',
    packaging: 'Hộp gỗ nhỏ',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'gift-craft'
  },

  // Basket Products
  {
    name: {
      vi: 'Giỏ đan tre tự nhiên',
      en: 'Natural Bamboo Woven Basket'
    },
    description: {
      vi: 'Giỏ được đan thủ công từ tre tự nhiên. Thân thiện môi trường, bền đẹp và tiện dụng.',
      en: 'Basket handwoven from natural bamboo. Eco-friendly, durable and practical.'
    },
    material: 'Tre tự nhiên',
    price: {
      amount: 280000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Giỏ đan tre tự nhiên',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 30
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 25,
        height: 20,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      },
      color: 'Vàng tre tự nhiên'
    },
    moisture: '< 12%',
    packaging: 'Bọc giấy bảo vệ',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'basket'
  },
  {
    name: {
      vi: 'Túi vải canvas đa năng',
      en: 'Multi-purpose Canvas Tote Bag'
    },
    description: {
      vi: 'Túi vải canvas bền chắc, có thể sử dụng đa năng. Thân thiện môi trường thay thế túi nhựa.',
      en: 'Durable canvas tote bag for multi-purpose use. Eco-friendly alternative to plastic bags.'
    },
    material: 'Vải canvas cotton',
    price: {
      amount: 120000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Túi vải canvas đa năng',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 50
    },
    specifications: {
      dimensions: {
        length: 40,
        width: 35,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 0.3,
        unit: 'kg'
      },
      color: 'Be tự nhiên'
    },
    moisture: '< 5%',
    packaging: 'Gấp gọn trong túi nhỏ',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'basket'
  },

  // Lighting Products
  {
    name: {
      vi: 'Đèn bàn vintage',
      en: 'Vintage Table Lamp'
    },
    description: {
      vi: 'Đèn bàn phong cách vintage với chân đế bằng gỗ và chụp đèn vải. Tạo không gian ấm cúng và lãng mạn.',
      en: 'Vintage style table lamp with wooden base and fabric lampshade. Creates cozy and romantic atmosphere.'
    },
    material: 'Gỗ + Vải + Kim loại',
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
      quantity: 25
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
    isFeatured: true,
    categorySlug: 'lighting'
  },
  {
    name: {
      vi: 'Đèn LED thông minh RGB',
      en: 'Smart RGB LED Light'
    },
    description: {
      vi: 'Đèn LED thông minh có thể thay đổi màu sắc qua ứng dụng di động. Tiết kiệm năng lượng và hiện đại.',
      en: 'Smart LED light with color-changing capability via mobile app. Energy-efficient and modern.'
    },
    material: 'Nhựa ABS + LED',
    price: {
      amount: 450000,
      currency: 'VND'
    },
    images: [
      {
        url: '/placeholder-product.svg',
        alt: 'Đèn LED thông minh RGB',
        isPrimary: true
      }
    ],
    stock: {
      isAvailable: true,
      quantity: 40
    },
    specifications: {
      dimensions: {
        length: 12,
        width: 12,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 0.5,
        unit: 'kg'
      },
      color: 'Đa màu RGB'
    },
    moisture: '< 1%',
    packaging: 'Hộp carton kèm sách hướng dẫn',
    status: 'published',
    isActive: true,
    isFeatured: true,
    categorySlug: 'lighting'
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

    // Create a mapping of category slug to category ID
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.slug] = category._id;
    });

    // Assign categories to products based on categorySlug
    const productsWithCategories = sampleProducts.map(product => {
      const { categorySlug, ...productData } = product;
      return {
        ...productData,
        category: categoryMap[categorySlug]
      };
    });

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    
    console.log('\nCategories created:');
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name.vi} (${category.name.en}) - ID: ${category._id}`);
    });

    console.log('\nProducts created:');
    createdProducts.forEach((product, index) => {
      const category = createdCategories.find(cat => cat._id.equals(product.category));
      console.log(`${index + 1}. ${product.name.vi} - Category: ${category.name.vi} - Featured: ${product.isFeatured} - ID: ${product._id}`);
    });

    // Count featured products
    const featuredCount = createdProducts.filter(p => p.isFeatured).length;
    console.log(`\n📊 Summary: ${featuredCount}/${createdProducts.length} products are featured`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
