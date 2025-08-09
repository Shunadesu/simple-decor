const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    alt: { type: String }
  }],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1, status: 1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful ? this.helpful.length : 0;
});

// Instance method to check if user has already marked as helpful
reviewSchema.methods.isHelpfulByUser = function(userId) {
  return this.helpful && this.helpful.some(h => h.user.toString() === userId.toString());
};

// Static method to get average rating for a product
reviewSchema.statics.getAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  } : { averageRating: 0, totalReviews: 0 };
};

// Static method to get reviews for a product
reviewSchema.statics.getProductReviews = function(productId, options = {}) {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = options;
  
  const query = { product: productId, status: 'approved' };
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;
  
  return this.find(query)
    .populate('user', 'firstName lastName email')
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = mongoose.model('Review', reviewSchema); 