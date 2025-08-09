const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  product: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'quoted', 'closed'],
    default: 'pending'
  },
  quoteAmount: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
quoteRequestSchema.index({ email: 1, createdAt: -1 });
quoteRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema); 