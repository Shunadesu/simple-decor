const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateRegistration = [
  body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
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

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      username: user.username 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register - User registration
router.post('/register', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Create new user (password will be hashed by the model's pre-save middleware)
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      status: 'active'
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.getPublicProfile();

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }
    
    res.status(500).json({
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        message: 'Account is not active. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.getPublicProfile();

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT setup, logout is handled client-side
    // by removing the token from storage
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Failed to logout',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Generate new token
      const newToken = generateToken(user);
      const userResponse = user.getPublicProfile();

      res.json({
        message: 'Token refreshed successfully',
        user: userResponse,
        token: newToken
      });

    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const userResponse = user.getPublicProfile();

      res.json({
        message: 'Profile retrieved successfully',
        user: userResponse
      });

    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const { firstName, lastName, email, phone } = req.body;

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email is already taken' });
        }
      }

      // Update user
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true }
      );

      const userResponse = updatedUser.getPublicProfile();

      res.json({
        message: 'Profile updated successfully',
        user: userResponse
      });

    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 