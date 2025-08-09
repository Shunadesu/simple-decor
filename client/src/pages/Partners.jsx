import React from 'react';
import { useTranslation } from 'react-i18next';
import {  Globe, Award, Users } from 'lucide-react';

const Partners = () => {
  const { t, i18n, ready } = useTranslation();
  
  // Debug logging
  console.log('Partners - i18n ready:', ready);
  console.log('Partners - Current language:', i18n.language);  
  console.log('Partners - Title translation:', t('partners.title'));
  console.log('Partners - Has title key?', i18n.exists('partners.title'));
  
  // Show loading if translations not ready
  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading translations...</div>
    </div>;
  }

  const partners = [
    {
      key: 'globalImport',
      logo: '🏢'
    },
    {
      key: 'europeanDecor',
      logo: '🏭'
    },
    {
      key: 'asiaPacific',
      logo: '🌏'
    },
    {
      key: 'nordicHome',
      logo: '🏠'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      key: 'longTerm'
    },
    {
      icon: Globe,
      key: 'globalNetwork'
    },
    {
      icon: Award,
      key: 'qualityAssurance'
    },
    {
      icon: Users,
      key: 'support'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('partners.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('partners.strategicPartnersTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('partners.strategicPartnersSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(`partners.list.${partner.key}.name`)}
                </h3>
                <p className="text-green-600 font-medium mb-2">
                  {t(`partners.list.${partner.key}.country`)}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  {t(`partners.list.${partner.key}.description`)}
                </p>
                <p className="text-gray-500 text-xs">
                  {t(`partners.list.${partner.key}.years`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('partners.benefitsTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('partners.benefitsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t(`partners.benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`partners.benefits.${benefit.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Partner Section */}
              <section className="py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('partners.becomePartnerTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('partners.becomePartnerSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              {t('partners.contactNow')}
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-800 transition-colors">
              {t('partners.downloadBrochure')}
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('partners.globalNetworkTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('partners.globalNetworkSubtitle')}
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Globe size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('partners.mapPlaceholder')}</p>
              <p className="text-sm text-gray-500 mt-2">
                {t('partners.mapDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners; 