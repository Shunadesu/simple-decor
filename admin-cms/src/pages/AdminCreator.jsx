import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Shield, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const AdminCreator = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminList, setAdminList] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/api/admin/create', {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        permissions: data.permissions || []
      });

      toast.success('Admin created successfully!');
      reset();
      fetchAdmins(); // Refresh admin list
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/api/admin/list');
      setAdminList(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const roles = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full access to all features' },
    { value: 'admin', label: 'Admin', description: 'Manage content and users' },
    { value: 'moderator', label: 'Moderator', description: 'Moderate content only' },
    { value: 'editor', label: 'Editor', description: 'Edit content only' }
  ];

  const permissions = [
    { value: 'manage_users', label: 'Manage Users' },
    { value: 'manage_content', label: 'Manage Content' },
    { value: 'manage_products', label: 'Manage Products' },
    { value: 'manage_blog', label: 'Manage Blog' },
    { value: 'manage_settings', label: 'Manage Settings' },
    { value: 'view_analytics', label: 'View Analytics' },
    { value: 'manage_backups', label: 'Manage Backups' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Admin</h1>
          <p className="text-gray-600">Add new administrators to the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Admin Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">New Admin Details</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })}
                  className="input-field"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field"
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                    className="input-field pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className="input-field"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {permissions.map((permission) => (
                  <label key={permission.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={permission.value}
                      {...register('permissions')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Only create admin accounts for trusted users. All admin actions are logged for security purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              <span>{loading ? 'Creating...' : 'Create Admin'}</span>
            </button>
          </form>
        </div>

        {/* Admin List */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Existing Admins</h2>
          
          <div className="space-y-4">
            {adminList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No admins found</p>
              </div>
            ) : (
              adminList.map((admin, index) => (
                <div key={admin._id || `admin-${index}`} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{admin.username}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                        {admin.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreator; 