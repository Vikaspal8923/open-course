# Frontend-Backend Integration Guide

## Overview
This guide shows how to connect your React frontend (running on port 5173) to the Express backend (running on port 5000).

## Step 1: Create API Configuration File

Create a new file: `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  [key: string]: any;
}

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    localStorage.setItem('token', token);
  }

  clearAuthToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<any> {
    return this.client.post('/auth/register', data);
  }

  async login(email: string, password: string): Promise<any> {
    return this.client.post('/auth/login', { email, password });
  }

  async getCurrentUser(): Promise<any> {
    return this.client.get('/auth/me');
  }

  async updateProfile(data: any): Promise<any> {
    return this.client.put('/auth/profile', data);
  }

  // Course endpoints
  async getCourses(query?: any): Promise<any> {
    return this.client.get('/courses', { params: query });
  }

  async getCourse(id: string): Promise<any> {
    return this.client.get(\`/courses/\${id}\`);
  }

  async createCourse(data: any): Promise<any> {
    return this.client.post('/courses', data);
  }

  async updateCourse(id: string, data: any): Promise<any> {
    return this.client.put(\`/courses/\${id}\`, data);
  }

  async enrollCourse(id: string): Promise<any> {
    return this.client.post(\`/courses/\${id}/enroll\`);
  }

  async getInstructorCourses(instructorId: string): Promise<any> {
    return this.client.get(\`/courses/instructor/\${instructorId}\`);
  }

  // Lesson endpoints
  async getLessonsByCourse(courseId: string): Promise<any> {
    return this.client.get(\`/lessons/course/\${courseId}\`);
  }

  async getLesson(id: string): Promise<any> {
    return this.client.get(\`/lessons/\${id}\`);
  }

  async createLesson(data: any): Promise<any> {
    return this.client.post('/lessons', data);
  }

  async updateLesson(id: string, data: any): Promise<any> {
    return this.client.put(\`/lessons/\${id}\`, data);
  }

  // Interview endpoints
  async getInterviews(query?: any): Promise<any> {
    return this.client.get('/interviews', { params: query });
  }

  async getInterview(id: string): Promise<any> {
    return this.client.get(\`/interviews/\${id}\`);
  }

  async createInterview(data: any): Promise<any> {
    return this.client.post('/interviews', data);
  }

  async likeInterview(id: string): Promise<any> {
    return this.client.post(\`/interviews/\${id}/like\`);
  }

  // Thread endpoints
  async getThreads(query?: any): Promise<any> {
    return this.client.get('/threads', { params: query });
  }

  async getThread(id: string): Promise<any> {
    return this.client.get(\`/threads/\${id}\`);
  }

  async createThread(data: any): Promise<any> {
    return this.client.post('/threads', data);
  }

  async updateThread(id: string, data: any): Promise<any> {
    return this.client.put(\`/threads/\${id}\`, data);
  }

  async addComment(threadId: string, content: string): Promise<any> {
    return this.client.post(\`/threads/\${threadId}/comments\`, { content });
  }

  async likeThread(id: string): Promise<any> {
    return this.client.post(\`/threads/\${id}/like\`);
  }

  // Contribution endpoints
  async getContributions(query?: any): Promise<any> {
    return this.client.get('/contributions', { params: query });
  }

  async getContribution(id: string): Promise<any> {
    return this.client.get(\`/contributions/\${id}\`);
  }

  async createContribution(data: any): Promise<any> {
    return this.client.post('/contributions', data);
  }

  async likeContribution(id: string): Promise<any> {
    return this.client.post(\`/contributions/\${id}/like\`);
  }
}

export const api = new APIClient();
```

## Step 2: Update .env File

Create `.env` (or `.env.local`) in the root frontend folder:

```
VITE_API_URL=http://localhost:5000/api
```

Update the API client constructor to use it:
```typescript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
```

## Step 3: Update Login Page

File: `src/app/pages/Login.tsx`

```typescript
import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      if (response.data.success) {
        api.setAuthToken(response.data.token);
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Step 4: Update Courses Page

File: `src/app/pages/Courses.tsx`

```typescript
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getCourses();
        setCourses(response.data.courses || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h1>Courses</h1>
      <div className="grid grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
```

## Step 5: Create Auth Context (Optional but Recommended)

File: `src/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.setAuthToken(token);
          const response = await api.getCurrentUser();
          setUser(response.data.user);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    api.setAuthToken(response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    api.clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Step 6: Update Main App

File: `src/app/App.tsx`

```typescript
import { AuthProvider } from '../context/AuthContext';
import Router from './routes';

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
```

## Step 7: Install Axios

```bash
npm install axios
```

## Testing the Integration

### 1. Start Both Servers

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

### 2. Test Login

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: `sarah@example.com`
   - Password: `password123`
3. Should redirect to home page

### 3. Test Courses Page

1. Go to http://localhost:5173/courses
2. Should load and display courses from MongoDB

## Sample Test Data

After running `npm run seed` in backend folder:

**Instructors:**
- Email: `sarah@example.com`, Password: `password123`
- Email: `mike@example.com`, Password: `password123`

**Students:**
- Email: `emma@example.com`, Password: `password123`
- Email: `alex@example.com`, Password: `password123`

## Common Issues & Solutions

### CORS Error

If you see CORS error in browser console:

**Backend .env:**
```
CLIENT_URL=http://localhost:5173
```

Then restart backend.

### 404 on API Calls

Check:
1. Backend is running on port 5000
2. API URL in frontend is correct
3. Endpoint path matches backend routes

### Token Errors

1. Clear browser localStorage
2. Login again to get new token
3. Check .env has valid JWT_SECRET

## Production Deployment

Change API URL for production:

```
VITE_API_URL=https://your-backend-domain.com/api
```

Deploy both frontend and backend:
- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Heroku, DigitalOcean, AWS, etc.

---

## Next Steps

1. ✅ Create API service
2. ✅ Update auth pages
3. ✅ Create components to fetch data
4. ⬜ Add error handling & loading states
5. ⬜ Implement file uploads
6. ⬜ Add form creation/editing pages
7. ⬜ Implement real-time updates (optional)
