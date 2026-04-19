# Backend Setup Guide

## Overview
This is the Express.js backend for the Open Course UI HCI project. It provides a complete REST API with:
- User authentication (JWT-based)
- Course management
- Lesson management
- Interviews
- Discussion threads
- Community contributions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new account or sign in
3. Create a new project
4. Create a new cluster (choose the free tier for development)
5. Set up database access:
   - Click "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Enter username and password
   - Save the credentials
6. Set up network access:
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0) for development
7. Get your connection string:
   - Click "Clusters" and then "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 3. Configure Environment Variables

1. Open `.env` file in the backend folder
2. Update the `MONGODB_URI` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/opencourse?retryWrites=true&w=majority
   ```
   Replace:
   - `<username>` - Your database user username
   - `<password>` - Your database user password
   - `<cluster-name>` - Your cluster name
   - Replace `opencourse` with your database name if different

3. (Optional) Update `JWT_SECRET` with a strong random string
4. (Optional) Update other environment variables as needed

## Running the Backend

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `GET /api/courses/instructor/:id` - Get instructor's courses
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course

### Lessons
- `GET /api/lessons/course/:courseId` - Get lessons for a course
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Interviews
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get single interview
- `POST /api/interviews` - Create interview
- `PUT /api/interviews/:id` - Update interview
- `POST /api/interviews/:id/like` - Like/unlike interview

### Threads (Discussions)
- `GET /api/threads` - Get all threads
- `GET /api/threads/:id` - Get single thread
- `POST /api/threads` - Create thread
- `PUT /api/threads/:id` - Update thread
- `DELETE /api/threads/:id` - Delete thread
- `POST /api/threads/:id/comments` - Add comment to thread
- `POST /api/threads/:id/like` - Like/unlike thread

### Contributions
- `GET /api/contributions` - Get all contributions
- `GET /api/contributions/:id` - Get single contribution
- `POST /api/contributions` - Create contribution
- `PUT /api/contributions/:id` - Update contribution
- `POST /api/contributions/:id/like` - Like/unlike contribution

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected routes:

1. Register or login to get a token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your_token_here>
   ```

## Testing with Postman/cURL

### Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get all courses
```bash
curl http://localhost:5000/api/courses
```

### Create a course (requires authentication)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Learn React",
    "description": "Complete React Course",
    "category": "Development",
    "level": "Beginner",
    "price": 29.99
  }'
```

## Data Models

### User
- name, email, password (hashed)
- bio, profileImage
- role (student, instructor, admin)
- enrolledCourses, createdCourses
- completedLessons

### Course
- title, description, category, level
- instructor, image, thumbnail
- duration, price, rating
- lessons, materials
- enrolledStudents, tags
- isPublished

### Lesson
- title, description, content
- course, order
- videoUrl, duration
- materials, resources
- isPublished

### Interview
- title, description
- interviewee (name, title, bio, image)
- videoUrl, transcript
- topics, duration
- views, likes, comments
- isPublished

### Thread
- title, description, content
- author, course, category
- tags, views, likes, comments
- isPinned, isClosed

### Contribution
- title, description, type
- contributor, content
- image, link, tags
- views, likes
- status (pending, approved, rejected)

## Connection Optimization

The backend uses optimized MongoDB connection settings:
- `maxPoolSize: 10` - Maximum connections
- `minPoolSize: 5` - Minimum connections kept ready
- `maxIdleTimeMS: 45000` - Connection idle timeout
- `serverSelectionTimeoutMS: 5000` - Server selection timeout
- `socketTimeoutMS: 45000` - Socket timeout

These settings are ideal for traditional server environments. Adjust in `src/config/database.js` if needed.

## Deployment

To deploy this backend:

1. **Heroku**:
   - Add `Procfile` with: `web: node src/server.js`
   - Set environment variables in Heroku dashboard
   - Deploy: `git push heroku main`

2. **DigitalOcean/VPS**:
   - Install Node.js and npm
   - Clone repository
   - Install dependencies: `npm install`
   - Set environment variables
   - Use PM2: `pm2 start src/server.js --name "open-course-backend"`

3. **Docker**:
   - Create Dockerfile and docker-compose.yml
   - Build and run containers

## Troubleshooting

### MongoDB Connection Error
- Verify your connection string is correct
- Check that your IP address is allowed in Network Access
- Ensure database user credentials are correct

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Token Expired
- Login again to get a new token
- Token expires in 7 days by default (configurable in .env)

## Contributing
Follow the existing code structure and naming conventions.

## License
ISC
