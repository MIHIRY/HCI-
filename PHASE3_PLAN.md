# Phase 3 Implementation Plan
## Groq-Powered Adaptive Suggestion Strip

**Status:** 🚀 **STARTING**
**Date:** December 2, 2025
**Based on:** ContextType_5_Phases.md

---

## 🎯 Phase 3 Goals

Add **intelligent, context-aware suggestions** powered by Groq LLM:
1. Suggestion strip UI component above keyboard
2. Backend API integration with Groq
3. Smart trigger logic (pause, space, punctuation)
4. Swipe-to-accept gesture for quick insertion
5. Context-aware suggestions (code/email/chat)

---

## 📋 Features to Implement

### 1. SuggestionStrip UI Component
**What:** Horizontal strip above keyboard showing 3-5 suggestions

**Implementation:**
- Position: Fixed above keyboard, below text input
- Layout: Horizontal scrollable strip
- Each suggestion: Chip/pill style button
- Tap to insert at cursor
- Swipe up on suggestion for quick insert
- Visual: Different colors for different contexts

**UI/UX:**
```
┌─────────────────────────────────────────┐
│  [function]  [return]  [const]  [if] ⟩  │ ← Suggestion strip
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  q  w  e  r  t  y  u  i  o  p          │ ← Keyboard
│  a  s  d  f  g  h  j  k  l             │
│  z  x  c  v  b  n  m                   │
└─────────────────────────────────────────┘
```

---

### 2. Backend API Integration
**Endpoint:** `POST /api/v1/suggestions`

**Request:**
```json
{
  "text": "const user",
  "context": "code",
  "cursor_position": 10,
  "max_suggestions": 5
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "text": "function",
      "confidence": 0.92,
      "type": "keyword"
    },
    {
      "text": "return",
      "confidence": 0.87,
      "type": "keyword"
    },
    {
      "text": "const",
      "confidence": 0.78,
      "type": "keyword"
    }
  ]
}
```

**Groq Integration:**
- Use Groq Chat Completions API
- Model: `llama-3.1-8b-instant` (fast, efficient)
- System prompt varies by context
- Temperature: 0.3 (more focused)
- Max tokens: 50

---

### 3. Trigger Logic
**When to fetch suggestions:**

**Option A: On Pause (500-800ms)**
- User stops typing for 500-800ms
- Debounce to avoid too many API calls
- Cancel previous requests if user continues typing

**Option B: On Space/Punctuation**
- After space, period, comma, semicolon
- Immediate feedback
- Useful for next-word prediction

**Option C: Hybrid (RECOMMENDED)**
- Space/punctuation triggers immediately
- Pause triggers after 500ms
- Smart caching to avoid duplicate requests

**Implementation:**
```typescript
// Debounced suggestion fetching
const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

// On keystroke
useEffect(() => {
  if (shouldTrigger(lastKey)) {
    fetchSuggestions(); // Immediate
  } else {
    debouncedFetchSuggestions(); // Debounced
  }
}, [inputText]);
```

---

### 4. Swipe-to-Accept Gesture
**What:** Swipe up on a suggestion to quickly insert it

**Implementation:**
- Detect vertical swipe on suggestion chip
- Threshold: 20px upward
- Visual feedback: Chip lifts/highlights
- Insert suggestion at cursor position
- Close suggestion strip

---

### 5. Context-Aware Prompts
**Code Context:**
```
System: You are a code completion assistant. Given the user's partial code, suggest the next likely keywords, function names, or code patterns. Return only a JSON array of 3-5 suggestions.

User: const user
```

**Email Context:**
```
System: You are an email writing assistant. Given the user's partial email, suggest professional next words or phrases. Return only a JSON array of 3-5 suggestions.

User: Dear John, I hope this email finds you
```

**Chat Context:**
```
System: You are a casual chat assistant. Given the user's partial message, suggest next words or casual phrases. Return only a JSON array of 3-5 suggestions.

User: Hey! I'm heading to the
```

---

## 🛠️ Implementation Steps

### Step 1: Setup Backend API (45 min)
- [ ] Create `backend/` directory structure
- [ ] Setup Express.js server
- [ ] Add Groq SDK dependency
- [ ] Create `/api/v1/suggestions` endpoint
- [ ] Implement context-specific prompts
- [ ] Add error handling and rate limiting

### Step 2: Create SuggestionStrip Component (30 min)
- [ ] Create `SuggestionStrip.tsx` component
- [ ] Horizontal scrollable layout
- [ ] Chip/pill style for suggestions
- [ ] Tap to insert handler
- [ ] Context-based styling (code=blue, email=gray, chat=purple)

### Step 3: Add Trigger Logic (30 min)
- [ ] Create `useSuggestions` hook
- [ ] Implement debounce logic (500ms)
- [ ] Detect space/punctuation triggers
- [ ] Handle API requests and caching
- [ ] Loading state management

### Step 4: Integrate with Keyboard (20 min)
- [ ] Add SuggestionStrip above keyboard in App.tsx
- [ ] Connect to input text state
- [ ] Handle suggestion insertion
- [ ] Update cursor position after insert

### Step 5: Swipe-to-Accept Gesture (30 min)
- [ ] Add swipe detection to suggestion chips
- [ ] Visual feedback on swipe
- [ ] Quick insert on swipe up
- [ ] Smooth animation

