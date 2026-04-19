# Complete MongoDB Atlas Setup Guide

## What You Need to Do

The backend is running, but we need to set up MongoDB Atlas first. Follow these steps:

### 1. Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Register" 
3. Enter your email and create an account
4. Verify your email
5. Create an organization (name it anything, e.g., "Open Course")

### 2. Create a Project

1. Click "Create a Project"
2. Name it "Open Course Project"
3. Click "Create Project"

### 3. Create a Cluster

1. Click "Create" button
2. Choose **FREE** tier (M0)
3. Select your preferred region (closest to you)
4. Click "Create Deployment"
5. Wait for cluster to be created (2-3 minutes)

### 4. Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" as authentication method
4. Enter:
   - Username: `admin`
   - Password: Generate secure password (save this!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### 5. Configure Network Access

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, select "Allow Access From Anywhere"
   - This adds 0.0.0.0/0 to the whitelist
   - (For production, use specific IPs)
4. Click "Confirm"

### 6. Get Connection String

1. Click "Clusters" in left sidebar
2. Find your cluster and click "Connect"
3. Click "Connect your application"
4. Choose "Node.js" 
5. Copy the connection string

Your string will look like:
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
```

### 7. Update .env File

1. Open: `backend/.env`
2. Replace the MONGODB_URI value with yours:

```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@YOUR_CLUSTER_NAME.mongodb.net/opencourse?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with the password you created
- Replace `YOUR_CLUSTER_NAME` with your cluster name
- Replace `admin` if you used a different username
- Change `opencourse` to your desired database name (optional)

### 8. Create Database

The database will be created automatically when the server first connects.

---

## Example Connection String

**Before:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/opencourse?retryWrites=true&w=majority
```

**After (example):**
```
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@my-cluster-abc123.mongodb.net/opencourse?retryWrites=true&w=majority
```

---

## After Configuration

### 1. Restart Backend Server

Once you've updated `.env`:

```bash
# In backend folder, press Ctrl+C to stop current server
# Then restart
npm run dev
```

### 2. Seed Sample Data

```bash
# In a new terminal in backend folder
npm run seed
```

This creates:
- 4 sample users
- 3 sample courses
- 3 sample lessons
- 2 sample interviews
- 2 sample threads
- 2 sample contributions

### 3. Test Connection

Check if backend connects:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "message": "Server is running"
}
```

### 4. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "password123"
  }'
```

---

## Troubleshooting

### EBADNAME Error
- Check cluster name spelling (case-sensitive)
- Verify user creation was successful
- Make sure database user permissions are correct

### Connection Refused
- Verify IP is whitelisted in Network Access
- Check USERNAME and PASSWORD are correct
- Ensure cluster exists and is running

### Database Not Found
- This is normal - it will be created on first connection
- Check backend logs for actual MongoDB connection message

---

## Cost & Limits

**Free Tier Includes:**
- Up to 3 clusters
- 5GB storage
- Shared RAM & CPU
- Perfect for development & testing

**When to Upgrade:**
- If you need more than 5GB storage
- If you need better performance
- When going to production

---

## Security Notes

**Development Only:**
- Using 0.0.0.0/0 IP access
- Simple database password

**Before Production:**
- Use strong passwords
- Whitelist specific IPs only
- Enable IP whitelist instead of 0.0.0.0/0
- Use environment variables (not hardcoded)
- Enable database encryption

---

## Next Steps

After MongoDB setup:

1. ✅ Backend running on http://localhost:5000
2. ✅ MongoDB connected
3. ✅ Sample data seeded
4. ⬜ Connect frontend to backend API
5. ⬜ Update frontend to use real API endpoints

See `BACKEND_SETUP.md` for quick reference.
