import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MessageSquare, Phone, Mail, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import servicesApi from '../services/servicesApi';

const ConsultationModal = ({ isOpen, onClose, service }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Set service name when service changes
  useEffect(() => {
    if (service) {
      setValue('serviceName', service.name);
    }
  }, [service, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare consultation data
      const consultationData = {
        serviceId: service?.id,
        serviceName: service?.name,
        customerName: data.name,
        email: data.email,
        phone: data.phone,
        preferredContactMethod: data.contactMethod,
        message: data.message,
        preferredTime: data.preferredTime,
      };

      // Submit consultation request
      const response = await servicesApi.recordServiceInquiry(service?.id, consultationData);
      
      if (response.success) {
        toast.success('Yêu cầu tư vấn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
        reset();
        onClose();
      } else {
        toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Đăng ký tư vấn dịch vụ
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {service && (
            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-primary-800 mb-1">Dịch vụ:</h3>
              <p className="text-primary-700">{service.name}</p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Vui lòng điền thông tin để chúng tôi có thể tư vấn dịch vụ phù hợp nhất cho bạn
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Vui lòng nhập họ tên' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập họ và tên của bạn"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0xxx xxx xxx"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phương thức liên hệ ưu tiên
              </label>
              <select
                {...register('contactMethod')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="phone">Điện thoại</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="zalo">Zalo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian phù hợp để liên hệ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  {...register('preferredTime')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Chọn thời gian</option>
                  <option value="morning">Buổi sáng (8:00 - 12:00)</option>
                  <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                  <option value="evening">Buổi tối (18:00 - 20:00)</option>
                  <option value="anytime">Bất kỳ thời gian nào</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung cần tư vấn
              </label>
              <textarea
                {...register('message')}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Mô tả chi tiết về yêu cầu, thắc mắc hoặc vấn đề cần tư vấn..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Gửi yêu cầu tư vấn</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-600" />
                <span>Hotline: 1900 xxx xxx</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-600" />
                <span>Email: support@company.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
