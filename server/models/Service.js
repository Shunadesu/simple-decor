const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: true,
      trim: true
    },
    vi: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  description: {
    en: {
      type: String,
      required: true
    },
    vi: {
      type: String,
      required: true
    }
  },
  
  shortDescription: {
    en: {
      type: String,
      trim: true
    },
    vi: {
      type: String,
      trim: true
    }
  },
  
  features: [{
    en: {
      type: String,
      required: true
    },
    vi: {
      type: String,
      required: true
    }
  }],
  
  icon: {
    type: String,
    required: true,
    enum: [
      'Users', 'FileText', 'Ship', 'Shield', 'Headphones', 'Settings',
      'Truck', 'Heart', 'Award', 'Zap', 'Globe', 'Wrench', 'CheckCircle',
      'Package', 'Search', 'Clock', 'Star', 'Target', 'Layers', 'Database'
    ],
    default: 'Settings'
  },
  
  image: {
    url: {
      type: String
    },
    public_id: {
      type: String
    },
    alt: {
      en: {
        type: String
      },
      vi: {
        type: String
      }
    }
  },
  
  category: {
    type: String,
    enum: [
      'consultation',     // Tư vấn
      'documentation',    // Giấy tờ/Hồ sơ
      'logistics',        // Vận chuyển
      'quality',          // Chất lượng
      'support',          // Hỗ trợ
      'manufacturing',    // Sản xuất
      'export',           // Xuất khẩu
      'technology',       // Công nghệ
      'design',           // Thiết kế
      'other'             // Khác
    ],
    required: true,
    default: 'other'
  },
  
  price: {
    type: String,
    enum: ['free', 'negotiable', 'contact', 'included'],
    default: 'contact'
  },
  
  priceDetails: {
    en: {
      type: String
    },
    vi: {
      type: String
    }
  },
  
  duration: {
    type: String, // e.g., "1-2 weeks", "Ongoing", "Per project"
  },
  
  requirements: [{
    en: {
      type: String
    },
    vi: {
      type: String
    }
  }],
  
  benefits: [{
    en: {
      type: String
    },
    vi: {
      type: String
    }
  }],
  
  processSteps: [{
    step: {
      type: Number,
      required: true
    },
    title: {
      en: {
        type: String,
        required: true
      },
      vi: {
        type: String,
        required: true
      }
    },
    description: {
      en: {
        type: String
      },
      vi: {
        type: String
      }
    }
  }],
  
  tags: [{
    en: {
      type: String
    },
    vi: {
      type: String
    }
  }],
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  displayOrder: {
    type: Number,
    default: 0
  },
  
  contactInfo: {
    email: {
      type: String
    },
    phone: {
      type: String
    },
    department: {
      type: String
    }
  },
  
  relatedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  
  metaTitle: {
    en: {
      type: String
    },
    vi: {
      type: String
    }
  },
  
  metaDescription: {
    en: {
      type: String
    },
    vi: {
      type: String
    }
  },
  
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  statistics: {
    viewCount: {
      type: Number,
      default: 0
    },
    inquiryCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ isFeatured: 1, displayOrder: 1 });
serviceSchema.index({ 'title.en': 'text', 'title.vi': 'text', 'description.en': 'text', 'description.vi': 'text' });
// slug index is automatically created by unique: true

// Virtual for localized content
serviceSchema.virtual('localizedTitle').get(function() {
  return {
    en: this.title?.en || '',
    vi: this.title?.vi || ''
  };
});

serviceSchema.virtual('localizedDescription').get(function() {
  return {
    en: this.description?.en || '',
    vi: this.description?.vi || ''
  };
});

// Static methods
serviceSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
};

serviceSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
};

serviceSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
};

serviceSchema.statics.searchServices = function(searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { 'title.en': { $regex: searchTerm, $options: 'i' } },
          { 'title.vi': { $regex: searchTerm, $options: 'i' } },
          { 'description.en': { $regex: searchTerm, $options: 'i' } },
          { 'description.vi': { $regex: searchTerm, $options: 'i' } },
          { 'features.en': { $regex: searchTerm, $options: 'i' } },
          { 'features.vi': { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  }).sort({ displayOrder: 1, createdAt: -1 });
};

// Instance methods
serviceSchema.methods.incrementView = function() {
  this.statistics.viewCount += 1;
  return this.save();
};

serviceSchema.methods.incrementInquiry = function() {
  this.statistics.inquiryCount += 1;
  return this.save();
};

serviceSchema.methods.generateSlug = function() {
  if (!this.slug && this.title?.en) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
};

// Middleware
serviceSchema.pre('save', function(next) {
  // Generate slug if not provided
  this.generateSlug();
  next();
});

serviceSchema.pre('findOneAndUpdate', function(next) {
  // Update slug if title changes
  if (this.getUpdate().title && this.getUpdate().title.en) {
    const slug = this.getUpdate().title.en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    this.getUpdate().slug = slug;
  }
  next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
