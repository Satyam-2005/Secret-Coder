# E-Learning Platform Backend

This is the backend API for the E-Learning Platform. It provides endpoints for user authentication, course management, instructor management, and more.

## Features

- User Authentication (Register/Login)
- Course Management (CRUD operations)
- Instructor Management
- Category Management
- User Management
- Error Handling
- Input Validation
- MongoDB Database Integration
- JWT Authentication
- Role-based Authorization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   EMAIL_SERVICE=your_email_service
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   NODE_ENV=development
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current logged in user

### Users
- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get single user
- POST /api/users - Create user (Admin only)
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user (Admin only)

### Courses
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get single course
- POST /api/courses - Create course (Instructor/Admin only)
- PUT /api/courses/:id - Update course (Instructor/Admin only)
- DELETE /api/courses/:id - Delete course (Instructor/Admin only)
- POST /api/courses/:id/enroll - Enroll in a course

### Categories
- GET /api/categories - Get all categories
- GET /api/categories/:id - Get single category
- POST /api/categories - Create category (Admin only)
- PUT /api/categories/:id - Update category (Admin only)
- DELETE /api/categories/:id - Delete category (Admin only)

### Instructors
- GET /api/instructors - Get all instructors
- GET /api/instructors/:id - Get single instructor
- POST /api/instructors - Create instructor (Admin only)
- PUT /api/instructors/:id - Update instructor (Admin/Instructor only)
- DELETE /api/instructors/:id - Delete instructor (Admin only)

## Error Handling

The API includes comprehensive error handling for:
- Invalid MongoDB ObjectIds
- Duplicate key errors
- Validation errors
- Authentication errors
- Authorization errors

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 