import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, ShoppingCart } from 'lucide-react';
import useUserStore from '../stores/userStore';
import useCartStore from '../stores/cartStore';
import Modal from '../components/Modal';

// CartInfo component
const CartInfo = React.memo(({ userId }) => {
  const { getUserCart, fetchUserCart } = useCartStore();
  const cart = getUserCart(userId);
  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cart && !hasFetched.current && !isLoading) {
      hasFetched.current = true;
      setIsLoading(true);
      setError(null);
      
      fetchUserCart(userId)
        .then(() => {
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch cart for user:', userId, error);
          setError(error.message || 'Failed to fetch cart');
          setIsLoading(false);
          hasFetched.current = false; // Allow retry
        });
    }
  }, [userId, cart, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2" title="Loading cart...">
        <ShoppingCart size={16} className="text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2" title={`Error: ${error}`}>
        <ShoppingCart size={16} className="text-red-400" />
        <span className="text-sm text-red-500">Error</span>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex items-center gap-2" title="No cart data">
        <ShoppingCart size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">No data</span>
      </div>
    );
  }

  const itemCount = cart.items?.length || 0;
  const totalAmount = cart.items?.reduce((total, item) => {
    const price = item.price?.amount || item.product?.price?.amount || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0) || 0;

  if (itemCount === 0) {
    return (
      <div className="flex items-center gap-2" title="Cart is empty">
        <ShoppingCart size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">Empty</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" title={`Cart: ${itemCount} items, Total: $${totalAmount.toFixed(2)}`}>
      <ShoppingCart size={16} className="text-blue-500" />
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </div>
        <div className="text-gray-500">
          ${totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
});

CartInfo.displayName = 'CartInfo';

const Users = () => {
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    clearError
  } = useUserStore();

  const { fetchUserCart, getUserCart } = useCartStore();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const fetchedUsers = useRef(new Set());

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch cart for each user when users change - only once
  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      users.forEach(user => {
        // Only fetch if not already fetched
        if (!fetchedUsers.current.has(user._id)) {
          fetchedUsers.current.add(user._id);
          fetchUserCart(user._id).catch(error => {
            console.error('Failed to fetch cart for user:', user._id, error);
            // Remove from fetched set to allow retry
            fetchedUsers.current.delete(user._id);
          });
        }
      });
    }
  }, [users]); // Removed fetchUserCart and getUserCart from dependencies

  useEffect(() => {
    if (editingUser) {
      setFormData({
        username: editingUser.username || '',
        email: editingUser.email || '',
        password: '',
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
        phone: editingUser.phone || '',
        role: editingUser.role || 'user',
        status: editingUser.status || 'active'
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'user',
        status: 'active'
      });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = { ...formData };
    if (!editingUser && !userData.password) {
      alert('Password is required for new users');
      return;
    }
    
    if (editingUser && !userData.password) {
      delete userData.password;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser._id, userData);
      } else {
        await createUser(userData);
      }
      
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'user',
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    await updateUserStatus(userId, newStatus);
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredUsers.length} of {Array.isArray(users) ? users.length : 0} users
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cart
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName?.[0] || user.username?.[0] || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.username
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CartInfo userId={user._id} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Add/Edit User Modal */}
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false);
        setEditingUser(null);
      }}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {!editingUser && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Users; 