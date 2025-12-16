# Test Context Detection - Quick Guide

## ✅ Fix Applied
The context detection now works **client-side** (no backend needed for this feature).

---

## 🚀 How to Test

### Step 1: Start the Frontend
```bash
cd frontend
npm run dev
```

Open: **http://localhost:5173**

### Step 2: Open Browser Console
Press **F12** → Click "Console" tab

This will show you live context detection logs!

---

## 📝 Test Scenarios

### Test 1: CODE Context (Blue)
**Type this:**
```javascript
function calculateTotal(items) {
  const sum = items.reduce((a, b) => a + b);
  return sum;
}
```

**Expected:**
- Console shows: `detected: code`
- Context badge: **CODE**
- Keyboard color: **BLUE**
- Confidence: ~80-90%

---

### Test 2: EMAIL Context (Gray)
**Clear text, then type:**
```
Dear Professor Smith,

I hope this email finds you well. I wanted to follow up on our previous discussion regarding the research project. Please let me know when you're available for a meeting.

Best regards,
John
```

**Expected:**
- Console shows: `detected: email`
- Context badge: **EMAIL**
- Keyboard color: **GRAY**
- Confidence: ~75-85%

---

### Test 3: CHAT Context (Purple)
**Clear text, then type:**
```
hey! what's up? 😊
lol that's awesome!!!
wanna grab lunch later?
btw did you see that movie? omg it was so cool
```

**Expected:**
- Console shows: `detected: chat`
- Context badge: **CHAT**
- Keyboard color: **PURPLE**
- Confidence: ~85-95%

---

## 🔍 What to Look For in Console

You'll see logs like this:

```javascript
Context detection: {
  text: "hey! what's up? 😊 lol that's awesome...",
  detected: "chat",
  confidence: "0.92",
  scores: {
    code: 0,
    email: 2,
    chat: 22  ← Winner!
  }
}
Switching context: code → chat
```

**Understanding the scores:**
- **Highest score** = Detected context
- **Confidence** = How sure the system is (0.0 - 1.0)
- Needs **60%+ confidence** to switch contexts

---

## 🎯 Tips for Successful Detection

### For CODE:
- Use keywords: `function`, `const`, `let`, `if`, `return`
- Use symbols: `{}`, `()`, `[]`, `=>`
- Use camelCase: `calculateTotal`, `getUserName`

### For EMAIL:
- Start with: `Dear`, `Hi`, `Hello`
- Use formal words: `regards`, `sincerely`, `please`
- End with: `Best regards`, `Thanks`, `Sincerely`
- Write complete sentences with proper punctuation

### For CHAT:
- Use slang: `lol`, `omg`, `btw`, `haha`
- Use emojis: 😊 😂 ❤️ 👍
- Use multiple punctuation: `!!!`, `???`
- Keep it informal and short

---

## 🐛 Troubleshooting

### Problem: Context not switching

**Solution 1:** Type more text
- Minimum: 10 characters
- Better: 20+ words

**Solution 2:** Use more context-specific words
- For email: Add "Dear", "regards", "Best"
- For chat: Add "lol", "omg", emojis
- For code: Add "function", "const", "{}"

**Solution 3:** Check console
- See which context has highest score
- If scores are close, it won't switch (needs 60% confidence)

---

### Problem: Wrong context detected

**Check console scores:**
```javascript
scores: {
  code: 15,
  email: 12,  ← Very close! Ambiguous.
  chat: 10
}
```

If scores are close, the text is ambiguous. Add more context-specific content.

---

### Problem: Context switches too often

**Solution:** Not a problem yet, but if it happens:
1. Edit `App.tsx` line 89
2. Change `0.6` to `0.7` (needs 70% confidence to switch)

---

## ✨ Features

### Hysteresis (Stability)
The system won't switch unless it's **60%+ confident** in the new context. This prevents flickering.

### Context-Specific Keywords

**CODE:**
- 50+ keywords (function, const, if, for, etc.)
- Symbol patterns ({}, (), [], =>)
- Comment detection (// and /* */)

**EMAIL:**
- 20+ formal keywords
- Greeting detection
- Closing detection
- Email address pattern

**CHAT:**
- 30+ slang terms
- Emoji detection (1000+ emojis)
- Informal punctuation
- Short message detection

---

## 📊 Accuracy

**Expected accuracy:** 85-95%

**Best results with:**
- 20+ words
- Context-specific vocabulary
- Clear patterns

**May struggle with:**
- Very short text (<10 chars)
- Mixed contexts (code in email)
- Ambiguous text

---

## 🎨 Visual Feedback

### Context Colors
- **CODE:** Blue (#3B82F6)
- **EMAIL:** Gray (#6B7280)
- **CHAT:** Purple (#A855F7)

### What Changes
1. Context badge (top-left)
2. Keyboard background tint
3. Suggestion chip colors
4. Symbol row (different symbols per context)

---

## 🔄 Manual Override

If auto-detection is wrong, you can manually switch:
1. Look for context buttons in the UI
2. Click CODE / EMAIL / CHAT to force that context

---

## ✅ Success Checklist

- [ ] Frontend running on http://localhost:5173
- [ ] Console shows context detection logs
- [ ] Typing code changes to CODE context (blue)
- [ ] Typing email changes to EMAIL context (gray)
- [ ] Typing chat changes to CHAT context (purple)
- [ ] Context badge updates correctly
- [ ] Keyboard color changes
- [ ] No errors in console

---

## 🎉 All Working?

If everything above works, your context detection is **fully functional**!

Try mixing it up:
1. Start with code
2. Switch to an email
3. Then chat with a friend
4. Watch the keyboard adapt in real-time! 🚀

---

## 📖 More Info

See **CONTEXT_DETECTION_FIX.md** for:
- Technical details
- Algorithm explanation
- Configuration options
- Advanced troubleshooting
