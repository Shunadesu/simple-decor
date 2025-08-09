import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { number: '10+', label: t('about.stats.experience') },
    { number: '50+', label: t('about.stats.countries') },
    { number: '1000+', label: t('about.stats.customers') },
    { number: '100%', label: t('about.stats.naturalProducts') }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.sustainability.title'),
      description: t('about.values.sustainability.description')
    },
    {
      icon: Award,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: Users,
      title: t('about.values.customer.title'),
      description: t('about.values.customer.description')
    },
    {
      icon: Globe,
      title: t('about.values.global.title'),
      description: t('about.values.global.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.stories')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.story.description1')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.story.description2')}
              </p>
              <p className="text-lg text-gray-600">
                {t('about.story.description3')}
              </p>
            </div>
            <div className="bg-gray-200 rounded-xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🏭</span>
                <p className="text-gray-600">Hình ảnh xưởng sản xuất</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.solutions')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp giải pháp toàn diện cho mọi nhu cầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sản Xuất Tùy Chỉnh
              </h3>
              <p className="text-gray-600">
                Đáp ứng mọi yêu cầu thiết kế và kích thước theo đơn hàng của khách hàng
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Xuất Khẩu Toàn Cầu
              </h3>
              <p className="text-gray-600">
                Hỗ trợ đầy đủ thủ tục xuất khẩu và vận chuyển đến mọi quốc gia
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Dịch Vụ Hậu Mãi
              </h3>
              <p className="text-gray-600">
                Hỗ trợ khách hàng sau bán hàng và bảo hành sản phẩm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
              <section className="py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('about.careers')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tham gia cùng chúng tôi trong hành trình phát triển và sáng tạo
          </p>
          <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Xem Cơ Hội Nghề Nghiệp
          </button>
        </div>
      </section>
    </div>
  );
};

export default About; 