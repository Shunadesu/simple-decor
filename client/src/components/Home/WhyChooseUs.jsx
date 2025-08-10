import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Award, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = React.useMemo(() => [
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.quality.title'),
      description: t('home.whyChooseUs.features.quality.description')
    },
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.shipping.title'),
      description: t('home.whyChooseUs.features.shipping.description')
    },
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.service.title'),
      description: t('home.whyChooseUs.features.service.description')
    },
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.design.title'),
      description: t('home.whyChooseUs.features.design.description')
    },
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.warranty.title'),
      description: t('home.whyChooseUs.features.warranty.description')
    },
    {
      icon: CheckCircle,
      title: t('home.whyChooseUs.features.community.title'),
      description: t('home.whyChooseUs.features.community.description')
    }
  ], [t]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
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

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6
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
        delay: 0.8
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('home.whyChooseUs.title')}{' '}
            <span className="text-primary-600">{t('home.whyChooseUs.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('home.whyChooseUs.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  variants={featureVariants}
                  whileHover={{ 
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <feature.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
              variants={statsVariants}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">10K+</span>
                </div>
                <p className="text-sm text-gray-600">{t('home.whyChooseUs.stats.satisfaction')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">24/7</span>
                </div>
                <p className="text-sm text-gray-600">{t('home.whyChooseUs.stats.support')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-sm text-gray-600">{t('home.whyChooseUs.stats.rating')}</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-8"
              variants={buttonVariants}
            >
              <motion.div whileHover="hover">
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  {t('home.whyChooseUs.cta.explore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover="hover">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-300"
                >
                  {t('home.whyChooseUs.cta.consult')}
                </Link>
              </motion.div>
            </motion.div>

            {/* Certification */}
            <motion.div 
              className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center">
                <Award className="w-8 h-8 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('home.whyChooseUs.certification.title')}</p>
                  <p className="text-xs text-gray-600">{t('home.whyChooseUs.certification.iso')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Why Choose Simple Decor"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">4.9/5</p>
                    <p className="text-xs text-gray-600">Customer Rating</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-6 right-6 bg-white rounded-lg p-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">10K+</p>
                    <p className="text-xs text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
