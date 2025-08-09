# Order Management API Documentation

## Overview

This API provides comprehensive order management functionality for both authenticated users and guest customers. Users can create orders, track their status, and manage the entire order lifecycle.

## Base URL

```
http://localhost:5000/api/orders
```

## Authentication

- Most endpoints require authentication via JWT token
- Guest endpoints (marked with 🔓) do not require authentication
- Admin endpoints (marked with 👑) require admin privileges

## Endpoints

### 🔓 Guest Endpoints

#### 1. Get Guest Orders by Email

```
GET /api/orders/guest?email={email}&status={status}
```

**Description:** Retrieve orders for guest customers using their email address.

**Query Parameters:**

- `email` (required): Customer's email address
- `status` (optional): Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled, refunded)

**Response:**

```json
{
  "orders": [
    {
      "_id": "order_id",
      "orderNumber": "ORD2412010001",
      "status": "pending",
      "paymentStatus": "pending",
      "total": 1500000,
      "shippingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "0123456789",
        "address": "123 Main St",
        "city": "Ho Chi Minh",
        "country": "Vietnam"
      },
      "items": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "price": 500000,
            "images": ["image_url"]
          },
          "quantity": 3,
          "total": 1500000
        }
      ],
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

#### 2. Get Single Order (Guest Access)

```
GET /api/orders/{orderId}?email={email}
```

**Description:** Retrieve a specific order by ID (guest access requires email verification).

**Parameters:**

- `orderId` (required): Order ID
- `email` (required for guest access): Customer's email address

**Response:**

```json
{
  "order": {
    "_id": "order_id",
    "orderNumber": "ORD2412010001",
    "status": "pending",
    "paymentStatus": "pending",
    "total": 1500000,
    "shippingAddress": {...},
    "items": [...],
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

### 🔐 User Endpoints

#### 3. Get User's Orders

```
GET /api/orders/my?status={status}
```

**Description:** Retrieve orders for the authenticated user.

**Headers:**

```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**

- `status` (optional): Filter by order status

**Response:**

```json
{
  "orders": [
    {
      "_id": "order_id",
      "orderNumber": "ORD2412010001",
      "status": "pending",
      "total": 1500000,
      "items": [...],
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

#### 4. Create Order

```
POST /api/orders
```

**Description:** Create a new order with items and shipping information.

**Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "selectedOptions": {
        "size": "L",
        "color": "Red"
      }
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "state": "Ho Chi Minh",
    "zipCode": "70000",
    "country": "Vietnam"
  },
  "billingAddress": {
    // Same structure as shippingAddress (optional)
  },
  "paymentMethod": "cod",
  "notes": "Please deliver in the morning"
}
```

**Response:**

```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "orderNumber": "ORD2412010001",
    "status": "pending",
    "total": 1500000,
    "items": [...],
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

#### 5. Create Order from Cart

```
POST /api/orders/from-cart
```

**Description:** Create an order from the user's existing cart.

**Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "cartId": "cart_id",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod",
  "notes": "Please deliver in the morning"
}
```

#### 6. Create Order from Guest Cart

```
POST /api/orders/from-guest-cart
```

**Description:** Create an order from a guest cart.

**Request Body:**

```json
{
  "guestId": "guest_cart_id",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod",
  "notes": "Please deliver in the morning"
}
```

#### 7. Cancel Order

```
DELETE /api/orders/{orderId}
```

**Description:** Cancel an order (only for pending or confirmed orders).

**Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "reason": "Changed my mind"
}
```

### 👑 Admin Endpoints

#### 8. Get All Orders

```
GET /api/orders?status={status}&paymentStatus={paymentStatus}&limit={limit}&page={page}
```

**Description:** Retrieve all orders (admin only).

**Headers:**

```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**

- `status` (optional): Filter by order status
- `paymentStatus` (optional): Filter by payment status
- `limit` (optional): Number of orders per page (default: 20, max: 100)
- `page` (optional): Page number (default: 1)

#### 9. Update Order Status

```
PATCH /api/orders/{orderId}/status
```

**Description:** Update the status of an order (admin only).

**Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "confirmed",
  "cancellationReason": "Out of stock" // Only for cancelled status
}
```

#### 10. Update Payment Status

```
PATCH /api/orders/{orderId}/payment
```

**Description:** Update the payment status of an order (admin only).

**Request Body:**

```json
{
  "paymentStatus": "paid",
  "transactionId": "TXN123456",
  "paymentAmount": 1500000
}
```

#### 11. Update Tracking Information

```
PATCH /api/orders/{orderId}/tracking
```

**Description:** Update tracking information for an order (admin only).

**Request Body:**

```json
{
  "trackingNumber": "VN123456789",
  "estimatedDelivery": "2024-12-05T10:00:00.000Z"
}
```

## Order Statuses

### Order Status

- `pending`: Order is pending confirmation
- `confirmed`: Order has been confirmed
- `processing`: Order is being processed
- `shipped`: Order has been shipped
- `delivered`: Order has been delivered
- `cancelled`: Order has been cancelled
- `refunded`: Order has been refunded

### Payment Status

- `pending`: Payment is pending
- `paid`: Payment has been received
- `failed`: Payment has failed
- `refunded`: Payment has been refunded

## Payment Methods

- `cod`: Cash on Delivery
- `bank_transfer`: Bank Transfer
- `credit_card`: Credit Card
- `paypal`: PayPal

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid_value",
      "msg": "Error message",
      "path": "field_name",
      "location": "body"
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
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "message": "Order not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Examples

### Creating a Guest Order

1. Create a guest cart:

```bash
POST /api/carts/guest
```

2. Add items to guest cart:

```bash
POST /api/carts/guest/{guestId}/items
{
  "productId": "product_id",
  "quantity": 2
}
```

3. Create order from guest cart:

```bash
POST /api/orders/from-guest-cart
{
  "guestId": "guest_cart_id",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod"
}
```

### Creating a User Order

1. Add items to user cart (if using cart):

```bash
POST /api/carts/items
Authorization: Bearer {jwt_token}
{
  "productId": "product_id",
  "quantity": 2
}
```

2. Create order from cart:

```bash
POST /api/orders/from-cart
Authorization: Bearer {jwt_token}
{
  "cartId": "cart_id",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "cod"
}
```

## Notes

- Guest orders are identified by email address
- Guest carts expire after 30 days
- Orders can only be cancelled when status is 'pending' or 'confirmed'
- All monetary values are in VND (Vietnamese Dong)
- Shipping cost is currently set to 0 (free shipping)
- Tax is currently set to 0
