import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, Ship, Shield, Headphones, Settings, Truck, Heart, Award, Zap, Globe, Wrench, CheckCircle, Package, Search, Clock, Star, Target, Layers, Database, Loader } from 'lucide-react';
import servicesApi from '../services/servicesApi';
import ConsultationModal from '../components/ConsultationModal';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const currentLanguage = i18n.language || 'vi';

  const iconComponents = {
    Users, FileText, Ship, Shield, Headphones, Settings,
    Truck, Heart, Award, Zap, Globe, Wrench, CheckCircle,
    Package, Search, Clock, Star, Target, Layers, Database
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories, featured services, and all services
      const [categoriesResponse, featuredResponse, servicesResponse] = await Promise.all([
        servicesApi.getServiceCategories(),
        servicesApi.getFeaturedServices(6),
        servicesApi.getServices({ status: 'active', limit: 50 })
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (featuredResponse.success) {
        setFeaturedServices(featuredResponse.data);
      }

      if (servicesResponse.success) {
        setServices(servicesResponse.data.services);
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const params = {
        status: 'active',
        limit: 50
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await servicesApi.getServices(params);
      
      if (response.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || Settings;
    return <IconComponent size={32} className="text-primary-600" />;
  };

  const handleInquiry = (service) => {
    setSelectedService({
      id: service._id,
      name: servicesApi.getLocalizedTitle(service, currentLanguage)
    });
    setIsConsultationModalOpen(true);
  };

  const closeConsultationModal = () => {
    setIsConsultationModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('nav.services')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dịch vụ toàn diện đáp ứng mọi nhu cầu của khách hàng
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  {typeof category.name === 'object' ? category.name[currentLanguage] : category.name} 
                  ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy dịch vụ
              </h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục để xem nhiều dịch vụ hơn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const title = servicesApi.getLocalizedTitle(service, currentLanguage);
                const description = servicesApi.getLocalizedDescription(service, currentLanguage);
                const shortDescription = servicesApi.getLocalizedShortDescription(service, currentLanguage);
                const features = servicesApi.getLocalizedFeatures(service, currentLanguage);
                const serviceImageUrl = servicesApi.getServiceImageUrl(service);
                const priceLabel = servicesApi.getPriceLabel(service.price, currentLanguage);
                
                return (
                  <div key={service._id} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Service Image or Icon */}
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                      {serviceImageUrl ? (
                        <img
                          src={serviceImageUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        renderIcon(service.icon)
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">
                        {title}
                      </h3>
                      {service.isFeatured && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {shortDescription || description.substring(0, 150) + (description.length > 150 ? '...' : '')}
                    </p>

                    {/* Features */}
                    {features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {features.length > 4 && (
                          <li className="text-sm text-gray-500 italic">
                            +{features.length - 4} tính năng khác
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{priceLabel}</span>
                        {service.duration && (
                          <div className="text-xs text-gray-500 mt-1">
                            ⏱️ {service.duration}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleInquiry(service)}
                        className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Tư vấn
                      </button>
                    </div>

                    {/* Category */}
                    <div className="mt-4">
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {servicesApi.getCategoryLabel(service.category, currentLanguage)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
              <section className="py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn Sàng Bắt Đầu Dự Án?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn miễn phí
          </p>
          <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Liên Hệ Ngay
          </button>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={closeConsultationModal}
        service={selectedService}
      />
    </div>
  );
};

export default Services; 