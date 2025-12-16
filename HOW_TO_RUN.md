# ContextType - How to Run the Project

This guide provides step-by-step instructions to set up and run the ContextType adaptive keyboard application.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Accessing the Application](#accessing-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Quick Start Summary](#quick-start-summary)

---

## Prerequisites

Before running the project, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (v8.0.0 or higher) - comes with Node.js
  - Verify installation: `npm --version`

### Required API Key
- **Groq API Key** (for LLM-based suggestions)
  - Sign up at: https://console.groq.com/
  - Create a new API key from the dashboard
  - **IMPORTANT**: Keep your API key secure and never commit it to version control

---

## Project Structure

```
ContextType/
│
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   └── .env           # Frontend environment variables
│
├── backend/           # Node.js + Express backend
│   ├── services/
│   │   └── groq.js   # Groq LLM integration
│   ├── routes/
│   │   └── suggestions.js
│   ├── server.js
│   ├── package.json
│   └── .env          # Backend environment variables
│
└── HOW_TO_RUN.md     # This file
```

---

## Installation

### Step 1: Clone/Extract the Project

If you received a ZIP file, extract it to your desired location.
If using Git:
```bash
git clone <repository-url>
cd ContextType
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

**This will install:**
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `groq-sdk` - Groq LLM integration

**Expected output:**
```
added XX packages in Xs
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**This will install:**
- `react` - UI library
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `zustand` - State management
- `tailwindcss` - Styling framework

**Expected output:**
```
added XXX packages in XXs
```

---

## Environment Configuration

### Backend Environment Setup

**CRITICAL STEP**: The backend requires a Groq API key to function.

1. Navigate to the `backend/` directory:
```bash
cd backend
```

2. **Option A - Edit existing .env file:**
   - Open `backend/.env` in a text editor
   - Replace the API key with your own

3. **Option B - Create new .env file:**
   - Create a new file named `.env` in the `backend/` directory
   - Add the following content:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
PORT=3001

# Frontend URL for CORS (local testing)
FRONTEND_URL=http://localhost:5173
```

**IMPORTANT**:
- Replace `your_groq_api_key_here` with your actual Groq API key
- Get your key from: https://console.groq.com/keys
- The key format looks like: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Do not add quotes around the key
- Do not add spaces before or after the `=` sign

### Frontend Environment Setup

1. Navigate to the `frontend/` directory:
```bash
cd ../frontend
```

2. **Option A - Edit existing .env file:**
   - Open `frontend/.env` in a text editor
   - Verify the URLs are correct

3. **Option B - Create new .env file:**
   - Create a new file named `.env` in the `frontend/` directory
   - Add the following content:

```env
# Backend API URL (local testing)
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

**Note**: For local testing, always use `localhost`. If you need to test on mobile devices on the same network, replace `localhost` with your computer's IP address in both frontend and backend `.env` files.

---

## Running the Application

### IMPORTANT: You need TWO terminal windows running simultaneously

One terminal for the backend server, and one for the frontend application.

---

### Terminal 1: Start Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend directory:

```bash
cd backend
```

3. Start the backend server:

```bash
npm start
```

**Expected Output:**
```
✅ ContextType Backend Server
✅ Running on http://localhost:3001
✅ Groq API: Configured
✅ CORS: http://localhost:5173

📍 Endpoints:
   GET  /health
   POST /api/v1/suggestions
```

**If you see this error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```
See [Troubleshooting - Port Already in Use](#issue-1-port-already-in-use)

**⚠️ KEEP THIS TERMINAL WINDOW OPEN AND RUNNING**

---

### Terminal 2: Start Frontend Application

1. Open a **NEW** terminal/command prompt (keep the backend running)
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Start the frontend development server:

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**⚠️ KEEP THIS TERMINAL WINDOW OPEN AND RUNNING**

---

## Accessing the Application

Once both backend and frontend are running:

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to:** http://localhost:5173
3. You should see the ContextType keyboard interface

### Using the Application

1. **Select a context** by clicking one of the buttons at the top:
   - `CODE` - For programming/code
   - `EMAIL` - For email writing
   - `CHAT` - For casual conversation

2. **Start typing** in the text input area

3. **Suggestions will appear** below the input as you type

4. **Click a suggestion** to insert it into your text

5. **Performance metrics** are displayed on the right:
   - WPM (Words Per Minute)
   - Total Keystrokes
   - Characters Typed

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Cause:** Another process is using port 3001

**Solution (Windows):**
```bash
# Find the process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace <PID> with the actual process ID)
taskkill /F /PID <PID>
```

**Solution (Mac/Linux):**
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill -9
```

Then restart the backend: `npm start`

---

### Issue 2: Groq API Authentication Error

**Error in backend terminal:**
```
AuthenticationError: 401 Invalid API Key
```

**Cause:** Groq API key is missing, incorrect, or expired

**Solution:**
1. Check your `backend/.env` file
2. Verify the `GROQ_API_KEY` value is correct
3. Ensure there are no spaces or quotes around the key
4. Get a new key from https://console.groq.com/keys if needed
5. **Important**: Restart the backend server after updating `.env`

**To restart backend:**
- Press `Ctrl+C` in the backend terminal
- Run `npm start` again

---

### Issue 3: Frontend Cannot Connect to Backend

**Error in browser console:**
```
Error: Network Error
ERR_CONNECTION_REFUSED
```

**Cause:** Backend is not running or wrong URL configured

**Solution:**
1. **Verify backend is running:**
   - Check Terminal 1 shows: `✅ Running on http://localhost:3001`
   - If not, start it with `npm start`

2. **Check frontend .env file:**
   - Open `frontend/.env`
   - Verify: `VITE_API_URL=http://localhost:3001`
   - No trailing slash, no `/api/v1` path

3. **Restart frontend:**
   - Press `Ctrl+C` in frontend terminal
   - Run `npm run dev` again

---

### Issue 4: No Suggestions Appearing

**Symptoms:** You type but no suggestions show up

**Possible Causes & Solutions:**

**A. Backend not running**
- Check Terminal 1 - backend should be running
- Restart backend if needed: `npm start`

**B. API key not configured**
- Check backend terminal for errors
- Verify `backend/.env` has valid `GROQ_API_KEY`
- Restart backend after updating

**C. LLM model error**
- Check backend terminal for: "model_decommissioned" error
- The code should use `llama-3.3-70b-versatile` (latest model)
- If you see old model name, update `backend/services/groq.js`

**D. Gate rules blocking requests**
- Suggestions only appear after typing certain characters
- Try typing more text (5-10 characters minimum)
- Type a space after a word to trigger suggestions

---

### Issue 5: npm install Fails

**Error:** Various errors during `npm install`

**Solution:**

```bash
# Delete existing installations
rm -rf node_modules package-lock.json  # Mac/Linux
# OR on Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json

# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If still failing, try:
npm install --legacy-peer-deps
```

---

### Issue 6: Blank Screen in Browser

**Symptoms:** Browser shows blank page at http://localhost:5173

**Solution:**

1. **Open browser Developer Console:**
   - Press `F12` or right-click → "Inspect"
   - Check the "Console" tab for errors

2. **Check frontend terminal:**
   - Should show: `Local: http://localhost:5173/`
   - If you see errors, restart: `Ctrl+C` then `npm run dev`

3. **Hard refresh the page:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear cached images and files
   - Refresh the page

---

### Issue 7: Suggestions are Generic/Wrong

**Symptoms:** Getting suggestions like "const", "function", "the" instead of smart suggestions

**Cause:** Backend is using fallback suggestions (LLM not being called)

**Solution:**

1. **Check backend logs:**
   - Look for: `🤖 CALLING GROQ LLM...`
   - If not appearing, Groq API is not being called

2. **Verify API key is loading:**
   - Backend should show: `🔑 Initializing Groq client...`
   - Should show first 20 chars of your key
   - If shows `undefined`, API key not loaded correctly

3. **Restart backend:**
   - Ensure `.env` file is saved
   - Kill backend (`Ctrl+C`)
   - Start again (`npm start`)

---

### Issue 8: "Module not found" Errors

**Error:**
```
Error: Cannot find module 'express'
```

**Cause:** Dependencies not installed

**Solution:**

```bash
# In backend directory:
cd backend
npm install

# In frontend directory:
cd frontend
npm install
```

---

## Environment Variables Reference

### Backend `.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GROQ_API_KEY` | ✅ Yes | Groq API authentication key | `gsk_xxxxxxxxxxxxx` |
| `PORT` | ⚠️ Recommended | Backend server port | `3001` |
| `FRONTEND_URL` | ⚠️ Recommended | Frontend URL for CORS | `http://localhost:5173` |

### Frontend `.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API endpoint | `http://localhost:3001` |
| `VITE_WS_URL` | ❌ Optional | WebSocket endpoint | `ws://localhost:3001` |

---

## Quick Start Summary

**TL;DR - Fastest way to get running:**

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Configure backend .env
# Edit backend/.env and add your GROQ_API_KEY

# 3. Start backend (Terminal 1)
npm start
# Should show: ✅ Running on http://localhost:3001

# 4. Install frontend dependencies (Terminal 2 - NEW WINDOW)
cd ../frontend
npm install

# 5. Start frontend (same Terminal 2)
npm run dev
# Should show: ➜ Local: http://localhost:5173/

# 6. Open browser
# Navigate to: http://localhost:5173
```

**That's it!** 🎉

---

## Testing the Application

### Test 1: Basic Functionality

1. Open http://localhost:5173
2. Click `CODE` context
3. Type: `function hello`
4. Suggestions should appear below the input
5. Click a suggestion to insert it

### Test 2: Context Switching

1. Click `EMAIL` context
2. Type: `Dear Professor`
3. Note different suggestions for email context
4. Click `CHAT` context
5. Type: `hey how are`
6. Note casual/conversational suggestions

### Test 3: Backend Connection

1. Check backend terminal for:
   ```
   === SUGGESTION REQUEST ===
   Text: "your typed text"
   Context: code/email/chat
   ```

2. Should see:
   ```
   🤖 CALLING GROQ LLM...
   ✅ GROQ SUGGESTIONS:
   ```

3. If you see this, everything is working correctly!

---

## Stopping the Application

### Stop Frontend
- Go to Terminal 2 (frontend)
- Press `Ctrl+C`
- Confirm with `Y` if prompted

### Stop Backend
- Go to Terminal 1 (backend)
- Press `Ctrl+C`
- Confirm with `Y` if prompted

**Both services will stop immediately.**

---

## Additional Information

### API Rate Limits
- Groq API has rate limits based on your plan
- Free tier: Limited requests per minute
- Monitor your usage at: https://console.groq.com/usage
- Upgrade if you hit limits frequently

### Data Privacy
- All text input is sent to Groq API for suggestion generation
- No data is permanently stored on the backend server
- Text is only used for real-time suggestions
- See Groq's privacy policy: https://groq.com/privacy-policy/

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

### System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 500MB free space
- Internet: Required (for Groq API)

**Recommended:**
- CPU: 4+ cores
- RAM: 8GB+
- Internet: Stable broadband connection

---

## Advanced Configuration

### Running on Mobile Device (Same Network)

1. Find your computer's IP address:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" address (e.g., 192.168.1.100)
```

2. Update `frontend/.env`:
```env
VITE_API_URL=http://192.168.1.100:3001
```

3. Update `backend/.env`:
```env
FRONTEND_URL=http://192.168.1.100:5173
```

4. Restart both servers

5. On mobile browser, visit: `http://192.168.1.100:5173`

---

### Changing Ports

**To change backend port:**
1. Edit `backend/.env`: `PORT=3002`
2. Edit `frontend/.env`: `VITE_API_URL=http://localhost:3002`
3. Restart both servers

**To change frontend port:**
1. Edit `frontend/vite.config.ts`:
```typescript
server: {
  port: 5174
}
```
2. Edit `backend/.env`: `FRONTEND_URL=http://localhost:5174`
3. Restart both servers

---

## Project Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **TailwindCSS** - Styling framework

### Backend
- **Node.js 16+** - Runtime environment
- **Express 4** - Web server framework
- **Groq SDK** - LLM integration
- **dotenv** - Environment configuration

### LLM
- **Groq** - LLM provider
- **Model:** llama-3.3-70b-versatile
- **Purpose:** Context-aware text suggestions

---

## Useful Commands

### Check if ports are in use:
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Mac/Linux
lsof -ti:3001
lsof -ti:5173
```

### View backend logs in detail:
```bash
cd backend
npm start 2>&1 | tee backend.log
```

### View frontend build info:
```bash
cd frontend
npm run build
```

### Check Node.js and npm versions:
```bash
node --version
npm --version
```

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check browser console** (F12) for frontend errors
2. **Check backend terminal** for server errors
3. **Verify environment variables** are set correctly
4. **Ensure all dependencies are installed**
5. **Try restarting both backend and frontend**
6. **Check Groq API status:** https://status.groq.com/

---

## Next Steps

After successfully running the application:

1. ✅ Test different contexts (Code, Email, Chat)
2. ✅ Observe how suggestions change based on context
3. ✅ Monitor performance metrics (WPM, Keystrokes)
4. ✅ Check backend logs to see LLM calls
5. ✅ Review the code structure to understand the implementation

---

**Last Updated:** December 2025

**Version:** 1.0.0

**Project:** ContextType - Adaptive Keyboard with LLM-based Suggestions
