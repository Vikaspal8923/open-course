# Project Summary: Full Stack Open Course UI HCI

## ✅ What's Been Created

### Frontend (Already Running ✅)
- **Status**: Running on http://localhost:5173
- **Technology**: React + TypeScript + Vite + Tailwind CSS
- **Components**: All UI components implemented
- **Data**: Currently using mock data

### Backend (Created & Ready 🚀)
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB Atlas (requires setup)
- **Status**: Running on http://localhost:5000 (awaiting MongoDB config)
- **Features**:
  - User authentication (JWT)
  - Complete REST API
  - Role-based access control (Student, Instructor, Admin)

---

## 📦 Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/                  # Data models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Interview.js
│   │   ├── Thread.js
│   │   ├── Contribution.js
│   │   └── Material.js
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   ├── interviewController.js
│   │   ├── threadController.js
│   │   └── contributionController.js
│   ├── routes/                  # API endpoints
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   ├── interviews.js
│   │   ├── threads.js
│   │   └── contributions.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── utils/
│   │   └── jwt.js               # Token generation
│   └── server.js                # Main server file
├── seed.js                      # Sample data seeder
├── package.json
├── .env                         # Environment variables
├── README.md
├── API_TESTING_GUIDE.md
└── Procfile                     # Heroku deployment
```

---

## 🚀 Quick Start (Next Steps)

### Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create account → Create project → Create cluster (FREE tier)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Copy connection string

**See:** `MONGODB_SETUP.md` for detailed instructions

### Step 2: Update .env File

Open `backend/.env` and update:
```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/opencourse?retryWrites=true&w=majority
```

### Step 3: Restart Backend Server

```bash
# Press Ctrl+C to stop current server
cd backend
npm run dev
```

### Step 4: Seed Sample Data

```bash
cd backend
npm run seed
```

This creates:
- 4 sample users
- 3 courses with lessons
- Interviews, threads, contributions
- Ready to test!

### Step 5: Test Backend

```bash
curl http://localhost:5000/api/health
```

Should return: `{"message":"Server is running"}`

---

## 📚 API Overview

### Quick Reference

| Resource | Method | Endpoint |
|----------|--------|----------|
| **Auth** | POST | `/api/auth/register` |
| | POST | `/api/auth/login` |
| | GET | `/api/auth/me` |
| | PUT | `/api/auth/profile` |
| **Courses** | GET | `/api/courses` |
| | GET | `/api/courses/:id` |
| | POST | `/api/courses` (instructor) |
| | POST | `/api/courses/:id/enroll` |
| **Lessons** | GET | `/api/lessons/course/:courseId` |
| | POST | `/api/lessons` (instructor) |
| **Interviews** | GET | `/api/interviews` |
| | POST | `/api/interviews/:id/like` |
| **Threads** | GET | `/api/threads` |
| | POST | `/api/threads` |
| | POST | `/api/threads/:id/comments` |

**See:** `backend/API_TESTING_GUIDE.md` for complete documentation with examples

---

## 🔗 Frontend Integration

To connect frontend to backend:

1. Install axios: `npm install axios`
2. Create API service file
3. Update pages to use real API
4. Add auth context

**See:** `FRONTEND_INTEGRATION.md` for step-by-step guide

### Sample Code

```typescript
// Login button example
const handleLogin = async (email: string, password: string) => {
  const response = await api.login(email, password);
  localStorage.setItem('token', response.data.token);
  navigate('/');
};

// Fetch courses
const [courses, setCourses] = useState([]);
useEffect(() => {
  api.getCourses().then(res => setCourses(res.data.courses));
}, []);
```

---

## 🗄️ Database Models

### User
- name, email, password (hashed)
- bio, profileImage, role (student/instructor/admin)
- enrolledCourses, createdCourses
- completedLessons

### Course
- title, description, category, level
- instructor, image, thumbnail
- price, rating, duration
- lessons, materials, enrolledStudents

### Lesson
- title, content, videoUrl
- course, order, duration
- materials, resources

### Interview
- title, interviewee info
- videoUrl, transcript
- topics, views, likes, comments

### Thread
- title, content, category
- author, course, comments
- likes, views, isPinned

### Contribution
- title, type (Tool/Research/Article)
- contributor, link
- tags, status (pending/approved)

---

## 🔐 Authentication

### How It Works

1. **Register**: Create account → Get JWT token
2. **Login**: Send credentials → Get JWT token
3. **Authenticated Requests**: Include token in header:
   ```
   Authorization: Bearer YOUR_TOKEN
   ```
4. **Token Storage**: Stored in localStorage (frontend)

### Test Credentials (After Seeding)

```
Instructor:
- Email: sarah@example.com
- Password: password123

