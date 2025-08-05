# User Management API Documentation

## Overview
This document describes the new user management functionality added to the IT Help Desk application. The system now supports complete user management including viewing, updating, and deleting users (admin only) as well as profile management for all users.

## Authentication & Authorization

### Admin Routes
- All admin routes require admin privileges
- Protected by `adminAuth` middleware
- Only users with `role: 'admin'` can access these endpoints

### User Profile Routes
- Available to all authenticated users
- Protected by `verifyToken` middleware
- Users can only manage their own profile

## API Endpoints

### Admin Routes (Admin Only)

#### 1. Get All Users
```
GET /api/users/all
```
**Description:** Retrieve all users in the system
**Headers:** 
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "employeeID": "EMP001",
      "department": "IT",
      "branch": "Main",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get User by ID
```
GET /api/users/:id
```
**Description:** Retrieve a specific user by their ID
**Headers:** 
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "employeeID": "EMP001",
    "department": "IT",
    "branch": "Main",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Update User
```
PUT /api/users/:id
```
**Description:** Update user information (admin only)
**Headers:** 
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "employeeID": "EMP001",
  "department": "IT",
  "branch": "Main",
  "role": "user",
  "password": "newpassword" // Optional
}
```

**Response:**
```json
{
  "message": "User updated successfully"
}
```

#### 4. Delete User
```
DELETE /api/users/:id
```
**Description:** Delete a user from the system
**Headers:** 
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Note:** Admins cannot delete their own account

### User Profile Routes (All Authenticated Users)

#### 1. Get Current User Profile
```
GET /api/users/profile/me
```
**Description:** Get the current user's profile information
**Headers:** 
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "employeeID": "EMP001",
    "department": "IT",
    "branch": "Main",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Update Current User Profile
```
PUT /api/users/profile/me
```
**Description:** Update the current user's profile
**Headers:** 
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "department": "IT",
  "branch": "Main",
  "currentPassword": "oldpassword", // Required if changing password
  "newPassword": "newpassword" // Optional
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "User ID is required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

## Security Features

1. **Password Security:**
   - Passwords are hashed using bcrypt
   - Current password verification required for password changes
   - Passwords are never returned in API responses

2. **Authorization:**
   - Admin routes protected by admin middleware
   - Users can only access their own profile
   - Admins cannot delete their own account

3. **Data Validation:**
   - All inputs are validated
   - SQL injection protection through parameterized queries
   - Required field validation

## Database Schema

The user management system uses the existing `Users` table with the following structure:

```sql
CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  employeeID VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  createdAt DATETIME DEFAULT GETDATE()
);
```

## Usage Examples

### Frontend Integration

```javascript
// Get all users (admin only)
const getAllUsers = async () => {
  const response = await fetch('/api/users/all', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Update user (admin only)
const updateUser = async (userId, userData) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get current user profile
const getProfile = async () => {
  const response = await fetch('/api/users/profile/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Testing

To test the user management functionality:

1. **Create an admin user** in the database
2. **Login as admin** to get authentication token
3. **Test admin endpoints** using the token
4. **Test user profile endpoints** with regular user accounts

## Notes

- All responses are encrypted using the existing encryption system
- The system maintains backward compatibility with existing authentication
- User management is fully integrated with the existing ticket system
- Audit trails can be added by extending the database schema 