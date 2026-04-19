# API Documentation & Testing Guide

## Quick Start with cURL or Insomnia/Postman

### 1. Register a New User

**Request:**
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

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60c72b2f9e8e4a0015c4d8f1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60c72b2f9e8e4a0015c4d8f1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 3. Get Current User Profile

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "60c72b2f9e8e4a0015c4d8f1",
    "name": "John Doe",
    "email": "john@example.com",
    "enrolledCourses": [...],
    "createdCourses": []
  }
}
```

---

## Course Endpoints

### Get All Courses

**Request:**
```bash
curl "http://localhost:5000/api/courses?category=Design&level=Beginner&search=HCI"
```

**Query Parameters:**
- `category`: Filter by category (Design, Development, Business, Science, Art)
- `level`: Filter by level (Beginner, Intermediate, Advanced)
- `search`: Search in title and description

**Response:**
```json
{
  "success": true,
  "count": 5,
  "courses": [
    {
      "_id": "60c72b2f9e8e4a0015c4d8f1",
      "title": "Introduction to HCI Design",
      "description": "Learn the fundamentals...",
      "instructor": {
        "_id": "60c72b2f9e8e4a0015c4d8e0",
        "name": "Sarah Chen"
      },
      "category": "Design",
      "level": "Beginner",
      "price": 49.99,
      "rating": 4.8,
      "enrolledStudents": [...]
    }
  ]
}
```

### Get Single Course

**Request:**
```bash
curl http://localhost:5000/api/courses/60c72b2f9e8e4a0015c4d8f1
```

**Response:**
```json
{
  "success": true,
  "course": {
    "_id": "60c72b2f9e8e4a0015c4d8f1",
    "title": "Introduction to HCI Design",
    "lessons": [...],
    "materials": [...]
  }
}
```

### Create Course (Instructor Only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Advanced UX Design",
    "description": "Learn advanced user experience design techniques",
    "category": "Design",
    "level": "Advanced",
    "price": 79.99
  }'
```

**Response:**
```json
{
  "success": true,
  "course": {
    "_id": "60c72b2f9e8e4a0015c4d8f2",
    "title": "Advanced UX Design",
    "instructor": "60c72b2f9e8e4a0015c4d8e0"
  }
}
```

### Enroll in Course

**Request:**
```bash
curl -X POST http://localhost:5000/api/courses/60c72b2f9e8e4a0015c4d8f1/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Enrolled successfully"
}
```

---

## Lesson Endpoints

### Get Lessons for a Course

**Request:**
```bash
curl http://localhost:5000/api/lessons/course/60c72b2f9e8e4a0015c4d8f1
```

**Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "_id": "60c72b2f9e8e4a0015c4d8f3",
      "title": "Understanding User Needs",
      "course": "60c72b2f9e8e4a0015c4d8f1",
      "order": 1,
      "duration": 45,
      "content": "..."
    }
  ]
}
```

### Create Lesson (Instructor Only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Understanding User Needs",
    "description": "Learn user research methods",
    "content": "Full lesson content here...",
    "courseId": "60c72b2f9e8e4a0015c4d8f1",
    "videoUrl": "https://youtube.com/embed/...",
    "duration": 45,
    "order": 1
  }'
```

---

## Interview Endpoints

### Get All Interviews

**Request:**
```bash
curl "http://localhost:5000/api/interviews?search=ethics"
```

**Response:**
```json
{
  "success": true,
  "interviews": [
    {
      "_id": "60c72b2f9e8e4a0015c4d8f4",
      "title": "Design Ethics in Modern Digital Products",
      "interviewee": {
        "name": "Jane Smith",
        "title": "Design Director"
      },
      "views": 1250,
      "likes": []
    }
  ]
}
```

### Create Interview

**Request:**
```bash
curl -X POST http://localhost:5000/api/interviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Future of Design",
    "description": "Industry leaders discuss upcoming trends",
    "interviewee": {
      "name": "Jane Smith",
      "title": "Design Director",
      "bio": "Expert in design trends"
    },
    "videoUrl": "https://youtube.com/embed/...",
    "transcript": "Full transcript...",
    "topics": ["Design", "Trends"],
    "duration": 45
  }'
```

### Like Interview

