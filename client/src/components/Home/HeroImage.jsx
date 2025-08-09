import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Users } from 'lucide-react';

const HeroImage = () => {
  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-[5] h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-primary-600/90 text-white text-sm font-medium rounded-full">
                <Award className="w-4 h-4 mr-2" />
                Chất lượng hàng đầu
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Biến Ngôi Nhà Thành 
              <span className="block text-primary-400">Tác Phẩm Nghệ Thuật</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Khám phá bộ sưu tập đồ trang trí nội thất cao cấp, được chế tác thủ công 
              với tình yêu và sự tỉ mỉ để mang đến không gian sống hoàn hảo cho gia đình bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                Khám Phá Sản Phẩm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Tư Vấn Miễn Phí
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-2xl font-bold text-white">4.9</span>
                </div>
                <p className="text-sm text-gray-300">Đánh giá khách hàng</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary-400 mr-1" />
                  <span className="text-2xl font-bold text-white">10K+</span>
                </div>
                <p className="text-sm text-gray-300">Khách hàng hài lòng</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-green-400 mr-1" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-sm text-gray-300">Sản phẩm chất lượng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full bg-gradient-to-tl from-primary-400 to-transparent rounded-full"></div>
      </div>
      
      <div className="absolute top-20 right-20 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full animate-pulse"></div>
      </div>
    </section>
  );
};

export default HeroImage;
