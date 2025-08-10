import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSwiper = () => {
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);

  // Sample slides data - in the future this could come from API
  const sampleSlides = React.useMemo(() => [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: t('home.heroSwiper.slide1.title'),
      subtitle: t('home.heroSwiper.slide1.subtitle'),
      description: t('home.heroSwiper.slide1.description'),
      ctaText: t('home.heroSwiper.slide1.ctaPrimary'),
      ctaLink: '/products'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: t('home.heroSwiper.slide2.title'),
      subtitle: t('home.heroSwiper.slide2.subtitle'),
      description: t('home.heroSwiper.slide2.description'),
      ctaText: t('home.heroSwiper.slide2.ctaPrimary'),
      ctaLink: '/contact'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: t('home.heroSwiper.slide3.title'),
      subtitle: t('home.heroSwiper.slide3.subtitle'),
      description: t('home.heroSwiper.slide3.description'),
      ctaText: t('home.heroSwiper.slide3.ctaPrimary'),
      ctaLink: '/about'
    }
  ], [t]);

  useEffect(() => {
    setSlides(sampleSlides);
  }, [sampleSlides]);

  // Animation variants
  const slideContentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };


  return (
    <section className="relative h-[70vh] min-h-screen overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <motion.div 
                  className="max-w-2xl"
                  variants={slideContentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={textVariants}
                    className="mb-4"
                  >
                    <span className="inline-flex items-center px-4 py-2 bg-primary-600/90 text-white text-sm font-medium rounded-full">
                      {slide.subtitle}
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={textVariants}
                    className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p
                    variants={textVariants}
                    className="text-xl text-gray-200 mb-8 leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                  >
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.ctaText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-tl from-primary-400 to-transparent rounded-full"></div>
      </motion.div>
      
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 opacity-5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full"></div>
      </motion.div>
    </section>
  );
};

export default HeroSwiper;
