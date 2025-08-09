const mongoose = require('mongoose');
const ProductCategory = require('../models/ProductCategory');
require('dotenv').config();

// Old categories data with full information and images
const oldCategories = [
  {
    name: {
      en: "Home Decor",
      vi: "Trang trí nhà"
    },
    slug: "home-decor",
    description: {
      en: "Beautiful home decoration items to transform your living space. From wall art to decorative accessories.",
      vi: "Các vật dụng trang trí nhà đẹp để biến đổi không gian sống. Từ tranh treo tường đến phụ kiện trang trí."
    },
    image: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      public_id: "home-decor-category",
      alt: "Home Decor Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 1,
    isActive: true,
    isFeatured: true,
    meta: {
      title: {
        en: "Home Decor - Decorative Items & Wall Art",
        vi: "Trang trí nhà - Đồ trang trí & Tranh treo tường"
      },
      description: {
        en: "Discover beautiful home decor items including wall art, vases, candles, and decorative accessories to enhance your living space.",
        vi: "Khám phá các vật dụng trang trí nhà đẹp bao gồm tranh treo tường, bình hoa, nến và phụ kiện trang trí để nâng cao không gian sống."
      },
      keywords: {
        en: "home decor, decoration, wall art, vases, candles, decorative accessories",
        vi: "trang trí nhà, đồ trang trí, tranh treo tường, bình hoa, nến, phụ kiện trang trí"
      }
    }
  },
  {
    name: {
      en: "Furniture",
      vi: "Nội thất"
    },
    slug: "furniture",
    description: {
      en: "Quality furniture pieces for every room. From chairs and tables to storage solutions and bedroom essentials.",
      vi: "Các món nội thất chất lượng cho mọi phòng. Từ ghế và bàn đến giải pháp lưu trữ và đồ dùng phòng ngủ."
    },
    image: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      public_id: "furniture-category",
      alt: "Furniture Category", 
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 2,
    isActive: true,
    isFeatured: true,
    meta: {
      title: {
        en: "Furniture - Chairs, Tables, Storage & More",
        vi: "Nội thất - Ghế, Bàn, Tủ & Nhiều hơn nữa"
      },
      description: {
        en: "Shop quality furniture including chairs, tables, storage solutions, and bedroom furniture for your home.",
        vi: "Mua sắm nội thất chất lượng bao gồm ghế, bàn, giải pháp lưu trữ và nội thất phòng ngủ cho ngôi nhà của bạn."
      },
      keywords: {
        en: "furniture, chairs, tables, storage, bedroom, living room, dining room",
        vi: "nội thất, ghế, bàn, tủ, phòng ngủ, phòng khách, phòng ăn"
      }
    }
  },
  {
    name: {
      en: "Kitchen & Dining",
      vi: "Nhà bếp & Phòng ăn"
    },
    slug: "kitchen-dining", 
    description: {
      en: "Essential kitchen and dining accessories. From cookware and utensils to tableware and storage containers.",
      vi: "Phụ kiện nhà bếp và phòng ăn thiết yếu. Từ đồ nấu ăn và dụng cụ đến đồ bàn ăn và hộp đựng."
    },
    image: {
      url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
      public_id: "kitchen-dining-category",
      alt: "Kitchen & Dining Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 3,
    isActive: true,
    isFeatured: true,
    meta: {
      title: {
        en: "Kitchen & Dining - Cookware, Tableware & Storage",
        vi: "Nhà bếp & Phòng ăn - Đồ nấu ăn, Đồ bàn ăn & Lưu trữ"
      },
      description: {
        en: "Complete kitchen and dining solutions including cookware, utensils, tableware, and storage containers.",
        vi: "Giải pháp nhà bếp và phòng ăn hoàn chỉnh bao gồm đồ nấu ăn, dụng cụ, đồ bàn ăn và hộp đựng."
      },
      keywords: {
        en: "kitchen, dining, cookware, utensils, tableware, storage, containers",
        vi: "nhà bếp, phòng ăn, đồ nấu ăn, dụng cụ, đồ bàn ăn, lưu trữ, hộp đựng"
      }
    }
  },
  {
    name: {
      en: "Fashion Accessories",
      vi: "Phụ kiện thời trang"
    },
    slug: "fashion-accessories",
    description: {
      en: "Stylish fashion accessories to complete your look. Bags, jewelry, scarves, and other trendy accessories.",
      vi: "Phụ kiện thời trang sành điệu để hoàn thiện vẻ ngoài. Túi xách, trang sức, khăn quàng và các phụ kiện thời thượng khác."
    },
    image: {
      url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
      public_id: "fashion-accessories-category",
      alt: "Fashion Accessories Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 4,
    isActive: true,
    isFeatured: false,
    meta: {
      title: {
        en: "Fashion Accessories - Bags, Jewelry & More",
        vi: "Phụ kiện thời trang - Túi, Trang sức & Nhiều hơn"
      },
      description: {
        en: "Trendy fashion accessories including bags, jewelry, scarves, and other stylish items to complement your outfit.",
        vi: "Phụ kiện thời trang thời thượng bao gồm túi, trang sức, khăn quàng và các vật dụng sành điệu khác để bổ sung cho trang phục."
      },
      keywords: {
        en: "fashion, accessories, bags, jewelry, scarves, style, trendy",
        vi: "thời trang, phụ kiện, túi, trang sức, khăn quàng, phong cách, thời thượng"
      }
    }
  },
  {
    name: {
      en: "Outdoor & Garden",
      vi: "Ngoài trời & Sân vườn"
    },
    slug: "outdoor-garden",
    description: {
      en: "Outdoor and garden essentials for your exterior spaces. Planters, garden tools, outdoor furniture, and decorative items.",
      vi: "Đồ dùng ngoài trời và sân vườn thiết yếu cho không gian bên ngoài. Chậu cây, dụng cụ làm vườn, nội thất ngoài trời và đồ trang trí."
    },
    image: {
      url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=600&fit=crop",
      public_id: "outdoor-garden-category",
      alt: "Outdoor & Garden Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 5,
    isActive: true,
    isFeatured: false,
    meta: {
      title: {
        en: "Outdoor & Garden - Planters, Tools & Outdoor Furniture",
        vi: "Ngoài trời & Sân vườn - Chậu cây, Dụng cụ & Nội thất ngoài trời"
      },
      description: {
        en: "Transform your outdoor space with planters, garden tools, outdoor furniture, and decorative garden accessories.",
        vi: "Biến đổi không gian ngoài trời với chậu cây, dụng cụ làm vườn, nội thất ngoài trời và phụ kiện trang trí sân vườn."
      },
      keywords: {
        en: "outdoor, garden, planters, tools, furniture, patio, landscaping",
        vi: "ngoài trời, sân vườn, chậu cây, dụng cụ, nội thất, hiên, cảnh quan"
      }
    }
  },
  {
    name: {
      en: "Gift & Craft",
      vi: "Quà tặng & Thủ công"
    },
    slug: "gift-craft",
    description: {
      en: "Unique gifts and handcrafted items. Perfect for special occasions, holidays, and artisanal craft lovers.",
      vi: "Quà tặng độc đáo và đồ thủ công. Hoàn hảo cho những dịp đặc biệt, ngày lễ và những người yêu thích thủ công mỹ nghệ."
    },
    image: {
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      public_id: "gift-craft-category",
      alt: "Gift & Craft Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 6,
    isActive: true,
    isFeatured: false,
    meta: {
      title: {
        en: "Gift & Craft - Unique Gifts & Handmade Items",
        vi: "Quà tặng & Thủ công - Quà tặng độc đáo & Đồ thủ công"
      },
      description: {
        en: "Discover unique gifts and handcrafted items perfect for any occasion. Artisanal crafts and special presents.",
        vi: "Khám phá quà tặng độc đáo và đồ thủ công hoàn hảo cho mọi dịp. Thủ công mỹ nghệ và quà tặng đặc biệt."
      },
      keywords: {
        en: "gifts, craft, handmade, artisanal, unique, special, occasions",
        vi: "quà tặng, thủ công, làm tay, mỹ nghệ, độc đáo, đặc biệt, dịp lễ"
      }
    }
  },
  {
    name: {
      en: "Basket",
      vi: "Giỏ"
    },
    slug: "basket",
    description: {
      en: "Handwoven baskets for storage and decoration. Various sizes and styles from traditional to modern designs.",
      vi: "Giỏ đan tay cho lưu trữ và trang trí. Nhiều kích cỡ và phong cách từ thiết kế truyền thống đến hiện đại."
    },
    image: {
      url: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=800&h=600&fit=crop",
      public_id: "basket-category",
      alt: "Basket Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 7,
    isActive: true,
    isFeatured: true,
    meta: {
      title: {
        en: "Baskets - Handwoven Storage & Decorative Baskets",
        vi: "Giỏ - Giỏ đan tay cho lưu trữ & trang trí"
      },
      description: {
        en: "Beautiful handwoven baskets for storage and decoration in various sizes and traditional to modern styles.",
        vi: "Giỏ đan tay đẹp cho lưu trữ và trang trí với nhiều kích cỡ và phong cách từ truyền thống đến hiện đại."
      },
      keywords: {
        en: "baskets, handwoven, storage, decoration, traditional, modern, organization",
        vi: "giỏ, đan tay, lưu trữ, trang trí, truyền thống, hiện đại, tổ chức"
      }
    }
  },
  {
    name: {
      en: "Lighting",
      vi: "Đèn chiếu sáng"
    },
    slug: "lighting",
    description: {
      en: "Indoor and outdoor lighting solutions. Table lamps, pendant lights, floor lamps, and decorative lighting fixtures.",
      vi: "Giải pháp chiếu sáng trong nhà và ngoài trời. Đèn bàn, đèn thả, đèn sàn và đồ gá đèn trang trí."
    },
    image: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      public_id: "lighting-category",
      alt: "Lighting Category",
      width: 800,
      height: 600,
      format: "jpg"
    },
    parent: null,
    level: 0,
    order: 8,
    isActive: true,
    isFeatured: false,
    meta: {
      title: {
        en: "Lighting - Table Lamps, Pendant Lights & More",
        vi: "Đèn chiếu sáng - Đèn bàn, Đèn thả & Nhiều hơn"
      },
      description: {
        en: "Illuminate your space with our lighting collection including table lamps, pendant lights, floor lamps, and decorative fixtures.",
        vi: "Thắp sáng không gian với bộ sưu tập đèn chiếu sáng bao gồm đèn bàn, đèn thả, đèn sàn và đồ gá đèn trang trí."
      },
      keywords: {
        en: "lighting, lamps, pendant, floor, table, decorative, fixtures, illuminate",
        vi: "đèn chiếu sáng, đèn, thả, sàn, bàn, trang trí, đồ gá, thắp sáng"
      }
    }
  }
];

async function recreateOldCategories() {
  try {
    console.log('🔄 Starting recreation of old categories with full information...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Step 1: Removing existing old categories...');
    
    // Get slugs of categories to recreate
    const slugsToRecreate = oldCategories.map(cat => cat.slug);
    console.log('📋 Categories to recreate:', slugsToRecreate);
    
    // Delete existing categories with these slugs
    const deleteResult = await ProductCategory.deleteMany({ 
      slug: { $in: slugsToRecreate } 
    });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing categories`);

    console.log('✨ Step 2: Creating categories with full information...');
    
    const createdCategories = [];
    
    for (const categoryData of oldCategories) {
      const category = new ProductCategory(categoryData);
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
      console.log(`✅ Created: ${categoryData.name.en} (${categoryData.slug}) - Order: ${categoryData.order}`);
    }

    console.log(`🎉 Successfully recreated ${createdCategories.length} categories!`);
    console.log('\n📋 Final categories list:');
    createdCategories.forEach(category => {
      const featured = category.isFeatured ? '⭐' : '  ';
      console.log(`   ${featured} ${category.name.en} (${category.slug}) - Order: ${category.order}`);
    });

    return createdCategories;

  } catch (error) {
    console.error('❌ Error recreating old categories:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  recreateOldCategories()
    .then(() => {
      console.log('✅ Old categories recreation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Old categories recreation failed:', error);
      process.exit(1);
    });
}

module.exports = recreateOldCategories;
