const mongoose = require('mongoose');
const Service = require('../models/Service');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-simpledecor');
    console.log('MongoDB connected for services seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleServices = [
  {
    title: {
      en: 'Product Design Consultation',
      vi: 'Tư Vấn Thiết Kế Sản Phẩm'
    },
    description: {
      en: 'Professional consultation for custom product design and material selection. Our experienced team helps you create products that meet your specific requirements and market demands.',
      vi: 'Tư vấn chuyên nghiệp về thiết kế sản phẩm tùy chỉnh và lựa chọn vật liệu. Đội ngũ có kinh nghiệm của chúng tôi giúp bạn tạo ra những sản phẩm đáp ứng yêu cầu cụ thể và nhu cầu thị trường.'
    },
    shortDescription: {
      en: 'Expert guidance for custom product design and material selection',
      vi: 'Hướng dẫn chuyên gia về thiết kế sản phẩm tùy chỉnh và lựa chọn vật liệu'
    },
    category: 'consultation',
    icon: 'Users',
    price: 'contact',
    priceDetails: {
      en: 'Starting from $500 per project',
      vi: 'Bắt đầu từ 12,000,000 VND mỗi dự án'
    },
    duration: '1-2 weeks',
    features: [
      { en: 'Material analysis and selection', vi: 'Phân tích và lựa chọn vật liệu' },
      { en: 'Design optimization', vi: 'Tối ưu hóa thiết kế' },
      { en: 'Cost-effective solutions', vi: 'Giải pháp tiết kiệm chi phí' },
      { en: '3D modeling and prototyping', vi: 'Mô hình 3D và tạo mẫu thử' }
    ],
    benefits: [
      { en: 'Reduced development time', vi: 'Giảm thời gian phát triển' },
      { en: 'Optimized material costs', vi: 'Tối ưu chi phí vật liệu' },
      { en: 'Professional design quality', vi: 'Chất lượng thiết kế chuyên nghiệp' }
    ],
    requirements: [
      { en: 'Product specifications document', vi: 'Tài liệu đặc tả sản phẩm' },
      { en: 'Target market information', vi: 'Thông tin thị trường mục tiêu' }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 1
  },
  {
    title: {
      en: 'Weekly Price Quotations',
      vi: 'Báo Giá Hàng Tuần'
    },
    description: {
      en: 'Regular updated price quotations for new products and market changes. Stay informed about the latest pricing trends and opportunities in the market.',
      vi: 'Báo giá cập nhật thường xuyên cho sản phẩm mới và thay đổi thị trường. Luôn được thông báo về xu hướng giá cả và cơ hội mới nhất trên thị trường.'
    },
    shortDescription: {
      en: 'Weekly updated pricing information and market analysis',
      vi: 'Thông tin giá cả và phân tích thị trường được cập nhật hàng tuần'
    },
    category: 'documentation',
    icon: 'FileText',
    price: 'included',
    priceDetails: {
      en: 'Included in partnership package',
      vi: 'Bao gồm trong gói đối tác'
    },
    duration: 'Ongoing',
    features: [
      { en: 'Weekly price updates', vi: 'Cập nhật giá hàng tuần' },
      { en: 'Market trend analysis', vi: 'Phân tích xu hướng thị trường' },
      { en: 'Competitor pricing insights', vi: 'Thông tin giá đối thủ cạnh tranh' },
      { en: 'Custom product quotes', vi: 'Báo giá sản phẩm tùy chỉnh' }
    ],
    benefits: [
      { en: 'Stay competitive in pricing', vi: 'Duy trì tính cạnh tranh về giá' },
      { en: 'Better negotiation power', vi: 'Sức mạnh đàm phán tốt hơn' },
      { en: 'Market insights', vi: 'Hiểu biết thị trường' }
    ],
    requirements: [
      { en: 'Active partnership agreement', vi: 'Thỏa thuận đối tác hiệu lực' }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 2
  },
  {
    title: {
      en: 'Export Documentation Support',
      vi: 'Hỗ Trợ Hồ Sơ Xuất Khẩu'
    },
    description: {
      en: 'Complete export documentation and customs procedures support for all orders. We handle all the paperwork to ensure smooth international shipping.',
      vi: 'Hỗ trợ hoàn chỉnh hồ sơ xuất khẩu và thủ tục hải quan cho mọi đơn hàng. Chúng tôi xử lý tất cả giấy tờ để đảm bảo vận chuyển quốc tế suôn sẻ.'
    },
    shortDescription: {
      en: 'Complete export paperwork and customs support',
      vi: 'Hỗ trợ hoàn chỉnh giấy tờ xuất khẩu và hải quan'
    },
    category: 'export',
    icon: 'FileText',
    price: 'included',
    priceDetails: {
      en: 'Included with all export orders',
      vi: 'Bao gồm với tất cả đơn hàng xuất khẩu'
    },
    duration: '3-5 business days',
    features: [
      { en: 'Export certificates', vi: 'Giấy chứng nhận xuất khẩu' },
      { en: 'Customs clearance', vi: 'Thông quan hải quan' },
      { en: 'Required permits', vi: 'Giấy phép cần thiết' },
      { en: 'Origin certificates', vi: 'Giấy chứng nhận xuất xứ' }
    ],
    benefits: [
      { en: 'Faster customs clearance', vi: 'Thông quan nhanh hơn' },
      { en: 'Reduced shipping delays', vi: 'Giảm chậm trễ vận chuyển' },
      { en: 'Compliance assurance', vi: 'Đảm bảo tuân thủ' }
    ],
    requirements: [
      { en: 'Confirmed export order', vi: 'Đơn hàng xuất khẩu được xác nhận' },
      { en: 'Destination country details', vi: 'Chi tiết nước đích' }
    ],
    isFeatured: false,
    isActive: true,
    displayOrder: 3
  },
  {
    title: {
      en: 'International Shipping & Logistics',
      vi: 'Vận Chuyển & Logistics Quốc Tế'
    },
    description: {
      en: 'Professional shipping and logistics services with optimal cost and delivery time. We manage the entire logistics chain from warehouse to destination.',
      vi: 'Dịch vụ vận chuyển và logistics chuyên nghiệp với chi phí và thời gian giao hàng tối ưu. Chúng tôi quản lý toàn bộ chuỗi logistics từ kho đến điểm đến.'
    },
    shortDescription: {
      en: 'End-to-end shipping and logistics management',
      vi: 'Quản lý vận chuyển và logistics từ đầu đến cuối'
    },
    category: 'logistics',
    icon: 'Ship',
    price: 'negotiable',
    priceDetails: {
      en: 'Based on volume and destination',
      vi: 'Dựa trên khối lượng và điểm đến'
    },
    duration: '2-6 weeks',
    features: [
      { en: 'Sea and air freight', vi: 'Vận chuyển đường biển và hàng không' },
      { en: 'Container booking', vi: 'Đặt chỗ container' },
      { en: 'Cargo tracking', vi: 'Theo dõi hàng hóa' },
      { en: 'Insurance options', vi: 'Tùy chọn bảo hiểm' }
    ],
    benefits: [
      { en: 'Cost-effective shipping', vi: 'Vận chuyển tiết kiệm chi phí' },
      { en: 'Reliable delivery', vi: 'Giao hàng đáng tin cậy' },
      { en: 'Real-time tracking', vi: 'Theo dõi thời gian thực' }
    ],
    requirements: [
      { en: 'Shipping address confirmation', vi: 'Xác nhận địa chỉ giao hàng' },
      { en: 'Cargo details and weight', vi: 'Chi tiết và trọng lượng hàng hóa' }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 4
  },
  {
    title: {
      en: 'Quality Control & Inspection',
      vi: 'Kiểm Soát & Kiểm Tra Chất Lượng'
    },
    description: {
      en: 'Comprehensive quality control and production monitoring to ensure product standards. Our QC team ensures every product meets international quality standards.',
      vi: 'Kiểm soát chất lượng toàn diện và giám sát sản xuất để đảm bảo tiêu chuẩn sản phẩm. Đội ngũ QC của chúng tôi đảm bảo mọi sản phẩm đều đạt tiêu chuẩn chất lượng quốc tế.'
    },
    shortDescription: {
      en: 'Professional quality assurance and inspection services',
      vi: 'Dịch vụ đảm bảo chất lượng và kiểm tra chuyên nghiệp'
    },
    category: 'quality',
    icon: 'Shield',
    price: 'contact',
    priceDetails: {
      en: '2-5% of order value',
      vi: '2-5% giá trị đơn hàng'
    },
    duration: '1-3 days per batch',
    features: [
      { en: 'Pre-production inspection', vi: 'Kiểm tra trước sản xuất' },
      { en: 'In-line production monitoring', vi: 'Giám sát sản xuất trực tuyến' },
      { en: 'Final quality inspection', vi: 'Kiểm tra chất lượng cuối cùng' },
      { en: 'Detailed QC reports', vi: 'Báo cáo QC chi tiết' }
    ],
    benefits: [
      { en: 'Guaranteed product quality', vi: 'Chất lượng sản phẩm được đảm bảo' },
      { en: 'Reduced defect rates', vi: 'Giảm tỷ lệ lỗi' },
      { en: 'Customer satisfaction', vi: 'Sự hài lòng của khách hàng' }
    ],
    requirements: [
      { en: 'Quality standards specification', vi: 'Đặc tả tiêu chuẩn chất lượng' },
      { en: 'Access to production facility', vi: 'Truy cập cơ sở sản xuất' }
    ],
    isFeatured: false,
    isActive: true,
    displayOrder: 5
  },
  {
    title: {
      en: 'After-Sales Support & Warranty',
      vi: 'Hỗ Trợ Sau Bán Hàng & Bảo Hành'
    },
    description: {
      en: 'Comprehensive after-sales support and product warranty services. We provide ongoing technical support and maintenance for all our products.',
      vi: 'Dịch vụ hỗ trợ sau bán hàng và bảo hành sản phẩm toàn diện. Chúng tôi cung cấp hỗ trợ kỹ thuật và bảo trì liên tục cho tất cả sản phẩm của chúng tôi.'
    },
    shortDescription: {
      en: 'Complete after-sales support and warranty coverage',
      vi: 'Hỗ trợ sau bán hàng và bảo hành toàn diện'
    },
    category: 'support',
    icon: 'Headphones',
    price: 'included',
    priceDetails: {
      en: '12-month warranty included',
      vi: 'Bảo hành 12 tháng bao gồm'
    },
    duration: '12 months warranty',
    features: [
      { en: 'Technical support hotline', vi: 'Đường dây hỗ trợ kỹ thuật' },
      { en: 'Product warranty coverage', vi: 'Bảo hành sản phẩm' },
      { en: 'Repair and replacement', vi: 'Sửa chữa và thay thế' },
      { en: 'Maintenance guidance', vi: 'Hướng dẫn bảo trì' }
    ],
    benefits: [
      { en: 'Peace of mind', vi: 'An tâm sử dụng' },
      { en: 'Extended product life', vi: 'Kéo dài tuổi thọ sản phẩm' },
      { en: '24/7 support availability', vi: 'Hỗ trợ 24/7' }
    ],
    requirements: [
      { en: 'Valid purchase receipt', vi: 'Hóa đơn mua hàng hợp lệ' },
      { en: 'Product registration', vi: 'Đăng ký sản phẩm' }
    ],
    isFeatured: false,
    isActive: true,
    displayOrder: 6
  },
  {
    title: {
      en: 'Custom Manufacturing Solutions',
      vi: 'Giải Pháp Sản Xuất Tùy Chỉnh'
    },
    description: {
      en: 'Tailored manufacturing solutions for unique product requirements. We work with you to develop custom production processes that meet your specific needs.',
      vi: 'Giải pháp sản xuất được điều chỉnh cho các yêu cầu sản phẩm độc đáo. Chúng tôi làm việc với bạn để phát triển quy trình sản xuất tùy chỉnh đáp ứng nhu cầu cụ thể của bạn.'
    },
    shortDescription: {
      en: 'Tailored production processes for unique requirements',
      vi: 'Quy trình sản xuất được điều chỉnh cho yêu cầu độc đáo'
    },
    category: 'manufacturing',
    icon: 'Settings',
    price: 'negotiable',
    priceDetails: {
      en: 'Project-based pricing',
      vi: 'Định giá theo dự án'
    },
    duration: '4-12 weeks setup',
    features: [
      { en: 'Custom production line setup', vi: 'Thiết lập dây chuyền sản xuất tùy chỉnh' },
      { en: 'Specialized tooling', vi: 'Dụng cụ chuyên dụng' },
      { en: 'Quality system development', vi: 'Phát triển hệ thống chất lượng' },
      { en: 'Process optimization', vi: 'Tối ưu hóa quy trình' }
    ],
    benefits: [
      { en: 'Unique product capabilities', vi: 'Khả năng sản phẩm độc đáo' },
      { en: 'Competitive advantage', vi: 'Lợi thế cạnh tranh' },
      { en: 'Scalable production', vi: 'Sản xuất có thể mở rộng' }
    ],
    requirements: [
      { en: 'Detailed product specifications', vi: 'Đặc tả sản phẩm chi tiết' },
      { en: 'Minimum order commitment', vi: 'Cam kết đơn hàng tối thiểu' }
    ],
    isFeatured: true,
    isActive: true,
    displayOrder: 7
  },
  {
    title: {
      en: 'Sustainable Design Consulting',
      vi: 'Tư Vấn Thiết Kế Bền Vững'
    },
    description: {
      en: 'Expert consultation on sustainable and eco-friendly design practices. Help your business reduce environmental impact while maintaining product quality and appeal.',
      vi: 'Tư vấn chuyên gia về thực hành thiết kế bền vững và thân thiện với môi trường. Giúp doanh nghiệp của bạn giảm tác động môi trường trong khi duy trì chất lượng và sức hấp dẫn của sản phẩm.'
    },
    shortDescription: {
      en: 'Eco-friendly design solutions for sustainable business',
      vi: 'Giải pháp thiết kế thân thiện với môi trường cho doanh nghiệp bền vững'
    },
    category: 'design',
    icon: 'Heart',
    price: 'contact',
    priceDetails: {
      en: 'Consultation rates from $200/hour',
      vi: 'Mức phí tư vấn từ 5,000,000 VND/giờ'
    },
    duration: '2-4 weeks',
    features: [
      { en: 'Sustainable material selection', vi: 'Lựa chọn vật liệu bền vững' },
      { en: 'Eco-friendly production methods', vi: 'Phương pháp sản xuất thân thiện với môi trường' },
      { en: 'Lifecycle assessment', vi: 'Đánh giá vòng đời sản phẩm' },
      { en: 'Carbon footprint analysis', vi: 'Phân tích dấu chân carbon' }
    ],
    benefits: [
      { en: 'Environmental responsibility', vi: 'Trách nhiệm môi trường' },
      { en: 'Cost savings through efficiency', vi: 'Tiết kiệm chi phí thông qua hiệu quả' },
      { en: 'Brand reputation enhancement', vi: 'Nâng cao danh tiếng thương hiệu' }
    ],
    requirements: [
      { en: 'Current product portfolio review', vi: 'Đánh giá danh mục sản phẩm hiện tại' },
      { en: 'Sustainability goals definition', vi: 'Xác định mục tiêu bền vững' }
    ],
    isFeatured: false,
    isActive: true,
    displayOrder: 8
  }
];

const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    const createdServices = await Service.insertMany(sampleServices);
    console.log(`✅ Successfully seeded ${createdServices.length} services`);

    // Display summary
    console.log('\n📊 Services Summary:');
    const categories = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} services`);
    });

    const featuredCount = await Service.countDocuments({ isFeatured: true });
    console.log(`  Featured: ${featuredCount} services`);

    console.log('\n🎯 Sample services have been successfully seeded!');
    console.log('You can now:');
    console.log('1. View services in admin-cms at /services');
    console.log('2. Browse services on client at /services');
    console.log('3. Test the API endpoints');

  } catch (error) {
    console.error('❌ Error seeding services:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedServices();
};

if (require.main === module) {
  runSeeder();
}

module.exports = { seedServices, sampleServices };
