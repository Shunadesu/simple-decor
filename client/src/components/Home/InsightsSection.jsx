import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, TrendingUp, Building, Heart } from 'lucide-react';

const InsightsSection = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = [
    {
      id: 'business',
      label: 'FOR BUSINESS',
      icon: Building,
      title: 'For Business',
      subtitle: 'Browse through the newest business insights from manufacturing processes, consultation, to handicraft industry news and information...',
      color: 'green'
    },
    {
      id: 'growth',
      label: 'FOR GROWTH',
      icon: TrendingUp,
      title: 'For Growth',
      subtitle: 'Discover growth strategies and market insights that drive sustainable business development...',
      color: 'blue'
    },
    {
      id: 'society',
      label: 'FOR SOCIETY',
      icon: Heart,
      title: 'For Society',
      subtitle: 'Explore our commitment to social responsibility and community impact initiatives...',
      color: 'purple'
    }
  ];

  // Sample data - in the future this could come from API
  const sampleInsights = {
    business: [
      {
        id: 1,
        title: 'Ha Nam: The Source of the Inspiring Journey of Simple Decor',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '26 Jul',
        readTime: '5 min read',
        category: 'Business Journey',
        excerpt: 'Discover how our journey began in Ha Nam province and how it shaped our commitment to sustainable craftsmanship.',
        featured: true
      },
      {
        id: 2,
        title: 'The Complete Creation of a Plant Basket Made from Recycled Materials',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '19 Jun',
        readTime: '8 min read',
        category: 'Manufacturing',
        excerpt: 'Step-by-step process of creating beautiful plant baskets from recycled materials.',
        featured: false
      },
      {
        id: 3,
        title: 'Sustainable Manufacturing in the Handicraft Industry',
        image: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '15 Jun',
        readTime: '6 min read',
        category: 'Sustainability',
        excerpt: 'How traditional handicrafts can embrace modern sustainable practices.',
        featured: false
      }
    ],
    growth: [
      {
        id: 4,
        title: 'Market Expansion Strategies for Handicraft Businesses',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '20 Jul',
        readTime: '7 min read',
        category: 'Strategy',
        excerpt: 'Effective approaches to expand your handicraft business in competitive markets.',
        featured: true
      },
      {
        id: 5,
        title: 'Digital Transformation in Traditional Crafts',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '12 Jul',
        readTime: '9 min read',
        category: 'Technology',
        excerpt: 'Leveraging technology to preserve and promote traditional craftsmanship.',
        featured: false
      },
      {
        id: 6,
        title: 'Customer Experience in the Digital Age',
        image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '8 Jul',
        readTime: '5 min read',
        category: 'Customer Service',
        excerpt: 'Building meaningful customer relationships in an increasingly digital world.',
        featured: false
      }
    ],
    society: [
      {
        id: 7,
        title: 'Community Empowerment Through Handicraft Training',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '25 Jul',
        readTime: '6 min read',
        category: 'Community',
        excerpt: 'How our training programs empower local communities and preserve traditional skills.',
        featured: true
      },
      {
        id: 8,
        title: 'Environmental Impact of Sustainable Design',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '18 Jul',
        readTime: '7 min read',
        category: 'Environment',
        excerpt: 'Understanding how sustainable design practices benefit both business and environment.',
        featured: false
      },
      {
        id: 9,
        title: 'Cultural Heritage Preservation Through Modern Craft',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: '10 Jul',
        readTime: '8 min read',
        category: 'Culture',
        excerpt: 'Bridging traditional cultural practices with contemporary design sensibilities.',
        featured: false
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInsights(sampleInsights);
      setLoading(false);
    }, 500);
  }, []);

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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Insights</h2>
            <p className="text-lg text-gray-600">Explore all of our articles here...</p>
          </div>
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ color: '#7B8D5B' }}>
            Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all of our articles here...
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Featured Article */}
          {featuredInsight && (
            <div className="order-2 lg:order-1">
              <Link to={`/blog/${featuredInsight.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={featuredInsight.image}
                    alt={featuredInsight.title}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="inline-block bg-primary-600 px-3 py-1 text-sm font-medium rounded-full mb-3">
                        {featuredInsight.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {featuredInsight.title}
                      </h3>
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {featuredInsight.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Right Side - Content & Other Articles */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Tab Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {currentTab?.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {currentTab?.subtitle}
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                EXPLORE MORE
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Other Articles */}
            <div className="space-y-6">
              {otherInsights.slice(0, 2).map((insight) => {
                const dateInfo = formatDate(insight.date);
                return (
                  <Link 
                    key={insight.id} 
                    to={`/blog/${insight.id}`} 
                    className="group flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-gray-900">{dateInfo.day}</div>
                      <div className="text-sm text-gray-500 uppercase">{dateInfo.month}</div>
                    </div>
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={insight.image}
                        alt={insight.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
