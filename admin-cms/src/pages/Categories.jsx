import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Folder,
  Tag,
  Calendar,
  Image as ImageIcon,
  Video,
  X,
  ChevronDown,
  ChevronRight,
  Move,
  Copy
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import CloudinaryUpload from '../components/CloudinaryUpload';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories?include=children,productCount');
      setCategories(response.data.categories || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (uploadedData) => {
    console.log('handleImageUpload received:', uploadedData); // Debug log
    
    // Handle different response structures
    let imageData = null;
    
    if (Array.isArray(uploadedData)) {
      // If it's an array, take the first item
      imageData = uploadedData[0];
    } else if (uploadedData && typeof uploadedData === 'object') {
      // If it's an object, use it directly
      imageData = uploadedData;
    }
    
    // Check if the data has the expected structure
    if (imageData && (imageData.url || imageData.secure_url)) {
      setUploadedImage(imageData);
    } else {
      console.error('Invalid image data structure:', imageData);
      toast.error('Invalid image data received');
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const onSubmit = async (data) => {
    try {
      console.log('uploadedImage:', uploadedImage); // Debug log
      
      const categoryData = {
        name: {
          en: data.nameEn,
          vi: data.nameVi
        },
        description: {
          en: data.descriptionEn,
          vi: data.descriptionVi
        },
        slug: data.slug,
        order: parseInt(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
        meta: {
          title: {
            en: data.metaTitleEn,
            vi: data.metaTitleVi
          },
          description: {
            en: data.metaDescriptionEn,
            vi: data.metaDescriptionVi
          },
          keywords: {
            en: data.metaKeywordsEn,
            vi: data.metaKeywordsVi
          }
        }
      };

      // Only add parent if it's provided and not empty
      if (data.parent && data.parent.trim() !== '') {
        categoryData.parent = data.parent;
      } else if (data.parent === '') {
        // If parent is explicitly set to empty string, set it to null
        categoryData.parent = null;
      }

      // Only add image if uploadedImage exists and has the correct structure
      if (uploadedImage && typeof uploadedImage === 'object' && (uploadedImage.url || uploadedImage.secure_url)) {
        // Ensure the image object has the required structure
        categoryData.image = {
          url: uploadedImage.url || uploadedImage.secure_url,
          public_id: uploadedImage.public_id || null,
          alt: uploadedImage.alt || '',
          width: uploadedImage.width || null,
          height: uploadedImage.height || null,
          format: uploadedImage.format || null,
          bytes: uploadedImage.bytes || null
        };
        console.log('categoryData.image:', categoryData.image); // Debug log
      } else if (uploadedImage === null) {
        // If uploadedImage is explicitly null, set image to null to remove it
        categoryData.image = null;
        console.log('Setting image to null'); // Debug log
      } else {
        console.log('uploadedImage not processed:', uploadedImage); // Debug log
      }

      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, categoryData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/api/categories', categoryData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setEditingCategory(null);
      setUploadedImage(null);
      reset();
      fetchCategories();
    } catch (error) {
      console.error('Category operation error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Operation failed';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    reset({
      nameEn: category.name.en || category.name,
      nameVi: category.name.vi || category.name,
      descriptionEn: category.description?.en || '',
      descriptionVi: category.description?.vi || '',
      slug: category.slug,
      parent: category.parent?._id || category.parent || '',
      order: category.order || 0,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      metaTitleEn: category.meta?.title?.en || '',
      metaTitleVi: category.meta?.title?.vi || '',
      metaDescriptionEn: category.meta?.description?.en || '',
      metaDescriptionVi: category.meta?.description?.vi || '',
      metaKeywordsEn: category.meta?.keywords?.en || '',
      metaKeywordsVi: category.meta?.keywords?.vi || '',
    });
    
    setUploadedImage(category.image || null);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${categoryId}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleStatusChange = async (categoryId, newStatus) => {
    try {
      await api.patch(`/api/categories/${categoryId}/status`, { isActive: newStatus });
      toast.success('Status updated successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedItems(newExpanded);
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedItems.has(category._id);

      return (
        <div key={category._id} className="border-b border-gray-200">
          <div className={`flex items-center justify-between p-4 hover:bg-gray-50 ${level > 0 ? 'ml-6' : ''}`}>
            <div className="flex items-center space-x-3">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(category._id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              
              {category.image ? (
                <img
                  src={category.image.url}
                  alt={category.name.en}
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Folder size={16} className="text-gray-500" />
                </div>
              )}
              
              <div>
                <p className="font-medium text-gray-900">{category.name.en}</p>
                <p className="text-sm text-gray-500">{category.name.vi}</p>
                {category.productCount > 0 && (
                  <p className="text-xs text-gray-400">
                    {category.productCount} product{category.productCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`badge ${category.isActive ? 'badge-success' : 'badge-warning'}`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
              {category.isFeatured && (
                <span className="badge badge-info">Featured</span>
              )}
              <span className="text-sm text-gray-500">Order: {category.order}</span>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="border-l-2 border-gray-200 ml-6">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.name.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParent = selectedParent === 'all' || 
                         (selectedParent === 'null' && !category.parent) ||
                         (category.parent && category.parent._id === selectedParent);
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && category.isActive) ||
                         (selectedStatus === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesParent && matchesStatus;
  });

  const getParentOptions = () => {
    const options = [{ value: '', label: 'No Parent' }];
    categories.forEach(category => {
      options.push({
        value: category._id,
        label: `${'─'.repeat(category.level || 0)} ${category.name.en}`
      });
    });
    return options;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            className="input-field"
          >
            <option value="all">All Parents</option>
            <option value="null">No Parent</option>
            {categories.filter(c => !c.parent).map(category => (
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredCategories.length} categories
            </span>
          </div>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="card">
        <div className="overflow-x-auto">
          {filteredCategories.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {renderCategoryTree(filteredCategories)}
            </div>
          ) : (
            <div className="text-center py-8">
              <Folder size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setUploadedImage(null);
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
                      <label className="block text-sm font-medium text-gray-700">Name (English)</label>
                      <input
                        type="text"
                        {...register('nameEn', { required: 'English name is required' })}
                        className="input-field"
                        placeholder="Category name in English"
                      />
                      {errors.nameEn && (
                        <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name (Vietnamese)</label>
                      <input
                        type="text"
                        {...register('nameVi', { required: 'Vietnamese name is required' })}
                        className="input-field"
                        placeholder="Category name in Vietnamese"
                      />
                      {errors.nameVi && (
                        <p className="mt-1 text-sm text-red-600">{errors.nameVi.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                      <textarea
                        {...register('descriptionEn')}
                        rows={3}
                        className="input-field"
                        placeholder="Category description in English"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (Vietnamese)</label>
                      <textarea
                        {...register('descriptionVi')}
                        rows={3}
                        className="input-field"
                        placeholder="Category description in Vietnamese"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        type="text"
                        {...register('slug')}
                        className="input-field"
                        placeholder="category-slug (auto-generated if empty)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                      <select
                        {...register('parent')}
                        className="input-field"
                      >
                        {getParentOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order</label>
                      <input
                        type="number"
                        {...register('order')}
                        className="input-field"
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('isActive')}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('isFeatured')}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Meta Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Title (English)</label>
                      <input
                        type="text"
                        {...register('metaTitleEn')}
                        className="input-field"
                        placeholder="SEO title in English"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Title (Vietnamese)</label>
                      <input
                        type="text"
                        {...register('metaTitleVi')}
                        className="input-field"
                        placeholder="SEO title in Vietnamese"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Description (English)</label>
                      <textarea
                        {...register('metaDescriptionEn')}
                        rows={2}
                        className="input-field"
                        placeholder="SEO description in English"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Description (Vietnamese)</label>
                      <textarea
                        {...register('metaDescriptionVi')}
                        rows={2}
                        className="input-field"
                        placeholder="SEO description in Vietnamese"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Keywords (English)</label>
                      <input
                        type="text"
                        {...register('metaKeywordsEn')}
                        className="input-field"
                        placeholder="SEO keywords in English"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Keywords (Vietnamese)</label>
                      <input
                        type="text"
                        {...register('metaKeywordsVi')}
                        className="input-field"
                        placeholder="SEO keywords in Vietnamese"
                      />
                    </div>

                    {/* Category Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ImageIcon size={16} className="inline mr-2" />
                        Category Image
                      </label>
                      <CloudinaryUpload
                        onUpload={handleImageUpload}
                        fileType="image"
                        multiple={false}
                        maxFiles={1}
                        className="mb-4"
                        label="Upload Category Image"
                        folder="categories"
                      />
                      
                      {uploadedImage && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Image:</h4>
                          <div className="relative inline-block">
                            <img
                              src={uploadedImage.url}
                              alt="Category"
                              className="w-32 h-32 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              <X size={10} />
                            </button>
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
                      setEditingCategory(null);
                      setUploadedImage(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
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

export default Categories; 