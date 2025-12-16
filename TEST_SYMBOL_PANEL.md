# Quick Test: Symbol Panel Feature

## 🚀 Start Testing (30 seconds)

### Step 1: Run Frontend
```bash
cd frontend
npm run dev
```
Open: http://localhost:5173

---

## ✅ Visual Test Checklist

### Test 1: Find the Button (5 seconds)

**Look for:** `#+=` button in keyboard header (right side)

```
┌────────────────────────────────────────┐
│ lowercase    [#+=]  [⊞ Full]  CODE    │  ← Header
└────────────────────────────────────────┘
              👆 HERE
```

✅ **Button found?** → Continue

---

### Test 2: CODE Context Panel (10 seconds)

1. **Type:** `function`
2. **Click:** `#+=` button
3. **Expected:**
   ```
   Panel slides up from bottom 📈
   Header: "Code Symbols" (BLUE)
   Symbols: ()  {}  []  <>  =>  !=
   ```
4. **Tap:** `()` button
5. **Expected:**
   - `()` inserted
   - Panel closes
   - Result: `function()`

✅ **Worked?** → Continue

---

### Test 3: EMAIL Context Panel (10 seconds)

1. **Clear text**
2. **Type:** `Dear John,`
3. **Wait:** 2 seconds for context switch
4. **Click:** `#+=` button
5. **Expected:**
   ```
   Panel slides up 📈
   Header: "Email Symbols" (GRAY)
   Symbols: @  .com  .org  .edu  €  £
   ```
6. **Tap:** `@` button
7. **Expected:**
   - `@` inserted
   - Panel closes
   - Result: `Dear John,@`

✅ **Worked?** → Continue

---

### Test 4: CHAT Context Panel (10 seconds)

1. **Clear text**
2. **Type:** `hey! lol`
3. **Wait:** 2 seconds for context switch
4. **Click:** `#+=` button
5. **Expected:**
   ```
   Panel slides up 📈
   Header: "Chat Symbols" (PURPLE)
   Large emojis: 😊 😂 ❤️ 👍 🔥 ✨
   Slang: lol  omg  btw  brb
   ```
6. **Tap:** 😊 emoji
7. **Expected:**
   - 😊 inserted
   - Panel closes
   - Result: `hey! lol😊`

✅ **Worked?** → Success! 🎉

---

## 🎯 Quick Visual Checks

### Button States

**Panel Closed:**
```
┌─────────┐
│  #+=    │  ← Gray background
└─────────┘
```

**Panel Open (CODE):**
```
┌─────────┐
│  #+=    │  ← BLUE background
└─────────┘
```

**Panel Open (EMAIL):**
```
┌─────────┐
│  #+=    │  ← GRAY background
└─────────┘
```

**Panel Open (CHAT):**
```
┌─────────┐
│  #+=    │  ← PURPLE background
└─────────┘
```

---

## 🔍 What to Look For

### Panel Appearance
- ✅ Slides up smoothly (not jumpy)
- ✅ Rounded top corners
- ✅ Colored header bar (blue/gray/purple)
- ✅ X button in top-right
- ✅ Swipe indicator at top (—)
- ✅ Semi-transparent backdrop

### Symbols
- ✅ Touch-friendly size (large enough to tap)
- ✅ Organized in rows
- ✅ Colored borders matching context
- ✅ Hover effect (lighter on hover)
- ✅ Press effect (shrinks slightly)

### Behavior
- ✅ Symbol inserted on tap
- ✅ Panel auto-closes after selection
- ✅ Can close by clicking backdrop
- ✅ Can close by clicking X
- ✅ Smooth animations (300ms)

---

## 🎨 Context-Specific Symbols Summary

### CODE Context (Blue)
```
Brackets:  ()  {}  []  <>
Operators: =>  !=  ===  !==  +=  -=
Comments:  //  /*  */
Special:   #  $  @  \  |  ^  ~
```

### EMAIL Context (Gray)
```
Email:     @  .com  .org  .edu  .net
Dash:      —  –  -  _
Quotes:    "  "  '  '
Currency:  €  £  ¥  $  ©  ®  ™
```

### CHAT Context (Purple)
```
Emojis:    😊 😂 ❤️ 👍 🔥 ✨ 🎉 💯
More:      😭 🤔 😅 🙏 💀 😍 🥰 😎
Emoticons: :)  :(  :D  <3  ^_^
Slang:     lol omg btw brb
Emphasis:  !  ?  !!  ??  ...
```

---

## 🐛 Troubleshooting

### ❌ Panel doesn't appear

**Try:**
1. F5 (refresh page)
2. Check console for errors (F12)
3. Make sure you clicked the `#+=` button

### ❌ Wrong symbols showing

**Check:**
- What context are you in? (top-right shows CODE/EMAIL/CHAT)
- Type more context-specific text
- Wait 2 seconds for detection

### ❌ Symbols not inserting

**Check:**
- Did panel close? (It should)
- Check text input - symbol should be there
- Try refreshing page

---

## 🎬 Animation Checklist

- [ ] Panel slides up smoothly (300ms)
- [ ] Button changes color when panel opens
- [ ] Backdrop fades in (semi-transparent black)
- [ ] Buttons have hover effect (lighter color)
- [ ] Buttons shrink slightly when pressed (scale 95%)
- [ ] Panel slides down when closing

All smooth? ✅ **Animations working!**

---

## ✨ Quick Demo Workflow

**Complete workflow in 15 seconds:**

1. Type: `function test`
2. Click: `#+=`
3. Tap: `()`
4. Type: `return x`
5. Click: `#+=`
6. Tap: `;`
7. Result: `function test() { return x; }`

**Clean, fast, efficient!** 🚀

---

## 📱 Mobile Testing

If testing on phone:

1. **Open in mobile browser:** http://YOUR_IP:5173
2. **Look for button:** `#+=` in header
3. **Tap it:** Panel should slide up
4. **Tap symbol:** Should insert immediately
5. **Check sizes:** Buttons should be easy to tap (not too small)

**Tip:** Emojis in CHAT mode are **extra large** (64px) for easy tapping!

---

## 🎊 Success Criteria

✅ All working when:

- [ ] Can see `#+=` button
- [ ] Click opens panel with smooth slide-up
- [ ] Panel shows different symbols per context
- [ ] Tap symbol → Inserts into text
- [ ] Panel auto-closes
- [ ] Button color changes with panel state
- [ ] CODE = blue, EMAIL = gray, CHAT = purple
- [ ] No lag or jank in animations

**All checked?** → **Feature is perfect!** 🎉

---

## 🚀 Next Steps

1. **Test on real phone** - Most accurate
2. **Try all three contexts** - CODE, EMAIL, CHAT
3. **Test edge cases:**
   - Open/close rapidly
   - Switch contexts while open
   - Tap multiple symbols quickly
4. **Check performance:**
   - Should be instant (<100ms)
   - No lag when opening/closing
   - Smooth 60fps animations

---

**Ready to test?** Start with Test 1 above! 🎯

See `SYMBOL_PANEL_FEATURE.md` for full documentation.
