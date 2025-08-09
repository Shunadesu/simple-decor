const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Master seed data - this should be the single source of truth for both FE and admin-cms
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
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1549465220-356e065b3ed8?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&h=400&fit=crop&q=80',
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
      url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=400&fit=crop&q=80',
      alt: 'Lighting Category'
    }
  }
];

const sampleProducts = [
  // Home Decor Category
  {
    name: {
      vi: 'Tranh treo tường minimalist',
      en: 'Minimalist Wall Art'
    },
    description: {
      vi: 'Tranh treo tường phong cách tối giản, phù hợp với mọi không gian hiện đại',
      en: 'Minimalist wall art perfect for modern living spaces'
    },
    category: 'home-decor', // Will be replaced with ObjectId
    material: 'Canvas & khung gỗ',
    price: {
      amount: 89.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 60,
        width: 40,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 1.2,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&h=600&fit=crop&q=80',
        alt: 'Minimalist Wall Art',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&h=600&fit=crop&q=80',
        alt: 'Wall Art Detail',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 25,
    tags: ['art', 'minimalist', 'modern', 'wall-decor']
  },
  {
    name: {
      vi: 'Lọ hoa gốm sứ',
      en: 'Ceramic Flower Vase'
    },
    description: {
      vi: 'Lọ hoa gốm sứ cao cấp, thiết kế tinh tế cho việc cắm hoa trang trí',
      en: 'Premium ceramic vase with elegant design for flower arrangements'
    },
    category: 'home-decor',
    material: 'Gốm sứ',
    price: {
      amount: 45.50,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 15,
        width: 15,
        height: 25,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop&q=80',
        alt: 'Ceramic Vase',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        alt: 'Vase with Flowers',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 15,
    tags: ['vase', 'ceramic', 'home-decor', 'flowers']
  },

  // Furniture Category
  {
    name: {
      vi: 'Bàn gỗ sồi tự nhiên',
      en: 'Natural Oak Dining Table'
    },
    description: {
      vi: 'Bàn ăn gỗ sồi tự nhiên, chắc chắn và bền đẹp theo thời gian',
      en: 'Solid natural oak dining table, durable and beautiful over time'
    },
    category: 'furniture',
    material: 'Gỗ sồi tự nhiên',
    price: {
      amount: 599.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 180,
        width: 90,
        height: 75,
        unit: 'cm'
      },
      weight: {
        value: 45,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        alt: 'Oak Dining Table',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80',
        alt: 'Table Detail',
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop&q=80',
        alt: 'Table in Room',
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop&q=80',
        alt: 'Table Surface Texture',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 8,
    tags: ['furniture', 'dining', 'oak', 'natural']
  },
  {
    name: {
      vi: 'Ghế gỗ ergonomic',
      en: 'Ergonomic Wooden Chair'
    },
    description: {
      vi: 'Ghế gỗ thiết kế ergonomic, thoải mái cho việc làm việc lâu dài',
      en: 'Ergonomic wooden chair, comfortable for long working hours'
    },
    category: 'furniture',
    material: 'Gỗ beech và đệm vải',
    price: {
      amount: 189.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 60,
        width: 60,
        height: 85,
        unit: 'cm'
      },
      weight: {
        value: 12,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        alt: 'Ergonomic Wooden Chair',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop&q=80',
        alt: 'Chair Detail',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 20,
    tags: ['chair', 'ergonomic', 'office', 'comfort']
  },
  {
    name: {
      vi: 'Kệ sách gỗ thông',
      en: 'Pine Wood Bookshelf'
    },
    description: {
      vi: 'Kệ sách gỗ thông 5 tầng, thiết kế đơn giản và tiện dụng',
      en: '5-tier pine wood bookshelf with simple and practical design'
    },
    category: 'furniture',
    material: 'Gỗ thông',
    price: {
      amount: 129.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 80,
        width: 30,
        height: 180,
        unit: 'cm'
      },
      weight: {
        value: 25,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&q=80',
        alt: 'Pine Wood Bookshelf',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
        alt: 'Bookshelf with Books',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 12,
    tags: ['bookshelf', 'pine', 'storage', 'books']
  },

  // Kitchen & Dining Category  
  {
    name: {
      vi: 'Bộ dao nhà bếp Nhật Bản',
      en: 'Japanese Kitchen Knife Set'
    },
    description: {
      vi: 'Bộ dao nhà bếp chất lượng cao từ Nhật Bản, sắc bén và bền bỉ',
      en: 'High-quality Japanese kitchen knife set, sharp and durable'
    },
    category: 'kitchen-dining',
    material: 'Thép carbon Nhật Bản',
    price: {
      amount: 299.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 25,
        height: 5,
        unit: 'cm'
      },
      weight: {
        value: 1.5,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594736797933-d0eeb3995342?w=800&h=600&fit=crop&q=80',
        alt: 'Japanese Kitchen Knife Set',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1583394838403-6c2cd83d10ad?w=800&h=600&fit=crop&q=80',
        alt: 'Sharp Kitchen Knives',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 30,
    tags: ['knife', 'kitchen', 'japanese', 'cooking']
  },
  {
    name: {
      vi: 'Bộ chén bát gốm Bát Tràng',
      en: 'Bat Trang Ceramic Dinnerware Set'
    },
    description: {
      vi: 'Bộ chén bát gốm Bát Tràng truyền thống, tinh xảo và đẹp mắt',
      en: 'Traditional Bat Trang ceramic dinnerware set, exquisite and beautiful'
    },
    category: 'kitchen-dining',
    material: 'Gốm Bát Tràng',
    price: {
      amount: 89.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 25,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 3,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop&q=80',
        alt: 'Bat Trang Ceramic Dinnerware',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        alt: 'Beautiful Ceramic Bowls',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 18,
    tags: ['dinnerware', 'ceramic', 'traditional', 'vietnam']
  },

  // Fashion Accessories Category
  {
    name: {
      vi: 'Túi xách da thật handmade',
      en: 'Handmade Genuine Leather Bag'
    },
    description: {
      vi: 'Túi xách da thật được làm thủ công, thiết kế elegant và tinh tế',
      en: 'Handmade genuine leather bag with elegant and sophisticated design'
    },
    category: 'fashion-accessories',
    material: 'Da thật',
    price: {
      amount: 159.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 12,
        height: 25,
        unit: 'cm'
      },
      weight: {
        value: 0.8,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80',
        alt: 'Handmade Leather Bag',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop&q=80',
        alt: 'Leather Bag Details',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 22,
    tags: ['bag', 'leather', 'handmade', 'fashion']
  },
  {
    name: {
      vi: 'Đồng hồ gỗ tre thủ công',
      en: 'Handcraft Bamboo Watch'
    },
    description: {
      vi: 'Đồng hồ làm từ gỗ tre tự nhiên, thân thiện với môi trường',
      en: 'Watch made from natural bamboo wood, environmentally friendly'
    },
    category: 'fashion-accessories',
    material: 'Gỗ tre tự nhiên',
    price: {
      amount: 79.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 4,
        width: 4,
        height: 1,
        unit: 'cm'
      },
      weight: {
        value: 0.1,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop&q=80',
        alt: 'Bamboo Wood Watch',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop&q=80',
        alt: 'Eco-friendly Watch',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 35,
    tags: ['watch', 'bamboo', 'eco-friendly', 'handcraft']
  },

  // Outdoor & Garden Category
  {
    name: {
      vi: 'Chậu cây composite chống thời tiết',
      en: 'Weather-Resistant Composite Planter'
    },
    description: {
      vi: 'Chậu cây composite chống thời tiết, bền đẹp cho sân vườn',
      en: 'Weather-resistant composite planter, durable and beautiful for gardens'
    },
    category: 'outdoor-garden',
    material: 'Composite chống thời tiết',
    price: {
      amount: 69.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 40,
        width: 40,
        height: 35,
        unit: 'cm'
      },
      weight: {
        value: 5,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
        alt: 'Weather-Resistant Planter',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1599582909646-2fa29b7b88a8?w=800&h=600&fit=crop&q=80',
        alt: 'Garden Planter with Plants',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 15,
    tags: ['planter', 'garden', 'weather-resistant', 'outdoor']
  },
  {
    name: {
      vi: 'Bộ dụng cụ làm vườn mini',
      en: 'Mini Garden Tool Set'
    },
    description: {
      vi: 'Bộ dụng cụ làm vườn mini tiện dụng cho việc chăm sóc cây cảnh',
      en: 'Convenient mini garden tool set for plant care'
    },
    category: 'outdoor-garden',
    material: 'Thép không gỉ và gỗ',
    price: {
      amount: 29.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 15,
        height: 3,
        unit: 'cm'
      },
      weight: {
        value: 0.5,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
        alt: 'Mini Garden Tool Set',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&h=600&fit=crop&q=80',
        alt: 'Gardening Tools',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 40,
    tags: ['tools', 'garden', 'mini', 'plant-care']
  },

  // Gift & Craft Category
  {
    name: {
      vi: 'Hộp quà handmade vintage',
      en: 'Vintage Handmade Gift Box'
    },
    description: {
      vi: 'Hộp quà handmade phong cách vintage, hoàn hảo cho các dịp đặc biệt',
      en: 'Vintage style handmade gift box, perfect for special occasions'
    },
    category: 'gift-craft',
    material: 'Giấy kraft và vải vintage',
    price: {
      amount: 19.99,
      currency: 'USD'
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
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&q=80',
        alt: 'Vintage Handmade Gift Box',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1549465220-356e065b3ed8?w=800&h=600&fit=crop&q=80',
        alt: 'Beautiful Gift Packaging',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 50,
    tags: ['gift-box', 'vintage', 'handmade', 'craft']
  },
  {
    name: {
      vi: 'Búp bê gỗ thủ công truyền thống',
      en: 'Traditional Wooden Handcraft Doll'
    },
    description: {
      vi: 'Búp bê gỗ thủ công truyền thống, tỉ mỉ trong từng chi tiết',
      en: 'Traditional wooden handcraft doll, meticulously detailed'
    },
    category: 'gift-craft',
    material: 'Gỗ tự nhiên',
    price: {
      amount: 35.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 8,
        width: 6,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 0.2,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&q=80',
        alt: 'Traditional Wooden Doll',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        alt: 'Handcraft Wooden Art',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 25,
    tags: ['doll', 'wooden', 'traditional', 'handcraft']
  },

  // Basket Category
  {
    name: {
      vi: 'Giỏ đan tre tự nhiên',
      en: 'Natural Bamboo Woven Basket'
    },
    description: {
      vi: 'Giỏ đan tre tự nhiên, thân thiện môi trường và bền đẹp',
      en: 'Natural bamboo woven basket, eco-friendly and durable'
    },
    category: 'basket',
    material: 'Tre tự nhiên',
    price: {
      amount: 24.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 30,
        width: 20,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 0.4,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
        alt: 'Natural Bamboo Basket',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop&q=80',
        alt: 'Woven Bamboo Storage',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 32,
    tags: ['basket', 'bamboo', 'natural', 'storage']
  },
  {
    name: {
      vi: 'Túi vải canvas đa năng',
      en: 'Multi-Purpose Canvas Bag'
    },
    description: {
      vi: 'Túi vải canvas đa năng, bền chắc và thời trang',
      en: 'Multi-purpose canvas bag, durable and fashionable'
    },
    category: 'basket',
    material: 'Vải canvas',
    price: {
      amount: 18.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 35,
        width: 10,
        height: 30,
        unit: 'cm'
      },
      weight: {
        value: 0.3,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80',
        alt: 'Multi-Purpose Canvas Bag',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop&q=80',
        alt: 'Durable Canvas Tote',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 45,
    tags: ['bag', 'canvas', 'multi-purpose', 'eco-friendly']
  },

  // Lighting Category
  {
    name: {
      vi: 'Đèn bàn vintage',
      en: 'Vintage Desk Lamp'
    },
    description: {
      vi: 'Đèn bàn phong cách vintage, mang đến ánh sáng ấm áp và cổ điển',
      en: 'Vintage style desk lamp providing warm and classic lighting'
    },
    category: 'lighting',
    material: 'Kim loại và gỗ',
    price: {
      amount: 75.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 25,
        width: 25,
        height: 45,
        unit: 'cm'
      },
      weight: {
        value: 2,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
        alt: 'Vintage Desk Lamp',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&q=80',
        alt: 'Classic Lighting',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 18,
    tags: ['lamp', 'vintage', 'desk', 'lighting']
  },
  {
    name: {
      vi: 'Đèn LED thông minh RGB',
      en: 'Smart RGB LED Light'
    },
    description: {
      vi: 'Đèn LED thông minh RGB có thể điều khiển qua app, đa dạng màu sắc',
      en: 'Smart RGB LED light controllable via app with various colors'
    },
    category: 'lighting',
    material: 'Nhựa và LED',
    price: {
      amount: 49.99,
      currency: 'USD'
    },
    specifications: {
      dimensions: {
        length: 15,
        width: 15,
        height: 8,
        unit: 'cm'
      },
      weight: {
        value: 0.5,
        unit: 'kg'
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
        alt: 'Smart RGB LED Light',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
        alt: 'Modern LED Lighting',
        isPrimary: false
      }
    ],
    status: 'published',
    isActive: true,
    isFeatured: true,
    stock: 28,
    tags: ['led', 'smart', 'rgb', 'app-controlled']
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simpledecor');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing products and categories...');
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create categories first
    console.log('📂 Creating categories...');
    const createdCategories = await ProductCategory.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category slugs to ObjectIds
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.slug] = category._id;
    });

    // Update products with correct category ObjectIds
    const productsWithCategoryIds = sampleProducts.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`📂 Categories: ${createdCategories.length}`);
    console.log(`📦 Products: ${createdProducts.length}`);
    console.log(`⭐ Featured Products: ${createdProducts.filter(p => p.isFeatured).length}`);

    // Display categories
    console.log('\n📂 Categories created:');
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name.vi} (${category.name.en}) - ID: ${category._id}`);
    });

    // Display products  
    console.log('\n📦 Products created:');
    createdProducts.forEach((product, index) => {
      const categoryName = createdCategories.find(c => c._id.equals(product.category))?.name.vi || 'Unknown';
      console.log(`${index + 1}. ${product.name.vi} - Category: ${categoryName} - Featured: ${product.isFeatured} - ID: ${product._id}`);
    });

    console.log(`\n⭐ Featured Products Summary: ${createdProducts.filter(p => p.isFeatured).length}/${createdProducts.length} products are featured`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
