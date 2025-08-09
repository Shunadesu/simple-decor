const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { 
  uploadImage, 
  uploadCategoryImage,
  uploadVideo, 
  uploadImageFromBuffer, 
  uploadVideoFromBuffer,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  getThumbnailUrl
} = require('../utils/upload');

// Validation middleware
const validateUpload = [
  body('folder').optional().isString().withMessage('Folder must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('transformation').optional().isObject().withMessage('Transformation must be an object')
];

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

// POST /api/upload/image - Upload single image
router.post('/image', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = {
      url: req.file.path,
      public_id: req.file.filename,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      bytes: req.file.size,
      secure_url: req.file.path.replace('http://', 'https://')
    };

    res.status(201).json({
      message: 'Image uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/images - Upload multiple images
router.post('/images', uploadImage.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const results = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      width: file.width,
      height: file.height,
      format: file.format,
      bytes: file.size,
      secure_url: file.path.replace('http://', 'https://')
    }));

    res.status(201).json({
      message: 'Images uploaded successfully',
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      message: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/category-image - Upload single category image
router.post('/category-image', uploadCategoryImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = {
      url: req.file.path,
      public_id: req.file.filename,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      bytes: req.file.size,
      secure_url: req.file.path.replace('http://', 'https://')
    };

    res.status(201).json({
      message: 'Category image uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload category image error:', error);
    res.status(500).json({
      message: 'Failed to upload category image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/category-images - Upload multiple category images
router.post('/category-images', uploadCategoryImage.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const results = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      width: file.width,
      height: file.height,
      format: file.format,
      bytes: file.size,
      secure_url: file.path.replace('http://', 'https://')
    }));

    res.status(201).json({
      message: 'Category images uploaded successfully',
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Upload category images error:', error);
    res.status(500).json({
      message: 'Failed to upload category images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/video - Upload single video
router.post('/video', uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const result = {
      url: req.file.path,
      public_id: req.file.filename,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      bytes: req.file.size,
      duration: req.file.duration,
      secure_url: req.file.path.replace('http://', 'https://')
    };

    res.status(201).json({
      message: 'Video uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      message: 'Failed to upload video',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/base64-image - Upload image from base64
router.post('/base64-image', validateUpload, handleValidationErrors, async (req, res) => {
  try {
    const { image, folder, tags, transformation } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Base64 image data is required' });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadOptions = {};
    if (folder) uploadOptions.folder = folder;
    if (tags) uploadOptions.tags = tags;
    if (transformation) uploadOptions.transformation = transformation;

    const result = await uploadImageFromBuffer(buffer, uploadOptions);

    res.status(201).json({
      message: 'Image uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload base64 image error:', error);
    res.status(500).json({
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/upload/base64-video - Upload video from base64
router.post('/base64-video', validateUpload, handleValidationErrors, async (req, res) => {
  try {
    const { video, folder, tags, transformation } = req.body;

    if (!video) {
      return res.status(400).json({ message: 'Base64 video data is required' });
    }

    // Convert base64 to buffer
    const base64Data = video.replace(/^data:video\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadOptions = {};
    if (folder) uploadOptions.folder = folder;
    if (tags) uploadOptions.tags = tags;
    if (transformation) uploadOptions.transformation = transformation;

    const result = await uploadVideoFromBuffer(buffer, uploadOptions);

    res.status(201).json({
      message: 'Video uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload base64 video error:', error);
    res.status(500).json({
      message: 'Failed to upload video',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/upload/:public_id - Delete file from Cloudinary
router.delete('/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const { resource_type = 'image' } = req.query;

    if (!public_id) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    const result = await deleteFromCloudinary(public_id, resource_type);

    res.json({
      message: 'File deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      message: 'Failed to delete file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/upload/optimize/:public_id - Get optimized image URL
router.get('/optimize/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const { width, height, crop, quality, format } = req.query;

    if (!public_id) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    const options = {};
    if (width) options.width = parseInt(width);
    if (height) options.height = parseInt(height);
    if (crop) options.crop = crop;
    if (quality) options.quality = quality;
    if (format) options.format = format;

    const optimizedUrl = getOptimizedImageUrl(public_id, options);

    res.json({
      message: 'Optimized URL generated successfully',
      data: {
        public_id,
        optimized_url: optimizedUrl,
        options
      }
    });

  } catch (error) {
    console.error('Generate optimized URL error:', error);
    res.status(500).json({
      message: 'Failed to generate optimized URL',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/upload/thumbnail/:public_id - Get thumbnail URL
router.get('/thumbnail/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const { width = 300, height = 200 } = req.query;

    if (!public_id) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    const thumbnailUrl = getThumbnailUrl(public_id, parseInt(width), parseInt(height));

    res.json({
      message: 'Thumbnail URL generated successfully',
      data: {
        public_id,
        thumbnail_url: thumbnailUrl,
        width: parseInt(width),
        height: parseInt(height)
      }
    });

  } catch (error) {
    console.error('Generate thumbnail URL error:', error);
    res.status(500).json({
      message: 'Failed to generate thumbnail URL',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 