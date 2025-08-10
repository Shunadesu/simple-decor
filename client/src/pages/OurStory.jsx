import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Users, Award, Globe, Heart } from 'lucide-react';

const OurStory = () => {
  const { t } = useTranslation();

  const milestones = [
    {
      year: '2014',
      title: t('ourStory.milestones.2014.title'),
      description: t('ourStory.milestones.2014.description'),
      icon: Clock
    },
    {
      year: '2016',
      title: t('ourStory.milestones.2016.title'),
      description: t('ourStory.milestones.2016.description'),
      icon: Globe
    },
    {
      year: '2018',
      title: t('ourStory.milestones.2018.title'),
      description: t('ourStory.milestones.2018.description'),
      icon: Award
    },
    {
      year: '2020',
      title: t('ourStory.milestones.2020.title'),
      description: t('ourStory.milestones.2020.description'),
      icon: Users
    },
    {
      year: '2024',
      title: t('ourStory.milestones.2024.title'),
      description: t('ourStory.milestones.2024.description'),
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-50 text-primary-600 py-20 mt-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('ourStory.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('ourStory.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('ourStory.storyTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('ourStory.storyParagraph1')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('ourStory.storyParagraph2')}
              </p>
              <p className="text-lg text-gray-600">
                {t('ourStory.storyParagraph3')}
              </p>
            </div>
            <div className="bg-gray-200 rounded-xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🏭</span>
                <p className="text-gray-600">{t('ourStory.factoryImageAlt')}</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              {t('ourStory.milestonesTitle')}
            </h2>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <milestone.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600">{milestone.description}</p>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-xl p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📈</span>
                      <p className="text-gray-600">{t('ourStory.imageAlt')} {milestone.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('ourStory.coreValuesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourStory.values.sustainability.title')}</h3>
              <p className="text-gray-600">{t('ourStory.values.sustainability.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourStory.values.quality.title')}</h3>
              <p className="text-gray-600">{t('ourStory.values.quality.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourStory.values.customer.title')}</h3>
              <p className="text-gray-600">{t('ourStory.values.customer.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('ourStory.values.global.title')}</h3>
              <p className="text-gray-600">{t('ourStory.values.global.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory; 