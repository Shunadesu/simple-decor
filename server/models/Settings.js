const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  general: {
    siteName: {
      type: String,
      default: 'Zuna Simple Decor'
    },
    siteDescription: {
      type: String,
      default: 'The Green Path Forward'
    },
    contactEmail: {
      type: String,
      default: 'cs@simpledecor.vn'
    },
    contactPhone: {
      type: String,
      default: '+84-989809313'
    },
    address: {
      type: String,
      default: 'Ho Chi Minh City, Vietnam'
    }
  },
  social: {
    facebook: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    }
  },
  appearance: {
    primaryColor: {
      type: String,
      default: '#557f39'
    },
    secondaryColor: {
      type: String,
      default: '#0ea5e9'
    },
    logo: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    }
  },
  email: {
    smtpHost: {
      type: String,
      default: ''
    },
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpUser: {
      type: String,
      default: ''
    },
    smtpPass: {
      type: String,
      default: ''
    },
    fromEmail: {
      type: String,
      default: 'noreply@zuna.com'
    },
    fromName: {
      type: String,
      default: 'Zuna Simple Decor'
    }
  },
  security: {
    passwordMinLength: {
      type: Number,
      default: 8
    },
    passwordRequireUppercase: {
      type: Boolean,
      default: true
    },
    passwordRequireNumbers: {
      type: Boolean,
      default: true
    },
    passwordRequireSymbols: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 3600 // 1 hour in seconds
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    backupEnabled: {
      type: Boolean,
      default: false
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  database: {
    connectionStatus: {
      type: String,
      default: 'connected'
    },
    lastBackup: {
      type: Date,
      default: null
    },
    autoBackup: {
      type: Boolean,
      default: false
    }
  },
  currency: {
    defaultCurrency: {
      type: String,
      default: 'VND'
    },
    supportedCurrencies: [{
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      symbol: {
        type: String,
        required: true
      },
      exchangeRate: {
        type: Number,
        default: 1
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    autoUpdateRates: {
      type: Boolean,
      default: false
    },
    rateUpdateFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    }
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    orderNotifications: {
      type: Boolean,
      default: true
    },
    stockAlerts: {
      type: Boolean,
      default: true
    },
    systemAlerts: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Static method to get or create settings
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      currency: {
        supportedCurrencies: [
          {
            code: 'VND',
            name: 'Vietnamese Dong',
            symbol: '₫',
            exchangeRate: 1,
            isActive: true
          },
          {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            exchangeRate: 0.00004,
            isActive: true
          },
          {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            exchangeRate: 0.000037,
            isActive: true
          }
        ]
      }
    });
  }
  
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = await this.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }
  
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
