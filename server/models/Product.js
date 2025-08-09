const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    en: { type: String, required: true, trim: true },
    vi: { type: String, required: true, trim: true },
    ko: { type: String, trim: true },
    zh: { type: String, trim: true },
    ja: { type: String, trim: true }
  },
  
  description: {
    en: { type: String, required: true },
    vi: { type: String, required: true },
    ko: { type: String },
    zh: { type: String },
    ja: { type: String }
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
    index: true
  },
  
  // Media
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number }
  }],
  
  videos: [{
    url: { type: String },
    public_id: { type: String },
    type: { type: String, enum: ['youtube', 'vimeo', 'direct'], default: 'direct' },
    title: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number },
    duration: { type: Number }
  }],
  
  // Technical Specifications
  material: {
    type: String,
    required: true,
    trim: true
  },
  
  specifications: {
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { type: String, default: 'cm' }
    },
    weight: {
      value: { type: Number },
      unit: { type: String, default: 'kg' }
    },
    color: { type: String },
    finish: { type: String }
  },
  
  moisture: {
    type: String,
    required: true,
    default: '< 12%'
  },
  
  packaging: {
    type: String,
    required: true,
    default: 'Carton box'
  },
  
  // Pricing
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'VND'], default: 'VND' },
    unit: { type: String, default: 'piece' }
  },
  
  // Inventory
  stock: {
    quantity: { type: Number, default: 0 },
    minOrder: { type: Number, default: 1 },
    maxOrder: { type: Number },
    isAvailable: { type: Boolean, default: true }
  },
  
  // SEO & Marketing
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  metaTitle: {
    en: { type: String },
    vi: { type: String },
    ko: { type: String },
    zh: { type: String },
    ja: { type: String }
  },
  
  metaDescription: {
    en: { type: String },
    vi: { type: String },
    ko: { type: String },
    zh: { type: String },
    ja: { type: String }
  },
  
  keywords: [String],
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional Information
  tags: [String],
  
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Review statistics (computed fields)
  reviewStats: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  
  // Custom Fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, status: 1, isActive: 1 });
productSchema.index({ 'name.en': 'text', 'name.vi': 'text', 'description.en': 'text', 'description.vi': 'text' });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to update slug
productSchema.pre('save', function(next) {
  if (this.isModified('name.en') && !this.slug) {
    this.slug = this.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted dimensions
productSchema.virtual('formattedDimensions').get(function() {
  const specs = this.specifications;
  if (specs && specs.dimensions) {
    const { length, width, height, unit } = specs.dimensions;
    return `${length}x${width}x${height} ${unit}`;
  }
  return null;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Instance method to get localized name
productSchema.methods.getLocalizedName = function(language = 'en') {
  return this.name[language] || this.name.en || this.name.vi;
};

// Instance method to get localized description
productSchema.methods.getLocalizedDescription = function(language = 'en') {
  return this.description[language] || this.description.en || this.description.vi;
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, status: 'published', isActive: true };
  return this.find(query, options);
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 6) {
  return this.find({ 
    isFeatured: true, 
    status: 'published', 
    isActive: true 
  }).limit(limit);
};

// Instance method to update review statistics
productSchema.methods.updateReviewStats = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.getAverageRating(this._id);
  
  // Get rating distribution
  const distribution = await Review.aggregate([
    { $match: { product: this._id, status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  // Initialize rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  // Fill in actual counts
  distribution.forEach(item => {
    ratingDistribution[item._id] = item.count;
  });
  
  // Update the product's review stats
  this.reviewStats = {
    averageRating: stats.averageRating,
    totalReviews: stats.totalReviews,
    ratingDistribution
  };
  
  await this.save();
  return this.reviewStats;
};

// Virtual for formatted average rating
productSchema.virtual('formattedAverageRating').get(function() {
  return this.reviewStats ? Math.round(this.reviewStats.averageRating * 10) / 10 : 0;
});

// Virtual for total reviews count
productSchema.virtual('totalReviewsCount').get(function() {
  return this.reviewStats ? this.reviewStats.totalReviews : 0;
});

module.exports = mongoose.model('Product', productSchema); 