const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  description: {
    en: { type: String },
    vi: { type: String }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  image: {
    url: { type: String },
    public_id: { type: String },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number }
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  meta: {
    title: {
      en: { type: String },
      vi: { type: String }
    },
    description: {
      en: { type: String },
      vi: { type: String }
    },
    keywords: {
      en: { type: String },
      vi: { type: String }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
productCategorySchema.index({ parent: 1 });
productCategorySchema.index({ isActive: 1 });
productCategorySchema.index({ order: 1 });

// Virtual for getting children
productCategorySchema.virtual('children', {
  ref: 'ProductCategory',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for getting product count
productCategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Ensure virtuals are included in JSON output
productCategorySchema.set('toJSON', { virtuals: true });
productCategorySchema.set('toObject', { virtuals: true });

// Pre-save middleware to generate slug if not provided
productCategorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate level based on parent
  if (this.parent) {
    this.level = 1;
  } else {
    this.level = 0;
  }
  
  next();
});

module.exports = mongoose.model('ProductCategory', productCategorySchema); 