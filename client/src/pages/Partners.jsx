import React from 'react';
import { useTranslation } from 'react-i18next';
import {  Globe, Award, Users } from 'lucide-react';

const Partners = () => {
  const { t } = useTranslation();

  const partners = [
    {
      name: 'Global Import Co.',
      country: 'United States',
      logo: '🏢',
      description: 'Đối tác xuất khẩu chính tại thị trường Mỹ',
      years: '5+ năm hợp tác'
    },
    {
      name: 'European Decor Ltd.',
      country: 'Germany',
      logo: '🏭',
      description: 'Nhà phân phối độc quyền tại châu Âu',
      years: '3+ năm hợp tác'
    },
    {
      name: 'Asia Pacific Trading',
      country: 'Singapore',
      logo: '🌏',
      description: 'Đối tác chiến lược tại khu vực châu Á',
      years: '4+ năm hợp tác'
    },
    {
      name: 'Nordic Home Solutions',
      country: 'Sweden',
      logo: '🏠',
      description: 'Đối tác thương mại tại Bắc Âu',
      years: '2+ năm hợp tác'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Hợp tác lâu dài',
      description: 'Xây dựng mối quan hệ đối tác bền vững'
    },
    {
      icon: Globe,
      title: 'Mạng lưới toàn cầu',
      description: 'Tiếp cận thị trường quốc tế'
    },
    {
      icon: Award,
      title: 'Chất lượng đảm bảo',
      description: 'Cam kết chất lượng sản phẩm cao'
    },
    {
      icon: Users,
      title: 'Hỗ trợ tận tâm',
      description: 'Dịch vụ khách hàng 24/7'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('nav.partners')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Đối tác tin cậy trên toàn thế giới
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đối Tác Chiến Lược
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi tự hào được hợp tác với những đối tác uy tín trên toàn thế giới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-green-600 font-medium mb-2">
                  {partner.country}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  {partner.description}
                </p>
                <p className="text-gray-500 text-xs">
                  {partner.years}
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
              Lợi Ích Hợp Tác
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị chúng tôi mang lại cho đối tác
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
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
            Trở Thành Đối Tác
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bạn có muốn trở thành đối tác của chúng tôi? Hãy liên hệ để tìm hiểu thêm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Liên Hệ Ngay
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-800 transition-colors">
              Tải Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mạng Lưới Đối Tác Toàn Cầu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi có mặt tại hơn 50 quốc gia trên thế giới
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Globe size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Bản đồ đối tác sẽ được tích hợp tại đây</p>
              <p className="text-sm text-gray-500 mt-2">
                Hiển thị vị trí các đối tác trên toàn thế giới
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners; 