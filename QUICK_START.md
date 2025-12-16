# ContextType - Quick Start Guide

## Fastest Way to Get Started (3 Steps)

### Step 1: Start Frontend
**Double-click:** `start-frontend.bat`

OR run in terminal:
```bash
cd frontend
npm install
npm run dev
```

**Open:** http://localhost:5173

You can now test Phases 1 & 2 features! ✅

---

### Step 2 (Optional): Get Groq API Key
Only needed for Phase 3 AI suggestions.

1. Visit: https://console.groq.com
2. Sign up (free)
3. Create API Key
4. Copy the key (starts with `gsk_...`)

---

### Step 3 (Optional): Start Backend
**Double-click:** `start-backend.bat`

OR run in terminal:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your Groq API key
npm start
```

**Backend runs on:** http://localhost:3001

Now you can test Phase 3 AI suggestions! ✅

---

## What Can I Test?

### With Frontend Only (Phases 1 & 2):
✅ Responsive mobile keyboard
✅ Compact mode toggle
✅ Long-press for alternate characters
✅ Swipe backspace to delete word
✅ Long-press space for cursor mode
✅ Fitts' Law key resizing

### With Frontend + Backend (Phase 3):
✅ All of the above, PLUS:
✅ AI-powered suggestions
✅ Context-aware predictions (code/email/chat)
✅ Real-time suggestion updates

---

## Full Testing Guide
See: **HOW_TO_RUN_COMPLETE_GUIDE.md**

---

## Troubleshooting

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend won't start?**
- Check if .env file exists in backend folder
- Make sure Groq API key is added to .env
- Verify Node.js version: `node --version` (need 18+)

**Port already in use?**
- Frontend: Change port with `npm run dev -- --port 5174`
- Backend: Change PORT in backend/.env

---

## Success!

✅ **Frontend running:** http://localhost:5173
✅ **Backend running:** http://localhost:3001 (optional)
✅ **Keyboard visible:** You should see the adaptive keyboard
✅ **Type to test:** Start typing and watch the magic happen!

---

For detailed testing instructions, see **HOW_TO_RUN_COMPLETE_GUIDE.md**
