import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Video,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import CloudinaryUpload from '../components/CloudinaryUpload';
import CurrencySelector from '../components/CurrencySelector';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Debug initial state
  console.log('🚀 [PRODUCTS] Initial filter state:', { selectedStatus, selectedCategory, searchTerm });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('VND');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Get all products regardless of status
      const response = await api.get('/api/products?status=all&isActive=true');
      console.log('Products response:', response.data); // Debug log
      const productsData = response.data.products || [];
      console.log('Products array:', productsData); // Debug log
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (uploadedData) => {
    if (Array.isArray(uploadedData)) {
      setUploadedImages(prev => [...prev, ...uploadedData]);
    } else {
      setUploadedImages(prev => [...prev, uploadedData]);
    }
  };

  const handleVideoUpload = (uploadedData) => {
    if (Array.isArray(uploadedData)) {
      setUploadedVideos(prev => [...prev, ...uploadedData]);
    } else {
      setUploadedVideos(prev => [...prev, uploadedData]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      // Prepare images data for Cloudinary
      const images = uploadedImages.map((img, index) => ({
        url: img.url,
        public_id: img.public_id,
        alt: `Product image ${index + 1}`,
        isPrimary: index === 0, // First image is primary
        width: img.width,
        height: img.height,
        format: img.format,
        bytes: img.bytes
      }));

      // Prepare videos data for Cloudinary
      const videos = uploadedVideos.map((video, index) => ({
        url: video.url,
        public_id: video.public_id,
        type: 'direct',
        title: `Product video ${index + 1}`,
        width: video.width,
        height: video.height,
        format: video.format,
        bytes: video.bytes,
        duration: video.duration
      }));

      // Prepare product data according to server schema
      const productData = {
        name: {
          en: data.name,
          vi: data.name // For now, using same name for both languages
        },
        description: {
          en: data.description,
          vi: data.description // For now, using same description for both languages
        },
        category: data.category,
        price: {
          amount: parseFloat(data.price),
          currency: selectedCurrency
        },
        material: data.material,
        status: data.status,
        isActive: true,
        isFeatured: isFeatured,
        images: images,
        videos: videos
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully');
      } else {
        const response = await api.post('/api/products', productData);
        console.log('Created product:', response.data); // Debug log
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      setUploadedImages([]);
      setUploadedVideos([]);
      setSelectedCurrency('VND');
      setIsFeatured(false);
      reset();
      await fetchProducts(); // Wait for fetch to complete
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name.en || product.name,
      description: product.description.en || product.description,
      category: product.category?._id || product.category,
      price: product.price.amount || product.price,
      material: product.material,
      status: product.status,
    });
    
    // Load existing images and videos
    setUploadedImages(product.images || []);
    setUploadedVideos(product.videos || []);
    
    // Set currency from existing product
    setSelectedCurrency(product.price?.currency || 'VND');
    // Set featured status from existing product
    setIsFeatured(product.isFeatured || false);
    
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await api.patch(`/api/products/${productId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFeaturedToggle = async (productId, isFeatured) => {
    console.log('🔄 [FEATURED] Toggle started:', { productId, isFeatured });
    
    try {
      console.log('⏳ [FEATURED] Setting loading state...');
      setFeaturedLoading(prev => ({ ...prev, [productId]: true }));
      
      console.log('🌐 [FEATURED] Making API call to:', `/api/products/${productId}/featured`);
      console.log('📦 [FEATURED] Request body:', { isFeatured });
      
      const response = await api.patch(`/api/products/${productId}/featured`, { isFeatured });
      
      console.log('✅ [FEATURED] API call successful:', response.data);
      
      console.log('🔄 [FEATURED] Updating local state...');
      setProducts(products.map(product => 
        product._id === productId ? { ...product, isFeatured } : product
      ));
      
      console.log('🎉 [FEATURED] Toggle completed successfully');
      toast.success(`Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
      
    } catch (error) {
      console.error('💥 [FEATURED] Toggle failed:');
      console.error('📍 [FEATURED] Error status:', error.response?.status);
      console.error('📝 [FEATURED] Error data:', error.response?.data);
      console.error('📋 [FEATURED] Full error:', error);
      
      toast.error(`Failed to update featured status: ${error.response?.data?.message || error.message}`);
    } finally {
      console.log('🏁 [FEATURED] Clearing loading state...');
      setFeaturedLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const filteredProducts = products.filter(product => {
    // Safe access to nested properties
    const productName = product.name?.en || product.name || '';
    const productDescription = product.description?.en || product.description || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category._id === selectedCategory);
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Debug log for filtered products
  console.log('🔍 [PRODUCTS] Raw products from API:', products.length);
  console.log('🔍 [PRODUCTS] Current filters:', { searchTerm, selectedCategory, selectedStatus });
  console.log('🔍 [PRODUCTS] Filtered products:', filteredProducts.length);
  console.log('🔍 [PRODUCTS] First few products:', products.slice(0, 3).map(p => ({ 
    id: p._id, 
    name: p.name?.en || p.name, 
    status: p.status,
    category: p.category?._id 
  })));

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories?active=true');
      setCategories(response.data.categories || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const statuses = [
    { value: 'draft', label: 'Draft', color: 'badge-warning' },
    { value: 'published', label: 'Published', color: 'badge-success' },
    { value: 'archived', label: 'Archived', color: 'badge-danger' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name.en}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredProducts.length} products
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">Category</th>
                <th className="table-header">Price</th>
                <th className="table-header">Status</th>
                <th className="table-header">Featured</th>
                <th className="table-header">Created</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Package size={48} className="text-gray-300" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your filters or add a new product</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name?.en || product.name || 'Product'}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package size={16} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name?.en || product.name || 'Unnamed Product'}</p>
                        <p className="text-sm text-gray-500">{product.material || 'No material'}</p>
                        {product.images && product.images.length > 0 && (
                          <p className="text-xs text-gray-400">
                            {product.images.length} image{product.images.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-info">
                      {product.category ? product.category.name.en : 'Unknown'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <DollarSign size={14} className="text-gray-400" />
                      <span className="font-medium">
                        {(product.price?.amount || product.price || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.price?.currency || 'VND'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product._id, e.target.value)}
                      className={`badge ${statuses.find(s => s.value === product.status)?.color} border-0`}
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          console.log('🖱️ [BUTTON] Clicked:', {
                            productId: product._id,
                            productName: product.name?.en || product.name,
                            currentFeatured: product.isFeatured,
                            newValue: !product.isFeatured,
                            disabled: featuredLoading[product._id]
                          });
                          
                          e.stopPropagation();
                          handleFeaturedToggle(product._id, !product.isFeatured);
                        }}
                        disabled={featuredLoading[product._id]}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          product.isFeatured
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } ${
                          featuredLoading[product._id] 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                      >
                        {featuredLoading[product._id] ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>...</span>
                          </div>
                        ) : (
                          <>
                            {product.isFeatured ? '⭐ Featured' : '☆ Normal'}
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setUploadedImages([]);
                    setUploadedVideos([]);
                    setSelectedCurrency('VND');
                    setIsFeatured(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="input-field"
                        placeholder="Product name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        {...register('description', { required: 'Description is required' })}
                        rows={3}
                        className="input-field"
                        placeholder="Product description"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="input-field"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name.en}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('price', { required: 'Price is required' })}
                          className="input-field"
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                        )}
                      </div>
                      
                      <CurrencySelector
                        value={selectedCurrency}
                        onChange={setSelectedCurrency}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Material</label>
                      <input
                        type="text"
                        {...register('material', { required: 'Material is required' })}
                        className="input-field"
                        placeholder="Product material"
                      />
                      {errors.material && (
                        <p className="mt-1 text-sm text-red-600">{errors.material.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        {...register('status', { required: 'Status is required' })}
                        className="input-field"
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                      )}
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Featured Product
                      </label>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ImageIcon size={16} className="inline mr-2" />
                        Product Images
                      </label>
                      <CloudinaryUpload
                        onUpload={handleImageUpload}
                        fileType="image"
                        multiple={true}
                        maxFiles={10}
                        className="mb-4"
                        label="Upload Product Images"
                      />
                      
                      {/* Uploaded Images Preview */}
                      {uploadedImages.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {uploadedImages.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img.url}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                                {index === 0 && (
                                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Primary
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Video size={16} className="inline mr-2" />
                        Product Videos
                      </label>
                      <CloudinaryUpload
                        onUpload={handleVideoUpload}
                        fileType="video"
                        multiple={true}
                        maxFiles={5}
                        className="mb-4"
                        label="Upload Product Videos"
                      />
                      
                      {/* Uploaded Videos Preview */}
                      {uploadedVideos.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Videos:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {uploadedVideos.map((video, index) => (
                              <div key={index} className="relative group">
                                <video
                                  src={video.url}
                                  className="w-full h-20 object-cover rounded border"
                                  controls
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVideo(index)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      setUploadedImages([]);
                      setUploadedVideos([]);
                      setSelectedCurrency('VND');
                      setIsFeatured(false);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 