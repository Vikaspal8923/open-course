# BACKEND SETUP QUICK START

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a new project
4. Create a cluster (free tier is fine)
5. Create a database user with username & password
6. Whitelist your IP (or use 0.0.0.0/0 for development)
7. Get connection string from "Connect" button

## Step 3: Update .env File

Open `backend/.env` and update:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/opencourse?retryWrites=true&w=majority
```

Replace:
- `YOUR_USERNAME` - Database user username
- `YOUR_PASSWORD` - Database user password  
- `YOUR_CLUSTER` - Your cluster name

## Step 4: Seed Sample Data

```bash
node seed.js
```

This creates:
- Admin user: admin@example.com / password123
- Instructor: sarah@example.com / password123
- Students with sample courses, lessons, interviews, etc.

## Step 5: Start Backend Server

```bash
npm run dev
```

Server will start on: **http://localhost:5000**

## Step 6: Test Backend

Health check:
```bash
curl http://localhost:5000/api/health
```

## Frontend Integration

In your frontend, update your API calls to use:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## API Endpoints Ready to Use

- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (instructor)
- `GET /api/threads` - Get discussions
- `POST /api/threads` - Create thread
- And many more!

See `API_TESTING_GUIDE.md` for full documentation.

## Troubleshooting

**Port 5000 already in use?**
```bash
# Kill process on port 5000
npx lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error?**
- Check connection string is correct
- Verify IP is whitelisted in MongoDB Atlas
- Check database user credentials

**CORS Error?**
- Ensure backend is running
- Check `.env` has correct CLIENT_URL

## Frontend & Backend Together

Terminal 1 (Frontend):
```bash
cd .
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

Both should be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

**Next Steps:**
1. Connect frontend to backend API
2. Implement authentication in frontend
3. Create forms for course creation, enrollment
4. Add file upload for course materials/images
