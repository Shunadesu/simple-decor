const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const Product = require('../models/Product');
const { deleteFromCloudinary } = require('../utils/upload');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const adminOnlyAuth = require('../middleware/adminOnlyAuth');

// Validation middleware
const validateProduct = [
  body('name.en').notEmpty().withMessage('English name is required'),
  body('name.vi').notEmpty().withMessage('Vietnamese name is required'),
  body('description.en').notEmpty().withMessage('English description is required'),
  body('description.vi').notEmpty().withMessage('Vietnamese description is required'),
  body('category').isMongoId().withMessage('Invalid category ID'),
  body('material').notEmpty().withMessage('Material is required'),
  body('price.amount').isNumeric().withMessage('Price amount must be a number'),
  body('price.currency').optional().isIn(['USD', 'EUR', 'VND']).withMessage('Invalid currency'),
  body('moisture').optional().isString().withMessage('Moisture must be a string'),
  body('packaging').optional().isString().withMessage('Packaging must be a string'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*.url').optional().isURL().withMessage('Image URL must be valid'),
  body('videos').optional().isArray().withMessage('Videos must be an array'),
  body('videos.*.url').optional().isURL().withMessage('Video URL must be valid'),
  body('specifications.dimensions.length').optional().isNumeric().withMessage('Length must be a number'),
  body('specifications.dimensions.width').optional().isNumeric().withMessage('Width must be a number'),
  body('specifications.dimensions.height').optional().isNumeric().withMessage('Height must be a number'),
  body('stock.quantity').optional().isNumeric().withMessage('Stock quantity must be a number'),
  body('stock.minOrder').optional().isNumeric().withMessage('Min order must be a number'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to delete files from Cloudinary
const deleteProductFiles = async (product) => {
  try {
    const deletePromises = [];
    
    // Delete images
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        if (image.public_id) {
          deletePromises.push(deleteFromCloudinary(image.public_id, 'image'));
        }
      });
    }
    
    // Delete videos
    if (product.videos && product.videos.length > 0) {
      product.videos.forEach(video => {
        if (video.public_id) {
          deletePromises.push(deleteFromCloudinary(video.public_id, 'video'));
        }
      });
    }
    
    if (deletePromises.length > 0) {
      await Promise.allSettled(deletePromises);
    }
  } catch (error) {
    console.error('Error deleting product files:', error);
  }
};

