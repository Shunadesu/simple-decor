import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, TrendingUp, Building, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const InsightsSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('business');
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = React.useMemo(() => [
    {
      id: 'business',
      label: t('home.insights.tabs.business'),
      icon: Building,
      title: t('home.insights.tabContent.business.title'),
      subtitle: t('home.insights.tabContent.business.subtitle'),
      color: 'green'
    },
    {
      id: 'growth',
      label: t('home.insights.tabs.growth'),
      icon: TrendingUp,
      title: t('home.insights.tabContent.growth.title'),
      subtitle: t('home.insights.tabContent.growth.subtitle'),
      color: 'blue'
    },
    {
      id: 'society',
      label: t('home.insights.tabs.society'),
      icon: Heart,
      title: t('home.insights.tabContent.society.title'),
      subtitle: t('home.insights.tabContent.society.subtitle'),
      color: 'purple'
    }
  ], [t]);

  // Sample data - in the future this could come from API
  const sampleInsights = React.useMemo(() => ({
    business: [
      {
        id: 1,
        title: t('home.insights.sampleData.business.article1.title'),
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '26 Jul',
        readTime: `5 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.business.article1.category'),
        excerpt: t('home.insights.sampleData.business.article1.excerpt'),
        featured: true
      },
      {
        id: 2,
        title: t('home.insights.sampleData.business.article2.title'),
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '19 Jun',
        readTime: `8 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.business.article2.category'),
        excerpt: t('home.insights.sampleData.business.article2.excerpt'),
        featured: false
      },
      {
        id: 3,
        title: t('home.insights.sampleData.business.article3.title'),
        image: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '15 Jun',
        readTime: `6 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.business.article3.category'),
        excerpt: t('home.insights.sampleData.business.article3.excerpt'),
        featured: false
      }
    ],
    growth: [
      {
        id: 4,
        title: t('home.insights.sampleData.growth.article1.title'),
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '20 Jul',
        readTime: `7 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.growth.article1.category'),
        excerpt: t('home.insights.sampleData.growth.article1.excerpt'),
        featured: true
      },
      {
        id: 5,
        title: t('home.insights.sampleData.growth.article2.title'),
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '12 Jul',
        readTime: `9 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.growth.article2.category'),
        excerpt: t('home.insights.sampleData.growth.article2.excerpt'),
        featured: false
      },
      {
        id: 6,
        title: t('home.insights.sampleData.growth.article3.title'),
        image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '8 Jul',
        readTime: `5 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.growth.article3.category'),
        excerpt: t('home.insights.sampleData.growth.article3.excerpt'),
        featured: false
      }
    ],
    society: [
      {
        id: 7,
        title: t('home.insights.sampleData.society.article1.title'),
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '25 Jul',
        readTime: `6 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.society.article1.category'),
        excerpt: t('home.insights.sampleData.society.article1.excerpt'),
        featured: true
      },
      {
        id: 8,
        title: t('home.insights.sampleData.society.article2.title'),
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '18 Jul',
        readTime: `7 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.society.article2.category'),
        excerpt: t('home.insights.sampleData.society.article2.excerpt'),
        featured: false
      },
      {
        id: 9,
        title: t('home.insights.sampleData.society.article3.title'),
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '10 Jul',
        readTime: `8 ${t('home.articlesGrid.readTime')}`,
        category: t('home.insights.sampleData.society.article3.category'),
        excerpt: t('home.insights.sampleData.society.article3.excerpt'),
        featured: false
      }
    ]
  }), [t]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInsights(sampleInsights);
      setLoading(false);
    }, 500);
  }, [sampleInsights]);

  const getCurrentInsights = () => {
    return insights[activeTab] || [];
  };

  const getCurrentTab = () => {
    return tabs.find(tab => tab.id === activeTab);
  };

  const formatDate = (dateString) => {
    const [day, month] = dateString.split(' ');
    return { day, month };
  };

  // Animation variants
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

  const tabsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const featuredArticleVariants = {
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

  const sideContentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const articleItemVariants = {
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Insights</h2>
            <p className="text-lg text-gray-600">Explore all of our articles here...</p>
          </motion.div>
          <div className="animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 w-32 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentTab = getCurrentTab();
  const currentInsights = getCurrentInsights();
  const featuredInsight = currentInsights.find(insight => insight.featured);
  const otherInsights = currentInsights.filter(insight => !insight.featured);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ color: '#7B8D5B' }}>
            {t('home.insights.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.insights.subtitle')}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={tabsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            {/* Left Side - Featured Article */}
            {featuredInsight && (
              <motion.div 
                className="order-2 lg:order-1"
                variants={featuredArticleVariants}
              >
                <Link to={`/blog/${featuredInsight.id}`} className="group block">
                  <motion.div 
                    className="relative rounded-2xl overflow-hidden shadow-lg"
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.img
                      src={featuredInsight.image}
                      alt={featuredInsight.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <motion.span 
                          className="inline-block bg-primary-600 px-3 py-1 text-sm font-medium rounded-full mb-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {featuredInsight.category}
                        </motion.span>
                        <motion.h3 
                          className="text-xl font-bold mb-2 line-clamp-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {featuredInsight.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-200 text-sm line-clamp-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {featuredInsight.excerpt}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )}

            {/* Right Side - Content & Other Articles */}
            <motion.div 
              className="order-1 lg:order-2 space-y-8"
              variants={sideContentVariants}
            >
              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {currentTab?.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {currentTab?.subtitle}
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/blog"
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                  >
                    {t('home.insights.exploreMore')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Other Articles */}
              <div className="space-y-6">
                {otherInsights.slice(0, 2).map((insight, index) => {
                  const dateInfo = formatDate(insight.date);
                  return (
                    <motion.div
                      key={insight.id}
                      variants={articleItemVariants}
                      whileHover={{ 
                        x: 10,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Link 
                        to={`/blog/${insight.id}`} 
                        className="group flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 text-center">
                          <div className="text-2xl font-bold text-gray-900">{dateInfo.day}</div>
                          <div className="text-sm text-gray-500 uppercase">{dateInfo.month}</div>
                        </div>
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <motion.img
                            src={insight.image}
                            alt={insight.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {insight.excerpt}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{insight.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InsightsSection;
