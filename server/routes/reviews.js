const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Validation middleware
const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('comment').notEmpty().trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*.url').optional().isURL().withMessage('Image URL must be valid')
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

// GET /api/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', 
  param('productId').isMongoId().withMessage('Invalid product ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['createdAt', 'rating', 'helpfulCount']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get reviews
      const reviews = await Review.getProductReviews(productId, { page, limit, sort, order });
      
      // Get total count for pagination
      const totalReviews = await Review.countDocuments({ product: productId, status: 'approved' });
      
      // Get average rating
      const { averageRating, totalReviews: totalCount } = await Review.getAverageRating(productId);

      res.json({
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: parseInt(page) < Math.ceil(totalReviews / limit),
          hasPrev: parseInt(page) > 1
        },
        stats: {
          averageRating,
          totalReviews: totalCount
        }
      });

    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({
        message: 'Failed to fetch reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// POST /api/reviews - Create a new review
router.post('/', 
  auth,
  validateReview,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { productId, rating, title, comment, images = [] } = req.body;
      const userId = req.user.id;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({ product: productId, user: userId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }

      // Create the review
      const review = new Review({
        product: productId,
        user: userId,
        rating,
        title,
        comment,
        images,
        status: 'pending' // Default to pending for moderation
      });

      await review.save();

      // Update product review stats
      await product.updateReviewStats();

      // Populate user info for response
      await review.populate('user', 'firstName lastName email');

      res.status(201).json({
        message: 'Review submitted successfully',
        review
      });

    } catch (error) {
      console.error('Create review error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'You have already reviewed this product'
        });
      }

      res.status(500).json({
        message: 'Failed to create review',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// PUT /api/reviews/:id - Update a review
router.put('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid review ID'),
  validateReview,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, title, comment, images } = req.body;
      const userId = req.user.id;

      // Find the review
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user owns the review
      if (review.user.toString() !== userId) {
        return res.status(403).json({ message: 'You can only edit your own reviews' });
      }

      // Update the review
      review.rating = rating;
      review.title = title;
      review.comment = comment;
      if (images) review.images = images;
      review.status = 'pending'; // Reset to pending for re-moderation

      await review.save();

      // Update product review stats
      const product = await Product.findById(review.product);
      if (product) {
        await product.updateReviewStats();
      }

      // Populate user info for response
      await review.populate('user', 'firstName lastName email');

      res.json({
        message: 'Review updated successfully',
        review
      });

    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
        message: 'Failed to update review',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid review ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the review
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user owns the review
      if (review.user.toString() !== userId) {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }

      const productId = review.product;

      // Delete the review
      await Review.findByIdAndDelete(id);

      // Update product review stats
      const product = await Product.findById(productId);
      if (product) {
        await product.updateReviewStats();
      }

      res.json({
        message: 'Review deleted successfully',
        reviewId: id
      });

    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        message: 'Failed to delete review',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:id/helpful',
  auth,
  param('id').isMongoId().withMessage('Invalid review ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the review
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user has already marked as helpful
      const alreadyHelpful = review.isHelpfulByUser(userId);
      
      if (alreadyHelpful) {
        // Remove helpful mark
        review.helpful = review.helpful.filter(h => h.user.toString() !== userId);
      } else {
        // Add helpful mark
        review.helpful.push({ user: userId });
      }

      await review.save();

      res.json({
        message: alreadyHelpful ? 'Removed helpful mark' : 'Marked as helpful',
        helpfulCount: review.helpfulCount,
        isHelpful: !alreadyHelpful
      });

    } catch (error) {
      console.error('Toggle helpful error:', error);
      res.status(500).json({
        message: 'Failed to toggle helpful status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// GET /api/reviews/user - Get user's reviews
router.get('/user',
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const reviews = await Review.find({ user: userId })
        .populate('product', 'name.en images')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalReviews = await Review.countDocuments({ user: userId });

      res.json({
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: parseInt(page) < Math.ceil(totalReviews / limit),
          hasPrev: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({
        message: 'Failed to fetch user reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router; 