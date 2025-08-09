const express = require('express');
const { body, validationResult } = require('express-validator');
const QuoteRequest = require('../models/QuoteRequest');
const router = express.Router();

// Validation rules
const quoteRequestValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

// POST /api/quote-requests - Submit quote request
router.post('/', quoteRequestValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, phone, product, notes } = req.body;

    // Create new quote request
    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone,
      product,
      notes,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await quoteRequest.save();

    // Send email notification (implement email service)
    // await sendQuoteRequestNotification(quoteRequest);

    res.status(201).json({
      message: 'Quote request submitted successfully',
      data: {
        id: quoteRequest._id,
        name: quoteRequest.name,
        email: quoteRequest.email,
        status: quoteRequest.status
      }
    });

  } catch (error) {
    console.error('Quote request submission error:', error);
    res.status(500).json({
      message: 'Failed to submit quote request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/quote-requests - Get all quote requests (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const quoteRequests = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await QuoteRequest.countDocuments(query);

    res.json({
      quoteRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get quote requests error:', error);
    res.status(500).json({
      message: 'Failed to fetch quote requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/quote-requests/:id - Update quote request (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quoteAmount, currency } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (quoteAmount) updateData.quoteAmount = quoteAmount;
    if (currency) updateData.currency = currency;

    const quoteRequest = await QuoteRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    res.json({
      message: 'Quote request updated successfully',
      data: quoteRequest
    });

  } catch (error) {
    console.error('Update quote request error:', error);
    res.status(500).json({
      message: 'Failed to update quote request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/quote-requests/:id - Delete quote request (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quoteRequest = await QuoteRequest.findByIdAndDelete(id);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    res.json({
      message: 'Quote request deleted successfully',
      data: { id }
    });

  } catch (error) {
    console.error('Delete quote request error:', error);
    res.status(500).json({
      message: 'Failed to delete quote request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/quote-requests/:id/status - Update quote request status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const quoteRequest = await QuoteRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    res.json({
      message: 'Quote request status updated successfully',
      data: quoteRequest
    });

  } catch (error) {
    console.error('Update quote request status error:', error);
    res.status(500).json({
      message: 'Failed to update quote request status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/quote-requests/stats - Get statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const stats = await QuoteRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await QuoteRequest.countDocuments();
    const pending = await QuoteRequest.countDocuments({ status: 'pending' });
    const processing = await QuoteRequest.countDocuments({ status: 'processing' });
    const quoted = await QuoteRequest.countDocuments({ status: 'quoted' });

    res.json({
      total,
      pending,
      processing,
      quoted,
      breakdown: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 