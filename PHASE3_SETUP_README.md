# Phase 3 Setup Guide
## Groq-Powered Adaptive Suggestion Strip

**Status:** ✅ **READY TO TEST**
**Date:** December 2, 2025

This guide will help you set up and test Phase 3 features of ContextType.

---

## 🎯 What's New in Phase 3

Phase 3 adds **intelligent, context-aware suggestions** powered by Groq LLM:

✅ **Suggestion Strip** - 3-5 smart suggestions above the keyboard
✅ **Context-Aware** - Different suggestions for code/email/chat contexts
✅ **Smart Triggers** - Suggestions appear on pause (500ms) or after space/punctuation
✅ **Swipe-to-Accept** - Swipe up on a suggestion for quick insertion
✅ **Groq Integration** - Powered by Llama 3.1 8B Instant model

---

## 📋 Prerequisites

Before starting, you need:

1. **Node.js** installed (v16 or higher)
2. **Groq API Key** - Get one from [https://console.groq.com](https://console.groq.com)
   - Sign up for free
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (starts with `gsk_...`)

---

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected output:**
```
added 117 packages in 4s
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Groq API key:

```env
# Groq API Configuration
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# Server Configuration
PORT=3001

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

**IMPORTANT:** Replace `gsk_your_actual_groq_api_key_here` with your actual Groq API key!

### Step 3: Configure Frontend (Optional)

If your backend runs on a different port, create `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001
```

### Step 4: Start the Backend Server

In a **new terminal window**:

```bash
cd backend
npm start
```

**Expected output:**
```
🚀 ContextType Backend Server
📡 Running on http://localhost:3001
🔑 Groq API: ✅ Configured
🌐 CORS: http://localhost:5173

📍 Endpoints:
   GET  /health
   POST /api/v1/suggestions
```

✅ **Verify:** The backend should show "🔑 Groq API: ✅ Configured"

### Step 5: Start the Frontend (Already Running)

The frontend should already be running on `http://localhost:5173`. If not:

```bash
cd frontend
npm run dev
```

### Step 6: Test the Setup

Open your browser to `http://localhost:5173` and test:

**Test 1: Health Check**
- Open `http://localhost:3001/health` in a new tab
- Should see: `{"status":"ok","groq_api_configured":true}`

**Test 2: Suggestions**
- In the ContextType app, start typing in the text input
- Wait 500ms or press space
- ✅ Suggestion strip should appear above the keyboard

---

## 🧪 Testing Phase 3 Features

### Test 1: Context-Aware Suggestions (Code)

1. Switch to **Code** context (blue theme)
2. Type: `const user`
3. Wait 500ms or press space
4. ✅ **Expected:** Suggestions like `function`, `return`, `const`, `if` appear
5. Tap a suggestion → it should be inserted

### Test 2: Context-Aware Suggestions (Email)

1. Switch to **Email** context (gray theme)
2. Type: `Dear John, I hope this email`
3. Wait for suggestions
4. ✅ **Expected:** Professional phrases like `finds you well`, `regards,` appear
5. Tap a suggestion → it should be inserted

### Test 3: Context-Aware Suggestions (Chat)

1. Switch to **Chat** context (purple theme)
2. Type: `Hey! I'm heading to the`
3. Wait for suggestions
4. ✅ **Expected:** Casual words like `store`, `park`, `beach`, emojis appear

### Test 4: Swipe-to-Accept Gesture

1. Type partial text
2. Wait for suggestions to appear
3. **Press and drag UP** on a suggestion chip
4. ✅ **Expected:** Suggestion lifts up and is inserted quickly

### Test 5: Trigger on Punctuation

1. Type: `Hello world`
2. Press `.` (period)
3. ✅ **Expected:** Suggestions appear **immediately** (no 500ms wait)

### Test 6: Loading State

1. Type quickly: `abcdefgh`
2. ✅ **Expected:** While fetching, shows "Loading suggestions..." spinner

### Test 7: Fallback Mode (No API Key)

1. Stop the backend server (Ctrl+C)
2. Type in the app
3. ✅ **Expected:** Fallback suggestions appear (hardcoded defaults)

---

## 🎨 UI Elements

### Suggestion Strip Layout

```
┌────────────────────────────────────────────────┐
│ 💡 Suggestions  Tap/Swipe up   CODE           │ ← Header
├────────────────────────────────────────────────┤
│ [function] [return] [const] [if] [for] ⟩      │ ← Chips
└────────────────────────────────────────────────┘
```

**Features:**
- **Blue chips** for code context
- **Gray chips** for email context
- **Purple chips** for chat context
- **Green dot** on high-confidence suggestions (≥80%)
- **Horizontal scroll** if more than 3 suggestions
- **Tap** to insert
- **Swipe up** for quick insert

---

## 🔧 Troubleshooting

### Problem: "Groq API: ❌ Not configured"

**Solution:**
1. Check that `backend/.env` file exists
2. Verify `GROQ_API_KEY` is set correctly
3. Restart the backend server

### Problem: No suggestions appearing

**Check:**
1. Backend server is running on port 3001
2. Open browser console (F12) → Check for network errors
3. Verify API call to `http://localhost:3001/api/v1/suggestions`

**Fix:**
- If CORS error → Check `FRONTEND_URL` in backend `.env`
- If 404 error → Backend not running
- If 500 error → Check Groq API key is valid

### Problem: "Loading suggestions..." never finishes

**Solutions:**
1. Check backend terminal for errors
2. Verify Groq API key is valid
3. Check network connection
4. Fallback suggestions should appear if API fails

### Problem: Suggestions are generic/not context-aware

**This is expected if:**
- Using fallback mode (backend offline)
- Groq API key not configured
- Network issues

**Fix:** Configure Groq API key and restart backend

---

## 📊 API Usage & Limits

### Groq Free Tier Limits

- **Requests:** 30 requests/minute
- **Tokens:** 6000 tokens/minute
- **Model:** llama-3.1-8b-instant

### Our Implementation

- **Debouncing:** 500ms (reduces API calls)
- **Caching:** 50 most recent queries cached
- **Trigger optimization:** Only on pause or space/punctuation
- **Fallback:** Hardcoded suggestions when API unavailable

**Estimated usage:** ~5-10 API calls per minute during active typing

---

## 🎯 What Works

✅ **Suggestion Strip UI** - Displays above keyboard
✅ **Context Detection** - Different prompts for code/email/chat
✅ **Smart Triggers** - Pause (500ms) and space/punctuation
✅ **Groq Integration** - Real LLM-powered suggestions
✅ **Swipe Gesture** - Swipe up to accept
✅ **Loading States** - Spinner while fetching
✅ **Fallback Mode** - Works offline with defaults
✅ **Caching** - Avoids duplicate API calls
✅ **Compact Mode** - Suggestions hidden in compact mode

---

## 🔜 Known Limitations

1. **Cursor Position:** Suggestions always append to end of text (no cursor position support yet)
2. **Multi-word Suggestions:** Currently single words/phrases only
3. **Personalization:** No user-specific learning yet (future Phase 4-5)
4. **Rate Limiting:** No client-side rate limit warnings

---

## 📁 Project Structure

```
backend/
├── package.json          # Dependencies
├── server.js             # Express server
├── .env                  # Environment variables (YOU CREATE THIS)
├── .env.example          # Template
├── routes/
│   └── suggestions.js    # Suggestions endpoint
└── services/
    └── groq.js           # Groq API integration

frontend/
├── src/
│   ├── components/
│   │   └── SuggestionStrip.tsx      # UI component
│   ├── hooks/
│   │   └── useSuggestions.ts        # Fetching logic
│   └── services/
│       └── suggestionService.ts     # API client
├── .env                  # Frontend config (optional)
└── .env.example          # Template
```

---

## 🎓 How It Works

### 1. Trigger Logic

```typescript
// User types: "const user"
// → Wait 500ms
// → If no new input, fetch suggestions

// User types: "Hello " (space)
// → Fetch suggestions immediately
```

### 2. API Flow

```
Frontend (useSuggestions hook)
    ↓
    POST /api/v1/suggestions
    {text: "const user", context: "code"}
    ↓
Backend (Groq service)
    ↓
    Groq API (llama-3.1-8b-instant)
    ↓
    Response: ["function", "return", "const"]
    ↓
Frontend (SuggestionStrip)
    → Display chips
```

### 3. System Prompts

**Code Context:**
```
You are a code completion assistant. Given the user's partial code,
suggest the next likely keywords, function names, or code patterns.
Return ONLY a JSON array of 3-5 short suggestions.
```

**Email Context:**
```
You are an email writing assistant. Given the user's partial email,
suggest professional next words or phrases. Return ONLY a JSON array.
```

**Chat Context:**
```
You are a casual chat assistant. Given the user's partial message,
suggest next words or casual phrases. Return ONLY a JSON array.
```

---

## 🚀 Ready to Test!

Everything is set up! Follow the testing instructions above to verify Phase 3 works.

**Quick Start:**
1. Ensure backend is running with Groq API key configured
2. Open `http://localhost:5173`
3. Start typing → suggestions appear!

**Questions?** Check troubleshooting section or the implementation files.

---

**Next:** Phase 4 will add Templates & Snippets!
