import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Search, Filter, ShoppingCart, User, Package } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';
import Modal from '../components/Modal';

const Carts = () => {
  const {
    carts,
    currentCart,
    isLoading,
    error,
    fetchCarts,
    getUserCart,
    updateCartStatus,
    deleteCart,
    clearError
  } = useCartStore();

  const { users } = useUserStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const handleViewCart = async (cart) => {
    setSelectedCart(cart);
    setShowModal(true);
  };

  const handleDelete = async (cartId) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      await deleteCart(cartId);
    }
  };

  const handleStatusChange = async (cartId, newStatus) => {
    await updateCartStatus(cartId, newStatus);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Unknown User';
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.email : 'Unknown';
  };

  const filteredCarts = carts.filter(cart => {
    const matchesSearch = 
      getUserName(cart.user).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(cart.user).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cart.status === statusFilter;
    const matchesUser = userFilter === 'all' || cart.user === userFilter;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCartTotal = (cart) => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalItems = (cart) => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Carts: {carts.length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredCarts.length} of {carts.length} carts
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={clearError} className="float-right">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Carts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No carts found
                  </td>
                </tr>
              ) : (
                filteredCarts.map((cart) => (
                  <tr key={cart._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getUserName(cart.user)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getUserEmail(cart.user)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getTotalItems(cart)} items
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {cart.items?.length || 0} products
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${calculateCartTotal(cart).toFixed(2)}
                      </div>
                      {cart.appliedCoupons && cart.appliedCoupons.length > 0 && (
                        <div className="text-xs text-green-600">
                          {cart.appliedCoupons.length} coupon(s) applied
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={cart.status}
                        onChange={(e) => handleStatusChange(cart._id, e.target.value)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(cart.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cart.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewCart(cart)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Cart Details"
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cart._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Cart"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Details Modal */}
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false);
        setSelectedCart(null);
      }}>
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Cart Details
            </h2>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedCart(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          {selectedCart && (
            <div className="p-6">
              {/* User Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name:</label>
                      <p className="text-sm text-gray-900">{getUserName(selectedCart.user)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email:</label>
                      <p className="text-sm text-gray-900">{getUserEmail(selectedCart.user)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cart Status:</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCart.status)}`}>
                        {selectedCart.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created:</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedCart.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Items</h3>
                {selectedCart.items && selectedCart.items.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCart.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product?.name?.en || item.product?.name || 'Product Name'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Options:</p>
                                <div className="text-sm text-gray-600">
                                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                                    <span key={key} className="inline-block mr-2">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items in this cart
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${calculateCartTotal(selectedCart).toFixed(2)}
                      </span>
                    </div>
                    {selectedCart.appliedCoupons && selectedCart.appliedCoupons.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discounts:</span>
                        <span className="text-sm font-medium text-green-600">
                          -${(selectedCart.totalDiscount || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-900">Total:</span>
                        <span className="text-base font-bold text-gray-900">
                          ${(selectedCart.total || calculateCartTotal(selectedCart)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applied Coupons */}
              {selectedCart.appliedCoupons && selectedCart.appliedCoupons.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Applied Coupons</h3>
                  <div className="space-y-2">
                    {selectedCart.appliedCoupons.map((coupon, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-800">
                            {coupon.code}
                          </span>
                          <span className="text-sm text-green-600">
                            -${coupon.discountAmount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCart.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedCart.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Carts; 