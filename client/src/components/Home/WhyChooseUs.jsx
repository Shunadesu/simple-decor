import React from 'react';
import { Shield, Truck, HeartHandshake, Award, Clock, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Chất Lượng Đảm Bảo',
      description: 'Sản phẩm được kiểm tra nghiêm ngặt, đảm bảo chất lượng cao nhất trước khi đến tay khách hàng.'
    },
    {
      icon: Truck,
      title: 'Giao Hàng Nhanh Chóng',
      description: 'Giao hàng toàn quốc với dịch vụ nhanh chóng, an toàn và theo dõi đơn hàng 24/7.'
    },
    {
      icon: HeartHandshake,
      title: 'Dịch Vụ Tận Tâm',
      description: 'Đội ngũ chuyên viên tư vấn nhiệt tình, hỗ trợ khách hàng từ khâu chọn lựa đến sau bán hàng.'
    },
    {
      icon: Award,
      title: 'Thiết Kế Độc Đáo',
      description: 'Các sản phẩm được thiết kế độc quyền, mang tính thẩm mỹ cao và phù hợp với không gian Việt Nam.'
    },
    {
      icon: Clock,
      title: 'Bảo Hành Dài Hạn',
      description: 'Chế độ bảo hành và đổi trả linh hoạt, đảm bảo quyền lợi tối đa cho khách hàng.'
    },
    {
      icon: Users,
      title: 'Cộng Đồng Lớn',
      description: 'Hơn 10,000 khách hàng tin tưởng và lựa chọn, tạo nên cộng đồng yêu thích trang trí nội thất.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Left Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tại Sao Chọn 
                <span className="text-primary-600"> Simple Decor?</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Chúng tôi không chỉ cung cấp sản phẩm mà còn mang đến trải nghiệm mua sắm 
                tuyệt vời với những giá trị vượt trội mà bạn khó có thể tìm thấy ở nơi khác.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300">
                Khám Phá Ngay
              </button>
              <button className="px-8 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-300">
                Liên Hệ Tư Vấn
              </button>
            </div>
          </div>

          {/* Image - Right Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Why Choose Us"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay with Stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-sm text-white/90">Hài lòng</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-sm text-white/90">Hỗ trợ</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">5⭐</div>
                      <div className="text-sm text-white/90">Đánh giá</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-200 rounded-full opacity-50"></div>
            
            {/* Floating Card */}
            <div className="absolute top-8 -left-8 bg-white rounded-xl shadow-xl p-6 max-w-48">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Chứng nhận</div>
                  <div className="text-xs text-gray-600">ISO 9001:2015</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
