import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Star,
  Eye,
  Users,
  FileText,
  Ship,
  Shield,
  Headphones,
  Settings,
  Truck,
  Heart,
  Award,
  Zap,
  Globe,
  Wrench,
  CheckCircle,
  Package,
  Clock,
  Target,
  Layers,
  Database,
  ImageIcon,
  Upload,
  X
} from 'lucide-react';
import axios from '../utils/axios';
import CloudinaryUpload from '../components/CloudinaryUpload';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredLoading, setFeaturedLoading] = useState({});
  const [currentLang, setCurrentLang] = useState('vi');
  const [serviceImage, setServiceImage] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  const iconComponents = {
    Users, FileText, Ship, Shield, Headphones, Settings,
    Truck, Heart, Award, Zap, Globe, Wrench, CheckCircle,
    Package, Search, Clock, Star, Target, Layers, Database
  };

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'consultation', label: 'Tư vấn' },
    { value: 'documentation', label: 'Giấy tờ' },
    { value: 'logistics', label: 'Vận chuyển' },
    { value: 'quality', label: 'Kiểm soát chất lượng' },
    { value: 'support', label: 'Hỗ trợ' },
    { value: 'manufacturing', label: 'Sản xuất' },
    { value: 'export', label: 'Xuất khẩu' },
    { value: 'technology', label: 'Công nghệ' },
    { value: 'design', label: 'Thiết kế' },
    { value: 'other', label: 'Khác' }
  ];

  const iconOptions = [
    'Users', 'FileText', 'Ship', 'Shield', 'Headphones', 'Settings',
    'Truck', 'Heart', 'Award', 'Zap', 'Globe', 'Wrench', 'CheckCircle',
    'Package', 'Search', 'Clock', 'Star', 'Target', 'Layers', 'Database'
  ];

  const priceOptions = [
    { value: 'free', label: 'Miễn phí' },
    { value: 'negotiable', label: 'Thỏa thuận' },
    { value: 'contact', label: 'Liên hệ để biết giá' },
    { value: 'included', label: 'Bao gồm trong gói' }
  ];

  useEffect(() => {
    fetchServices();
  }, [searchTerm, filterCategory, filterStatus, currentPage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        status: filterStatus,
        search: searchTerm || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined
      };

      const response = await axios.get('/api/services/admin/all', { params });
      
      if (response.data.success) {
        setServices(response.data.services);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting service data:', data);

      // Prepare service data
      const serviceData = {
        title: {
          en: data.title_en,
          vi: data.title_vi
        },
        description: {
          en: data.description_en,
          vi: data.description_vi
        },
        shortDescription: {
          en: data.shortDescription_en || '',
          vi: data.shortDescription_vi || ''
        },
        category: data.category,
        icon: data.icon,
        price: data.price,
        priceDetails: {
          en: data.priceDetails_en || '',
          vi: data.priceDetails_vi || ''
        },
        duration: data.duration || '',
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false, // Default to true
        displayOrder: parseInt(data.displayOrder) || 0,
        image: serviceImage || undefined
      };

      // Handle features
      if (data.features) {
        const featuresArray = data.features.split('\n').filter(f => f.trim());
        serviceData.features = featuresArray.map(feature => ({
          en: feature.trim(),
          vi: feature.trim() // For now, same content for both languages
        }));
      }

      // Handle benefits
      if (data.benefits) {
        const benefitsArray = data.benefits.split('\n').filter(b => b.trim());
        serviceData.benefits = benefitsArray.map(benefit => ({
          en: benefit.trim(),
          vi: benefit.trim()
        }));
      }

      // Handle requirements
      if (data.requirements) {
        const requirementsArray = data.requirements.split('\n').filter(r => r.trim());
        serviceData.requirements = requirementsArray.map(req => ({
          en: req.trim(),
          vi: req.trim()
        }));
      }

      let response;
      if (editingService) {
        response = await axios.put(`/api/services/admin/${editingService._id}`, serviceData);
      } else {
        response = await axios.post('/api/services/admin', serviceData);
      }

      if (response.data.success) {
        await fetchServices();
        resetForm();
        alert(editingService ? 'Cập nhật dịch vụ thành công!' : 'Tạo dịch vụ thành công!');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setCurrentLang('vi');
    
    // Set form values
    setValue('title_en', service.title?.en || '');
    setValue('title_vi', service.title?.vi || '');
    setValue('description_en', service.description?.en || '');
    setValue('description_vi', service.description?.vi || '');
    setValue('shortDescription_en', service.shortDescription?.en || '');
    setValue('shortDescription_vi', service.shortDescription?.vi || '');
    setValue('category', service.category || 'other');
    setValue('icon', service.icon || 'Settings');
    setValue('price', service.price || 'contact');
    setValue('priceDetails_en', service.priceDetails?.en || '');
    setValue('priceDetails_vi', service.priceDetails?.vi || '');
    setValue('duration', service.duration || '');
    setValue('isFeatured', service.isFeatured || false);
    setValue('isActive', service.isActive !== false);
    setValue('displayOrder', service.displayOrder || 0);

    // Set features, benefits, requirements
    if (service.features && service.features.length > 0) {
      const featuresText = service.features.map(f => f.vi || f.en || f).join('\n');
      setValue('features', featuresText);
    }

    if (service.benefits && service.benefits.length > 0) {
      const benefitsText = service.benefits.map(b => b.vi || b.en || b).join('\n');
      setValue('benefits', benefitsText);
    }

    if (service.requirements && service.requirements.length > 0) {
      const requirementsText = service.requirements.map(r => r.vi || r.en || r).join('\n');
      setValue('requirements', requirementsText);
    }

    // Set image
    setServiceImage(service.image || null);
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        const response = await axios.delete(`/api/services/admin/${id}`);
        if (response.data.success) {
          await fetchServices();
          alert('Xóa dịch vụ thành công!');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Có lỗi xảy ra khi xóa dịch vụ');
      }
    }
  };

  const handleFeaturedToggle = async (id, isFeatured) => {
    try {
      setFeaturedLoading(prev => ({ ...prev, [id]: true }));
      
      const response = await axios.patch(`/api/services/admin/${id}/featured`, {
        isFeatured
      });
      
      if (response.data.success) {
        await fetchServices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái nổi bật');
    } finally {
      setFeaturedLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const resetForm = () => {
    reset();
    setEditingService(null);
    setShowModal(false);
    setServiceImage(null);
    setCurrentLang('vi');
  };

  const handleImageUpload = (imageData) => {
    setServiceImage(imageData);
  };

  const removeImage = () => {
    setServiceImage(null);
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || Settings;
    return <IconComponent size={20} className="text-blue-600" />;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.title?.vi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.vi?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Dịch Vụ</h1>
          <p className="text-gray-600">Quản lý các dịch vụ của công ty</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Thêm Dịch Vụ</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          <Filter size={14} className="mr-1" />
          Tìm thấy {filteredServices.length} dịch vụ
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Dịch vụ</th>
                <th className="table-header">Danh mục</th>
                <th className="table-header">Biểu tượng</th>
                <th className="table-header">Giá</th>
                <th className="table-header">Trạng thái</th>
                <th className="table-header">Nổi bật</th>
                <th className="table-header">Thống kê</th>
                <th className="table-header">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    Không tìm thấy dịch vụ nào
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                          {service.image?.url ? (
                            <img
                              src={service.image.url}
                              alt={service.title?.vi || service.title?.en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            renderIcon(service.icon)
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {service.title?.vi || service.title?.en || 'Chưa có tiêu đề'}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {service.shortDescription?.vi || service.description?.vi?.substring(0, 100) + '...' || 'Chưa có mô tả'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {categories.find(cat => cat.value === service.category)?.label || service.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      {renderIcon(service.icon)}
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600">
                        {priceOptions.find(p => p.value === service.price)?.label || service.price}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleFeaturedToggle(service._id, !service.isFeatured)}
                        disabled={featuredLoading[service._id]}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          service.isFeatured
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } ${
                          featuredLoading[service._id]
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        {featuredLoading[service._id] ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>...</span>
                          </div>
                        ) : (
                          <>
                            {service.isFeatured ? '⭐ Nổi bật' : '☆ Thường'}
                          </>
                        )}
                      </button>
                    </td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{service.statistics?.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={12} />
                          <span>{service.statistics?.inquiryCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Trang {currentPage} của {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  {/* Language Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngôn ngữ
                    </label>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setCurrentLang('vi')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          currentLang === 'vi' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        🇻🇳 VI
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentLang('en')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          currentLang === 'en' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        🇺🇸 EN
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề ({currentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      {...register(`title_${currentLang}`, { required: `Tiêu đề ${currentLang.toUpperCase()} là bắt buộc` })}
                      className="input-field"
                      placeholder={`Nhập tiêu đề dịch vụ bằng ${currentLang === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}`}
                    />
                    {errors[`title_${currentLang}`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`title_${currentLang}`].message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ({currentLang.toUpperCase()})
                    </label>
                    <textarea
                      {...register(`description_${currentLang}`, { required: `Mô tả ${currentLang.toUpperCase()} là bắt buộc` })}
                      rows={4}
                      className="input-field"
                      placeholder={`Nhập mô tả chi tiết dịch vụ bằng ${currentLang === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}`}
                    />
                    {errors[`description_${currentLang}`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`description_${currentLang}`].message}</p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn ({currentLang.toUpperCase()}) - Tùy chọn
                    </label>
                    <textarea
                      {...register(`shortDescription_${currentLang}`)}
                      rows={2}
                      className="input-field"
                      placeholder={`Nhập mô tả ngắn gọn bằng ${currentLang === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}`}
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tính năng (mỗi dòng một tính năng)
                    </label>
                    <textarea
                      {...register('features')}
                      rows={3}
                      className="input-field"
                      placeholder="Tư vấn thiết kế&#10;Chọn vật liệu phù hợp&#10;Tối ưu chi phí"
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lợi ích (mỗi dòng một lợi ích)
                    </label>
                    <textarea
                      {...register('benefits')}
                      rows={3}
                      className="input-field"
                      placeholder="Tiết kiệm thời gian&#10;Chất lượng đảm bảo&#10;Hỗ trợ 24/7"
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu (mỗi dòng một yêu cầu)
                    </label>
                    <textarea
                      {...register('requirements')}
                      rows={2}
                      className="input-field"
                      placeholder="Cung cấp thông tin chi tiết&#10;Có bản vẽ thiết kế"
                    />
                  </div>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                  {/* Service Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh dịch vụ
                    </label>
                    {serviceImage ? (
                      <div className="relative">
                        <img
                          src={serviceImage.url}
                          alt="Service"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <CloudinaryUpload
                        onUpload={handleImageUpload}
                        multiple={false}
                        folder="services"
                      />
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      {...register('category', { required: 'Danh mục là bắt buộc' })}
                      className="input-field"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biểu tượng
                    </label>
                    <select
                      {...register('icon')}
                      className="input-field"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại giá
                    </label>
                    <select
                      {...register('price')}
                      className="input-field"
                    >
                      {priceOptions.map(price => (
                        <option key={price.value} value={price.value}>{price.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chi tiết giá ({currentLang.toUpperCase()}) - Tùy chọn
                    </label>
                    <input
                      type="text"
                      {...register(`priceDetails_${currentLang}`)}
                      className="input-field"
                      placeholder="VD: Từ 500,000 VND"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian thực hiện
                    </label>
                    <input
                      type="text"
                      {...register('duration')}
                      className="input-field"
                      placeholder="VD: 1-2 tuần, Liên tục, Theo dự án"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      {...register('displayOrder')}
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isFeatured')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Dịch vụ nổi bật</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Kích hoạt dịch vụ</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingService ? 'Cập Nhật' : 'Tạo Dịch Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