### Step 6: Groq API Integration (30 min)
- [ ] Get Groq API key from user
- [ ] Configure environment variables
- [ ] Test API calls with different contexts
- [ ] Handle rate limits and errors
- [ ] Add fallback for offline mode

### Step 7: Testing & Polish (30 min)
- [ ] Test in all 3 contexts (code, email, chat)
- [ ] Test trigger logic (pause, space, punctuation)
- [ ] Test swipe gesture
- [ ] Performance optimization
- [ ] Error handling

**Total Estimated Time:** 3-4 hours

---

## 📊 Acceptance Criteria

### Suggestion Strip:
- ✅ Shows 3-5 suggestions above keyboard
- ✅ Horizontal scrollable layout
- ✅ Tap suggestion → inserts at cursor
- ✅ Context-based styling (different colors)
- ✅ Loading indicator while fetching

### API Integration:
- ✅ POST request to `/api/v1/suggestions`
- ✅ Sends: text, context, cursor position
- ✅ Receives: array of suggestions with confidence
- ✅ Groq API integration working
- ✅ Error handling for API failures

### Trigger Logic:
- ✅ Suggestions appear after 500ms pause
- ✅ Immediate suggestions on space/punctuation
- ✅ Debounced to avoid excessive API calls
- ✅ Previous requests canceled on new input
- ✅ Caching for duplicate requests

### Swipe Gesture:
- ✅ Swipe up on chip → quick insert
- ✅ Visual feedback during swipe
- ✅ Smooth animation
- ✅ Works on touch and mouse

### Context Awareness:
- ✅ Code: Suggests keywords, function names
- ✅ Email: Suggests professional phrases
- ✅ Chat: Suggests casual words/emojis
- ✅ Different prompts for each context

---

## 🎨 UI Mockups

### Suggestion Strip (Code Context):
```
┌───────────────────────────────────────────────┐
│ 💡 Loading suggestions...                    │
└───────────────────────────────────────────────┘

↓ (after loading)

┌───────────────────────────────────────────────┐
│ [function] [return] [const] [if] [for] ⟩     │
└───────────────────────────────────────────────┘
  Blue chips for code context
```

### Suggestion Strip (Email Context):
```
┌───────────────────────────────────────────────┐
│ [well,] [you] [find] [Best regards,] ⟩       │
└───────────────────────────────────────────────┘
  Gray chips for email context
```

### Suggestion Strip (Chat Context):
```
┌───────────────────────────────────────────────┐
│ [store] [park] [beach] [😊] [!] ⟩            │
└───────────────────────────────────────────────┘
  Purple chips for chat context
```

### Swipe Gesture:
```
     ┌──────────┐
     │ function │ ← Swipe up
     └──────────┘
         ↑
     (lifts and highlights)
```

---

## 📁 Files to Create/Modify

### New Files (Backend):
1. `backend/package.json` - Node.js dependencies
2. `backend/server.js` - Express server
3. `backend/routes/suggestions.js` - Suggestions endpoint
4. `backend/services/groq.js` - Groq API integration
5. `backend/.env` - Environment variables (GROQ_API_KEY)

### New Files (Frontend):
6. `frontend/src/components/SuggestionStrip.tsx` - Suggestion UI
7. `frontend/src/hooks/useSuggestions.ts` - Suggestion fetching logic
8. `frontend/src/services/suggestionService.ts` - API client
9. `frontend/src/config/groqPrompts.ts` - Context-specific prompts

### Modified Files:
10. `frontend/src/App.tsx` - Add SuggestionStrip component
11. `frontend/src/contexts/store.ts` - Add suggestions state
12. `frontend/.env` - Backend API URL

---

## 🔧 Backend Setup

### Directory Structure:
```
backend/
├── package.json
├── server.js
├── .env
├── routes/
│   └── suggestions.js
└── services/
    └── groq.js
```

### Dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "groq-sdk": "^0.3.0"
  }
}
```

### Environment Variables:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

---

## 🧪 Testing Plan

### Manual Testing:

**Test 1: Code Context**
1. Switch to code context
2. Type: `const user`
3. Wait 500ms or press space
4. ✅ Verify: Suggestions appear (function, return, const, etc.)
5. Tap suggestion → verify insertion

**Test 2: Email Context**
1. Switch to email context
2. Type: `Dear John, I hope this email`
3. Wait for suggestions
4. ✅ Verify: Professional phrases (finds you well, etc.)

**Test 3: Chat Context**
1. Switch to chat context
2. Type: `Hey! I'm heading to the`
3. ✅ Verify: Casual suggestions (store, park, beach, etc.)

**Test 4: Swipe Gesture**
1. Type partial text
2. Wait for suggestions
3. Swipe up on a suggestion chip
4. ✅ Verify: Quick insertion, chip highlights

**Test 5: Performance**
1. Type rapidly
2. ✅ Verify: Debouncing works, not too many API calls
3. ✅ Verify: Previous requests canceled
4. ✅ Verify: No lag or stuttering

---

## 🚀 Let's Start!

Beginning with **Step 1: Setup Backend API**

This will create the Express server and Groq integration for suggestions.

Ready to implement? 🎯
