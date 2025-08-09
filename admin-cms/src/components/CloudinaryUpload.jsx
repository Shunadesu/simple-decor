import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, File } from 'lucide-react';
import api from '../utils/axios';

const CloudinaryUpload = ({ 
  onUpload, 
  fileType = 'image', 
  multiple = false, 
  maxFiles = 5,
  className = '',
  label = 'Upload Files',
  folder = 'products' // 'products' or 'categories'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const validateFile = (file) => {
    const maxSize = fileType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos
    const allowedTypes = fileType === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];

    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${fileType === 'image' ? '10MB' : '100MB'}`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }

    return true;
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    if (!multiple && validFiles.length > 1) {
      alert('Only one file allowed');
      return;
    }

    if (multiple && validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let results;
      
      if (multiple && fileType === 'image') {
        // Upload multiple images in one request
        const formData = new FormData();
        validFiles.forEach(file => {
          formData.append('images', file);
        });
        
        const endpoint = folder === 'categories' ? '/api/upload/category-images' : '/api/upload/images';
        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });
        
        results = response.data.data || response.data;
      } else {
        // Upload files one by one
        const uploadPromises = validFiles.map(async (file, index) => {
          const formData = new FormData();
          
          if (fileType === 'image') {
            formData.append('image', file);
          } else if (fileType === 'video') {
            formData.append('video', file);
          } else {
            formData.append('file', file);
          }

          let endpoint;
          if (fileType === 'image') {
            endpoint = folder === 'categories' ? '/api/upload/category-image' : '/api/upload/image';
          } else if (fileType === 'video') {
            endpoint = '/api/upload/video';
          } else {
            endpoint = '/api/upload/file';
          }
          
          const response = await api.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            },
          });

          return response.data.data || response.data;
        });

        results = await Promise.all(uploadPromises);
      }
      
      if (onUpload) {
        if (multiple) {
          onUpload(results);
        } else {
          onUpload(results[0]);
        }
      }

      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed. Please try again.';
      alert(`Upload error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const getIcon = () => {
    if (fileType === 'image') return <ImageIcon className="w-8 h-8 text-gray-400" />;
    if (fileType === 'video') return <Video className="w-8 h-8 text-gray-400" />;
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const getAcceptTypes = () => {
    if (fileType === 'image') return 'image/*';
    if (fileType === 'video') return 'video/*';
    return '*/*';
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={getAcceptTypes()}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          {getIcon()}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : label}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {fileType === 'image' 
                ? 'Drag and drop images here, or click to select'
                : 'Drag and drop videos here, or click to select'
              }
            </p>
            {multiple && (
              <p className="text-xs text-gray-400 mt-1">
                Maximum {maxFiles} files
              </p>
            )}
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryUpload; 