Student:
- Email: emma@example.com
- Password: password123
```

---

## 📝 Sample cURL Tests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@ex.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@ex.com","password":"pass123"}'
```

### Get Courses
```bash
curl http://localhost:5000/api/courses?category=Design&level=Beginner
```

### Create Course (needs token)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"New Course",
    "description":"Description",
    "category":"Design"
  }'
```

---

## 🌐 Running Both Servers

### Terminal 1: Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

Both should be running together!

---

## 🐳 Deployment Options

### Backend Deployment

**Heroku** (Easiest):
```bash
git push heroku main
```

**DigitalOcean**:
- Upload code
- Install Node.js
- Set environment variables
- Use PM2 to run: `pm2 start src/server.js`

**AWS/Azure/GCP**:
- Use Docker
- Set MongoDB connection string
- Deploy container

### Frontend Deployment

**Vercel** (Recommended):
```bash
npm run build
# Deploy build/ folder to Vercel
```

**Netlify**:
- Connect GitHub repo
- Auto-deploys on push

**GitHub Pages**:
```bash
npm run build
git push origin gh-pages
```

---

## ⚙️ Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/opencourse
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Available Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start with hot-reload
npm start            # Start server
npm run seed         # Populate sample data
```

---

## 📋 Checklist

- [x] Backend scaffolding created
- [x] MongoDB connection configured
- [x] All data models created
- [x] Authentication implemented
- [x] API endpoints created
- [x] Sample data seeder created
- [ ] MongoDB Atlas account created
- [ ] .env file updated with MongoDB URI
- [ ] Backend server tested
- [ ] Sample data seeded
- [ ] Frontend API service created
- [ ] Frontend connected to backend
- [ ] Login/Signup pages working
- [ ] Courses loaded from API
- [ ] Deployed to production

---

## 🆘 Troubleshooting

### Backend Won't Start
1. Check Node.js version: `node --version` (should be v16+)
2. Check port 5000 is free: `lsof -ti:5000`
3. Verify .env file exists
4. Check MongoDB connection string

### CORS Error
1. Backend should have: `CLIENT_URL=http://localhost:5173` in .env
2. Frontend should have: `VITE_API_URL=http://localhost:5000/api`
3. Restart both servers

### MongoDB Connection Failed
1. Check connection string has correct password
2. Verify IP is whitelisted in MongoDB Atlas
3. Create database user in MongoDB Atlas
4. Test connection with: `mongosh "mongodb+srv://..."`

### API Returns 404
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Verify endpoint path matches routes
3. Check authentication header for protected routes

---

## 📚 Documentation Files

- **BACKEND_SETUP.md** - Quick backend setup
- **MONGODB_SETUP.md** - MongoDB Atlas setup (IMPORTANT!)
- **API_TESTING_GUIDE.md** - Complete API reference with examples
- **FRONTEND_INTEGRATION.md** - How to connect frontend to backend
- **backend/README.md** - Backend documentation
- **backend/API_TESTING_GUIDE.md** - API endpoint examples

---

## 🎯 Next Phase: Frontend Integration

1. Create `src/services/api.ts` for API calls
2. Create `src/context/AuthContext.tsx` for auth state
3. Update pages to fetch real data
4. Add forms for course creation/enrollment
5. Add image upload for courses
6. Implement real-time updates (optional - WebSockets)

---

## ✨ Features Implemented

### User Management
- ✅ Registration (student/instructor)
- ✅ Login with JWT
- ✅ Profile management
- ✅ Role-based access control

### Course Management
- ✅ Create/Read/Update/Delete courses
- ✅ Enroll students in courses
- ✅ Search & filter courses
- ✅ Course ratings

### Learning Content
- ✅ Lessons with video support
- ✅ Lesson materials
- ✅ Course resources

### Community Features
- ✅ Discussion threads
- ✅ Comments on threads
- ✅ Interviews/expert content
- ✅ Community contributions
- ✅ Like/upvote system

---

## 🎓 What You Can Do Now

### As an Instructor
- Create courses
- Add lessons & materials
- Set course details
- See enrolled students
- Create interviews

### As a Student
- Browse all courses
- Enroll in courses
- View lessons
- Participate in discussions
- Like content
- Make contributions

### As Admin
- Manage all courses & users
- Moderate discussions
- Approve contributions

---

## 🚀 You're All Set!

Your full-stack application is ready to go:

1. ✅ Frontend running
2. ✅ Backend structure ready
3. ✅ Database models designed
4. ✅ API endpoints created
5. ⏳ Waiting for MongoDB setup

**Next Step:** Follow `MONGODB_SETUP.md` to create your MongoDB Atlas account and connect the database!

Questions? Check the relevant documentation file.

Good luck! 🎉
