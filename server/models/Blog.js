const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  // Basic Information
  title: {
    en: { type: String, required: true, trim: true },
    vi: { type: String, required: true, trim: true },
    ko: { type: String, trim: true },
    zh: { type: String, trim: true },
    ja: { type: String, trim: true }
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  excerpt: {
    en: { type: String, required: true, maxlength: 500 },
    vi: { type: String, required: true, maxlength: 500 },
    ko: { type: String, maxlength: 500 },
    zh: { type: String, maxlength: 500 },
    ja: { type: String, maxlength: 500 }
  },
  
  content: {
    en: { type: String, required: true },
    vi: { type: String, required: true },
    ko: { type: String },
    zh: { type: String },
    ja: { type: String }
  },
  
  // Media
  featuredImage: {
    url: { type: String, required: true },
    public_id: { type: String },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number }
  },
  
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    alt: { type: String },
    caption: {
      en: { type: String },
      vi: { type: String }
    },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number }
  }],
  
  // Categorization
  category: {
    type: String,
    required: true,
    enum: [
      'internal-news',      // Tin nội bộ
      'market-trends',      // Xu hướng thị trường
      'knowledge',          // Bài viết kiến thức
      'customer-stories',   // Chia sẻ khách hàng
      'product-updates',    // Cập nhật sản phẩm
      'sustainability',     // Bền vững
      'design-tips',        // Mẹo thiết kế
      'company-culture'     // Văn hóa công ty
    ],
    index: true
  },
  
  tags: [{
    en: { type: String, trim: true },
    vi: { type: String, trim: true }
  }],
  
  // Author Information
  author: {
    name: { type: String, required: true },
    email: { type: String },
    bio: {
      en: { type: String },
      vi: { type: String }
    },
    avatar: {
      url: { type: String },
      alt: { type: String }
    },
    role: { type: String }
  },
  
  // Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft',
    index: true
  },
  
  publishedAt: {
    type: Date,
    index: true
  },
  
  scheduledAt: {
    type: Date
  },
  
  // Features
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  isSticky: {
    type: Boolean,
    default: false
  },
  
  allowComments: {
    type: Boolean,
    default: true
  },
  
  // SEO
  metaTitle: {
    en: { type: String, maxlength: 60 },
    vi: { type: String, maxlength: 60 }
  },
  
  metaDescription: {
    en: { type: String, maxlength: 160 },
    vi: { type: String, maxlength: 160 }
  },
  
  keywords: [{
    en: { type: String },
    vi: { type: String }
  }],
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  shareCount: {
    facebook: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  // Reading Time (in minutes)
  readingTime: {
    type: Number,
    default: 5
  },
  
  // Related Content
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Comments (if not using external service)
  comments: [{
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String }
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'spam'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    replies: [{
      author: {
        name: { type: String, required: true },
        email: { type: String, required: true }
      },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  }]
}, {
  timestamps: true
});

// Indexes for better performance
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ isFeatured: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ slug: 1 });

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Pre-save middleware to calculate reading time
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Calculate reading time based on content (vi version)
    const wordCount = this.content.vi.split(/\s+/).length;
    const wordsPerMinute = 200; // Average reading speed in Vietnamese
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Pre-save middleware to set publishedAt
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Static method to get published posts
blogSchema.statics.getPublished = function(options = {}) {
  const { category, limit = 10, skip = 0, featured } = options;
  
  let query = { status: 'published', publishedAt: { $lte: new Date() } };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (featured === true) {
    query.isFeatured = true;
  }
  
  return this.find(query)
    .sort({ isSticky: -1, publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('relatedProducts', 'name slug price images');
};

// Static method to get categories with post counts
blogSchema.statics.getCategories = async function() {
  const categories = await this.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  return categories;
};

// Instance method to increment view count
blogSchema.methods.incrementViewCount = function() {
  this.viewCount = (this.viewCount || 0) + 1;
  return this.save();
};

module.exports = mongoose.model('Blog', blogSchema);
