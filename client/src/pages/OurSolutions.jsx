import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Settings, Users, Globe, Award, Shield } from 'lucide-react';

const OurSolutions = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: Lightbulb,
      title: t('ourSolutions.solutions.customDesign.title'),
      description: t('ourSolutions.solutions.customDesign.description'),
      features: t('ourSolutions.solutions.customDesign.features', { returnObjects: true })
    },
    {
      icon: Settings,
      title: t('ourSolutions.solutions.smartManufacturing.title'),
      description: t('ourSolutions.solutions.smartManufacturing.description'),
      features: t('ourSolutions.solutions.smartManufacturing.features', { returnObjects: true })
    },
    {
      icon: Users,
      title: t('ourSolutions.solutions.customerService.title'),
      description: t('ourSolutions.solutions.customerService.description'),
      features: t('ourSolutions.solutions.customerService.features', { returnObjects: true })
    },
    {
      icon: Globe,
      title: t('ourSolutions.solutions.globalDistribution.title'),
      description: t('ourSolutions.solutions.globalDistribution.description'),
      features: t('ourSolutions.solutions.globalDistribution.features', { returnObjects: true })
    }
  ];

  const technologies = [
    {
      icon: Award,
      title: t('ourSolutions.technologies.isoQuality.title'),
      description: t('ourSolutions.technologies.isoQuality.description')
    },
    {
      icon: Shield,
      title: t('ourSolutions.technologies.environmentalSafety.title'),
      description: t('ourSolutions.technologies.environmentalSafety.description')
    },
    {
      icon: Settings,
      title: t('ourSolutions.technologies.advancedTechnology.title'),
      description: t('ourSolutions.technologies.advancedTechnology.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-50 text-primary-600 py-20 mt-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('ourSolutions.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('ourSolutions.subtitle')}
          </p>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('ourSolutions.overviewTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('ourSolutions.overviewDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <solution.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('ourSolutions.technologiesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <tech.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('ourSolutions.processTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourSolutions.process.consultation.title')}</h3>
              <p className="text-gray-600">{t('ourSolutions.process.consultation.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourSolutions.process.design.title')}</h3>
              <p className="text-gray-600">{t('ourSolutions.process.design.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourSolutions.process.manufacturing.title')}</h3>
              <p className="text-gray-600">{t('ourSolutions.process.manufacturing.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourSolutions.process.delivery.title')}</h3>
              <p className="text-gray-600">{t('ourSolutions.process.delivery.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('ourSolutions.ctaTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('ourSolutions.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t('ourSolutions.contactNow')}
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-800 transition-colors">
              {t('ourSolutions.viewQuote')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurSolutions; 