# Categories API Documentation

## Overview

The Categories API provides full CRUD operations for managing product categories with hierarchical structure support, Cloudinary image integration, and multilingual content management.

## Base URL

```
http://localhost:5000/api/categories
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. GET /api/categories

Get all categories with optional filtering and pagination.

**Query Parameters:**

- `active` (boolean): Filter by active status
- `featured` (boolean): Filter by featured status
- `parent` (string): Filter by parent category ID (use 'null' for root categories)
- `level` (number): Filter by category level (0 for root, 1 for subcategories)
- `limit` (number): Number of items per page (default: 50, max: 100)
- `page` (number): Page number (default: 1)
- `include` (string): Comma-separated list of relations to include (children, productCount)

**Example Request:**

```bash
GET /api/categories?active=true&include=children,productCount&limit=20&page=1
```

**Response:**

```json
{
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": {
        "en": "Storage Baskets",
        "vi": "Giỏ Đựng Đồ"
      },
      "description": {
        "en": "Storage and organization solutions",
        "vi": "Giải pháp lưu trữ và tổ chức"
      },
      "slug": "storage-baskets",
      "parent": null,
      "level": 0,
      "order": 0,
      "isActive": true,
      "isFeatured": false,
      "image": {
        "url": "https://res.cloudinary.com/...",
        "public_id": "zuna-simpledecor/categories/...",
        "width": 800,
        "height": 600,
        "format": "jpg",
        "bytes": 123456
      },
      "meta": {
        "title": {
          "en": "Storage Baskets - Zuna Simple Decor",
          "vi": "Giỏ Đựng Đồ - Zuna Simple Decor"
        },
        "description": {
          "en": "Quality storage solutions",
          "vi": "Giải pháp lưu trữ chất lượng"
        },
        "keywords": {
          "en": "storage, baskets, organization",
          "vi": "lưu trữ, giỏ, tổ chức"
        }
      },
      "children": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": {
            "en": "Small Baskets",
            "vi": "Giỏ Nhỏ"
          },
          "level": 1,
          "order": 0,
          "isActive": true
        }
      ],
      "productCount": 15,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### 2. GET /api/categories/tree

Get hierarchical category tree structure.

**Query Parameters:**

- `active` (boolean): Filter by active status (default: true)

**Example Request:**

```bash
GET /api/categories/tree?active=true
```

**Response:**

```json
{
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": {
        "en": "Storage Baskets",
        "vi": "Giỏ Đựng Đồ"
      },
      "level": 0,
      "children": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": {
            "en": "Small Baskets",
            "vi": "Giỏ Nhỏ"
          },
          "level": 1,
          "children": []
        }
      ]
    }
  ]
}
```

### 3. GET /api/categories/:id

Get a single category by ID.

**Path Parameters:**

- `id` (string): Category ID (MongoDB ObjectId)

**Query Parameters:**

- `include` (string): Comma-separated list of relations to include

**Example Request:**

```bash
GET /api/categories/64f8a1b2c3d4e5f6a7b8c9d0?include=children,productCount
```

**Response:**

```json
{
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": {
      "en": "Storage Baskets",
      "vi": "Giỏ Đựng Đồ"
    },
    "description": {
      "en": "Storage and organization solutions",
      "vi": "Giải pháp lưu trữ và tổ chức"
    },
    "slug": "storage-baskets",
    "parent": null,
    "level": 0,
    "order": 0,
    "isActive": true,
    "isFeatured": false,
    "image": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "zuna-simpledecor/categories/...",
      "width": 800,
      "height": 600,
      "format": "jpg",
      "bytes": 123456
    },
    "meta": {
      "title": {
        "en": "Storage Baskets - Zuna Simple Decor",
        "vi": "Giỏ Đựng Đồ - Zuna Simple Decor"
      },
      "description": {
        "en": "Quality storage solutions",
        "vi": "Giải pháp lưu trữ chất lượng"
      },
      "keywords": {
        "en": "storage, baskets, organization",
        "vi": "lưu trữ, giỏ, tổ chức"
      }
    },
    "children": [],
    "productCount": 15,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 4. POST /api/categories

Create a new category.

**Request Body:**

```json
{
  "name": {
    "en": "New Category",
    "vi": "Danh Mục Mới"
  },
  "description": {
    "en": "Category description",
    "vi": "Mô tả danh mục"
  },
  "slug": "new-category",
  "parent": "64f8a1b2c3d4e5f6a7b8c9d0",
  "order": 0,
  "isActive": true,
  "isFeatured": false,
  "image": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "zuna-simpledecor/categories/...",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "bytes": 123456
  },
  "meta": {
    "title": {
      "en": "SEO Title",
      "vi": "Tiêu Đề SEO"
    },
    "description": {
      "en": "SEO Description",
      "vi": "Mô Tả SEO"
    },
    "keywords": {
      "en": "keyword1, keyword2",
      "vi": "từ khóa1, từ khóa2"
    }
  }
}
```

**Required Fields:**

- `name.en` (string): English name
- `name.vi` (string): Vietnamese name

**Optional Fields:**

- `description` (object): Multilingual description
- `slug` (string): URL slug (auto-generated if not provided)
- `parent` (string): Parent category ID
- `order` (number): Display order
- `isActive` (boolean): Active status
- `isFeatured` (boolean): Featured status
- `image` (object): Cloudinary image data
- `meta` (object): SEO metadata

**Response:**

```json
{
  "message": "Category created successfully",
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": {
      "en": "New Category",
      "vi": "Danh Mục Mới"
    },
    "slug": "new-category",
    "level": 1,
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 5. PUT /api/categories/:id