// POST /api/products - Create a new product
router.post('/', validateProduct, handleValidationErrors, async (req, res) => {
  try {
    const productData = req.body;
    
    // Set default values
    if (!productData.status) productData.status = 'draft';
    if (!productData.isActive) productData.isActive = true;
    if (!productData.isFeatured) productData.isFeatured = false;
    
    // Set primary image if not specified
    if (productData.images && productData.images.length > 0) {
      const hasPrimary = productData.images.some(img => img.isPrimary);
      if (!hasPrimary) {
        productData.images[0].isPrimary = true;
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Product with this slug already exists',
        error: 'Duplicate slug'
      });
    }
    
    res.status(500).json({
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status = 'published',
      isActive = true,
      isFeatured,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }
    
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name.en name.vi')
      .populate('relatedProducts', 'name.en images');
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      hasNext: skip + products.length < total,
      hasPrev: parseInt(page) > 1
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', [
  query('limit').optional().custom((value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 100) {
      throw new Error('Limit must be a number between 1 and 100');
    }
    return true;
  }).withMessage('Limit must be a number between 1 and 100'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.findFeatured(parseInt(limit));
    
    res.json({ products });
    
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      message: 'Failed to fetch featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/products/search - Search products
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const query = {
      $text: { $search: q },
      status: 'published',
      isActive: true
    };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      total,
      query: q,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
    
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      message: 'Failed to search products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', param('id').isMongoId().withMessage('Invalid product ID'), handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name.en name.vi')
      .populate('relatedProducts', 'name.en images');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
    
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', 
  param('id').isMongoId().withMessage('Invalid product ID'),
  validateProduct,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Update the updatedAt field
      updateData.updatedAt = new Date();
      
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({
        message: 'Product updated successfully',
        product
      });
      
    } catch (error) {
      console.error('Update product error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Product with this slug already exists',
          error: 'Duplicate slug'
        });
      }
      
      res.status(500).json({
        message: 'Failed to update product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// DELETE /api/products/:id - Delete a product
router.delete('/:id', param('id').isMongoId().withMessage('Invalid product ID'), handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete files from Cloudinary
    await deleteProductFiles(product);
    
    // Delete the product from database
    await Product.findByIdAndDelete(id);
    
    res.json({
      message: 'Product deleted successfully',
      productId: id
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/products/:id/status - Update product status
router.patch('/:id/status',
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('status').isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const product = await Product.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({
        message: 'Product status updated successfully',
        product
      });
      
    } catch (error) {
      console.error('Update product status error:', error);
      res.status(500).json({
        message: 'Failed to update product status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// PATCH /api/products/:id/featured - Update product featured status
router.patch('/:id/featured',
  adminOnlyAuth,
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('isFeatured').isBoolean().withMessage('isFeatured must be a boolean'),
  handleValidationErrors,
  async (req, res) => {
    console.log('🎯 [FEATURED-API] Featured update endpoint hit');
    console.log('📋 [FEATURED-API] User:', req.user);
    console.log('📝 [FEATURED-API] Params:', req.params);
    console.log('📦 [FEATURED-API] Body:', req.body);
    
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;
      
      console.log('🔍 [FEATURED-API] Updating product:', { id, isFeatured });
      
      const product = await Product.findByIdAndUpdate(
        id,
        { isFeatured, updatedAt: new Date() },
        { new: true }
      );
      
      if (!product) {
        console.warn('❌ [FEATURED-API] Product not found:', id);
        return res.status(404).json({ message: 'Product not found' });
      }
      
      console.log('✅ [FEATURED-API] Product updated successfully:', {
        id: product._id,
        name: product.name,
        isFeatured: product.isFeatured
      });
      
      res.json({
        message: 'Product featured status updated successfully',
        product
      });
      
    } catch (error) {
      console.error('💥 [FEATURED-API] Update error:', error);
      res.status(500).json({
        message: 'Failed to update product featured status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// GET /api/products/categories - Get all categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          publishedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'published'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          id: '$_id',
          name: '$_id',
          count: 1,
          publishedCount: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Add "all" category
    const totalCount = await Product.countDocuments();
    const totalPublished = await Product.countDocuments({ status: 'published' });
    
    categories.unshift({
      id: 'all',
      name: 'All Categories',
      count: totalCount,
      publishedCount: totalPublished
    });
    
    res.json({ categories });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/products/:id/images - Update product images
router.patch('/:id/images', 
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('images').isArray().withMessage('Images must be an array'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { images } = req.body;
      
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(image => {
          if (image.public_id) {
            return deleteFromCloudinary(image.public_id, 'image');
          }
          return Promise.resolve();
        });
        await Promise.allSettled(deletePromises);
      }
      
      // Update product with new images
      product.images = images;
      await product.save();
      
      res.json({
        message: 'Product images updated successfully',
        product
      });
      
    } catch (error) {
      console.error('Update product images error:', error);
      res.status(500).json({
        message: 'Failed to update product images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// PATCH /api/products/:id/videos - Update product videos
router.patch('/:id/videos', 
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('videos').isArray().withMessage('Videos must be an array'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { videos } = req.body;
      
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Delete old videos from Cloudinary
      if (product.videos && product.videos.length > 0) {
        const deletePromises = product.videos.map(video => {
          if (video.public_id) {
            return deleteFromCloudinary(video.public_id, 'video');
          }
          return Promise.resolve();
        });
        await Promise.allSettled(deletePromises);
      }
      
      // Update product with new videos
      product.videos = videos;
      await product.save();
      
      res.json({
        message: 'Product videos updated successfully',
        product
      });
      
    } catch (error) {
      console.error('Update product videos error:', error);
      res.status(500).json({
        message: 'Failed to update product videos',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router; 