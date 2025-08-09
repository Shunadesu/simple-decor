import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  Calendar,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { orderApi } from '../services';
import useAuthStore from '../stores/authStore';
import Toast from '../components/Toast';

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(!order);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && orderId) {
        try {
          setLoading(true);
          // For guest orders, we might need email verification
          // This could be enhanced with email verification token
          const response = await orderApi.getOrderById(orderId);
          setOrder(response.order);
        } catch (error) {
          console.error('Failed to fetch order:', error);
          setToast({ 
            message: 'Không thể tải thông tin đơn hàng. Vui lòng thử lại.', 
            type: 'error' 
          });
          // Redirect to home after error
          setTimeout(() => navigate('/'), 3000);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId, order, navigate]);

  const handleShareOrder = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Đơn hàng #${order.orderNumber}`,
          text: `Đơn hàng của tôi tại Simple Decor`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setToast({ message: 'Đã sao chép link đơn hàng', type: 'success' });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'delivered':
        return 'text-primary-600 bg-primary-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'paid':
        return 'text-primary-600 bg-primary-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Đơn hàng #{order.orderNumber}
              </h2>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShareOrder}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </button>
              <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Tải về
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Trạng thái đơn hàng</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Trạng thái thanh toán</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {getPaymentStatusText(order.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Sản phẩm đã đặt
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.product?.name?.vi || item.product?.name || 'Sản phẩm'}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.product?.name?.vi || item.product?.name || 'Sản phẩm'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-primary-600">
                      {item.price?.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tổng phụ:</span>
                <span>{order.totals?.subtotal?.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span>
                  {order.totals?.shipping === 0 
                    ? 'Miễn phí' 
                    : `${order.totals?.shipping?.toLocaleString('vi-VN')} VND`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT:</span>
                <span>{order.totals?.tax?.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">
                  {order.totals?.total?.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              Địa chỉ giao hàng
            </h3>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {order.shippingAddress?.phone}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment & Contact Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
              Thông tin thanh toán
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">
                  {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                </p>
              </div>
              
              {(order.guestInfo || order.billingAddress) && (
                <div>
                  <p className="text-sm text-gray-500">Thông tin liên hệ</p>
                  <div className="space-y-1">
                    <p className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {order.guestInfo?.firstName || order.billingAddress?.firstName} {order.guestInfo?.lastName || order.billingAddress?.lastName}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {order.guestInfo?.email || order.billingAddress?.email}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.guestInfo?.phone || order.billingAddress?.phone}
                    </p>
                  </div>
                </div>
              )}

              {order.trackingNumber && (
                <div>
                  <p className="text-sm text-gray-500">Mã vận đơn</p>
                  <p className="font-medium text-primary-600">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ghi chú đơn hàng
            </h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Xem đơn hàng của tôi
            </Link>
          )}
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

export default OrderConfirmation;
