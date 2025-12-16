
# ContextType – Mobile & Groq Feature Roadmap (5 Phases)

This document outlines how to evolve **ContextType** with:
- Clean and stable **mobile keyboard layout**
- Practical **mobile-only UX features**
- **Groq-powered LLM capabilities** for suggestions, templates, and assistance

Each phase tackles **one major feature** to keep the implementation simple and structured.

---

## Phase 1 – Mobile-First Layout Foundation

### Goal
Fix the mobile keyboard layout to make it **consistent, responsive, and touch-friendly**.

### Steps
1. **Introduce Mobile Layout Mode**
   - Detect viewport
   - Switch to `MobileLayout` when needed

2. **Use a Fixed Column Grid on Mobile**
   - 10–12 column grid
   - Key width = `calc(100vw / columns - gap)`
   - Height = `8–10vh`

3. **Apply Min/Max Key Size**
   ```ts
   MIN_SIZE = 48px;
   MAX_SIZE = 90px;
   ```
   Ensures mobile personalization does not break layout.

4. **Mobile-Safe Fitts' Law Behavior**
   - Use gentle personalization
   - Slightly enlarge top keys
   - Keep positions grid-based

---

## Phase 2 – Mobile UX: Compact Mode & Interactions

### Goal
Make mobile typing **comfortable and realistic**.

### Steps
1. **Compact Mode Toggle**
   - 3 rows + function row
   - Hide advanced UI

2. **Long-Press Alternate Characters**
   - e.g., `.` → `...`, `?`, `!`

3. **Basic Gestures**
   - Swipe backspace → delete word
   - Long-press space → move cursor

---

## Phase 3 – Groq-Powered Adaptive Suggestion Strip

### Goal
Dynamic, context-based suggestions above the keyboard.

### Steps
1. **UI Component: SuggestionStrip**
   - Displays 3–5 suggestions
   - Tap → inserts suggestion

2. **Backend Endpoint: `/api/v1/suggestions`**
   - Sends:
     ```json
     {
       "text": "...",
       "context": "code/email/chat"
     }
     ```
   - Backend → Groq → suggestions

3. **Trigger Logic**
   - On pause (500–800 ms)
   - On space or punctuation

---

## Phase 4 – Groq-Powered Templates & Snippets

### Goal
Offer quick templates/snippets based on context.

### Steps
1. **"Templates" Button**
   - Email: formal lines
   - Code: snippets
   - Chat: casual reply patterns

2. **Backend Endpoint: `/api/v1/templates`**
   - Groq generates 2–4 templates

3. **Insertion Mechanism**
   - Tap template → insert at cursor

---

## Phase 5 – Groq Smart Assistance (Tone, Syntax, Rewrites)

### Goal
Provide intelligent rewriting and fixes.

### Steps
1. **"✨ Assist" Button**
   - Pass selected text / sentence / snippet

2. **Backend Endpoint: `/api/v1/assist`**
   - Email: tone improvement
   - Code: missing bracket/semicolon hints
   - Chat: expressive rewrite

3. **Frontend Dialog**
   - Show original + improved version
   - Replace/cancel options

---

## LLM Principle for Entire Project
> **Wherever LLM behavior is required, we use Groq.**  
This includes:
- Suggestions  
- Template generation  
- Code / email / chat rephrasing  
- Smart assistance  

---

# End of Document
