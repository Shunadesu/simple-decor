# Users API Documentation

## Overview

The Users API provides comprehensive user management functionality including CRUD operations, authentication, and administrative features.

## Base URL

```
http://localhost:5000/api/users
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Users (Admin Only)

**GET** `/api/users`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for username, email, firstName, lastName
- `role` (optional): Filter by role (user, admin, moderator)
- `status` (optional): Filter by status (active, inactive, banned)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc)

**Response:**

```json
{
  "users": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "totalPages": 10,
  "currentPage": 1,
  "hasNext": true,
  "hasPrev": false
}
```

### 2. Get Single User

**GET** `/api/users/:id`

**Response:**

```json
{
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "status": "active",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    },
    "addresses": [],
    "wishlist": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create User (Admin Only)

**POST** `/api/users`

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "user",
  "status": "active"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "active"
  }
}
```

### 4. Update User

**PUT** `/api/users/:id`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "preferences": {
    "language": "vi",
    "currency": "VND"
  }
}
```

**Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}
```

### 5. Delete User (Admin Only)

**DELETE** `/api/users/:id`

**Response:**

```json
{
  "message": "User deleted successfully",
  "userId": "user_id"
}
```

### 6. Update User Status (Admin Only)

**PATCH** `/api/users/:id/status`

**Request Body:**

```json
{
  "status": "banned"
}
```

**Response:**

```json
{
  "message": "User status updated successfully",
  "user": {
    "_id": "user_id",
    "status": "banned"
  }
}
```

### 7. Reset User Password (Admin Only)

**POST** `/api/users/:id/reset-password`

**Request Body:**

```json
{
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe"
  }
}
```

### 8. Get User Statistics (Admin Only)

**GET** `/api/users/stats`

**Response:**

```json
{
  "totalUsers": 100,
  "activeUsers": 85,
  "inactiveUsers": 10,
  "bannedUsers": 5,
  "usersByRole": [
    {
      "_id": "user",
      "count": 90
    },
    {
      "_id": "admin",
      "count": 5
    },
    {
      "_id": "moderator",
      "count": 5
    }
  ],
  "recentUsers": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## User Model

### Fields

- **username** (String, required, unique): 3-30 characters
- **email** (String, required, unique): Valid email format
- **password** (String, required): Minimum 6 characters (hashed)
- **firstName** (String, required): Maximum 50 characters
- **lastName** (String, required): Maximum 50 characters
- **phone** (String, optional): Phone number format
- **avatar** (Object, optional): Cloudinary image data
- **role** (String, enum): user, admin, moderator (default: user)
- **status** (String, enum): active, inactive, banned (default: active)
- **isEmailVerified** (Boolean): Email verification status
- **lastLogin** (Date): Last login timestamp
- **preferences** (Object): User preferences
- **addresses** (Array): User addresses
- **wishlist** (Array): User wishlist items
- **socialAccounts** (Object): Social media accounts

### Virtual Fields

- **fullName**: Combination of firstName and lastName
- **isLocked**: Account lock status

### Methods

- **isAccountLocked()**: Check if account is locked
- **incLoginAttempts()**: Increment failed login attempts
- **resetLoginAttempts()**: Reset login attempts
- **getPublicProfile()**: Get user data without sensitive information

## Security Features

### Account Locking

- Accounts are locked after 5 failed login attempts
- Lock duration: 2 hours
- Automatic unlock after lock period expires

### Password Security

- Passwords are hashed using bcrypt
- Minimum 6 characters required
- Password reset functionality for admins

### Access Control

- Users can only view/edit their own profile
- Admins can manage all users
- Role-based access control

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
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
  "message": "User not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Failed to fetch users",
  "error": "Error details (development only)"
}
```

## Usage Examples

### Create a new user (Admin)

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "role": "user"
  }'
```

### Get user statistics (Admin)

```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer <admin_token>"
```

### Update user profile

```bash
curl -X PUT http://localhost:5000/api/users/user_id \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+1234567890"
  }'
```
