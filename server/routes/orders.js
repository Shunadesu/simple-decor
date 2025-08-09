const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

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

// GET /api/orders - Get all orders (admin only)
router.get('/', [
  auth,
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { status, paymentStatus, limit = 20, page = 1 } = req.query;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/orders/my - Get user's orders
router.get('/my', [
  auth,
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { status } = req.query;
    const options = {};
    if (status) options.status = status;

    const orders = await Order.findByUser(req.user._id, options)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({ orders });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/orders/guest - Get guest orders by email
router.get('/guest', [
  query('email').isEmail().withMessage('Valid email is required'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, status } = req.query;
    const options = {};
    if (status) options.status = status;

    const orders = await Order.findByGuestEmail(email, options)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({ orders });

  } catch (error) {
    console.error('Error fetching guest orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid order ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images price description')
      .populate('cancelledBy', 'firstName lastName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can access this order
    if (req.user) {
      // Authenticated user
      if (req.user.role !== 'admin' && order.user && order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // Guest access - check if email matches
      if (!email || order.shippingAddress.email !== email) {
        return res.status(403).json({ message: 'Access denied. Please provide valid email.' });
      }
    }

    res.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/orders - Create new order
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('paymentMethod').isIn(['cod', 'bank_transfer', 'credit_card', 'paypal']).withMessage('Invalid payment method'),
  body('notes').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      cartId
    } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {},
        price: {
          amount: product.price,
          currency: 'VND'
        },
        total: itemTotal
      });
    }

    // Calculate shipping cost (you can implement your own logic)
    const shippingCost = 0; // Free shipping for now
    const tax = 0; // No tax for now
    const discount = 0; // No discount for now
    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const orderData = {
      user: req.user ? req.user._id : null,
      guestInfo: !req.user ? {
        email: shippingAddress.email,
        phone: shippingAddress.phone
      } : null,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      currency: 'VND',
      notes
    };

    const order = new Order(orderData);
    await order.save();

    // Clear cart if cartId is provided and user is authenticated
    if (cartId && req.user) {
      await Cart.findByIdAndUpdate(cartId, { status: 'converted' });
    }

    // Populate order for response
    await order.populate('items.product', 'name images price');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/orders/from-cart - Create order from cart
router.post('/from-cart', [
  auth,
  body('cartId').isMongoId().withMessage('Invalid cart ID'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('paymentMethod').isIn(['cod', 'bank_transfer', 'credit_card', 'paypal']).withMessage('Invalid payment method'),
  body('notes').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { cartId, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get cart
    const cart = await Cart.findById(cartId)
      .populate('items.product', 'name images price isActive');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({ message: `Product ${item.product.name} is not available` });
      }

      const itemTotal = item.price.amount * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {},
        price: item.price,
        total: itemTotal
      });
    }

    // Calculate totals
    const shippingCost = 0; // Free shipping for now
    const tax = 0; // No tax for now
    const discount = cart.totalDiscount || 0;
    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const orderData = {
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      currency: 'VND',
      notes
    };

    const order = new Order(orderData);
    await order.save();

    // Clear cart
    await Cart.findByIdAndUpdate(cartId, { status: 'converted' });

    // Populate order for response
    await order.populate('items.product', 'name images price');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/orders/from-guest-cart - Create order from guest cart
router.post('/from-guest-cart', [
  body('guestId').isString().withMessage('Guest ID is required'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('paymentMethod').isIn(['cod', 'bank_transfer', 'credit_card', 'paypal']).withMessage('Invalid payment method'),
  body('notes').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { guestId, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get guest cart
    const cart = await Cart.findOne({ 
      guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).populate('items.product', 'name images price isActive');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({ message: `Product ${item.product.name} is not available` });
      }

      const itemTotal = item.price.amount * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {},
        price: item.price,
        total: itemTotal
      });
    }

    // Calculate totals
    const shippingCost = 0; // Free shipping for now
    const tax = 0; // No tax for now
    const discount = cart.totalDiscount || 0;
    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const orderData = {
      user: null, // Guest order
      guestInfo: {
        email: shippingAddress.email,
        phone: shippingAddress.phone
      },
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      currency: 'VND',
      notes
    };

    const order = new Order(orderData);
    await order.save();

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { status: 'converted' });

    // Populate order for response
    await order.populate('items.product', 'name images price');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order from guest cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch('/:id/status', [
  auth,
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('cancellationReason').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancelledBy = req.user._id;
      order.cancellationReason = cancellationReason;
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/payment - Update payment status (admin only)
router.patch('/:id/payment', [
  auth,
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('transactionId').optional().isString(),
  body('paymentAmount').optional().isNumeric(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentAmount } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      order.paymentDetails = {
        ...order.paymentDetails,
        transactionId,
        paymentAmount: paymentAmount || order.total,
        paymentDate: new Date()
      };
    }

    await order.save();

    res.json({
      message: 'Payment status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/tracking - Update tracking information (admin only)
router.patch('/:id/tracking', [
  auth,
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('trackingNumber').optional().isString(),
  body('estimatedDelivery').optional().isISO8601(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, estimatedDelivery } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    await order.save();

    res.json({
      message: 'Tracking information updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating tracking information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/orders/:id - Cancel order (user or admin)
router.delete('/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('reason').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = req.user._id;
    if (reason) order.cancellationReason = reason;

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 