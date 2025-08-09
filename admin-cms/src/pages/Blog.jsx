import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  User,
  Tag,
  X,
  Image as ImageIcon,
  Globe,
  Star,
  Upload
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import CloudinaryUpload from '../components/CloudinaryUpload';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Image upload states
  const [featuredImage, setFeaturedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Language toggle
  const [currentLang, setCurrentLang] = useState('vi');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/blog');
      setPosts(response.data.posts || response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Prepare multilingual post data
      const postData = {
        title: {
          vi: data.title_vi || data.title,
          en: data.title_en || data.title
        },
        content: {
          vi: data.content_vi || data.content,
          en: data.content_en || data.content
        },
        excerpt: {
          vi: data.excerpt_vi || (data.content_vi || data.content).substring(0, 150),
          en: data.excerpt_en || (data.content_en || data.content).substring(0, 150)
        },
        category: data.category,
        author: {
          name: data.author,
          role: data.author_role || 'Content Creator'
        },
        status: data.status,
        isFeatured: data.isFeatured || false,
        tags: data.tags ? data.tags.split(',').map(tag => ({
          vi: tag.trim(),
          en: tag.trim()
        })) : [],
        // Add featured image if uploaded
        featuredImage: featuredImage ? {
          url: featuredImage.url,
          public_id: featuredImage.public_id,
          alt: data.image_alt || data.title_vi || data.title,
          width: featuredImage.width,
          height: featuredImage.height,
          format: featuredImage.format,
          bytes: featuredImage.bytes
        } : undefined,
        // Add additional images
        images: uploadedImages.map((img, index) => ({
          url: img.url,
          public_id: img.public_id,
          alt: `Blog image ${index + 1}`,
          width: img.width,
          height: img.height,
          format: img.format,
          bytes: img.bytes
        }))
      };

      if (editingPost) {
        await api.put(`/api/blog/${editingPost._id}`, postData);
        toast.success('Post updated successfully');
      } else {
        await api.post('/api/blog', postData);
        toast.success('Post created successfully');
      }
      
      // Reset form and states
      setShowModal(false);
      setEditingPost(null);
      setFeaturedImage(null);
      setUploadedImages([]);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Blog submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    
    // Handle both legacy single-language and new multilingual format
    const title_vi = typeof post.title === 'object' ? post.title.vi : post.title;
    const title_en = typeof post.title === 'object' ? post.title.en : post.title;
    const content_vi = typeof post.content === 'object' ? post.content.vi : post.content;
    const content_en = typeof post.content === 'object' ? post.content.en : post.content;
    const author_name = typeof post.author === 'object' ? post.author.name : post.author;
    
    reset({
      title_vi: title_vi,
      title_en: title_en,
      content_vi: content_vi,
      content_en: content_en,
      category: post.category,
      author: author_name,
      author_role: typeof post.author === 'object' ? post.author.role : '',
      status: post.status,
      isFeatured: post.isFeatured || false,
      tags: post.tags?.map(tag => typeof tag === 'object' ? tag.vi : tag).join(', ') || '',
    });
    
    // Set images if available
    if (post.featuredImage) {
      setFeaturedImage(post.featuredImage);
    }
    if (post.images && post.images.length > 0) {
      setUploadedImages(post.images);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/api/blog/${postId}`);
        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  // Image upload handlers
  const handleFeaturedImageUpload = (uploadedData) => {
    setFeaturedImage(uploadedData);
    toast.success('Featured image uploaded successfully');
  };

  const handleImageUpload = (uploadedData) => {
    if (Array.isArray(uploadedData)) {
      setUploadedImages(prev => [...prev, ...uploadedData]);
    } else {
      setUploadedImages(prev => [...prev, uploadedData]);
    }
    toast.success('Images uploaded successfully');
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingPost(null);
    setFeaturedImage(null);
    setUploadedImages([]);
    setCurrentLang('vi');
    reset();
  };

  const filteredPosts = posts.filter(post => {
    // Handle both multilingual and legacy single-language format for search
    const title = typeof post.title === 'object' 
      ? `${post.title.vi || ''} ${post.title.en || ''}` 
      : post.title || '';
    const content = typeof post.content === 'object' 
      ? `${post.content.vi || ''} ${post.content.en || ''}` 
      : post.content || '';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: 'internal-news', label: 'Internal News' },
    { value: 'market-trends', label: 'Market Trends' },
    { value: 'knowledge', label: 'Knowledge Articles' },
    { value: 'customer-stories', label: 'Customer Stories' },
    { value: 'product-updates', label: 'Product Updates' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'design-tips', label: 'Design Tips' },
    { value: 'company-culture', label: 'Company Culture' },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Post</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
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
              <option key={category.value} value={category.value}>
                {category.label}
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
              {filteredPosts.length} posts
            </span>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Post</th>
                <th className="table-header">Category</th>
                <th className="table-header">Author</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage.url}
                            alt="Featured"
                            className="w-full h-full object-cover"
                          />
                        ) : post.image && post.image !== '📝' ? (
                          <span className="text-lg">{post.image}</span>
                        ) : (
                          <FileText size={16} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {typeof post.title === 'object' ? (post.title.vi || post.title.en) : post.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {typeof post.content === 'object' 
                            ? (post.content.vi || post.content.en).substring(0, 100) 
                            : post.content.substring(0, 100)
                          }...
                        </p>
                        {post.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            <Star size={12} className="mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-info">
                      {categories.find(c => c.value === post.category)?.label}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm">{post.author}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${statuses.find(s => s.value === post.status)?.color}`}>
                      {statuses.find(s => s.value === post.status)?.label}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingPost ? 'Edit Post' : 'Add New Post'}
                  </h3>
                  {/* Language Toggle */}
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
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Content */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title ({currentLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        {...register(`title_${currentLang}`, { required: `Title in ${currentLang.toUpperCase()} is required` })}
                        className="input-field"
                        placeholder={`Post title in ${currentLang === 'vi' ? 'Vietnamese' : 'English'}`}
                      />
                      {errors[`title_${currentLang}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`title_${currentLang}`].message}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content ({currentLang.toUpperCase()})
                      </label>
                      <textarea
                        {...register(`content_${currentLang}`, { required: `Content in ${currentLang.toUpperCase()} is required` })}
                        rows={8}
                        className="input-field"
                        placeholder={`Post content in ${currentLang === 'vi' ? 'Vietnamese' : 'English'}`}
                      />
                      {errors[`content_${currentLang}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`content_${currentLang}`].message}</p>
                      )}
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt ({currentLang.toUpperCase()})
                      </label>
                      <textarea
                        {...register(`excerpt_${currentLang}`)}
                        rows={3}
                        className="input-field"
                        placeholder={`Brief description in ${currentLang === 'vi' ? 'Vietnamese' : 'English'}`}
                      />
                    </div>
                  </div>

                  {/* Right Column - Settings & Media */}
                  <div className="space-y-4">
                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      {featuredImage ? (
                        <div className="relative">
                          <img
                            src={featuredImage.url}
                            alt="Featured"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeFeaturedImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <CloudinaryUpload
                          onUpload={handleFeaturedImageUpload}
                          multiple={false}
                          folder="blog/featured"
                        />
                      )}
                    </div>

                    {/* Additional Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Images
                      </label>
                      <CloudinaryUpload
                        onUpload={handleImageUpload}
                        multiple={true}
                        folder="blog/gallery"
                      />
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="input-field"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    {/* Author */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                        <input
                          type="text"
                          {...register('author', { required: 'Author is required' })}
                          className="input-field"
                          placeholder="Author name"
                        />
                        {errors.author && (
                          <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          {...register('author_role')}
                          className="input-field"
                          placeholder="Content Creator"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        {...register('tags')}
                        className="input-field"
                        placeholder="Tags (comma separated)"
                      />
                    </div>

                    {/* Status & Featured */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                        <div className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            {...register('isFeatured')}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-600">
                            Feature this post
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPost ? 'Update Post' : 'Create Post'}
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

export default Blog; 