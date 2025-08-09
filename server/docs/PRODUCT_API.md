# Product API Documentation

## Overview

This API provides full CRUD operations for product management with multilingual support, image/video handling, and advanced filtering capabilities.

## Base URL

```
http://localhost:5000/api/products
```

## Authentication

Currently, the API doesn't require authentication. In production, you should implement JWT authentication.

## Endpoints

### 1. Create Product

**POST** `/api/products`

Creates a new product with comprehensive validation.

#### Request Body

```json
{
  "name": {
    "en": "Storage Basket Large",
    "vi": "Giỏ đựng đồ lớn",
    "ko": "대형 보관 바구니",
    "zh": "大型储物篮",
    "ja": "大型ストレージバスケット"
  },
  "description": {
    "en": "Large storage basket for household items",
    "vi": "Giỏ đựng đồ lớn cho vật dụng gia đình",
    "ko": "가정용품을 위한 대형 보관 바구니",
    "zh": "家用物品的大型储物篮",
    "ja": "家庭用品用の大型ストレージバスケット"
  },
  "category": "storage-baskets",
  "material": "Rattan tự nhiên",
  "price": {
    "amount": 15.99,
    "currency": "USD",
    "unit": "piece"
  },
  "specifications": {
    "dimensions": {
      "length": 40,
      "width": 30,
      "height": 25,
      "unit": "cm"
    },
    "weight": {
      "value": 2.5,
      "unit": "kg"
    },
    "color": "Natural",
    "finish": "Smooth"
  },
  "moisture": "< 12%",
  "packaging": "Carton box",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "Storage basket front view",
      "isPrimary": true
    },
    {
      "url": "https://example.com/image2.jpg",
      "alt": "Storage basket side view",
      "isPrimary": false
    }
  ],
  "videos": [
    {
      "url": "https://example.com/video1.mp4",
      "type": "direct",
      "title": "Product demonstration"
    }
  ],
  "stock": {
    "quantity": 100,
    "minOrder": 1,
    "maxOrder": 50,
    "isAvailable": true
  },
  "keywords": ["storage", "basket", "home", "organization"],
  "tags": ["new", "popular", "eco-friendly"],
  "status": "draft",
  "isFeatured": false,
  "isActive": true
}
```

#### Response

```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": { ... },
    "description": { ... },
    "category": "storage-baskets",
    "material": "Rattan tự nhiên",
    "price": { ... },
    "specifications": { ... },
    "moisture": "< 12%",
    "packaging": "Carton box",
    "images": [ ... ],
    "videos": [ ... ],
    "stock": { ... },
    "keywords": [ ... ],
    "tags": [ ... ],
    "status": "draft",
    "isFeatured": false,
    "isActive": true,
    "slug": "storage-basket-large",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Products

**GET** `/api/products`

Retrieves products with filtering, pagination, and sorting.

#### Query Parameters

- `category` (string): Filter by category
- `status` (string): Filter by status (draft, published, archived)
- `isActive` (boolean): Filter by active status
- `isFeatured` (boolean): Filter by featured status
- `search` (string): Text search in name and description
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (asc/desc, default: desc)

#### Example Request

```
GET /api/products?category=storage-baskets&status=published&page=1&limit=5&sortBy=price.amount&sortOrder=asc
```

#### Response

```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": { ... },
      "description": { ... },
      "category": "storage-baskets",
      "material": "Rattan tự nhiên",
      "price": { ... },
      "specifications": { ... },
      "moisture": "< 12%",
      "packaging": "Carton box",
      "images": [ ... ],
      "videos": [ ... ],
      "stock": { ... },
      "status": "published",
      "isFeatured": false,
      "isActive": true,
      "slug": "storage-basket-large",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 25,
  "totalPages": 5,
  "currentPage": 1,
  "hasNext": true,
  "hasPrev": false
}
```

### 3. Get Single Product

**GET** `/api/products/:id`

Retrieves a single product by ID.

#### Example Request

```
GET /api/products/507f1f77bcf86cd799439011
```

#### Response

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": { ... },
    "description": { ... },
    "category": "storage-baskets",
    "material": "Rattan tự nhiên",
    "price": { ... },
    "specifications": { ... },
    "moisture": "< 12%",
    "packaging": "Carton box",
    "images": [ ... ],
    "videos": [ ... ],
    "stock": { ... },
    "status": "published",
    "isFeatured": false,
    "isActive": true,
    "slug": "storage-basket-large",
    "relatedProducts": [ ... ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Product

**PUT** `/api/products/:id`

Updates an existing product.

#### Example Request

```
PUT /api/products/507f1f77bcf86cd799439011
```

#### Request Body

```json
{
  "name": {
    "en": "Updated Storage Basket Large",
    "vi": "Giỏ đựng đồ lớn cập nhật"
  },
  "price": {
    "amount": 18.99,
    "currency": "USD"
  },
  "status": "published",
  "isFeatured": true
}
```

#### Response

```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": { ... },
    "description": { ... },
    "price": { ... },
    "status": "published",
    "isFeatured": true,
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 5. Delete Product

**DELETE** `/api/products/:id`

Deletes a product permanently.

#### Example Request

```
DELETE /api/products/507f1f77bcf86cd799439011
```

#### Response

```json
{
  "message": "Product deleted successfully",
  "productId": "507f1f77bcf86cd799439011"
}
```

### 6. Update Product Status

**PATCH** `/api/products/:id/status`

Updates only the status of a product.

#### Request Body

```json
{
  "status": "published"
}
```

#### Response

