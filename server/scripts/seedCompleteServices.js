const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

// Comprehensive services data with full information
const completeServices = [
  {
    title: {
      en: 'Product Design Consultation',
      vi: 'Tư Vấn Thiết Kế Sản Phẩm'
    },
    description: {
      en: 'Professional consultation for custom product design and material selection. Our experienced team helps you create products that meet your specific requirements and market demands, ensuring both aesthetic appeal and functional excellence.',
      vi: 'Tư vấn chuyên nghiệp về thiết kế sản phẩm tùy chỉnh và lựa chọn vật liệu. Đội ngũ có kinh nghiệm của chúng tôi giúp bạn tạo ra những sản phẩm đáp ứng yêu cầu cụ thể và nhu cầu thị trường, đảm bảo cả tính thẩm mỹ và xuất sắc về chức năng.'
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
      { en: '3D modeling and prototyping', vi: 'Mô hình 3D và tạo mẫu thử' },
      { en: 'Market research integration', vi: 'Tích hợp nghiên cứu thị trường' }
    ],
    benefits: [
      { en: 'Reduced development time', vi: 'Giảm thời gian phát triển' },
      { en: 'Optimized material costs', vi: 'Tối ưu chi phí vật liệu' },
      { en: 'Professional design quality', vi: 'Chất lượng thiết kế chuyên nghiệp' },
      { en: 'Market-ready products', vi: 'Sản phẩm sẵn sàng thị trường' }
    ],
    requirements: [
      { en: 'Product specifications document', vi: 'Tài liệu đặc tả sản phẩm' },
      { en: 'Target market information', vi: 'Thông tin thị trường mục tiêu' },
      { en: 'Budget range definition', vi: 'Xác định phạm vi ngân sách' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Requirements Analysis', vi: 'Phân tích yêu cầu' },
        description: { en: 'Detailed discussion of your product needs and market requirements', vi: 'Thảo luận chi tiết về nhu cầu sản phẩm và yêu cầu thị trường' }
      },
      {
        step: 2,
        title: { en: 'Design Concept', vi: 'Khái niệm thiết kế' },
        description: { en: 'Create initial design concepts and material recommendations', vi: 'Tạo các khái niệm thiết kế ban đầu và đề xuất vật liệu' }
      },
      {
        step: 3,
        title: { en: 'Prototype Development', vi: 'Phát triển mẫu thử' },
        description: { en: 'Build and test prototype based on approved design', vi: 'Xây dựng và thử nghiệm mẫu thử dựa trên thiết kế đã được phê duyệt' }
      },
      {
        step: 4,
        title: { en: 'Final Optimization', vi: 'Tối ưu hóa cuối cùng' },
        description: { en: 'Refine design and prepare for production', vi: 'Tinh chỉnh thiết kế và chuẩn bị sản xuất' }
      }
    ],
    contactInfo: {
      email: 'design@zuna-decor.com',
      phone: '+84 28 1234 5678',
      department: 'Design Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop',
      public_id: 'design-consultation-service',
      alt: {
        en: 'Product Design Consultation Service',
        vi: 'Dịch vụ Tư vấn Thiết kế Sản phẩm'
      }
    },
    metaTitle: {
      en: 'Product Design Consultation - Custom Design Services',
      vi: 'Tư vấn Thiết kế Sản phẩm - Dịch vụ Thiết kế Tùy chỉnh'
    },
    metaDescription: {
      en: 'Professional product design consultation services. Get expert guidance for custom product design, material selection, and 3D prototyping.',
      vi: 'Dịch vụ tư vấn thiết kế sản phẩm chuyên nghiệp. Nhận hướng dẫn chuyên gia về thiết kế sản phẩm tùy chỉnh, lựa chọn vật liệu và tạo mẫu 3D.'
    },
    tags: [
      { en: 'design', vi: 'thiết kế' },
      { en: 'consultation', vi: 'tư vấn' },
      { en: 'custom', vi: 'tùy chỉnh' },
      { en: 'prototype', vi: 'mẫu thử' }
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
      en: 'Regular updated price quotations for new products and market changes. Stay informed about the latest pricing trends and opportunities in the market with detailed analysis and competitive insights.',
      vi: 'Báo giá cập nhật thường xuyên cho sản phẩm mới và thay đổi thị trường. Luôn được thông báo về xu hướng giá cả và cơ hội mới nhất trên thị trường với phân tích chi tiết và thông tin cạnh tranh.'
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
    duration: 'Ongoing - Weekly updates',
    features: [
      { en: 'Weekly price updates', vi: 'Cập nhật giá hàng tuần' },
      { en: 'Market trend analysis', vi: 'Phân tích xu hướng thị trường' },
      { en: 'Competitor pricing insights', vi: 'Thông tin giá đối thủ cạnh tranh' },
      { en: 'Custom product quotes', vi: 'Báo giá sản phẩm tùy chỉnh' },
      { en: 'Volume discount calculation', vi: 'Tính toán chiết khấu số lượng' }
    ],
    benefits: [
      { en: 'Stay competitive in pricing', vi: 'Duy trì tính cạnh tranh về giá' },
      { en: 'Better negotiation power', vi: 'Sức mạnh đàm phán tốt hơn' },
      { en: 'Market insights', vi: 'Hiểu biết thị trường' },
      { en: 'Profit optimization', vi: 'Tối ưu hóa lợi nhuận' }
    ],
    requirements: [
      { en: 'Active partnership agreement', vi: 'Thỏa thuận đối tác hiệu lực' },
      { en: 'Regular order commitment', vi: 'Cam kết đặt hàng thường xuyên' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Market Research', vi: 'Nghiên cứu thị trường' },
        description: { en: 'Gather latest market data and competitor pricing', vi: 'Thu thập dữ liệu thị trường mới nhất và giá cạnh tranh' }
      },
      {
        step: 2,
        title: { en: 'Price Analysis', vi: 'Phân tích giá' },
        description: { en: 'Analyze trends and prepare comprehensive quotes', vi: 'Phân tích xu hướng và chuẩn bị báo giá toàn diện' }
      },
      {
        step: 3,
        title: { en: 'Weekly Distribution', vi: 'Phân phối hàng tuần' },
        description: { en: 'Send detailed price updates every Monday', vi: 'Gửi cập nhật giá chi tiết mỗi thứ Hai' }
      }
    ],
    contactInfo: {
      email: 'pricing@zuna-decor.com',
      phone: '+84 28 1234 5679',
      department: 'Sales Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      public_id: 'price-quotation-service',
      alt: {
        en: 'Weekly Price Quotation Service',
        vi: 'Dịch vụ Báo giá Hàng tuần'
      }
    },
    metaTitle: {
      en: 'Weekly Price Quotations - Market Pricing Updates',
      vi: 'Báo giá Hàng tuần - Cập nhật Giá Thị trường'
    },
    metaDescription: {
      en: 'Get weekly price quotations and market analysis. Stay competitive with regular pricing updates and market insights.',
      vi: 'Nhận báo giá hàng tuần và phân tích thị trường. Duy trì tính cạnh tranh với cập nhật giá thường xuyên và hiểu biết thị trường.'
    },
    tags: [
      { en: 'pricing', vi: 'định giá' },
      { en: 'quotation', vi: 'báo giá' },
      { en: 'market analysis', vi: 'phân tích thị trường' },
      { en: 'weekly', vi: 'hàng tuần' }
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
      en: 'Complete export documentation and customs procedures support for all orders. We handle all the paperwork to ensure smooth international shipping and compliance with destination country regulations.',
      vi: 'Hỗ trợ hoàn chỉnh hồ sơ xuất khẩu và thủ tục hải quan cho mọi đơn hàng. Chúng tôi xử lý tất cả giấy tờ để đảm bảo vận chuyển quốc tế suôn sẻ và tuân thủ quy định của nước đích.'
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
      { en: 'Origin certificates', vi: 'Giấy chứng nhận xuất xứ' },
      { en: 'Packing lists', vi: 'Danh sách đóng gói' },
      { en: 'Commercial invoices', vi: 'Hóa đơn thương mại' }
    ],
    benefits: [
      { en: 'Faster customs clearance', vi: 'Thông quan nhanh hơn' },
      { en: 'Reduced shipping delays', vi: 'Giảm chậm trễ vận chuyển' },
      { en: 'Compliance assurance', vi: 'Đảm bảo tuân thủ' },
      { en: 'No additional paperwork burden', vi: 'Không gánh nặng giấy tờ thêm' }
    ],
    requirements: [
      { en: 'Confirmed export order', vi: 'Đơn hàng xuất khẩu được xác nhận' },
      { en: 'Destination country details', vi: 'Chi tiết nước đích' },
      { en: 'Product specifications', vi: 'Đặc tả sản phẩm' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Document Preparation', vi: 'Chuẩn bị tài liệu' },
        description: { en: 'Prepare all required export documents', vi: 'Chuẩn bị tất cả tài liệu xuất khẩu cần thiết' }
      },
      {
        step: 2,
        title: { en: 'Verification', vi: 'Xác minh' },
        description: { en: 'Verify all documents for accuracy and compliance', vi: 'Xác minh tất cả tài liệu về độ chính xác và tuân thủ' }
      },
      {
        step: 3,
        title: { en: 'Customs Submission', vi: 'Nộp hải quan' },
        description: { en: 'Submit documents to customs authorities', vi: 'Nộp tài liệu cho cơ quan hải quan' }
      }
    ],
    contactInfo: {
      email: 'export@zuna-decor.com',
      phone: '+84 28 1234 5680',
      department: 'Export Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=600&fit=crop',
      public_id: 'export-documentation-service',
      alt: {
        en: 'Export Documentation Support Service',
        vi: 'Dịch vụ Hỗ trợ Hồ sơ Xuất khẩu'
      }
    },
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
      en: 'Professional shipping and logistics services with optimal cost and delivery time. We manage the entire logistics chain from warehouse to destination, ensuring safe and timely delivery of your products worldwide.',
      vi: 'Dịch vụ vận chuyển và logistics chuyên nghiệp với chi phí và thời gian giao hàng tối ưu. Chúng tôi quản lý toàn bộ chuỗi logistics từ kho đến điểm đến, đảm bảo giao hàng an toàn và đúng hạn trên toàn thế giới.'
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
    duration: '2-6 weeks depending on destination',
    features: [
      { en: 'Sea and air freight', vi: 'Vận chuyển đường biển và hàng không' },
      { en: 'Container booking', vi: 'Đặt chỗ container' },
      { en: 'Cargo tracking', vi: 'Theo dõi hàng hóa' },
      { en: 'Insurance options', vi: 'Tùy chọn bảo hiểm' },
      { en: 'Door-to-door delivery', vi: 'Giao hàng tận nơi' },
      { en: 'Customs brokerage', vi: 'Môi giới hải quan' }
    ],
    benefits: [
      { en: 'Cost-effective shipping', vi: 'Vận chuyển tiết kiệm chi phí' },
      { en: 'Reliable delivery', vi: 'Giao hàng đáng tin cậy' },
      { en: 'Real-time tracking', vi: 'Theo dõi thời gian thực' },
      { en: 'Global network coverage', vi: 'Phủ sóng mạng lưới toàn cầu' }
    ],
    requirements: [
      { en: 'Shipping address confirmation', vi: 'Xác nhận địa chỉ giao hàng' },
      { en: 'Cargo details and weight', vi: 'Chi tiết và trọng lượng hàng hóa' },
      { en: 'Delivery timeline preferences', vi: 'Ưu tiên thời gian giao hàng' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Logistics Planning', vi: 'Lập kế hoạch logistics' },
        description: { en: 'Plan optimal shipping route and method', vi: 'Lập kế hoạch tuyến đường và phương thức vận chuyển tối ưu' }
      },
      {
        step: 2,
        title: { en: 'Booking & Scheduling', vi: 'Đặt chỗ & Lên lịch' },
        description: { en: 'Book freight space and schedule pickup', vi: 'Đặt chỗ vận chuyển và lên lịch lấy hàng' }
      },
      {
        step: 3,
        title: { en: 'Transit Management', vi: 'Quản lý vận chuyển' },
        description: { en: 'Monitor shipment progress and provide updates', vi: 'Giám sát tiến trình vận chuyển và cung cấp cập nhật' }
      },
      {
        step: 4,
        title: { en: 'Delivery Confirmation', vi: 'Xác nhận giao hàng' },
        description: { en: 'Confirm delivery and provide proof of receipt', vi: 'Xác nhận giao hàng và cung cấp bằng chứng nhận hàng' }
      }
    ],
    contactInfo: {
      email: 'logistics@zuna-decor.com',
      phone: '+84 28 1234 5681',
      department: 'Logistics Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      public_id: 'shipping-logistics-service',
      alt: {
        en: 'International Shipping & Logistics Service',
        vi: 'Dịch vụ Vận chuyển & Logistics Quốc tế'
      }
    },
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
      en: 'Comprehensive quality control and production monitoring to ensure product standards. Our QC team ensures every product meets international quality standards and customer specifications through rigorous testing and inspection processes.',
      vi: 'Kiểm soát chất lượng toàn diện và giám sát sản xuất để đảm bảo tiêu chuẩn sản phẩm. Đội ngũ QC của chúng tôi đảm bảo mọi sản phẩm đều đạt tiêu chuẩn chất lượng quốc tế và đặc tả khách hàng thông qua quy trình kiểm tra và kiểm tra nghiêm ngặt.'
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
      { en: 'Detailed QC reports', vi: 'Báo cáo QC chi tiết' },
      { en: 'Material testing', vi: 'Kiểm tra vật liệu' },
      { en: 'Photographic documentation', vi: 'Tài liệu ảnh' }
    ],
    benefits: [
      { en: 'Guaranteed product quality', vi: 'Chất lượng sản phẩm được đảm bảo' },
      { en: 'Reduced defect rates', vi: 'Giảm tỷ lệ lỗi' },
      { en: 'Customer satisfaction', vi: 'Sự hài lòng của khách hàng' },
      { en: 'Risk mitigation', vi: 'Giảm thiểu rủi ro' }
    ],
    requirements: [
      { en: 'Quality standards specification', vi: 'Đặc tả tiêu chuẩn chất lượng' },
      { en: 'Access to production facility', vi: 'Truy cập cơ sở sản xuất' },
      { en: 'Sample approval', vi: 'Phê duyệt mẫu' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Standard Setting', vi: 'Thiết lập tiêu chuẩn' },
        description: { en: 'Define quality standards and inspection criteria', vi: 'Xác định tiêu chuẩn chất lượng và tiêu chí kiểm tra' }
      },
      {
        step: 2,
        title: { en: 'Pre-Production Check', vi: 'Kiểm tra trước sản xuất' },
        description: { en: 'Inspect materials and setup before production', vi: 'Kiểm tra vật liệu và thiết lập trước sản xuất' }
      },
      {
        step: 3,
        title: { en: 'In-Process Monitoring', vi: 'Giám sát trong quá trình' },
        description: { en: 'Monitor production quality during manufacturing', vi: 'Giám sát chất lượng sản xuất trong quá trình sản xuất' }
      },
      {
        step: 4,
        title: { en: 'Final Inspection', vi: 'Kiểm tra cuối cùng' },
        description: { en: 'Comprehensive final quality check and reporting', vi: 'Kiểm tra chất lượng cuối cùng toàn diện và báo cáo' }
      }
    ],
    contactInfo: {
      email: 'quality@zuna-decor.com',
      phone: '+84 28 1234 5682',
      department: 'Quality Assurance Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1581093458791-9f3c3250a33b?w=800&h=600&fit=crop',
      public_id: 'quality-control-service',
      alt: {
        en: 'Quality Control & Inspection Service',
        vi: 'Dịch vụ Kiểm soát & Kiểm tra Chất lượng'
      }
    },
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
      en: 'Comprehensive after-sales support and product warranty services. We provide ongoing technical support and maintenance for all our products, ensuring customer satisfaction long after purchase.',
      vi: 'Dịch vụ hỗ trợ sau bán hàng và bảo hành sản phẩm toàn diện. Chúng tôi cung cấp hỗ trợ kỹ thuật và bảo trì liên tục cho tất cả sản phẩm của chúng tôi, đảm bảo sự hài lòng của khách hàng lâu dài sau khi mua.'
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
    duration: '12 months warranty + ongoing support',
    features: [
      { en: 'Technical support hotline', vi: 'Đường dây hỗ trợ kỹ thuật' },
      { en: 'Product warranty coverage', vi: 'Bảo hành sản phẩm' },
      { en: 'Repair and replacement', vi: 'Sửa chữa và thay thế' },
      { en: 'Maintenance guidance', vi: 'Hướng dẫn bảo trì' },
      { en: 'Remote troubleshooting', vi: 'Khắc phục sự cố từ xa' },
      { en: 'Spare parts availability', vi: 'Sẵn có phụ tùng thay thế' }
    ],
    benefits: [
      { en: 'Peace of mind', vi: 'An tâm sử dụng' },
      { en: 'Extended product life', vi: 'Kéo dài tuổi thọ sản phẩm' },
      { en: '24/7 support availability', vi: 'Hỗ trợ 24/7' },
      { en: 'Cost-effective maintenance', vi: 'Bảo trì tiết kiệm chi phí' }
    ],
    requirements: [
      { en: 'Valid purchase receipt', vi: 'Hóa đơn mua hàng hợp lệ' },
      { en: 'Product registration', vi: 'Đăng ký sản phẩm' },
      { en: 'Proper product usage', vi: 'Sử dụng sản phẩm đúng cách' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Product Registration', vi: 'Đăng ký sản phẩm' },
        description: { en: 'Register your product for warranty coverage', vi: 'Đăng ký sản phẩm để được bảo hành' }
      },
      {
        step: 2,
        title: { en: 'Issue Reporting', vi: 'Báo cáo vấn đề' },
        description: { en: 'Contact support team with any issues', vi: 'Liên hệ đội hỗ trợ với bất kỳ vấn đề nào' }
      },
      {
        step: 3,
        title: { en: 'Diagnosis & Solution', vi: 'Chẩn đoán & Giải pháp' },
        description: { en: 'Technical diagnosis and solution implementation', vi: 'Chẩn đoán kỹ thuật và thực hiện giải pháp' }
      }
    ],
    contactInfo: {
      email: 'support@zuna-decor.com',
      phone: '+84 28 1234 5683',
      department: 'Customer Support'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1553598698-e2baaa4a1e4f?w=800&h=600&fit=crop',
      public_id: 'after-sales-support-service',
      alt: {
        en: 'After-Sales Support & Warranty Service',
        vi: 'Dịch vụ Hỗ trợ Sau bán hàng & Bảo hành'
      }
    },
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
      en: 'Tailored manufacturing solutions for unique product requirements. We work with you to develop custom production processes that meet your specific needs, from small batch production to large-scale manufacturing.',
      vi: 'Giải pháp sản xuất được điều chỉnh cho các yêu cầu sản phẩm độc đáo. Chúng tôi làm việc với bạn để phát triển quy trình sản xuất tùy chỉnh đáp ứng nhu cầu cụ thể của bạn, từ sản xuất lô nhỏ đến sản xuất quy mô lớn.'
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
    duration: '4-12 weeks setup + ongoing production',
    features: [
      { en: 'Custom production line setup', vi: 'Thiết lập dây chuyền sản xuất tùy chỉnh' },
      { en: 'Specialized tooling', vi: 'Dụng cụ chuyên dụng' },
      { en: 'Quality system development', vi: 'Phát triển hệ thống chất lượng' },
      { en: 'Process optimization', vi: 'Tối ưu hóa quy trình' },
      { en: 'Scalable production capacity', vi: 'Năng lực sản xuất có thể mở rộng' },
      { en: 'Dedicated project management', vi: 'Quản lý dự án chuyên dụng' }
    ],
    benefits: [
      { en: 'Unique product capabilities', vi: 'Khả năng sản phẩm độc đáo' },
      { en: 'Competitive advantage', vi: 'Lợi thế cạnh tranh' },
      { en: 'Scalable production', vi: 'Sản xuất có thể mở rộng' },
      { en: 'Exclusive partnerships', vi: 'Quan hệ đối tác độc quyền' }
    ],
    requirements: [
      { en: 'Detailed product specifications', vi: 'Đặc tả sản phẩm chi tiết' },
      { en: 'Minimum order commitment', vi: 'Cam kết đơn hàng tối thiểu' },
      { en: 'Technical feasibility study', vi: 'Nghiên cứu tính khả thi kỹ thuật' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Feasibility Study', vi: 'Nghiên cứu khả thi' },
        description: { en: 'Analyze technical and commercial feasibility', vi: 'Phân tích tính khả thi kỹ thuật và thương mại' }
      },
      {
        step: 2,
        title: { en: 'Process Design', vi: 'Thiết kế quy trình' },
        description: { en: 'Design custom manufacturing process', vi: 'Thiết kế quy trình sản xuất tùy chỉnh' }
      },
      {
        step: 3,
        title: { en: 'Setup & Testing', vi: 'Thiết lập & Thử nghiệm' },
        description: { en: 'Setup production line and conduct testing', vi: 'Thiết lập dây chuyền sản xuất và tiến hành thử nghiệm' }
      },
      {
        step: 4,
        title: { en: 'Production Launch', vi: 'Khởi động sản xuất' },
        description: { en: 'Begin full-scale production with monitoring', vi: 'Bắt đầu sản xuất quy mô đầy đủ với giám sát' }
      }
    ],
    contactInfo: {
      email: 'manufacturing@zuna-decor.com',
      phone: '+84 28 1234 5684',
      department: 'Manufacturing Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1581093458791-9f3c3250a33b?w=800&h=600&fit=crop',
      public_id: 'custom-manufacturing-service',
      alt: {
        en: 'Custom Manufacturing Solutions Service',
        vi: 'Dịch vụ Giải pháp Sản xuất Tùy chỉnh'
      }
    },
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
      en: 'Expert consultation on sustainable and eco-friendly design practices. Help your business reduce environmental impact while maintaining product quality and appeal through innovative sustainable solutions.',
      vi: 'Tư vấn chuyên gia về thực hành thiết kế bền vững và thân thiện với môi trường. Giúp doanh nghiệp của bạn giảm tác động môi trường trong khi duy trì chất lượng và sức hấp dẫn của sản phẩm thông qua các giải pháp bền vững sáng tạo.'
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
    duration: '2-4 weeks initial consultation + ongoing support',
    features: [
      { en: 'Sustainable material selection', vi: 'Lựa chọn vật liệu bền vững' },
      { en: 'Eco-friendly production methods', vi: 'Phương pháp sản xuất thân thiện với môi trường' },
      { en: 'Lifecycle assessment', vi: 'Đánh giá vòng đời sản phẩm' },
      { en: 'Carbon footprint analysis', vi: 'Phân tích dấu chân carbon' },
      { en: 'Circular design principles', vi: 'Nguyên tắc thiết kế tuần hoàn' },
      { en: 'Certification guidance', vi: 'Hướng dẫn chứng nhận' }
    ],
    benefits: [
      { en: 'Environmental responsibility', vi: 'Trách nhiệm môi trường' },
      { en: 'Cost savings through efficiency', vi: 'Tiết kiệm chi phí thông qua hiệu quả' },
      { en: 'Brand reputation enhancement', vi: 'Nâng cao danh tiếng thương hiệu' },
      { en: 'Regulatory compliance', vi: 'Tuân thủ quy định' }
    ],
    requirements: [
      { en: 'Current product portfolio review', vi: 'Đánh giá danh mục sản phẩm hiện tại' },
      { en: 'Sustainability goals definition', vi: 'Xác định mục tiêu bền vững' },
      { en: 'Stakeholder commitment', vi: 'Cam kết của các bên liên quan' }
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Sustainability Assessment', vi: 'Đánh giá tính bền vững' },
        description: { en: 'Evaluate current environmental impact', vi: 'Đánh giá tác động môi trường hiện tại' }
      },
      {
        step: 2,
        title: { en: 'Strategy Development', vi: 'Phát triển chiến lược' },
        description: { en: 'Develop sustainable design strategy', vi: 'Phát triển chiến lược thiết kế bền vững' }
      },
      {
        step: 3,
        title: { en: 'Implementation Plan', vi: 'Kế hoạch thực hiện' },
        description: { en: 'Create detailed implementation roadmap', vi: 'Tạo lộ trình thực hiện chi tiết' }
      },
      {
        step: 4,
        title: { en: 'Monitoring & Optimization', vi: 'Giám sát & Tối ưu hóa' },
        description: { en: 'Monitor progress and optimize solutions', vi: 'Giám sát tiến độ và tối ưu hóa giải pháp' }
      }
    ],
    contactInfo: {
      email: 'sustainability@zuna-decor.com',
      phone: '+84 28 1234 5685',
      department: 'Sustainability Department'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
      public_id: 'sustainable-design-service',
      alt: {
        en: 'Sustainable Design Consulting Service',
        vi: 'Dịch vụ Tư vấn Thiết kế Bền vững'
      }
    },
    isFeatured: false,
    isActive: true,
    displayOrder: 8
  }
];

