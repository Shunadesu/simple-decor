const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const adminOnlyAuth = require('../middleware/adminOnlyAuth');

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/services - Get all services (public)
router.get('/', [
  query('category').optional().isString(),
  query('featured').optional().isBoolean(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['title', 'createdAt', 'displayOrder', 'viewCount']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      page = 1,
      limit = 20,
      sortBy = 'displayOrder',
      sortOrder = 'asc'
    } = req.query;

    console.log('🔍 [SERVICES-API] Fetching services with params:', {
      category, featured, search, page, limit, sortBy, sortOrder
    });

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true' || featured === true) {
      query.isFeatured = true;
    }

    // Build sort object
    const sortField = sortBy === 'title' ? 'title.en' : sortBy;
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    // If sorting by displayOrder, add secondary sort by createdAt
    if (sortBy === 'displayOrder') {
      sort.createdAt = -1;
    }

    let servicesQuery;

    if (search) {
      // Use text search
      servicesQuery = Service.searchServices(search);
    } else {
      servicesQuery = Service.find(query).sort(sort);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [services, total] = await Promise.all([
      servicesQuery.skip(skip).limit(limitNum).populate('relatedServices', 'title icon category'),
      search ? Service.searchServices(search).countDocuments() : Service.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    console.log('✅ [SERVICES-API] Found services:', {
      count: services.length,
      total,
      page: pageNum,
      totalPages
    });

    res.json({
      success: true,
      services,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('💥 [SERVICES-API] Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/services/featured - Get featured services (public)
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    console.log('⭐ [SERVICES-API] Fetching featured services, limit:', limit);

    const services = await Service.findFeatured().limit(limit);

    console.log('✅ [SERVICES-API] Found featured services:', services.length);

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('💥 [SERVICES-API] Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/services/categories - Get service categories (public)
router.get('/categories', async (req, res) => {
  try {
    console.log('📂 [SERVICES-API] Fetching service categories');

    // Get all unique categories with counts
    const categoryCounts = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const categories = [
      { id: 'all', name: { en: 'All Services', vi: 'Tất cả dịch vụ' }, count: await Service.countDocuments({ isActive: true }) },
      { id: 'consultation', name: { en: 'Consultation', vi: 'Tư vấn' }, count: 0 },
      { id: 'documentation', name: { en: 'Documentation', vi: 'Giấy tờ' }, count: 0 },
      { id: 'logistics', name: { en: 'Logistics', vi: 'Vận chuyển' }, count: 0 },
      { id: 'quality', name: { en: 'Quality Control', vi: 'Kiểm soát chất lượng' }, count: 0 },
      { id: 'support', name: { en: 'Support', vi: 'Hỗ trợ' }, count: 0 },
      { id: 'manufacturing', name: { en: 'Manufacturing', vi: 'Sản xuất' }, count: 0 },
      { id: 'export', name: { en: 'Export', vi: 'Xuất khẩu' }, count: 0 },
      { id: 'technology', name: { en: 'Technology', vi: 'Công nghệ' }, count: 0 },
      { id: 'design', name: { en: 'Design', vi: 'Thiết kế' }, count: 0 },
      { id: 'other', name: { en: 'Other', vi: 'Khác' }, count: 0 }
    ];

    // Update counts from aggregation
    categoryCounts.forEach(cat => {
      const category = categories.find(c => c.id === cat._id);
      if (category) {
        category.count = cat.count;
      }
    });

    console.log('✅ [SERVICES-API] Categories with counts:', categories.length);

    res.json({
      success: true,
      categories: categories.filter(cat => cat.id === 'all' || cat.count > 0)
    });

  } catch (error) {
    console.error('💥 [SERVICES-API] Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/services/:id - Get single service (public)
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid service ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { increment_view } = req.query;
    
    console.log('🔍 [SERVICES-API] Fetching service:', id);

    const service = await Service.findOne({ _id: id, isActive: true })
      .populate('relatedServices', 'title icon category image');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment view count if requested
    if (increment_view === 'true') {
      service.incrementView();
    }

    console.log('✅ [SERVICES-API] Found service:', service.title?.en || service.title?.vi);

    res.json({
      success: true,
      service
    });

  } catch (error) {
    console.error('💥 [SERVICES-API] Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/services/:id/inquiry - Record service inquiry (public)
router.post('/:id/inquiry', [
  param('id').isMongoId().withMessage('Invalid service ID'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('message').optional().isString()
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📧 [SERVICES-API] Recording inquiry for service:', id);

    const service = await Service.findOne({ _id: id, isActive: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment inquiry count
    await service.incrementInquiry();

    console.log('✅ [SERVICES-API] Inquiry recorded for:', service.title?.en || service.title?.vi);

    res.json({
      success: true,
      message: 'Inquiry recorded successfully'
    });

  } catch (error) {
    console.error('💥 [SERVICES-API] Error recording inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record inquiry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// ===== ADMIN ROUTES =====

// GET /api/services/admin/all - Get all services for admin (protected)
router.get('/admin/all', adminOnlyAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('status').optional().isIn(['all', 'active', 'inactive'])
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status = 'all'
    } = req.query;

    console.log('🔐 [SERVICES-ADMIN] Fetching all services for admin');

    // Build query
    let query = {};

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let servicesQuery;

    if (search) {
      // Build text search query
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'title.en': searchRegex },
        { 'title.vi': searchRegex },
        { 'description.en': searchRegex },
        { 'description.vi': searchRegex }
      ];
      servicesQuery = Service.find(query);
    } else {
      servicesQuery = Service.find(query);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [services, total] = await Promise.all([
      servicesQuery
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('relatedServices', 'title'),
      Service.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    console.log('✅ [SERVICES-ADMIN] Found services for admin:', {
      count: services.length,
      total,
      page: pageNum,
      totalPages
    });

    res.json({
      success: true,
      services,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/services/admin - Create new service (protected)
router.post('/admin', adminOnlyAuth, [
  body('title.en').notEmpty().withMessage('English title is required'),
  body('title.vi').notEmpty().withMessage('Vietnamese title is required'),
  body('description.en').notEmpty().withMessage('English description is required'),
  body('description.vi').notEmpty().withMessage('Vietnamese description is required'),
  body('category').isIn([
    'consultation', 'documentation', 'logistics', 'quality', 'support',
    'manufacturing', 'export', 'technology', 'design', 'other'
  ]).withMessage('Valid category is required'),
  body('icon').optional().isString(),
  body('features').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 })
], handleValidationErrors, async (req, res) => {
  try {
    console.log('📝 [SERVICES-ADMIN] Creating new service');

    const serviceData = req.body;
    const service = new Service(serviceData);
    await service.save();

    console.log('✅ [SERVICES-ADMIN] Service created:', service.title?.en);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error creating service:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/services/admin/:id - Update service (protected)
router.put('/admin/:id', adminOnlyAuth, [
  param('id').isMongoId().withMessage('Invalid service ID'),
  body('title.en').optional().notEmpty().withMessage('English title cannot be empty'),
  body('title.vi').optional().notEmpty().withMessage('Vietnamese title cannot be empty'),
  body('description.en').optional().notEmpty().withMessage('English description cannot be empty'),
  body('description.vi').optional().notEmpty().withMessage('Vietnamese description cannot be empty'),
  body('category').optional().isIn([
    'consultation', 'documentation', 'logistics', 'quality', 'support',
    'manufacturing', 'export', 'technology', 'design', 'other'
  ]).withMessage('Valid category is required'),
  body('isFeatured').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 })
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📝 [SERVICES-ADMIN] Updating service:', id);

    const service = await Service.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    console.log('✅ [SERVICES-ADMIN] Service updated:', service.title?.en);

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error updating service:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/services/admin/:id/featured - Toggle featured status (protected)
router.patch('/admin/:id/featured', adminOnlyAuth, [
  param('id').isMongoId().withMessage('Invalid service ID'),
  body('isFeatured').isBoolean().withMessage('isFeatured must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    
    console.log('⭐ [SERVICES-ADMIN] Updating featured status:', { id, isFeatured });

    const service = await Service.findByIdAndUpdate(
      id,
      { isFeatured, updatedAt: new Date() },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    console.log('✅ [SERVICES-ADMIN] Featured status updated:', service.title?.en);

    res.json({
      success: true,
      message: 'Featured status updated successfully',
      service
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error updating featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/services/admin/:id - Delete service (protected)
router.delete('/admin/:id', adminOnlyAuth, [
  param('id').isMongoId().withMessage('Invalid service ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ [SERVICES-ADMIN] Deleting service:', id);

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    console.log('✅ [SERVICES-ADMIN] Service deleted:', service.title?.en);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/services/admin/stats - Get service statistics (protected)
router.get('/admin/stats', adminOnlyAuth, async (req, res) => {
  try {
    console.log('📊 [SERVICES-ADMIN] Fetching service statistics');

    const [
      totalServices,
      activeServices,
      featuredServices,
      categoryCounts,
      topViewedServices,
      recentInquiries
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Service.countDocuments({ isFeatured: true, isActive: true }),
      Service.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Service.find({ isActive: true })
        .sort({ 'statistics.viewCount': -1 })
        .limit(5)
        .select('title statistics.viewCount'),
      Service.find({ isActive: true })
        .sort({ 'statistics.inquiryCount': -1 })
        .limit(5)
        .select('title statistics.inquiryCount')
    ]);

    const stats = {
      overview: {
        total: totalServices,
        active: activeServices,
        inactive: totalServices - activeServices,
        featured: featuredServices
      },
      categories: categoryCounts,
      topViewed: topViewedServices,
      topInquiries: recentInquiries
    };

    console.log('✅ [SERVICES-ADMIN] Statistics compiled');

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('💥 [SERVICES-ADMIN] Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;