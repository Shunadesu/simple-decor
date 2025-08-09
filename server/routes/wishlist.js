const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/wishlist - Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Wishlist retrieved successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      message: 'Failed to get wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/wishlist - Add product to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if product is already in wishlist
    const existingItem = user.wishlist.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push({
      product: productId,
      addedAt: new Date()
    });

    await user.save();

    // Populate product details
    await user.populate('wishlist.product');

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      message: 'Failed to add product to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(item => 
      item.product.toString() !== productId
    );

    await user.save();

    res.json({
      message: 'Product removed from wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      message: 'Failed to remove product from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.wishlist = [];
    await user.save();

    res.json({
      message: 'Wishlist cleared successfully',
      wishlist: []
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      message: 'Failed to clear wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 