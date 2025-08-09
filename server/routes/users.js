const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateUser = [
  body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['user', 'admin', 'moderator']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive', 'banned']).withMessage('Invalid status')
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

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /api/users - Get all users (admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status) query.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id)
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', verifyToken, requireAdmin, validateUser, handleValidationErrors, async (req, res) => {
  try {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    const user = new User(userData);
    await user.save();

    // Remove sensitive data from response
    const userResponse = user.getPublicProfile();

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }
    
    res.status(500).json({
      message: 'Failed to create user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Non-admin users cannot update role or status
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      delete updateData.role;
      delete updateData.status;
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }
    
    res.status(500).json({
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', verifyToken, [
  body('firstName').optional().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phone').optional().matches(/^[+]?[\d\s\-\(\)]+$/).withMessage('Please enter a valid phone number'),
  body('currentPassword').optional().isLength({ min: 6 }).withMessage('Current password must be at least 6 characters'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Update basic info
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // Handle password change
    if (currentPassword && newPassword) {
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: 'User deleted successfully',
      userId: id
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/users/:id/status - Update user status (admin only)
router.patch('/:id/status', verifyToken, requireAdmin, 
  body('status').isIn(['active', 'inactive', 'banned']).withMessage('Invalid status'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'User status updated successfully',
        user
      });

    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        message: 'Failed to update user status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// POST /api/users/:id/reset-password - Reset user password (admin only)
router.post('/:id/reset-password', verifyToken, requireAdmin,
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const user = await User.findByIdAndUpdate(
        id,
        { 
          password: hashedPassword,
          loginAttempts: 0,
          lockUntil: null
        },
        { new: true }
      ).select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Password reset successfully',
        user
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        message: 'Failed to reset password',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// GET /api/users/stats - Get user statistics (admin only)
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email firstName lastName createdAt');

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      bannedUsers,
      usersByRole,
      recentUsers
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// WISHLIST ENDPOINTS

// GET /api/users/wishlist - Get user's wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist.product',
        select: 'name description price images category isFeatured status',
        match: { status: 'published', isActive: true }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out products that don't exist or are not active
    const wishlist = user.wishlist.filter(item => item.product);

    res.json({
      message: 'Wishlist retrieved successfully',
      wishlist,
      count: wishlist.length
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      message: 'Failed to fetch wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/users/wishlist - Add product to wishlist
router.post('/wishlist', verifyToken, [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists and is active
    const product = await Product.findOne({ 
      _id: productId, 
      status: 'published', 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not available' });
    }

    // Check if product is already in wishlist
    const user = await User.findById(userId);
    const existingWishlistItem = user.wishlist.find(item => 
      item.product.toString() === productId
    );

    if (existingWishlistItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    user.wishlist.push({ product: productId });
    await user.save();

    // Populate the newly added product
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'wishlist.product',
        select: 'name description price images category isFeatured status'
      });

    const addedItem = updatedUser.wishlist.find(item => 
      item.product._id.toString() === productId
    );

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      wishlistItem: addedItem
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      message: 'Failed to add product to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/users/wishlist/:productId - Remove product from wishlist
router.delete('/wishlist/:productId', verifyToken, [
  param('productId').isMongoId().withMessage('Invalid product ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is in wishlist
    const wishlistItemIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    if (wishlistItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    // Remove product from wishlist
    user.wishlist.splice(wishlistItemIndex, 1);
    await user.save();

    res.json({
      message: 'Product removed from wishlist successfully',
      removedProductId: productId
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      message: 'Failed to remove product from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/users/wishlist - Clear entire wishlist
router.delete('/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear wishlist
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

// GET /api/users/wishlist/check/:productId - Check if product is in wishlist
router.get('/wishlist/check/:productId', verifyToken, [
  param('productId').isMongoId().withMessage('Invalid product ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is in wishlist
    const isInWishlist = user.wishlist.some(item => 
      item.product.toString() === productId
    );

    res.json({
      isInWishlist,
      productId
    });

  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      message: 'Failed to check wishlist status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 