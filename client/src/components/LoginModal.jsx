import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      clearError(); // Clear any previous errors when modal opens
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for register form
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        toast.error('Vui lòng nhập họ');
        return;
      }
      if (!formData.lastName.trim()) {
        toast.error('Vui lòng nhập tên');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Vui lòng nhập email');
        return;
      }
      if (!formData.password.trim()) {
        toast.error('Vui lòng nhập mật khẩu');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
    }
    
    // Validation for login form
    if (isLogin) {
      if (!formData.email.trim()) {
        toast.error('Vui lòng nhập email');
        return;
      }
      if (!formData.password.trim()) {
        toast.error('Vui lòng nhập mật khẩu');
        return;
      }
    }
    
    if (isLogin) {
      try {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });
        
        if (result.success) {
          toast.success('Đăng nhập thành công!');
          onClose();
          setFormData({ email: '', password: '', firstName: '', lastName: '' });
        } else {
          toast.error(result.error || 'Đăng nhập thất bại');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đăng nhập');
      }
    } else {
      try {
        // Create a valid username from email
        const emailPrefix = formData.email.split('@')[0];
        const username = emailPrefix.length >= 3 ? emailPrefix : emailPrefix + 'user';
        
        const result = await register({
          username: username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        
        if (result.success) {
          toast.success('Đăng ký thành công!');
          onClose();
          setFormData({ email: '', password: '', firstName: '', lastName: '' });
        } else {
          toast.error(result.error || 'Đăng ký thất bại');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đăng ký');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nhập họ"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nhập tên"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal; 