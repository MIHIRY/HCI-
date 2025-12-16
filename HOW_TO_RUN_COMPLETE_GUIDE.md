# ContextType: Complete Setup & Testing Guide
**How to Run Everything (Phases 1-3)**

This guide will help you set up and test all implemented features of the ContextType adaptive keyboard system.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Testing Phase 1 Features](#testing-phase-1-features)
5. [Testing Phase 2 Features](#testing-phase-2-features)
6. [Testing Phase 3 Features](#testing-phase-3-features)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Web Browser** - Chrome, Firefox, or Edge
- **Text Editor** (optional) - VS Code recommended

### Optional (for Phase 3 AI features)
- **Groq API Key** - Free account at [console.groq.com](https://console.groq.com)

### Check Your Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## Quick Start (5 Minutes)

### Step 1: Open Terminal
Navigate to your project directory:
```bash
cd "D:\Stony Brook\HCI\Project"
```

### Step 2: Start Frontend
```bash
# Terminal 1
cd frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open Browser
Open: **http://localhost:5173**

You should see the ContextType adaptive keyboard!

### Step 4: (Optional) Start Backend for AI Suggestions
```bash
# Terminal 2
cd backend
npm install
npm start
```

---

## Detailed Setup

### 1. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

This installs:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- All other dependencies

#### Environment Configuration
Create `frontend/.env`:
```bash
# Copy the example file
cp .env.example .env
```

**frontend/.env contents:**
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:3001
```

#### Start Development Server
```bash
npm run dev
```

**Frontend runs on:** http://localhost:5173

---

### 2. Backend Setup (For Phase 3 AI Features)

#### Install Dependencies
```bash
cd backend
npm install
```

This installs:
- Express.js
- Groq SDK
- CORS
- dotenv

#### Get Groq API Key

1. **Visit:** [https://console.groq.com](https://console.groq.com)
2. **Sign up** for free account
3. **Create API Key:**
   - Go to "API Keys" section
   - Click "Create API Key"
   - Copy the key (starts with `gsk_...`)

#### Environment Configuration
Create `backend/.env`:
```bash
# Copy the example file
cp .env.example .env
```

**backend/.env contents:**
```env
# Groq Configuration
GROQ_API_KEY=gsk_your_actual_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

**⚠️ IMPORTANT:** Replace `gsk_your_actual_api_key_here` with your real Groq API key!

#### Start Backend Server
```bash
npm start
```

**Expected output:**
```
🚀 ContextType Backend Server
📡 Running on http://localhost:3001
🔑 Groq API: ✅ Configured
📝 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

**Backend runs on:** http://localhost:3001

---

## Testing Phase 1 Features
**Mobile-First Layout Foundation**

### Setup for Mobile Testing
1. Open **http://localhost:5173** in your browser
2. Press **F12** to open DevTools
3. Press **Ctrl+Shift+M** (Windows) or **Cmd+Shift+M** (Mac) for mobile view
4. Select device: **iPhone 12 Pro** (390px width)

### Test 1: Responsive Grid System
**What to check:**
- ✅ Keyboard shows 10 columns (portrait mode)
- ✅ Keys are uniform size
- ✅ 4px gaps between keys
- ✅ Keys are not too small (<48px) or too large (>90px)

**How to test:**
1. Look at the keyboard layout
2. Check footer info shows: "10 cols | 35px keys"
3. Rotate to landscape (click rotate icon in DevTools)
4. Should change to 12 columns

### Test 2: Viewport Detection
**What to check:**
- ✅ Auto-detects mobile/tablet/desktop
- ✅ Shows correct column count
- ✅ Keys resize based on viewport

**How to test:**
1. Start with iPhone 12 Pro (390px)
2. Switch to iPad Pro (1024px) - should show 12 columns
3. Switch to Responsive mode and drag width
4. Watch column count and key sizes change

### Test 3: Min/Max Key Constraints
**What to check:**
- ✅ Keys never smaller than 48px (accessibility)
- ✅ Keys never larger than 90px (visual balance)

**How to test:**
1. Set viewport to very small (320px)
2. Keys should stay at least 48px
3. Set viewport to very large (1920px)
4. Keys should max out at 90px

### Test 4: Fitts' Law Personalization
**What to check:**
- ✅ Frequently used keys grow slightly
- ✅ Max boost is 15%
- ✅ Grid positioning maintained

**How to test:**
1. Type a sentence with lots of 'e' and 'a'
2. Example: "the cat ate the tasty meat"
3. Watch 'e', 'a', 't' keys grow slightly
4. Check footer shows boost percentage
5. Keys should stay in their grid positions

---

## Testing Phase 2 Features
**Mobile UX & Gestures**

### Test 1: Compact Mode Toggle
**What to check:**
- ✅ Toggle button in keyboard header
- ✅ Hides sidebar and advanced UI
- ✅ Shows only keyboard rows

**How to test:**
1. Look for **"☰ Compact"** button at top of keyboard
2. Click it
3. ✅ Left sidebar disappears
4. ✅ Footer info hidden
5. ✅ Metrics display hidden
6. ✅ Only keyboard and text input visible
7. Click **"⊞ Full"** to restore
8. ✅ Everything comes back

### Test 2: Long-Press Alternate Characters
**What to check:**
- ✅ Hold key for 300ms shows popup
- ✅ Popup appears above key
- ✅ Tap alternate inserts it

**How to test:**

**Test 2a: Punctuation alternates**
1. **Hold** the `.` key (don't release, hold for 1 second)
2. ✅ Popup appears showing: `... , ? !`
3. Tap `...` in the popup
4. ✅ Three dots appear in text input

**Test 2b: Letter alternates**
1. **Hold** the `e` key
2. ✅ Popup shows: `è é ê ë € ē ė ę`
3. Tap `é`
4. ✅ Accented 'e' appears in text

**Test 2c: Number alternates**
1. Switch to number mode (123 button)
2. **Hold** the `1` key
3. ✅ Popup shows: `¹ ₁ ① ½ ⅓ ¼`
4. Tap `½`
5. ✅ Fraction appears

**Other keys to try:**
- `a` → `à á â ä æ ã å ā`
- `$` → `€ £ ¥ ¢ ₹ ₽`
- `o` → `ò ó ô ö œ õ ø ō`

**Visual indicator:**
- Look for `···` in bottom-right corner of keys with alternates

### Test 3: Swipe Backspace to Delete Word
**What to check:**
- ✅ Swipe left on backspace deletes word
- ✅ Red visual feedback
- ✅ Deletes back to previous space

**How to test:**
1. Type: `"Hello world testing"`
2. **Press and drag LEFT** on the backspace (⌫) key
3. ✅ Key turns RED
4. ✅ Shows "⌫ Word" text
5. ✅ "testing" is deleted → `"Hello world "`
6. Swipe backspace again
7. ✅ "world " is deleted → `"Hello "`

**Note:** You need to swipe at least 30px to trigger word deletion

### Test 4: Long-Press Space for Cursor Movement
**What to check:**
- ✅ Hold space bar activates cursor mode
- ✅ Purple visual feedback
- ✅ Shows cursor delta

**How to test:**
1. Type some text: `"The quick brown fox"`
2. **Hold** the space bar for 1 second
3. ✅ Space bar turns PURPLE
4. ✅ Shows "Move Cursor"
5. While holding, **drag LEFT**
6. ✅ Shows `← 3` (or similar number)
7. **Drag RIGHT**
8. ✅ Shows `5 →` (or similar number)
9. Release
10. ✅ Space bar returns to gray

**Note:** This currently shows visual feedback only. Actual cursor movement requires text input refactoring.

---

## Testing Phase 3 Features
**Groq-Powered AI Suggestions**

### Prerequisites
- ✅ Backend server running (see Detailed Setup above)
- ✅ Groq API key configured in backend/.env
- ✅ Frontend connected to backend

### Test 1: Suggestion Strip UI
**What to check:**
- ✅ Suggestion chips appear between input and keyboard
- ✅ Horizontal scrollable layout
- ✅ Context-based colors

**How to test:**
1. Ensure backend is running (check Terminal 2)
2. Open frontend: http://localhost:5173
3. Look for suggestion strip between text input and keyboard
4. Should show 3-5 suggestion chips

### Test 2: Context-Aware Suggestions

**Test 2a: Code Context**
1. Type: `const user`
2. Wait 500ms (or press space)
3. ✅ Loading spinner appears
4. ✅ Suggestions appear: `function`, `const`, `return`, etc.
5. ✅ Chips are BLUE (code context)
6. Click a suggestion
7. ✅ Suggestion is inserted at end of text

**Test 2b: Email Context**
1. Clear text input
2. Type: `Dear John, I hope`
3. Wait 500ms
4. ✅ Suggestions appear: `this`, `you`, `finds`, `regards`
5. ✅ Chips are GRAY (email context)
6. Click a suggestion
7. ✅ Text is appended

**Test 2c: Chat Context**
1. Clear text input
2. Type: `Hey! I'm going to`
3. Wait 500ms
4. ✅ Suggestions appear: `the`, `go`, `be`, etc.
5. ✅ Chips are PURPLE (chat context)

### Test 3: Trigger Logic

**Test 3a: Pause trigger (500ms)**
1. Type slowly: `Hello wor`
2. Stop typing for 1 second
3. ✅ Loading spinner appears
4. ✅ Suggestions fetch automatically

**Test 3b: Space trigger (immediate)**
1. Type: `Hello` + press space
2. ✅ Suggestions appear immediately
3. No 500ms wait needed

**Test 3c: Punctuation trigger**
1. Type: `Hi there`+ press `.`
2. ✅ Suggestions appear immediately

### Test 4: Swipe-to-Accept Gesture
**What to check:**
- ✅ Swipe UP on suggestion chip inserts it

**How to test:**
1. Wait for suggestions to appear
2. **Press and drag UP** on a suggestion chip
3. ✅ Suggestion is inserted into text
4. Alternative: Just tap the chip (easier)

### Test 5: Confidence Indicators
**What to check:**
- ✅ High-confidence suggestions show green dot
- ✅ Dot appears for ≥80% confidence

**How to test:**
1. Type common phrases
2. Look for small green dots on suggestion chips
3. These indicate AI is very confident

### Test 6: Fallback Mode (Without Backend)
**What to check:**
- ✅ Hardcoded suggestions when backend offline
- ✅ No errors in console

**How to test:**
1. Stop the backend server (Ctrl+C in Terminal 2)
2. Type in the frontend
3. ✅ Still shows basic suggestions
4. ✅ Console shows: "Using fallback suggestions"
5. Restart backend to re-enable AI

---

## Testing Context Detection

### Manual Context Switching
1. Look for **context indicator** in the UI
2. Type different content to see context change:

**Code Context (Blue):**
```javascript
function calculateTotal(items) {
  const sum = items.reduce((a, b) => a + b);
  return sum;
}
```

**Email Context (Gray):**
```
Dear Professor Smith,

I hope this email finds you well. I wanted to follow up on our previous discussion regarding the research project.

Best regards,
```

**Chat Context (Purple):**
```
Hey! What's up? 😊
Are you free tonight? Let's grab dinner!
```

### Visual Indicators
- **Top-left badge:** Shows current context (CODE/EMAIL/CHAT)
- **Keyboard color theme:** Blue/Gray/Purple
- **Suggestion chip colors:** Match context

---

## Complete Testing Checklist

### Phase 1: Layout ✅
- [ ] Keyboard shows 10 columns on mobile
- [ ] Keys are between 48-90px
- [ ] Responsive to viewport changes
- [ ] Footer shows column count and key size
- [ ] Frequently-used keys grow slightly (max 15%)

### Phase 2: Gestures ✅
- [ ] Compact mode toggle works
- [ ] Long-press `.` shows alternates
- [ ] Long-press `e` shows accents
- [ ] Swipe left on backspace deletes word
- [ ] Long-press space shows cursor mode
- [ ] All gestures work on touch and mouse

### Phase 3: AI Suggestions ✅
- [ ] Backend server starts successfully
- [ ] Suggestions appear after typing
- [ ] Context-aware colors (blue/gray/purple)
- [ ] Tap suggestion inserts text
- [ ] Space/punctuation triggers immediately
- [ ] Fallback works when backend offline
- [ ] Loading spinner shows while fetching

---

## Troubleshooting

### Frontend Issues

**Problem:** `npm run dev` fails
```bash
# Solution 1: Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Problem:** Port 5173 already in use
```bash
# Solution: Change port
npm run dev -- --port 5174
# Then open http://localhost:5174
```

**Problem:** Blank white screen
- Check browser console (F12) for errors
- Verify Node.js version: `node --version` (need 18+)
- Try: `npm run build` to check for compile errors

### Backend Issues

**Problem:** `npm start` fails
```bash
# Solution: Check Node.js version
node --version  # Must be 18+

# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

**Problem:** "Groq API: ❌ Not Configured"
- Check `backend/.env` exists
- Verify `GROQ_API_KEY=gsk_...` is set
- Make sure no spaces around `=`
- Restart backend after editing .env

**Problem:** Port 3001 already in use
```bash
# Find process using port (Windows)
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Find process using port (Mac/Linux)
lsof -ti:3001
kill -9 <process_id>
```

### Suggestion Issues

**Problem:** No suggestions appear
- ✅ Backend running? Check http://localhost:3001
- ✅ API key configured in backend/.env?
- ✅ Frontend .env has correct VITE_API_URL?
- ✅ Check browser console for errors (F12)

**Problem:** Suggestions but no context colors
- Context detection requires typing full sentences
- Try typing more text (10+ words)
- Check context badge in top-left

**Problem:** Slow suggestions
- Groq free tier may have rate limits
- Check backend console for errors
- Try typing slower to reduce API calls

### Mobile Testing Issues

**Problem:** Gestures don't work
- Make sure DevTools mobile emulation is ON
- Some gestures need actual touch (test on real phone)
- Try using mouse click-and-drag as fallback

**Problem:** Keys too small on mobile
- Check viewport width (should be 320-428px for phones)
- Keys should auto-scale to 48-90px range
- Verify footer shows correct column count

### General Tips

**Clear browser cache:**
```bash
# Chrome DevTools
F12 → Right-click refresh button → Empty Cache and Hard Reload
```

**Check both terminals:**
- Terminal 1: Frontend (http://localhost:5173)
- Terminal 2: Backend (http://localhost:3001)

**Environment variables not loading:**
- File must be named exactly `.env` (not `.env.txt`)
- Restart servers after editing .env files
- Use `cp .env.example .env` to create from template

---

## Performance Tips

### Optimal Testing Setup
1. **Use Chrome DevTools** for best mobile emulation
2. **Clear console** between tests (Ctrl+L)
3. **Monitor Network tab** to see API calls
4. **Use Redux DevTools** (if installed) to see state changes

### Reduce API Costs
- Suggestion fetching is debounced (500ms)
- Cached for duplicate queries (50 max)
- Groq free tier: 30 requests/minute (plenty for testing)

---

## Quick Reference

### URLs
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/v1/suggestions (POST)

### Keyboard Shortcuts
- **F12** - Open DevTools
- **Ctrl+Shift+M** - Toggle mobile view
- **Ctrl+Shift+C** - Element inspector
- **Ctrl+R** - Reload page
- **Ctrl+Shift+R** - Hard reload (clear cache)

### File Locations
```
Project/
├── frontend/
│   ├── .env                    ← Frontend config
│   ├── src/components/
│   │   ├── MobileKeyboard.tsx  ← Main keyboard
│   │   ├── SuggestionStrip.tsx ← AI suggestions
│   │   └── AlternateKeysPopup.tsx ← Long-press menu
│   └── src/hooks/
│       ├── useMobileDetection.ts
│       ├── useLongPress.ts
│       └── useSuggestions.ts
├── backend/
│   ├── .env                    ← Backend config (API key!)
│   ├── server.js               ← Express server
│   └── services/groq.js        ← AI integration
└── HOW_TO_RUN_COMPLETE_GUIDE.md ← This file!
```

---

## Next Steps

After testing all features:

1. **Phase 4: Templates & Snippets** (planned)
   - Email templates
   - Code snippets
   - Quick replies

2. **Phase 5: Smart Assistance** (planned)
   - Tone improvement
   - Grammar fixes
   - Intelligent rewrites

---

## Need Help?

### Common Questions

**Q: Do I need the backend to test Phases 1 & 2?**
A: No! Phases 1 and 2 work with frontend only. Backend is only for Phase 3 AI suggestions.

**Q: Is Groq API key required?**
A: No, but without it you only get fallback suggestions (not AI-powered).

**Q: Can I test on a real phone?**
A: Yes! Make sure phone is on same WiFi, then visit http://<your-ip>:5173

**Q: Where do I get my IP address?**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

**Q: How much does Groq cost?**
A: Free tier includes 30 requests/minute, which is plenty for testing.

---

## Success Criteria

You've successfully set everything up when:

✅ Frontend loads at http://localhost:5173
✅ Keyboard is visible and responsive
✅ Typing works in text input
✅ Mobile view shows 10-column grid
✅ Compact mode toggle works
✅ Long-press shows alternate characters
✅ Swipe backspace deletes words
✅ Backend shows "✅ Configured" (if running)
✅ Suggestions appear when typing (if backend running)

---

**Happy Testing! 🚀**

If you encounter any issues not covered here, check the browser console (F12) for error messages.
