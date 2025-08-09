import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { number: '10+', label: 'Năm kinh nghiệm' },
    { number: '50+', label: 'Quốc gia xuất khẩu' },
    { number: '1000+', label: 'Khách hàng hài lòng' },
    { number: '100%', label: 'Sản phẩm tự nhiên' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Bền vững',
      description: 'Cam kết sử dụng vật liệu tự nhiên và thân thiện môi trường'
    },
    {
      icon: Award,
      title: 'Chất lượng',
      description: 'Đảm bảo chất lượng cao nhất trong mọi sản phẩm'
    },
    {
      icon: Users,
      title: 'Khách hàng',
      description: 'Đặt lợi ích khách hàng lên hàng đầu'
    },
    {
      icon: Globe,
      title: 'Toàn cầu',
      description: 'Phục vụ khách hàng trên toàn thế giới'
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
            Khám phá câu chuyện và sứ mệnh của chúng tôi
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
                Simple decor được thành lập với tầm nhìn tạo ra những sản phẩm từ vật liệu tự nhiên, 
                mang lại giá trị thẩm mỹ và thực tiễn cho cuộc sống hiện đại.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Chúng tôi tin rằng thiết kế tối giản không chỉ là xu hướng mà còn là cách sống 
                bền vững, tôn trọng thiên nhiên và tạo ra những sản phẩm có ý nghĩa.
              </p>
              <p className="text-lg text-gray-600">
                Từ những ngày đầu với một xưởng nhỏ, đến nay chúng tôi đã phát triển thành 
                một doanh nghiệp xuất khẩu với mạng lưới khách hàng toàn cầu.
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