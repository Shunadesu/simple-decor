import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Truck, DollarSign } from 'lucide-react';

const CustomerSatisfaction = () => {
  const { t, i18n } = useTranslation();
  
  // Debug logging
  console.log('CustomerSatisfaction - Current language:', i18n.language);
  console.log('CustomerSatisfaction - Ready:', i18n.isInitialized);
  console.log('CustomerSatisfaction - Available resources:', Object.keys(i18n.store?.data || {}));
  console.log('CustomerSatisfaction - Current namespace data:', i18n.store?.data?.[i18n.language]?.translation ? Object.keys(i18n.store.data[i18n.language].translation).slice(0, 10) : 'No data');
  console.log('CustomerSatisfaction - Title translation:', t('customerSatisfaction.title'));
  console.log('CustomerSatisfaction - Has title key?', i18n.exists('customerSatisfaction.title'));
  
  // Force reload if key missing
  React.useEffect(() => {
    if (i18n.isInitialized && !i18n.exists('customerSatisfaction.title')) {
      console.log('CustomerSatisfaction - Force reloading resources...');
      i18n.reloadResources([i18n.language]);
    }
  }, [i18n.language, i18n.isInitialized]);

  const features = [
    {
      id: 'qualityControl',
      icon: CheckCircle,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      id: 'shippingOptimization',
      icon: Truck,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      id: 'productRange',
      icon: DollarSign,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-400 rounded-full blur-2xl"></div>
      </div>

      <div className="container-custom relative z-[5]">
        {/* Header with Handshake Icon */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white text-3xl">🤝</div>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto leading-tight">
            "{t('customerSatisfaction.title')}"
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('customerSatisfaction.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <div key={feature.id} className="text-center group">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="px-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {t(`customerSatisfaction.features.${feature.id}.title`)}
                  </h3>
                  
                  <p className="text-base font-semibold text-primary-600 mb-4">
                    {t(`customerSatisfaction.features.${feature.id}.subtitle`)}
                  </p>
                  
                  <div className="w-16 h-0.5 bg-primary-300 mx-auto mb-4"></div>
                  
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    {t(`customerSatisfaction.features.${feature.id}.description`)}
                  </p>
                </div>
                
                {/* Separator Line (except for last item) */}
                {index < features.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-px h-32 bg-gray-200 transform -translate-y-1/2 translate-x-6"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-16">
          <div className="w-32 h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSatisfaction;
