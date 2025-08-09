import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSwiper = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default slides if API is not available
  const defaultSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
      title: 'Chào Mừng Đến Simple Decor',
      subtitle: 'Biến đổi không gian sống với thiết kế tinh tế',
      description: 'Khám phá bộ sưu tập đồ trang trí nội thất đẹp mắt sẽ làm cho không gian của bạn trở nên đặc biệt.',
      ctaPrimary: { text: 'Khám Phá Sản Phẩm', link: '/products' },
      ctaSecondary: { text: 'Tư Vấn Miễn Phí', link: '/contact' },
      isActive: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      title: 'Nội Thất Chất Lượng Cao',
      subtitle: 'Được chế tác với sự chăm sóc và chú ý đến từng chi tiết',
      description: 'Các sản phẩm nội thất của chúng tôi được thiết kế để tồn tại lâu dài, kết hợp phong cách với chức năng cho ngôi nhà hoàn hảo của bạn.',
      ctaPrimary: { text: 'Xem Bộ Sưu Tập', link: '/products' },
      ctaSecondary: { text: 'Liên Hệ Ngay', link: '/contact' },
      isActive: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80',
      title: 'Giải Pháp Nội Thất Hiện Đại',
      subtitle: 'Thiết kế đương đại cho cuộc sống hiện đại',
      description: 'Từ tối giản đến sang trọng, chúng tôi cung cấp nhiều giải pháp nội thất để phù hợp với phong cách của bạn.',
      ctaPrimary: { text: 'Khám Phá Ngay', link: '/products' },
      ctaSecondary: { text: 'Đặt Lịch Hẹn', link: '/contact' },
      isActive: true
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Tư Vấn Thiết Kế Chuyên Nghiệp',
      subtitle: 'Hướng dẫn chuyên nghiệp cho dự án của bạn',
      description: 'Đội ngũ chuyên gia của chúng tôi sẵn sàng giúp bạn tạo ra không gian hoàn hảo phản ánh cá tính của bạn.',
      ctaPrimary: { text: 'Tư Vấn Ngay', link: '/contact' },
      ctaSecondary: { text: 'Xem Dự Án', link: '/services' },
      isActive: true
    }
  ];

  useEffect(() => {
    // In the future, this could fetch from an API
    // For now, use default slides
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - in the future this would be:
      // const response = await slidesApi.getActiveSlides();
      // setSlides(response.data);
      
      // For now, use default slides
      setTimeout(() => {
        setSlides(defaultSlides);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching slides:', error);
      setSlides(defaultSlides);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        className="h-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-8 text-gray-200 animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-600">
                    <Link
                      to={slide.ctaPrimary.link}
                      className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      {slide.ctaPrimary.text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to={slide.ctaSecondary.link}
                      className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
                    >
                      {slide.ctaSecondary.text}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <button className="swiper-button-prev-custom absolute left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button className="swiper-button-next-custom absolute right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3"></div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSwiper;
