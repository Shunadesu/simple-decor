const express = require('express');
const router = express.Router();

// GET /api/partners - Get all partners
router.get('/', async (req, res) => {
  try {
    // Mock data for partners
    const partners = [
      {
        id: 1,
        name: 'Vietnam Export',
        logo: '/images/partners/vietnam-export.png',
        description: 'Leading export company in Vietnam',
        website: 'https://vietnamexport.com',
        category: 'Export'
      },
      {
        id: 2,
        name: 'Global Trade Solutions',
        logo: '/images/partners/global-trade.png',
        description: 'International trade solutions provider',
        website: 'https://globaltradesolutions.com',
        category: 'Trade'
      },
      {
        id: 3,
        name: 'Eco Materials Co.',
        logo: '/images/partners/eco-materials.png',
        description: 'Sustainable materials supplier',
        website: 'https://ecomaterials.com',
        category: 'Materials'
      },
      {
        id: 4,
        name: 'Design Studio Asia',
        logo: '/images/partners/design-studio.png',
        description: 'Creative design solutions',
        website: 'https://designstudioasia.com',
        category: 'Design'
      }
    ];

    res.json({
      message: 'Partners retrieved successfully',
      partners
    });
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({
      message: 'Failed to get partners',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 