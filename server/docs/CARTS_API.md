# Carts API Documentation

## Overview

The Carts API provides comprehensive shopping cart management functionality including adding/removing items, quantity updates, coupon management, and administrative features.

## Base URL

```
http://localhost:5000/api/carts
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Carts (Admin Only)

**GET** `/api/carts`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (active, abandoned, converted)
- `userId` (optional): Filter by user ID
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc)

**Response:**

```json
{
  "carts": [
    {
      "_id": "cart_id",
      "user": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "items": [
        {
          "_id": "item_id",
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "price": {
              "amount": 99.99,
              "currency": "USD"
            },
            "images": ["image_url"]
          },
          "quantity": 2,
          "selectedOptions": {
            "size": "M",
            "color": "Blue"
          },
          "price": {
            "amount": 99.99,
            "currency": "USD"
          },
          "addedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "status": "active",
      "totalItems": 2,
      "subtotal": 199.98,
      "totalDiscount": 20.0,
      "total": 179.98,
      "appliedCoupons": [
        {
          "code": "SAVE20",
          "discount": 20.0,
          "appliedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "hasNext": true,
  "hasPrev": false
}
```

### 2. Get My Cart

**GET** `/api/carts/my-cart`

**Response:**

```json
{
  "cart": {
    "_id": "cart_id",
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "items": [
      {
        "_id": "item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": {
            "amount": 99.99,
            "currency": "USD"
          },
          "images": ["image_url"],
          "category": {
            "_id": "category_id",
            "name": "Category Name"
          },
          "status": "published"
        },
        "quantity": 2,
        "selectedOptions": {
          "size": "M",
          "color": "Blue"
        },
        "price": {
          "amount": 99.99,
          "currency": "USD"
        },
        "addedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "status": "active",
    "totalItems": 2,
    "subtotal": 199.98,
    "totalDiscount": 20.0,
    "total": 179.98,
    "appliedCoupons": [
      {
        "code": "SAVE20",
        "discount": 20.0,
        "appliedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Single Cart

**GET** `/api/carts/:id`

**Response:** Same as Get My Cart

### 4. Add Item to Cart

**POST** `/api/carts/add-item`

**Request Body:**

```json
{
  "productId": "product_id",
  "quantity": 2,
  "selectedOptions": {
    "size": "M",
    "color": "Blue",
    "material": "Cotton"
  },
  "price": {
    "amount": 99.99,
    "currency": "USD"
  }
}
```

**Response:**

```json
{
  "message": "Item added to cart successfully",
  "cart": {
    "_id": "cart_id",
    "items": [...],
    "totalItems": 3,
    "subtotal": 299.97,
    "total": 299.97
  }
}
```

### 5. Update Cart Item Quantity

**PUT** `/api/carts/update-item/:itemId`

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:**

```json
{
  "message": "Cart item updated successfully",
  "cart": {
    "_id": "cart_id",
    "items": [...],
    "totalItems": 4,
    "subtotal": 399.96,
    "total": 399.96
  }
}
```

### 6. Remove Item from Cart

**DELETE** `/api/carts/remove-item/:itemId`

**Response:**

```json
{
  "message": "Item removed from cart successfully",
  "cart": {
    "_id": "cart_id",
    "items": [...],
    "totalItems": 1,
    "subtotal": 99.99,
    "total": 99.99
  }
}
```

### 7. Clear Cart

**POST** `/api/carts/clear`

**Response:**

```json
{
  "message": "Cart cleared successfully",
  "cart": {
    "_id": "cart_id",
    "items": [],
    "totalItems": 0,
    "subtotal": 0,
    "total": 0,
    "appliedCoupons": []
  }
}
```

### 8. Apply Coupon to Cart

**POST** `/api/carts/apply-coupon`

**Request Body:**

```json
{
  "couponCode": "SAVE20",
  "discount": 20.0
}
```

**Response:**

```json
{
  "message": "Coupon applied successfully",
  "cart": {
    "_id": "cart_id",
    "items": [...],
    "totalItems": 2,
    "subtotal": 199.98,
    "totalDiscount": 20.00,
    "total": 179.98,
    "appliedCoupons": [
      {
        "code": "SAVE20",
        "discount": 20.00,
        "appliedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 9. Remove Coupon from Cart

**DELETE** `/api/carts/remove-coupon/:couponCode`

**Response:**

```json
{
  "message": "Coupon removed successfully",
  "cart": {
    "_id": "cart_id",
    "items": [...],
    "totalItems": 2,
    "subtotal": 199.98,
    "totalDiscount": 0,
    "total": 199.98,
    "appliedCoupons": []
  }
}
```

### 10. Update Cart Status (Admin Only)

**PATCH** `/api/carts/:id/status`

**Request Body:**

```json
{
  "status": "converted"
}
```

**Response:**

```json
{
  "message": "Cart status updated successfully",
  "cart": {
    "_id": "cart_id",
    "status": "converted"
  }
}
```

### 11. Delete Cart (Admin Only)

**DELETE** `/api/carts/:id`

**Response:**

```json
{
  "message": "Cart deleted successfully",
  "cartId": "cart_id"
}
```

### 12. Get Cart Statistics (Admin Only)

**GET** `/api/carts/stats`

**Response:**

```json
{
  "totalCarts": 100,
  "activeCarts": 75,
  "abandonedCarts": 20,
  "convertedCarts": 5,
  "cartsByStatus": [
    {
      "_id": "active",
      "count": 75
    },
    {
      "_id": "abandoned",
      "count": 20
    },
    {
      "_id": "converted",
      "count": 5
    }
  ],
  "recentCarts": [
    {
      "_id": "cart_id",
      "user": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "status": "active",
      "totalItems": 2,
      "total": 199.98,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Cart Model

### Fields

- **user** (ObjectId, required): Reference to User model
- **items** (Array): Cart items
  - **product** (ObjectId, required): Reference to Product model
  - **quantity** (Number, required): Item quantity (min: 1)
  - **selectedOptions** (Object): Product options (size, color, material)
  - **price** (Object): Item price
    - **amount** (Number, required): Price amount
    - **currency** (String, enum): USD, EUR, VND (default: USD)
  - **addedAt** (Date): When item was added
- **status** (String, enum): active, abandoned, converted (default: active)
- **expiresAt** (Date): Cart expiration date (30 days from creation)
- **notes** (String): Cart notes
- **appliedCoupons** (Array): Applied discount coupons
  - **code** (String): Coupon code
  - **discount** (Number): Discount amount
  - **appliedAt** (Date): When coupon was applied

### Virtual Fields

- **totalItems**: Total number of items in cart
- **subtotal**: Total price before discounts
- **totalDiscount**: Total discount amount
- **total**: Final total after discounts

### Methods

- **addItem(productId, quantity, options)**: Add item to cart
- **updateItemQuantity(itemId, quantity)**: Update item quantity
- **removeItem(itemId)**: Remove item from cart
- **clearCart()**: Clear all items from cart
- **applyCoupon(couponCode, discount)**: Apply discount coupon
- **removeCoupon(couponCode)**: Remove coupon from cart
- **findOrCreateForUser(userId)**: Find or create cart for user

## Features

### Automatic Cart Management

- Carts are automatically created for users
- Cart expiration after 30 days
- Automatic cleanup of expired carts

### Product Validation

- Only published and active products can be added
- Product availability is checked before adding

### Coupon System

- Multiple coupons can be applied
- Duplicate coupon prevention
- Automatic discount calculation

### Security

- Users can only access their own cart
- Admins can view all carts
- Proper authorization checks

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity must be at least 1"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "message": "Access token required"
}
```

### 403 Forbidden

```json
{
  "message": "Admin access required"
}
```

### 404 Not Found

```json
{
  "message": "Cart not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Failed to fetch cart",
  "error": "Error details (development only)"
}
```

## Usage Examples

### Add item to cart

```bash
curl -X POST http://localhost:5000/api/carts/add-item \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product_id",
    "quantity": 2,
    "selectedOptions": {
      "size": "M",
      "color": "Blue"
    },
    "price": {
      "amount": 99.99,
      "currency": "USD"
    }
  }'
```

### Apply coupon to cart

```bash
curl -X POST http://localhost:5000/api/carts/apply-coupon \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "SAVE20",
    "discount": 20.00
  }'
```

### Get cart statistics (Admin)

```bash
curl -X GET http://localhost:5000/api/carts/stats \
  -H "Authorization: Bearer <admin_token>"
```

### Update cart item quantity

```bash
curl -X PUT http://localhost:5000/api/carts/update-item/item_id \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```