async function seedCompleteServices() {
  try {
    console.log('🌱 Starting complete services seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Step 1: Removing existing services...');
    
    // Delete all existing services
    const deleteResult = await Service.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing services`);

    console.log('✨ Step 2: Creating services with complete information...');
    
    const createdServices = [];
    
    for (const serviceData of completeServices) {
      const service = new Service(serviceData);
      const savedService = await service.save();
      createdServices.push(savedService);
      console.log(`✅ Created: ${serviceData.title.en} (${serviceData.category})`);
    }

    console.log(`🎉 Successfully created ${createdServices.length} services!`);
    
    // Display summary by category
    console.log('\n📊 Services by Category:');
    const categories = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} service(s)`);
    });

    const featuredCount = await Service.countDocuments({ isFeatured: true });
    console.log(`\n⭐ Featured services: ${featuredCount}`);

    console.log('\n📋 Complete services list:');
    createdServices.forEach(service => {
      const featured = service.isFeatured ? '⭐' : '  ';
      console.log(`   ${featured} ${service.title.en} (${service.category}) - Order: ${service.displayOrder}`);
    });

    return createdServices;

  } catch (error) {
    console.error('❌ Error seeding complete services:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedCompleteServices()
    .then(() => {
      console.log('✅ Complete services seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Complete services seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedCompleteServices;
