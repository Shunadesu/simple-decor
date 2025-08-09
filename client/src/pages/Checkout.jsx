import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  Check, 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Minus,
  Plus,
  Trash2
} from 'lucide-react';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import { orderApi } from '../services';
import Toast from '../components/Toast';
import { formatPrice } from '../utils/currency';
import { getCartItemImageUrl, createImageProps } from '../utils/image';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    items, 
    getTotalPriceWithCurrency, 
    getTotalItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    currency 
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      // Billing information
      billingFirstName: user?.firstName || '',
      billingLastName: user?.lastName || '',
      billingEmail: user?.email || '',
      billingPhone: user?.phone || '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZipCode: '',
      billingCountry: 'Vietnam',
      
      // Shipping information
      shippingFirstName: user?.firstName || '',
      shippingLastName: user?.lastName || '',
      shippingPhone: user?.phone || '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZipCode: '',
      shippingCountry: 'Vietnam',
      
      // Order notes
      notes: ''
    }
  });

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  // Auto-fill shipping info when "same as billing" is checked
  useEffect(() => {
    if (sameAsBilling) {
      const billing = getValues();
      setValue('shippingFirstName', billing.billingFirstName);
      setValue('shippingLastName', billing.billingLastName);
      setValue('shippingPhone', billing.billingPhone);
      setValue('shippingAddress', billing.billingAddress);
      setValue('shippingCity', billing.billingCity);
      setValue('shippingState', billing.billingState);
      setValue('shippingZipCode', billing.billingZipCode);
      setValue('shippingCountry', billing.billingCountry);
    }
  }, [sameAsBilling, watch, setValue, getValues]);

  const steps = [
    { id: 1, title: t('checkout.steps.shipping'), icon: Truck },
    { id: 2, title: t('checkout.steps.payment'), icon: CreditCard },
    { id: 3, title: t('checkout.steps.review'), icon: Check }
  ];

  const cartTotal = getTotalPriceWithCurrency();
  const subtotal = cartTotal.amount;
  const cartCurrency = cartTotal.currency;
  
  // Calculate shipping based on currency (example logic)
  const shippingThreshold = cartCurrency === 'VND' ? 1000000 : (cartCurrency === 'USD' ? 50 : 40);
  const shippingCost = cartCurrency === 'VND' ? 50000 : (cartCurrency === 'USD' ? 5 : 4);
  const shipping = subtotal > shippingThreshold ? 0 : shippingCost;
  
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    setToast({ message: t('cart.remove'), type: 'success' });
  };

  const handleStepSubmit = (data) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit(data);
    }
  };

  const handleFinalSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price || item.price?.amount || 0
        })),
        shippingAddress: {
          firstName: data.shippingFirstName,
          lastName: data.shippingLastName,
          phone: data.shippingPhone,
          address: data.shippingAddress,
          city: data.shippingCity,
          state: data.shippingState,
          zipCode: data.shippingZipCode,
          country: data.shippingCountry
        },
        billingAddress: {
          firstName: data.billingFirstName,
          lastName: data.billingLastName,
          email: data.billingEmail,
          phone: data.billingPhone,
          address: data.billingAddress,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZipCode,
          country: data.billingCountry
        },
        paymentMethod,
        notes: data.notes,
        totals: {
          subtotal,
          shipping,
          tax,
          total
        }
      };

      // Add guest information if not authenticated
      if (!isAuthenticated) {
        orderData.guestInfo = {
          email: data.billingEmail,
          firstName: data.billingFirstName,
          lastName: data.billingLastName,
          phone: data.billingPhone
        };
      }

      let response;
      if (isAuthenticated) {
        response = await orderApi.createOrderFromUserCart(orderData);
      } else {
        const guestId = orderApi.getOrCreateGuestId();
        orderData.guestId = guestId;
        response = await orderApi.createOrderFromGuestCart(orderData);
      }

      // Clear cart after successful order
      clearCart();
      
      setToast({ 
        message: t('checkout.orderPlaced'), 
        type: 'success' 
      });

      // Navigate to order confirmation or home page
      setTimeout(() => {
        navigate(`/order-confirmation/${response.order._id}`, { 
          state: { orderData: response.order } 
        });
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      setToast({ 
        message: error.response?.data?.message || t('checkout.orderError'), 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span 
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-primary-500" />
                    Thông tin giao hàng
                  </h2>

                  {/* Billing Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Thông tin thanh toán
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.firstName')} *
                        </label>
                        <input
                          type="text"
                          {...register('billingFirstName', { required: 'Vui lòng nhập họ' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Nhập họ"
                        />
                        {errors.billingFirstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.lastName')} *
                        </label>
                        <input
                          type="text"
                          {...register('billingLastName', { required: 'Vui lòng nhập tên' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Nhập tên"
                        />
                        {errors.billingLastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingLastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.email')} *
                        </label>
                        <input
                          type="email"
                          {...register('billingEmail', { 
                            required: 'Vui lòng nhập email',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Email không hợp lệ'
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="example@email.com"
                        />
                        {errors.billingEmail && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingEmail.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.phone')} *
                        </label>
                        <input
                          type="tel"
                          {...register('billingPhone', { required: 'Vui lòng nhập số điện thoại' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="0912345678"
                        />
                        {errors.billingPhone && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingPhone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.address')} *
                        </label>
                        <input
                          type="text"
                          {...register('billingAddress', { required: 'Vui lòng nhập địa chỉ' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Nhập địa chỉ chi tiết"
                        />
                        {errors.billingAddress && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.city')} *
                        </label>
                        <input
                          type="text"
                          {...register('billingCity', { required: 'Vui lòng nhập thành phố' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Hồ Chí Minh"
                        />
                        {errors.billingCity && (
                          <p className="text-red-500 text-sm mt-1">{errors.billingCity.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.state')}
                        </label>
                        <input
                          type="text"
                          {...register('billingState')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Thành phố Hồ Chí Minh"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.zipCode')}
                        </label>
                        <input
                          type="text"
                          {...register('billingZipCode')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="700000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.country')}
                        </label>
                        <select
                          {...register('billingCountry')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Vietnam">Việt Nam</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Thailand">Thailand</option>
                          <option value="Malaysia">Malaysia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Địa chỉ giao hàng
                      </h3>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sameAsBilling}
                          onChange={(e) => setSameAsBilling(e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Giống địa chỉ thanh toán
                        </span>
                      </label>
                    </div>

                    {!sameAsBilling && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.firstName')} *
                          </label>
                          <input
                            type="text"
                            {...register('shippingFirstName', { required: !sameAsBilling && 'Vui lòng nhập họ' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nhập họ"
                          />
                          {errors.shippingFirstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.shippingFirstName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.lastName')} *
                          </label>
                          <input
                            type="text"
                            {...register('shippingLastName', { required: !sameAsBilling && 'Vui lòng nhập tên' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nhập tên"
                          />
                          {errors.shippingLastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.shippingLastName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.phone')} *
                          </label>
                          <input
                            type="tel"
                            {...register('shippingPhone', { required: !sameAsBilling && 'Vui lòng nhập số điện thoại' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="0912345678"
                          />
                          {errors.shippingPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.shippingPhone.message}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.address')} *
                          </label>
                          <input
                            type="text"
                            {...register('shippingAddress', { required: !sameAsBilling && 'Vui lòng nhập địa chỉ' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nhập địa chỉ chi tiết"
                          />
                          {errors.shippingAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.city')} *
                          </label>
                          <input
                            type="text"
                            {...register('shippingCity', { required: !sameAsBilling && 'Vui lòng nhập thành phố' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Hồ Chí Minh"
                          />
                          {errors.shippingCity && (
                            <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.state')}
                          </label>
                          <input
                            type="text"
                            {...register('shippingState')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Thành phố Hồ Chí Minh"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.zipCode')}
                          </label>
                          <input
                            type="text"
                            {...register('shippingZipCode')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="700000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.country')}
                          </label>
                          <select
                            {...register('shippingCountry')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="Vietnam">Việt Nam</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Malaysia">Malaysia</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Thanh toán khi nhận hàng (COD)
                            </p>
                            <p className="text-sm text-gray-500">
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                      <input
                        type="radio"
                        value="bank_transfer"
                        disabled
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Chuyển khoản ngân hàng
                            </p>
                            <p className="text-sm text-gray-500">
                              Tính năng đang phát triển
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng (tùy chọn)
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ghi chú về đơn hàng, yêu cầu đặc biệt..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-primary-500" />
                    Xác nhận đơn hàng
                  </h2>

                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Thông tin đơn hàng
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tổng phụ:</span>
                          <span>{formatPrice(subtotal, cartCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Phí vận chuyển:</span>
                          <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping, cartCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>VAT (10%):</span>
                          <span>{formatPrice(tax, cartCurrency)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Tổng cộng:</span>
                          <span className="text-primary-600">{formatPrice(total, cartCurrency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Phương thức thanh toán
                      </h3>
                      <p className="text-gray-600">
                        {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Địa chỉ giao hàng
                      </h3>
                      <div className="text-gray-600">
                        <p>{watch('shippingFirstName')} {watch('shippingLastName')}</p>
                        <p>{watch('shippingPhone')}</p>
                        <p>{watch('shippingAddress')}</p>
                        <p>{watch('shippingCity')}, {watch('shippingState')} {watch('shippingZipCode')}</p>
                        <p>{watch('shippingCountry')}</p>
                      </div>
                    </div>

                    {watch('notes') && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ghi chú
                        </h3>
                        <p className="text-gray-600">{watch('notes')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${
                    currentStep === 1 ? 'ml-auto' : ''
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Đang xử lý...
                    </span>
                  ) : currentStep === 3 ? (
                    'Đặt hàng'
                  ) : (
                    'Tiếp tục'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-primary-500" />
                Đơn hàng ({getTotalItems()} sản phẩm)
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <img
                      {...createImageProps(
                        getCartItemImageUrl(item),
                        item.name,
                        '/placeholder-product.svg'
                      )}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-semibold">
                        {formatPrice(item.price?.amount || item.price || 0, item.price?.currency || cartCurrency)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-2 text-sm text-gray-600 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-2 p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tổng phụ:</span>
                  <span>{formatPrice(subtotal, cartCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping, cartCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (10%):</span>
                  <span>{formatPrice(tax, cartCurrency)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{formatPrice(total, cartCurrency)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="text-sm text-primary-700 font-medium">
                    🎉 Miễn phí vận chuyển cho đơn hàng trên {formatPrice(shippingThreshold, cartCurrency)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Checkout;
