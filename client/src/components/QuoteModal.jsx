import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const QuoteModal = ({ isOpen, onClose }) => {
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
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Yêu cầu báo giá đã được gửi thành công!');
        reset();
        onClose();
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Nhận Báo Giá Miễn Phí
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Điền thông tin để nhận báo giá chi tiết cho sản phẩm của chúng tôi
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Vui lòng nhập họ tên' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+84 xxx xxx xxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sản phẩm quan tâm
              </label>
              <select
                {...register('product')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Chọn sản phẩm</option>
                <option value="storage-baskets">Storage Baskets</option>
                <option value="decorative-items">Decorative Items</option>
                <option value="kitchen-ware">Kitchen Ware</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                {...register('notes')}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Mô tả yêu cầu cụ thể..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Gửi yêu cầu</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // Download catalogue
                  toast.success('Đang tải catalogue...');
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>PDF</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal; 