**Request:**
```bash
curl -X POST http://localhost:5000/api/interviews/60c72b2f9e8e4a0015c4d8f4/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Thread Endpoints

### Get All Threads

**Request:**
```bash
curl "http://localhost:5000/api/threads?course=60c72b2f9e8e4a0015c4d8f1&category=Discussion&search=accessibility"
```

**Query Parameters:**
- `course`: Filter by course ID
- `category`: Filter by category (Discussion, Question, Announcement, General)
- `search`: Search in title, description, content

**Response:**
```json
{
  "success": true,
  "threads": [
    {
      "_id": "60c72b2f9e8e4a0015c4d8f5",
      "title": "Best practices for accessibility",
      "author": {
        "name": "Emma Wilson"
      },
      "views": 234,
      "comments": [...],
      "isPinned": true
    }
  ]
}
```

### Create Thread

**Request:**
```bash
curl -X POST http://localhost:5000/api/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Tips for better prototyping",
    "description": "Share your prototyping techniques",
    "content": "Full discussion content...",
    "course": "60c72b2f9e8e4a0015c4d8f1",
    "category": "Discussion",
    "tags": ["Prototyping", "Tools"]
  }'
```

### Add Comment to Thread

**Request:**
```bash
curl -X POST http://localhost:5000/api/threads/60c72b2f9e8e4a0015c4d8f5/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great discussion! Here's my take..."
  }'
```

### Like Thread

**Request:**
```bash
curl -X POST http://localhost:5000/api/threads/60c72b2f9e8e4a0015c4d8f5/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Contribution Endpoints

### Get All Contributions

**Request:**
```bash
curl "http://localhost:5000/api/contributions?type=Tool&status=approved&search=framework"
```

**Query Parameters:**
- `type`: Filter by type (Course, Article, Resource, Tool, Research)
- `status`: Filter by status (pending, approved, rejected)
- `search`: Search in title and description

**Response:**
```json
{
  "success": true,
  "contributions": [
    {
      "_id": "60c72b2f9e8e4a0015c4d8f6",
      "title": "HCI Design Framework",
      "type": "Tool",
      "status": "approved",
      "views": 543,
      "likes": []
    }
  ]
}
```

### Create Contribution

**Request:**
```bash
curl -X POST http://localhost:5000/api/contributions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My New Design Framework",
    "description": "A comprehensive framework for HCI design",
    "type": "Tool",
    "content": "Detailed content...",
    "link": "https://github.com/...",
    "tags": ["Framework", "Design"]
  }'
```

### Like Contribution

**Request:**
```bash
curl -X POST http://localhost:5000/api/contributions/60c72b2f9e8e4a0015c4d8f6/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Sample Data Seeding

To populate the database with sample data:

```bash
node seed.js
```

This will create:
- 4 sample users (2 instructors, 2 students)
- 3 sample courses
- 3 sample lessons
- 2 sample interviews
- 2 sample threads
- 2 sample contributions

---

## Error Responses

### Unauthorized (Missing Token)
```json
{
  "message": "Not authorized to access this route"
}
```

### Not Found
```json
{
  "message": "Course not found"
}
```

### Validation Error
```json
{
  "message": "Please provide all required fields"
}
```

### Forbidden (Insufficient Permissions)
```json
{
  "message": "Not authorized to update this course"
}
```

---

## Postman Collection

Import this template into Postman as a collection:

1. Open Postman
2. Click "Import"
3. Paste the JSON below or import from URL

Set the `base_url` variable to `http://localhost:5000` and `token` variable to your JWT token.

---

## Testing Tips

1. **Save tokens**: After login, copy the token and use it in the Authorization header
2. **Verify CORS**: Ensure the backend has the correct CLIENT_URL in .env
3. **Check MongoDB**: Verify connection is working with health check: `GET /api/health`
4. **Debug timestamps**: All models have `createdAt` and `updatedAt` fields
5. **Pagination**: For large datasets, consider adding pagination (future improvement)

---

## Common Issues

### CORS Error
- Check `.env` file has correct `CLIENT_URL`
- Ensure backend is running on correct port
- Clear browser cache and try again

### Token Expired
- Login again to get a new token
- Token validity: 7 days (configurable in .env)

### MongoDB Connection Failed
- Verify `MONGODB_URI` in `.env`
- Check IP allowlist in MongoDB Atlas
- Ensure database user credentials are correct

---

For more information, see `backend/README.md`
