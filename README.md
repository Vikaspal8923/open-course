# Open Course UI HCI

Open Course UI HCI is a full-stack course platform built with a React + TypeScript frontend and a Node.js + Express + MongoDB backend. It supports authentication, course creation, collaborative lesson contributions, rich-text lesson editing, course browsing, profile pages, and discussion-oriented learning features.

## Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TipTap editor

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Project Structure

```txt
.
├── src/                    # Frontend app
├── backend/                # Express API
├── package.json            # Frontend scripts and dependencies
├── backend/package.json    # Backend scripts and dependencies
└── README.md
```

## Features

- JWT-based login and signup
- Auth-aware navbar and course actions
- Course listing with search and sorting
- Create course flow for authenticated users
- Course detail pages with lesson contributions
- TipTap lesson editor with:
  - bold
  - italic
  - bullet list
  - link insertion
  - table insertion
- Lesson ownership logic:
  - any logged-in user can add a lesson
  - only the lesson creator can edit that lesson
- Lesson detail pages with YouTube embed conversion
- Profile page showing created courses and lessons

## Local Development

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Configure environment variables

Create or update these files:

#### Root `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

#### `backend/.env`

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 4. Run the app

Run frontend and backend together:

```bash
npm run start
```

This starts:

- frontend at `http://localhost:5173`
- backend at `http://localhost:5000`

### Other useful commands

Frontend only:

```bash
npm run dev:frontend
```

Backend only:

```bash
npm run dev:backend
```

Frontend production build:

```bash
npm run build
```

Backend production start:

```bash
cd backend
npm start
```

## API Base URL

The frontend expects the backend API under:

```txt
/api
```

Examples:

- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/courses`

If the deployed frontend points to the backend without `/api`, auth and data requests will fail with `Route not found`.

## Deployment

### Recommended setup

- Backend: Render
- Frontend: Netlify or Vercel

### Backend deployment on Render

Use these settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set these environment variables on Render:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.netlify.app
```

Do not manually set `PORT` on Render unless you have a special reason. Render provides it automatically.

After deploy, your backend URL will look like:

```txt
https://your-backend-name.onrender.com
```

Your API base will be:

```txt
https://your-backend-name.onrender.com/api
```

### Frontend deployment on Netlify

Use these settings:

- Base directory: leave empty
- Build command: `npm run build`
- Publish directory: `dist`

Set this environment variable on Netlify:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

After Netlify gives you a site URL, update `CLIENT_URL` on Render to that frontend URL and redeploy the backend once.

## Auto Deploy

If GitHub is connected:

- pushing frontend changes will trigger Netlify redeploys
- pushing backend changes will trigger Render redeploys

Environment variable changes are not pulled from GitHub automatically. Update them manually in the hosting dashboards.

## Security Notes

- Do not commit real secrets to GitHub
- Rotate exposed MongoDB credentials and JWT secrets before production use
- Keep `.env` files local and use deployment dashboards for production environment variables

## Troubleshooting

### Backend root URL shows `{"message":"Route not found"}`

That is expected if you open the backend root URL directly. The backend routes live under `/api/...`.

Use:

```txt
https://your-backend-name.onrender.com/api/health
```

instead of:

```txt
https://your-backend-name.onrender.com/
```

### Signup/login returns `Route not found`

Check that the frontend environment variable includes `/api`:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### White screen on frontend

Common causes:

- bad frontend environment variable
- stale deployment after code changes
- build error during deployment

Check the Netlify or Vercel deploy logs first.

## Notes

- The backend README in `backend/README.md` contains additional API and backend-specific details.
- This project currently uses email/password authentication only.
