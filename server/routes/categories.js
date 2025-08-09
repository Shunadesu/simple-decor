const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const { deleteFromCloudinary } = require('../utils/upload');

const router = express.Router();

// Validation middleware
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

// Helper function to delete category image from Cloudinary
const deleteCategoryImage = async (category) => {
  if (category.image && category.image.public_id) {
    try {
      await deleteFromCloudinary(category.image.public_id);
    } catch (error) {
      console.error('Error deleting category image from Cloudinary:', error);
    }
  }
};

// GET /api/categories - Get all categories with optional filters
router.get('/', [
  query('active').optional().isBoolean(),
  query('featured').optional().isBoolean(),
  query('parent').optional().isMongoId(),
  query('level').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      active,
      featured,
      parent,
      level,
      limit = 50,
      page = 1,
      include = 'children,productCount'
    } = req.query;

    // Build filter object
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';
    if (featured !== undefined) filter.isFeatured = featured === 'true';
    if (parent !== undefined) {
      if (parent === 'null') {
        filter.parent = null;
      } else {
        filter.parent = parent;
      }
    }
    if (level !== undefined) filter.level = parseInt(level);

    // Build populate options
    const populateOptions = [];
    if (include.includes('children')) {
      populateOptions.push({
        path: 'children',
        match: { isActive: true },
        options: { sort: { order: 1, name: 1 } }
      });
    }
    if (include.includes('productCount')) {
      populateOptions.push('productCount');
    }

    // Execute query
    const skip = (page - 1) * limit;
    const categories = await ProductCategory.find(filter)
      .populate(populateOptions)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProductCategory.countDocuments(filter);

    res.json({
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/categories/tree - Get hierarchical category tree
router.get('/tree', async (req, res) => {
  try {
    const { active = true } = req.query;
    
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';

    const categories = await ProductCategory.find(filter)
      .populate({
        path: 'children',
        match: { isActive: true },
        options: { sort: { order: 1, name: 1 } }
      })
      .sort({ order: 1, name: 1 });

    // Build tree structure
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => 
          parentId === null 
            ? !item.parent 
            : item.parent.toString() === parentId.toString()
        )
        .map(item => ({
          ...item.toObject(),
          children: buildTree(items, item._id)
        }));
    };

    const tree = buildTree(categories);

    res.json({ categories: tree });

  } catch (error) {
    console.error('Error fetching category tree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { include = 'children,productCount' } = req.query;

    const populateOptions = [];
    if (include.includes('children')) {
      populateOptions.push({
        path: 'children',
        match: { isActive: true },
        options: { sort: { order: 1, name: 1 } }
      });
    }
    if (include.includes('productCount')) {
      populateOptions.push('productCount');
    }

    const category = await ProductCategory.findById(id)
      .populate(populateOptions);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/categories - Create new category
router.post('/', [
  body('name.en').notEmpty().withMessage('English name is required'),
  body('name.vi').notEmpty().withMessage('Vietnamese name is required'),
  body('description.en').optional(),
  body('description.vi').optional(),
  body('slug').optional(),
  body('parent').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Allow null, undefined, or empty string
    }
    // If value exists, validate it's a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(value);
  }).withMessage('Invalid parent category ID'),
  body('order').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('image').optional().custom((value) => {
    if (value !== null && typeof value !== 'object') {
      throw new Error('Image must be null or an object');
    }
    if (value && typeof value === 'object') {
      if (value.url && typeof value.url !== 'string') {
        throw new Error('Image URL must be a string');
      }
      if (value.public_id && typeof value.public_id !== 'string') {
        throw new Error('Image public_id must be a string');
      }
    }
    return true;
  }),
  body('meta').optional(),
  handleValidationErrors
], async (req, res) => {
  try {
    const categoryData = req.body;

    // Check if slug already exists
    if (categoryData.slug) {
      const existingCategory = await ProductCategory.findOne({ slug: categoryData.slug });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }

    // Check if parent exists
    if (categoryData.parent) {
      const parentCategory = await ProductCategory.findById(categoryData.parent);
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }

    const category = new ProductCategory(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });

  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name.en').optional(),
  body('name.vi').optional(),
  body('description.en').optional(),
  body('description.vi').optional(),
  body('slug').optional(),
  body('parent').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Allow null, undefined, or empty string
    }
    // If value exists, validate it's a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(value);
  }).withMessage('Invalid parent category ID'),
  body('order').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('image').optional().custom((value) => {
    if (value !== null && typeof value !== 'object') {
      throw new Error('Image must be null or an object');
    }
    if (value && typeof value === 'object') {
      if (value.url && typeof value.url !== 'string') {
        throw new Error('Image URL must be a string');
      }
      if (value.public_id && typeof value.public_id !== 'string') {
        throw new Error('Image public_id must be a string');
      }
    }
    return true;
  }),
  body('meta').optional(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if slug already exists (excluding current category)
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await ProductCategory.findOne({ 
        slug: updateData.slug,
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }

    // Check if parent exists and is not the same as current category
    if (updateData.parent !== undefined) {
      if (updateData.parent === id) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }
      if (updateData.parent) {
        const parentCategory = await ProductCategory.findById(updateData.parent);
        if (!parentCategory) {
          return res.status(400).json({ message: 'Parent category not found' });
        }
      }
    }

    // Delete old image if new image is provided
    if (updateData.image && category.image && category.image.public_id) {
      await deleteCategoryImage(category);
    }

    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/categories/:id/image - Update category image
router.patch('/:id/image', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('image').isObject().withMessage('Image data is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete old image from Cloudinary
    if (category.image && category.image.public_id) {
      await deleteCategoryImage(category);
    }

    // Update with new image
    category.image = image;
    await category.save();

    res.json({
      message: 'Category image updated successfully',
      category
    });

  } catch (error) {
    console.error('Error updating category image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has children
    const childrenCount = await ProductCategory.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with subcategories. Please move or delete subcategories first.' 
      });
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with products. Please move or delete products first.' 
      });
    }

    // Delete image from Cloudinary
    await deleteCategoryImage(category);

    // Delete the category
    await ProductCategory.findByIdAndDelete(id);

    res.json({
      message: 'Category deleted successfully',
      categoryId: id
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/categories/:id/status - Update category status
router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const category = await ProductCategory.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category status updated successfully',
      category
    });

  } catch (error) {
    console.error('Error updating category status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/categories/reorder - Reorder categories
router.patch('/reorder', [
  body('categories').isArray().withMessage('Categories array is required'),
  body('categories.*.id').isMongoId().withMessage('Invalid category ID'),
  body('categories.*.order').isInt({ min: 0 }).withMessage('Order must be a positive integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { categories } = req.body;

    // Update categories in bulk
    const updatePromises = categories.map(({ id, order }) =>
      ProductCategory.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      message: 'Categories reordered successfully'
    });

  } catch (error) {
    console.error('Error reordering categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 