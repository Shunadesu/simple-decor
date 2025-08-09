import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send data to server
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Tin nhắn đã được gửi thành công!');
        reset();
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.info.phone'),
      value: '(+84) 24-66820188',
      description: 'Hỗ trợ 24/7'
    },
    {
      icon: Mail,
      title: t('contact.info.email'),
      value: 'info@simpledecor.vn',
      description: 'Phản hồi trong 24h'
    },
    {
      icon: MapPin,
      title: t('contact.info.address'),
      value: 'Van Boi Village, Nhat Tuu Commune',
      description: 'Kim Bang District, Ha Nam Province, Vietnam'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      value: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
      description: 'Thứ 7: 8:00 - 12:00'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Liên hệ với chúng tôi để nhận tư vấn miễn phí và báo giá chi tiết
          </p>
        </div>
      </section>

      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Vui lòng nhập họ tên' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập họ và tên"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Vui lòng nhập email',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.whatsapp')}
                  </label>
                  <input
                    type="tel"
                    {...register('whatsapp')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+84 xxx xxx xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.country')}
                  </label>
                  <select
                    {...register('country')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Chọn quốc gia</option>
                    <option value="vietnam">Việt Nam</option>
                    <option value="usa">Hoa Kỳ</option>
                    <option value="europe">Châu Âu</option>
                    <option value="asia">Châu Á</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.interestedProduct')}
                </label>
                <select
                  {...register('interestedProduct')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Chọn sản phẩm quan tâm</option>
                  <option value="storage-baskets">Storage Baskets</option>
                  <option value="decorative-items">Decorative Items</option>
                  <option value="kitchen-ware">Kitchen Ware</option>
                  <option value="furniture">Furniture</option>
                  <option value="custom">Sản phẩm tùy chỉnh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tin nhắn
                </label>
                <textarea
                  {...register('message', { required: 'Vui lòng nhập nội dung tin nhắn' })}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mô tả yêu cầu của bạn..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('contact.form.submit')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-gray-700 font-medium">{info.value}</p>
                      <p className="text-gray-500 text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-xl p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bản đồ sẽ được tích hợp tại đây</p>
                <p className="text-sm text-gray-500 mt-2">
                  Van Boi Village, Nhat Tuu Commune<br />
                  Kim Bang District, Ha Nam Province
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 