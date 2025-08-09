import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Gift, Star, ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const PromoPopup = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
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

  // Auto-advance to step 2 after showing promo
  useEffect(() => {
    if (isOpen && currentStep === 1) {
      const timer = setTimeout(() => {
        setCurrentStep(2);
      }, 3000); // Show promo for 3 seconds then show form

      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep]);

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call for quote request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the provided onSubmit function
      if (onSubmit) {
        await onSubmit(data);
      }
      
      toast.success('🎉 Đăng ký báo giá thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
      
      // Set flag to not show popup again for 7 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('promoPopupShown', JSON.stringify({
        shown: true,
        expiry: expiryDate.toISOString()
      }));
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Set flag to not show popup again for 1 day when closed without action
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    localStorage.setItem('promoPopupShown', JSON.stringify({
      shown: true,
      expiry: expiryDate.toISOString()
    }));
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        
        {/* Step 1: Promotional Content */}
        {currentStep === 1 && (
          <div className="relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white p-8 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-yellow-800" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  🎉 Ưu Đại Đặc Biệt!
                </h2>
                
                <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full inline-block font-bold text-lg mb-4">
                  MIỄN PHÍ BÁO GIÁ
                </div>
                
                <p className="text-lg opacity-90 mb-4">
                  Nhận báo giá chi tiết cho sản phẩm nội thất
                </p>
                
                <div className="flex items-center justify-center space-x-1 text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-white">Đánh giá 5 sao</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Bạn sẽ nhận được:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Báo giá chi tiết và chính xác</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Tư vấn miễn phí từ chuyên gia</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Ưu đái giảm giá lên đến 15%</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Hỗ trợ vận chuyển toàn quốc</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-gray-500 mb-2">Chỉ cần 30 giây để đăng ký</div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-primary-600 h-1 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {currentStep === 2 && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  Đăng Ký Nhận Báo Giá Miễn Phí
                </h2>
                <p className="text-primary-100 text-sm">
                  Chỉ mất 30 giây • Hoàn toàn miễn phí
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Vui lòng nhập họ tên' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập họ và tên của bạn"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                      {...register('phone', { 
                        required: 'Vui lòng nhập số điện thoại',
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: 'Số điện thoại không hợp lệ'
                        }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0xxx xxx xxx"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email không hợp lệ'
                        }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="example@email.com (không bắt buộc)"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sản phẩm quan tâm
                  </label>
                  <select
                    {...register('productInterest')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Chọn sản phẩm quan tâm</option>
                    <option value="storage-baskets">Giỏ lưu trữ & Tổ chức</option>
                    <option value="decorative-items">Đồ trang trí nội thất</option>
                    <option value="kitchen-ware">Đồ dùng nhà bếp</option>
                    <option value="furniture">Nội thất tre & gỗ</option>
                    <option value="home-accessories">Phụ kiện gia đình</option>
                    <option value="custom-order">Đặt hàng theo yêu cầu</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Nhận Báo Giá Miễn Phí</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-3">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  của chúng tôi
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoPopup;
