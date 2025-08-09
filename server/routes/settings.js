const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get application settings including currency preferences
router.get('/', async (req, res) => {
  try {
    const settings = {
      defaultCurrency: 'VND',
      supportedCurrencies: ['USD', 'EUR', 'VND'],
      currencyRates: {
        USD: { VND: 24000, EUR: 0.85 },
        VND: { USD: 1/24000, EUR: 1/28000 },
        EUR: { USD: 1.18, VND: 28000 }
      },
      shippingThresholds: {
        VND: 1000000,
        USD: 50,
        EUR: 40
      },
      shippingCosts: {
        VND: 50000,
        USD: 5,
        EUR: 4
      },
      taxRate: 0.1 // 10% VAT
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Get currency exchange rates
router.get('/currency-rates', async (req, res) => {
  try {
    // In production, you would fetch real-time rates from an API
    const exchangeRates = {
      USD: { VND: 24000, EUR: 0.85 },
      VND: { USD: 1/24000, EUR: 1/28000 },
      EUR: { USD: 1.18, VND: 28000 }
    };

    res.json({
      success: true,
      rates: exchangeRates,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currency rates'
    });
  }
});

// Convert amount between currencies
router.post('/convert-currency', async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Amount, fromCurrency, and toCurrency are required'
      });
    }

    if (fromCurrency === toCurrency) {
      return res.json({
        success: true,
        originalAmount: amount,
        convertedAmount: amount,
        fromCurrency,
        toCurrency,
        rate: 1
      });
    }

    // Simplified exchange rates (use real-time API in production)
    const exchangeRates = {
      USD: { VND: 24000, EUR: 0.85 },
      VND: { USD: 1/24000, EUR: 1/28000 },
      EUR: { USD: 1.18, VND: 28000 }
    };

    if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
      return res.status(400).json({
        success: false,
        message: `Conversion from ${fromCurrency} to ${toCurrency} not supported`
      });
    }

    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = Math.round(amount * rate * 100) / 100; // Round to 2 decimal places

    res.json({
      success: true,
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      rate
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert currency'
    });
  }
});

// Admin routes for settings management
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

router.put('/admin', auth, adminAuth, async (req, res) => {
  try {
    const updateData = req.body;
    
    // Validate required fields if provided
    if (updateData.general && updateData.general.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.general.contactEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }
    
    if (updateData.email && updateData.email.smtpPort) {
      const port = parseInt(updateData.email.smtpPort);
      if (isNaN(port) || port < 1 || port > 65535) {
        return res.status(400).json({
          success: false,
          message: 'Invalid SMTP port number'
        });
      }
    }
    
    // Validate color formats if provided
    if (updateData.appearance) {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (updateData.appearance.primaryColor && !colorRegex.test(updateData.appearance.primaryColor)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid primary color format'
        });
      }
      if (updateData.appearance.secondaryColor && !colorRegex.test(updateData.appearance.secondaryColor)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid secondary color format'
        });
      }
    }
    
    const settings = await Settings.updateSettings(updateData);
    
    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Get database statistics for admin
router.get('/admin/stats', auth, adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Get collection stats
    const stats = {};
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        stats[collection.name] = count;
      } catch (error) {
        console.error(`Error counting ${collection.name}:`, error);
        stats[collection.name] = 0;
      }
    }
    
    // Get database info
    const dbStats = await mongoose.connection.db.stats();
    
    res.json({
      success: true,
      data: {
        collections: stats,
        database: {
          name: mongoose.connection.name,
          size: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexSize: dbStats.indexSize,
          objects: dbStats.objects,
          avgObjSize: dbStats.avgObjSize
        },
        connection: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          host: mongoose.connection.host,
          port: mongoose.connection.port
        }
      }
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database statistics'
    });
  }
});

// Test email configuration
router.post('/admin/test-email', auth, adminAuth, async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Test email address is required'
      });
    }
    
    const settings = await Settings.getSettings();
    
    if (!settings.email.smtpHost || !settings.email.smtpUser) {
      return res.status(400).json({
        success: false,
        message: 'Email configuration is incomplete'
      });
    }
    
    // Here you would implement actual email sending logic
    // For now, we'll just simulate a successful test
    
    res.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email configuration'
    });
  }
});

// Reset settings to default
router.post('/admin/reset', auth, adminAuth, async (req, res) => {
  try {
    const { section } = req.body;
    
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section to reset is required'
      });
    }
    
    const settings = await Settings.getSettings();
    
    // Reset specific section to defaults
    const defaultSettings = new Settings();
    
    if (section === 'all') {
      await Settings.deleteMany({});
      const newSettings = await Settings.getSettings();
      return res.json({
        success: true,
        data: newSettings,
        message: 'All settings reset to default'
      });
    }
    
    if (settings[section]) {
      settings[section] = defaultSettings[section];
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings,
      message: `${section} settings reset to default`
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
});

module.exports = router;
