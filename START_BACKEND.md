# Starting the Backend - Step by Step

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ Docker Desktop installed and running
- ✅ Frontend already running on port 5173

## Step 1: Start Database Services

Open a **NEW terminal** (keep frontend running in the other terminal).

Navigate to project root:
```bash
cd "D:\Stony Brook\HCI\Project"
```

Start PostgreSQL and Redis with Docker Compose:
```bash
docker-compose up -d postgres redis
```

**Expected output:**
```
[+] Running 2/2
 ✔ Container contexttype-postgres  Started
 ✔ Container contexttype-redis     Started
```

**Verify services are running:**
```bash
docker-compose ps
```

You should see:
```
NAME                    STATUS
contexttype-postgres    Up
contexttype-redis       Up
```

**Wait 10 seconds** for databases to fully initialize.

## Step 2: Setup Backend

Open another **NEW terminal** (so you have 3 terminals now: frontend, and this one for backend).

Navigate to backend directory:
```bash
cd "D:\Stony Brook\HCI\Project\backend"
```

Install dependencies (first time only):
```bash
npm install
```

This will take 1-2 minutes.

## Step 3: Configure Environment

Check if `.env` file exists:
```bash
ls .env
```

If it doesn't exist, create it:
```bash
echo PORT=3000 > .env
echo DATABASE_URL=postgresql://contexttype:contexttype_dev_password@localhost:5432/contexttype_db >> .env
echo REDIS_URL=redis://localhost:6379 >> .env
echo NODE_ENV=development >> .env
echo ML_SERVICE_URL=http://localhost:8000 >> .env
```

## Step 4: Initialize Database

Run Prisma migrations to create database tables:
```bash
npx prisma generate
npx prisma db push
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Database synchronized with schema
```

## Step 5: Start Backend Server

Start the development server:
```bash
npm run dev
```

**Expected output:**
```
🚀 ContextType Backend Server
✓ Database connected
✓ Redis connected
✓ Server running on http://localhost:3000
✓ API Docs: http://localhost:3000/api-docs
```

## Step 6: Verify Connection

### Check Backend Health

In a browser or new terminal:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Check Frontend Connection

1. Go back to your browser at **http://localhost:5173**
2. Refresh the page
3. The yellow warning "Using offline mode - backend not connected" should **disappear**!
4. Start typing in the text area
5. Context detection should now work automatically!

## Step 7: Test Context Detection

1. Type some code in the text area:
   ```javascript
   function hello() {
     const x = 10;
     return x;
   }
   ```

2. Watch the **Context Indicator** - it should detect **"Code"** context automatically!

3. Clear the text and type an email:
   ```
   Dear Sir,

   Thank you for your consideration. I look forward to hearing from you.

   Sincerely,
   John
   ```

4. Context should switch to **"Email"**!

5. Clear and type casual chat:
   ```
   lol omg that's so funny haha 😂
   ```

6. Context should switch to **"Chat"**!

## Troubleshooting

### "Port 3000 is already in use"

Kill the process using port 3000:
```bash
# Find the process
netstat -ano | findstr :3000

# Kill it (replace XXXX with the PID)
taskkill //F //PID XXXX
```

### "Database connection failed"

Check if Docker containers are running:
```bash
docker-compose ps
```

Restart the containers:
```bash
docker-compose down
docker-compose up -d postgres redis
```

Wait 10 seconds, then restart backend.

### "Cannot find module 'prisma'"

Reinstall dependencies:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## What's Running Now

After completing all steps, you should have:

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Frontend** | 5173 | http://localhost:5173 | ✅ Running |
| **Backend** | 3000 | http://localhost:3000 | ✅ Running |
| **PostgreSQL** | 5432 | localhost:5432 | ✅ Running |
| **Redis** | 6379 | localhost:6379 | ✅ Running |

## View API Documentation

Visit: **http://localhost:3000/api-docs**

This shows all available API endpoints with Swagger UI.

## Stopping Services

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Databases
```bash
docker-compose down
```

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

## Next Step: ML Service (Optional)

Want 95-98% context detection accuracy? Set up the ML service!

See [HOW_TO_RUN.md](HOW_TO_RUN.md) Option 3 for ML service setup.

---

**You're all set!** The backend is now connected and context detection is working! 🎉
