# Quick Testing Guide - Context Detection & Suggestions

## 🚀 Start Here

```bash
cd frontend
npm run dev
```

Open: **http://localhost:5173**
Press: **F12** (open console)

---

## ✅ Test 1: CODE Context (Takes 5 seconds)

### Type exactly this:
```
function hello() {
```

### What you should see:

**1. Context Badge (top-left):**
```
CODE | 89%
```

**2. Keyboard Color:**
- Background: **BLUE** tint

**3. Console Output:**
```javascript
Context detection: {
  detected: "code",
  confidence: "0.89",
  scores: { code: 45, email: 2, chat: 1 }
}
✅ Switching context: email → code
```

**4. Suggestions Strip (above keyboard):**
```
[const]  [let]  [return]  [if]
```
(Blue chips)

**✅ SUCCESS:** If you see blue keyboard + code suggestions

---

## ✅ Test 2: EMAIL Context (Takes 5 seconds)

### Clear text, then type:
```
Dear John, I hope
```

### What you should see:

**1. Context Badge:**
```
EMAIL | 78%
```

**2. Keyboard Color:**
- Background: **GRAY** tint

**3. Console Output:**
```javascript
Context detection: {
  detected: "email",
  confidence: "0.78",
  scores: { code: 3, email: 24, chat: 2 }
}
✅ Switching context: code → email
```

**4. Suggestions:**
```
[you well]  [this helps]  [the]  [you]
```
(Gray chips)

**✅ SUCCESS:** If you see gray keyboard + email suggestions

---

## ✅ Test 3: CHAT Context (Takes 5 seconds)

### Clear text, then type:
```
hey! lol
```

### What you should see:

**1. Context Badge:**
```
CHAT | 92%
```

**2. Keyboard Color:**
- Background: **PURPLE** tint

**3. Console Output:**
```javascript
Context detection: {
  detected: "chat",
  confidence: "0.92",
  scores: { code: 0, email: 1, chat: 22 }
}
✅ Switching context: email → chat
```

**4. Suggestions:**
```
[😂]  [!]  [omg]  [😊]  [yeah]
```
(Purple chips with emojis)

**✅ SUCCESS:** If you see purple keyboard + chat suggestions

---

## 🎯 Test 4: Smart Suggestions

### Test CODE suggestions change:

**Type:** `function`
**Suggestions:** `()`, `return`, `=>`

**Type:** `const x`
**Suggestions:** `=`, `[]`, `{}`

**Type:** `{`
**Suggestions:** `const`, `let`, `return`, `if`

### Test EMAIL suggestions change:

**Type:** `thank`
**Suggestions:** `you`, `you for`

**Type:** Long email (100+ chars)
**Suggestions:** `Best regards,`, `Sincerely,`, `Thanks,`

### Test CHAT suggestions change:

**Type:** `what`
**Suggestions:** `?`, `are`, `is`

**Type:** `!`
**Suggestions:** `!`, `😂`, `lol`

---

## 🔍 Console Debugging

### Good Output (Context Switching):
```javascript
Context detection: {
  text: "function hello() {...",
  detected: "code",
  confidence: "0.89",
  scores: { code: 45, email: 2, chat: 1 }
}
✅ Switching context: email → code
```

### Normal Output (Staying in Context):
```javascript
✓ Staying in code context (confidence: 0.92)
```

### Warning Output (Not Confident):
```javascript
⚠ Not switching (confidence 0.35 < 0.4)
```

---

## 🐛 Troubleshooting

### ❌ Context not switching

**Console shows:**
```
⚠ Not switching (confidence 0.35 < 0.4)
scores: { code: 10, email: 9, chat: 8 }
```

**Problem:** Scores too close (ambiguous)

**Solution:** Add more context-specific words
- CODE: `function`, `const`, `{`, `}`
- EMAIL: `Dear`, `regards`, `sincerely`
- CHAT: `lol`, `hey`, emojis

---

### ❌ No suggestions showing

**Check:**
1. Not in compact mode? (Look for "☰ Compact" button - should say "⊞ Full")
2. Typed at least 5 characters?
3. Wait 500ms or press space

**Force refresh:**
- Press space after typing
- Suggestions fetch immediately on space

---

### ❌ Keyboard not changing color

**Check:**
1. Console shows context switch? (`✅ Switching context`)
2. Look carefully - tint is subtle
3. Context badge shows correct context?

**Visual indicators:**
- CODE = Blue-ish keyboard
- EMAIL = Gray-ish keyboard
- CHAT = Purple-ish keyboard
- Changes are subtle, not dramatic

---

## 📊 Expected Behavior

### Context Detection Timing
- **Minimum text:** 5 characters
- **Check interval:** After each keystroke
- **Debounce:** 100ms
- **Threshold:** 40% confidence

### Suggestion Timing
- **Trigger:** After 500ms pause OR on space/punctuation
- **Fetch time:** <200ms (local fallback)
- **Update:** Real-time as you type

---

## ✨ Success Criteria

You're all set if:

- [ ] Typing `function` switches to CODE (blue)
- [ ] Typing `Dear John` switches to EMAIL (gray)
- [ ] Typing `hey! lol` switches to CHAT (purple)
- [ ] Suggestions change based on what you type
- [ ] Console shows context detection logs
- [ ] Context badge updates correctly
- [ ] No errors in console

---

## 🎯 Quick 30-Second Test

**Speed test all three contexts:**

1. Type: `function x` → Should see **BLUE** keyboard + code suggestions ✅
2. Clear, type: `Dear John` → Should see **GRAY** keyboard + email suggestions ✅
3. Clear, type: `hey!` → Should see **PURPLE** keyboard + chat suggestions ✅

**All three working?** → **Context detection is perfect!** 🎉

---

## 📝 What to Report

If something's not working, share:

1. **Console output:** Copy the "Context detection" logs
2. **What you typed:** Exact text
3. **Expected:** What context/suggestions you expected
4. **Actual:** What you got instead
5. **Screenshots:** Of keyboard color and suggestions

---

## 🔄 Reset Everything

If things get weird:

1. **Refresh page:** F5 or Ctrl+R
2. **Clear storage:** Console → `localStorage.clear()`
3. **Hard reload:** Ctrl+Shift+R
4. **Restart server:** Ctrl+C, then `npm run dev`

---

## 🎊 Next Steps

Once context detection works:

1. ✅ Test Fitts' Law (type same keys repeatedly)
2. ✅ Test gestures (long-press, swipe)
3. ✅ Test compact mode toggle
4. ✅ Start backend for AI suggestions (optional)

---

**Need help?** Check `IMPROVED_CONTEXT_AND_SUGGESTIONS.md` for detailed explanations.

**Ready to test?** Start with Test 1 above! 🚀