```json
{
  "message": "Product status updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "published",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 7. Get Categories

**GET** `/api/products/categories`

Retrieves all product categories with counts.

#### Response

```json
{
  "categories": [
    {
      "id": "all",
      "name": "All Categories",
      "count": 25,
      "publishedCount": 20
    },
    {
      "id": "storage-baskets",
      "name": "storage-baskets",
      "count": 8,
      "publishedCount": 6
    },
    {
      "id": "decorative-items",
      "name": "decorative-items",
      "count": 6,
      "publishedCount": 5
    },
    {
      "id": "kitchen-ware",
      "name": "kitchen-ware",
      "count": 5,
      "publishedCount": 4
    },
    {
      "id": "furniture",
      "name": "furniture",
      "count": 4,
      "publishedCount": 3
    },
    {
      "id": "other",
      "name": "other",
      "count": 2,
      "publishedCount": 2
    }
  ]
}
```

### 8. Get Featured Products

**GET** `/api/products/featured`

Retrieves featured products.

#### Query Parameters

- `limit` (number): Number of featured products to return (default: 6)

#### Example Request

```
GET /api/products/featured?limit=4
```

#### Response

```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": { ... },
      "description": { ... },
      "category": "storage-baskets",
      "material": "Rattan tự nhiên",
      "price": { ... },
      "specifications": { ... },
      "moisture": "< 12%",
      "packaging": "Carton box",
      "images": [ ... ],
      "status": "published",
      "isFeatured": true,
      "isActive": true,
      "slug": "storage-basket-large",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 9. Search Products

**GET** `/api/products/search`

Searches products using text search.

#### Query Parameters

- `q` (string): Search query (required)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

#### Example Request

```
GET /api/products/search?q=storage basket&page=1&limit=5
```

#### Response

```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": { ... },
      "description": { ... },
      "category": "storage-baskets",
      "material": "Rattan tự nhiên",
      "price": { ... },
      "specifications": { ... },
      "moisture": "< 12%",
      "packaging": "Carton box",
      "images": [ ... ],
      "status": "published",
      "isFeatured": false,
      "isActive": true,
      "slug": "storage-basket-large",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 3,
  "query": "storage basket",
  "totalPages": 1,
  "currentPage": 1
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
  "message": "Product not found"
}
```

### Server Error (500)

```json
{
  "message": "Failed to create product",
  "error": "Internal server error"
}
```

## Product Schema Fields

### Required Fields

- `name.en` (string): English product name
- `name.vi` (string): Vietnamese product name
- `description.en` (string): English product description
- `description.vi` (string): Vietnamese product description
- `category` (string): Product category
- `material` (string): Product material
- `price.amount` (number): Product price

### Optional Fields

- `name.ko` (string): Korean product name
- `name.zh` (string): Chinese product name
- `name.ja` (string): Japanese product name
- `description.ko` (string): Korean product description
- `description.zh` (string): Chinese product description
- `description.ja` (string): Japanese product description
- `images` (array): Product images
- `videos` (array): Product videos
- `specifications` (object): Technical specifications
- `moisture` (string): Moisture content
- `packaging` (string): Packaging information
- `stock` (object): Inventory information
- `keywords` (array): SEO keywords
- `tags` (array): Product tags
- `status` (string): Product status (draft/published/archived)
- `isFeatured` (boolean): Featured product flag
- `isActive` (boolean): Active product flag
- `metaTitle` (object): SEO meta titles
- `metaDescription` (object): SEO meta descriptions
- `relatedProducts` (array): Related product IDs
- `customFields` (object): Custom fields

## Categories

- `storage-baskets`: Storage baskets
- `decorative-items`: Decorative items
- `kitchen-ware`: Kitchen ware
- `furniture`: Furniture
- `other`: Other products

## Status Values

- `draft`: Product is in draft mode
- `published`: Product is published and visible
- `archived`: Product is archived and hidden

## Usage Examples

### Creating a Product with cURL

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Storage Basket Large",
      "vi": "Giỏ đựng đồ lớn"
    },
    "description": {
      "en": "Large storage basket for household items",
      "vi": "Giỏ đựng đồ lớn cho vật dụng gia đình"
    },
    "category": "storage-baskets",
    "material": "Rattan tự nhiên",
    "price": {
      "amount": 15.99,
      "currency": "USD"
    },
    "specifications": {
      "dimensions": {
        "length": 40,
        "width": 30,
        "height": 25,
        "unit": "cm"
      }
    },
    "moisture": "< 12%",
    "packaging": "Carton box",
    "status": "draft"
  }'
```

### Updating a Product with cURL

```bash
curl -X PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "price": {
      "amount": 18.99,
      "currency": "USD"
    },
    "status": "published"
  }'
```

### Deleting a Product with cURL

```bash
curl -X DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

## Notes

1. **Multilingual Support**: The API supports 5 languages (English, Vietnamese, Korean, Chinese, Japanese) for product names and descriptions.

2. **Image Management**: Products can have multiple images with one marked as primary.

3. **Video Support**: Products can include videos from various sources (direct URLs, YouTube, Vimeo).

4. **SEO Features**: Products include meta titles, descriptions, and keywords for SEO optimization.

5. **Inventory Management**: Stock tracking with minimum/maximum order quantities.

6. **Search Functionality**: Full-text search across product names and descriptions.

7. **Pagination**: All list endpoints support pagination for better performance.

8. **Filtering**: Multiple filter options for category, status, featured status, etc.

9. **Sorting**: Flexible sorting by any field in ascending or descending order.

10. **Validation**: Comprehensive input validation with detailed error messages.
