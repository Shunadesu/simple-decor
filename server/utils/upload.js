const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zuna-simpledecor/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    resource_type: 'image'
  }
});

// Configure Cloudinary storage for category images
const categoryImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zuna-simpledecor/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { width: 400, height: 300, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    resource_type: 'image'
  }
});

// Configure Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zuna-simpledecor/videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'wmv'],
    resource_type: 'video',
    transformation: [
      { width: 1280, height: 720, crop: 'limit' }
    ]
  }
});

// Multer upload instances
const uploadImage = multer({ storage: imageStorage });
const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadVideo = multer({ storage: videoStorage });

// Helper function to upload image from buffer (for base64 or direct uploads)
const uploadImageFromBuffer = async (buffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'zuna-simpledecor/products',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto:good' }
          ],
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Helper function to upload video from buffer
const uploadVideoFromBuffer = async (buffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'zuna-simpledecor/videos',
          resource_type: 'video',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' }
          ],
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration
    };
  } catch (error) {
    throw new Error(`Failed to upload video: ${error.message}`);
  }
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (public_id, resource_type = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Helper function to generate optimized image URL
const getOptimizedImageUrl = (public_id, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'limit',
    quality: 'auto:good',
    format: 'auto'
  };
  
  return cloudinary.url(public_id, {
    ...defaultOptions,
    ...options
  });
};

// Helper function to generate thumbnail URL
const getThumbnailUrl = (public_id, width = 300, height = 200) => {
  return cloudinary.url(public_id, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    format: 'auto'
  });
};

module.exports = {
  uploadImage,
  uploadCategoryImage,
  uploadVideo,
  uploadImageFromBuffer,
  uploadVideoFromBuffer,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  getThumbnailUrl,
  cloudinary
}; 