Update an existing category.

**Path Parameters:**

- `id` (string): Category ID (MongoDB ObjectId)

**Request Body:** Same as POST, but all fields are optional.

**Example Request:**

```bash
PUT /api/categories/64f8a1b2c3d4e5f6a7b8c9d0
Content-Type: application/json

{
  "name": {
    "en": "Updated Category",
    "vi": "Danh Mục Đã Cập Nhật"
  },
  "isActive": false
}
```

**Response:**

```json
{
  "message": "Category updated successfully",
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": {
      "en": "Updated Category",
      "vi": "Danh Mục Đã Cập Nhật"
    },
    "isActive": false,
    "updatedAt": "2023-09-06T10:35:00.000Z"
  }
}
```

### 6. PATCH /api/categories/:id/image

Update category image.

**Path Parameters:**

- `id` (string): Category ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "image": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "zuna-simpledecor/categories/...",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "bytes": 123456
  }
}
```

**Response:**

```json
{
  "message": "Category image updated successfully",
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "image": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "zuna-simpledecor/categories/...",
      "width": 800,
      "height": 600,
      "format": "jpg",
      "bytes": 123456
    }
  }
}
```

### 7. DELETE /api/categories/:id

Delete a category.

**Path Parameters:**

- `id` (string): Category ID (MongoDB ObjectId)

**Validation:**

- Cannot delete category with subcategories
- Cannot delete category with products

**Example Request:**

```bash
DELETE /api/categories/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**

```json
{
  "message": "Category deleted successfully",
  "categoryId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

### 8. PATCH /api/categories/:id/status

Update category status.

**Path Parameters:**

- `id` (string): Category ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "isActive": false
}
```

**Response:**

```json
{
  "message": "Category status updated successfully",
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "isActive": false,
    "updatedAt": "2023-09-06T10:40:00.000Z"
  }
}
```

### 9. PATCH /api/categories/reorder

Reorder categories in bulk.

**Request Body:**

```json
{
  "categories": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "order": 0
    },
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "order": 1
    }
  ]
}
```

**Response:**

```json
{
  "message": "Categories reordered successfully"
}
```

## Error Responses

### Validation Error (400)

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "English name is required",
      "path": "name.en",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)

```json
{
  "message": "Category not found"
}
```

### Conflict Error (400)

```json
{
  "message": "Category with this slug already exists"
}
```

### Deletion Error (400)

```json
{
  "message": "Cannot delete category with subcategories. Please move or delete subcategories first."
}
```

## Data Models

### Category Schema

```javascript
{
  name: {
    en: String,      // Required
    vi: String       // Required
  },
  description: {
    en: String,
    vi: String
  },
  slug: String,      // Auto-generated from name.en
  image: {
    url: String,
    public_id: String,
    alt: String,
    width: Number,
    height: Number,
    format: String,
    bytes: Number
  },
  parent: ObjectId,  // Reference to ProductCategory
  level: Number,     // 0 for root, 1 for subcategories
  order: Number,     // Display order
  isActive: Boolean, // Default: true
  isFeatured: Boolean, // Default: false
  meta: {
    title: {
      en: String,
      vi: String
    },
    description: {
      en: String,
      vi: String
    },
    keywords: {
      en: String,
      vi: String
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Features

### 1. Hierarchical Structure

- Support for parent-child relationships
- Automatic level calculation
- Tree view API endpoint

### 2. Multilingual Support

- English and Vietnamese content
- SEO metadata in multiple languages
- Slug generation from English name

### 3. Cloudinary Integration

- Image upload and management
- Automatic cleanup on deletion
- Image metadata storage

### 4. SEO Optimization

- Meta title, description, and keywords
- Multilingual SEO support
- Slug-based URLs

### 5. Validation & Security

- Input validation with express-validator
- Duplicate slug prevention
- Parent-child relationship validation
- Deletion constraints

### 6. Performance

- Database indexing on key fields
- Pagination support
- Selective field population
- Efficient tree building

## Usage Examples

### Frontend Integration

```javascript
// Fetch categories with children and product count
const response = await fetch("/api/categories?include=children,productCount");
const { categories } = await response.json();

// Create new category
const newCategory = await fetch("/api/categories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: {
      en: "New Category",
      vi: "Danh Mục Mới",
    },
    parent: "64f8a1b2c3d4e5f6a7b8c9d0",
  }),
});
```

### Admin Panel Features

- Tree view with expand/collapse
- Drag-and-drop reordering
- Bulk status updates
- Image upload with preview
- SEO metadata management
- Parent-child relationship management

## Migration Notes

The API includes a migration script (`migrate-categories.js`) to convert old string-based categories to the new reference-based system. Run this script before using the new API:

```bash
node migrate-categories.js
```

This will:

1. Create default categories from the old mapping
2. Update existing products to use category references
3. Verify the migration was successful
