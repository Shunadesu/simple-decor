const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateCartItem = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('price.amount').isNumeric().withMessage('Price amount must be a number'),
  body('price.currency').optional().isIn(['USD', 'EUR', 'VND']).withMessage('Invalid currency')
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

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  console.log('Token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user);
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    console.log('User does not have admin role:', req.user.role);
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log('User has admin role:', req.user.role);
  next();
};

// GET /api/carts - Get all carts (admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (userId) query.user = userId;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const carts = await Cart.find(query)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Cart.countDocuments(query);

    res.json({
      carts,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      hasNext: skip + carts.length < total,
      hasPrev: parseInt(page) > 1
    });

  } catch (error) {
    console.error('Get carts error:', error);
    res.status(500).json({
      message: 'Failed to fetch carts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/carts/my-cart - Get current user's cart
router.get('/my-cart', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOrCreateForUser(req.user.id);
    
    const populatedCart = await Cart.findById(cart._id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    res.json({ cart: populatedCart });

  } catch (error) {
    console.error('Get my cart error:', error);
    res.status(500).json({
      message: 'Failed to fetch cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/carts/user/:userId - Get cart for specific user (admin only)
router.get('/user/:userId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Getting cart for user:', userId);
    console.log('Request user:', req.user);
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.username);

    // Get or create cart for user
    const cart = await Cart.findOrCreateForUser(userId);
    
    const populatedCart = await Cart.findById(cart._id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    console.log('Cart retrieved successfully');
    res.json({ cart: populatedCart });

  } catch (error) {
    console.error('Get user cart error:', error);
    res.status(500).json({
      message: 'Failed to fetch user cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/carts/:id - Get single cart
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own cart unless they're admin
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && cart.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const populatedCart = await Cart.findById(id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    res.json({ cart: populatedCart });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      message: 'Failed to fetch cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/carts/add-item - Add item to cart
router.post('/add-item', verifyToken, validateCartItem, handleValidationErrors, async (req, res) => {
  try {
    const { productId, quantity, selectedOptions, price } = req.body;

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'published' || !product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    // Get or create cart for user
    const cart = await Cart.findOrCreateForUser(req.user.id);

    // Add item to cart
    await cart.addItem(productId, quantity, {
      selectedOptions,
      price: price || product.price
    });

    // Populate cart with product details
    const populatedCart = await Cart.findById(cart._id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    res.json({
      message: 'Item added to cart successfully',
      cart: populatedCart
    });

  } catch (error) {
    console.error('Add item to cart error:', error);
    res.status(500).json({
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/carts/update-item/:itemId - Update cart item quantity
router.put('/update-item/:itemId', verifyToken, 
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ 
        user: req.user.id, 
        status: 'active',
        'items._id': itemId
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart or item not found' });
      }

      await cart.updateItemQuantity(itemId, quantity);

      const populatedCart = await Cart.findById(cart._id)
        .populate('user', 'username email firstName lastName')
        .populate('items.product', 'name price images category status');

      res.json({
        message: 'Cart item updated successfully',
        cart: populatedCart
      });

    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({
        message: 'Failed to update cart item',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// DELETE /api/carts/remove-item/:itemId - Remove item from cart
router.delete('/remove-item/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ 
      user: req.user.id, 
      status: 'active',
      'items._id': itemId
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart or item not found' });
    }

    await cart.removeItem(itemId);

    const populatedCart = await Cart.findById(cart._id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    res.json({
      message: 'Item removed from cart successfully',
      cart: populatedCart
    });

  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      message: 'Failed to remove item from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/carts/clear - Clear cart
router.post('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ 
      user: req.user.id, 
      status: 'active'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.clearCart();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/carts/apply-coupon - Apply coupon to cart
router.post('/apply-coupon', verifyToken, 
  body('couponCode').notEmpty().withMessage('Coupon code is required'),
  body('discount').isNumeric().withMessage('Discount must be a number'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { couponCode, discount } = req.body;

      const cart = await Cart.findOne({ 
        user: req.user.id, 
        status: 'active'
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      await cart.applyCoupon(couponCode, discount);

      const populatedCart = await Cart.findById(cart._id)
        .populate('user', 'username email firstName lastName')
        .populate('items.product', 'name price images category status');

      res.json({
        message: 'Coupon applied successfully',
        cart: populatedCart
      });

    } catch (error) {
      console.error('Apply coupon error:', error);
      res.status(500).json({
        message: error.message || 'Failed to apply coupon',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// DELETE /api/carts/remove-coupon/:couponCode - Remove coupon from cart
router.delete('/remove-coupon/:couponCode', verifyToken, async (req, res) => {
  try {
    const { couponCode } = req.params;

    const cart = await Cart.findOne({ 
      user: req.user.id, 
      status: 'active'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeCoupon(couponCode);

    const populatedCart = await Cart.findById(cart._id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name price images category status');

    res.json({
      message: 'Coupon removed successfully',
      cart: populatedCart
    });

  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({
      message: 'Failed to remove coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/carts/:id/status - Update cart status (admin only)
router.patch('/:id/status', verifyToken, requireAdmin,
  body('status').isIn(['active', 'abandoned', 'converted']).withMessage('Invalid status'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const cart = await Cart.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('user', 'username email firstName lastName')
       .populate('items.product', 'name price images category status');

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.json({
        message: 'Cart status updated successfully',
        cart
      });

    } catch (error) {
      console.error('Update cart status error:', error);
      res.status(500).json({
        message: 'Failed to update cart status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// DELETE /api/carts/:id - Delete cart (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await Cart.findByIdAndDelete(id);

    res.json({
      message: 'Cart deleted successfully',
      cartId: id
    });

  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({
      message: 'Failed to delete cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/carts/stats - Get cart statistics (admin only)
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalCarts = await Cart.countDocuments();
    const activeCarts = await Cart.countDocuments({ status: 'active' });
    const abandonedCarts = await Cart.countDocuments({ status: 'abandoned' });
    const convertedCarts = await Cart.countDocuments({ status: 'converted' });

    const cartsByStatus = await Cart.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentCarts = await Cart.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username email')
      .select('user status totalItems total createdAt');

    res.json({
      totalCarts,
      activeCarts,
      abandonedCarts,
      convertedCarts,
      cartsByStatus,
      recentCarts
    });

  } catch (error) {
    console.error('Get cart stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch cart statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/carts/guest - Create new guest cart
router.post('/guest', async (req, res) => {
  try {
    const { generateGuestId } = require('../utils/guest');
    const guestId = generateGuestId();

    const cart = new Cart({
      guestId,
      items: [],
      status: 'active'
    });

    await cart.save();

    res.status(201).json({
      message: 'Guest cart created successfully',
      guestId,
      cart
    });

  } catch (error) {
    console.error('Create guest cart error:', error);
    res.status(500).json({
      message: 'Failed to create guest cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Guest Cart Routes (no authentication required)

// GET /api/carts/guest/:guestId - Get guest cart
router.get('/guest/:guestId', async (req, res) => {
  try {
    const { guestId } = req.params;

    const cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).populate('items.product', 'name price images isActive');

    if (!cart) {
      // Create new guest cart
      const newCart = new Cart({
        guestId,
        items: [],
        status: 'active'
      });
      await newCart.save();
      return res.json({ cart: newCart });
    }

    res.json({ cart });

  } catch (error) {
    console.error('Get guest cart error:', error);
    res.status(500).json({
      message: 'Failed to fetch guest cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/carts/guest/:guestId/items - Add item to guest cart
router.post('/guest/:guestId/items', [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('selectedOptions').optional().isObject(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { guestId } = req.params;
    const { productId, quantity, selectedOptions } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    // Get or create guest cart
    let cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!cart) {
      cart = new Cart({
        guestId,
        items: [],
        status: 'active'
      });
    }

    // Check if item already exists
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId &&
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || {})
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedOptions: selectedOptions || {},
        price: {
          amount: product.price,
          currency: 'VND'
        }
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images isActive');

    res.json({
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add item to guest cart error:', error);
    res.status(500).json({
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/carts/guest/:guestId/items/:itemId - Update item in guest cart
router.put('/guest/:guestId/items/:itemId', [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be at least 0'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { guestId, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images isActive');

    res.json({
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Update guest cart item error:', error);
    res.status(500).json({
      message: 'Failed to update cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/carts/guest/:guestId/items/:itemId - Remove item from guest cart
router.delete('/guest/:guestId/items/:itemId', async (req, res) => {
  try {
    const { guestId, itemId } = req.params;

    const cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images isActive');

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Remove item from guest cart error:', error);
    res.status(500).json({
      message: 'Failed to remove item from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/carts/guest/:guestId - Clear guest cart
router.delete('/guest/:guestId', async (req, res) => {
  try {
    const { guestId } = req.params;

    const cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.appliedCoupons = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Clear guest cart error:', error);
    res.status(500).json({
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 