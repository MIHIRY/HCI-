# Phase 2 Implementation Plan
## Mobile UX: Compact Mode & Interactions

**Status:** 🚀 **STARTING**
**Date:** December 2, 2025
**Based on:** ContextType_5_Phases.md

---

## 🎯 Phase 2 Goals

Make mobile typing **comfortable and realistic** with:
1. Compact mode toggle (3 rows)
2. Long-press alternate characters
3. Basic gestures (swipe, long-press)

---

## 📋 Features to Implement

### 1. Compact Mode Toggle
**What:** Toggle between full keyboard and 3-row compact mode

**Implementation:**
- Add toggle button in header
- State: `isCompactMode` (true/false)
- When enabled:
  - Show only 3 letter rows (qwerty, asdf, zxcv)
  - Numbers/symbols via long-press
  - Hide advanced UI (heatmap, preferences)
  - Smaller overall height

**UI Location:** Header, next to mode indicator

---

### 2. Long-Press Alternate Characters
**What:** Hold a key to see alternate characters

**Examples:**
- `.` → long press → shows `, ` `...` `?` `!`
- `e` → long press → shows `é` `è` `ê` `ë` `€`
- `0` → long press → shows `°` `⁰` `∅`

**Implementation:**
- Detect long-press (300ms threshold)
- Show popup menu above key
- Tap alternate to insert it
- Works on all keys with alternates

**Tech:**
- `onTouchStart` / `onMouseDown` → start timer
- `onTouchEnd` / `onMouseUp` → clear timer
- If timer reaches 300ms → show popup

---

### 3. Swipe Backspace → Delete Word
**What:** Swipe left on backspace key to delete entire word

**Implementation:**
- Detect swipe gesture on backspace key
- Horizontal swipe > 30px = delete word
- Visual feedback (backspace key highlights)
- Delete from cursor to previous space

**Tech:**
- Touch events: `touchstart`, `touchmove`, `touchend`
- Track swipe direction and distance
- Threshold: 30px horizontal movement

---

### 4. Long-Press Space → Move Cursor
**What:** Long-press space bar, then drag to move cursor position

**Implementation:**
- Long-press space (300ms)
- Show cursor movement indicator
- Drag left/right to move cursor
- Release to place cursor

**Tech:**
- Similar to long-press alternates
- Track horizontal drag distance
- Update cursor position in text input

---

### 5. Hide Advanced UI in Compact Mode
**What:** When compact mode is ON, hide:
- Key heatmap visualization
- Layout preferences panel
- Optimization visualizer
- Demo mode button

**Keep visible:**
- Context indicator (small)
- Basic metrics (WPM only)
- Keyboard and text input

---

## 🛠️ Implementation Steps

### Step 1: Compact Mode Toggle (30 min)
- [ ] Add `isCompactMode` state to store
- [ ] Add toggle button in header
- [ ] Conditionally render 3 rows vs all rows
- [ ] Reduce keyboard height in compact mode
- [ ] Hide advanced panels when compact

### Step 2: Long-Press Infrastructure (45 min)
- [ ] Create `useLongPress` hook
- [ ] Create `AlternateKeysPopup` component
- [ ] Define alternate character mappings
- [ ] Handle touch and mouse events
- [ ] Show/hide popup on long-press

### Step 3: Long-Press Alternates for Keys (30 min)
- [ ] Map common alternates for letters
- [ ] Map punctuation alternates
- [ ] Map number alternates
- [ ] Style popup menu
- [ ] Handle selection

### Step 4: Swipe Gestures (45 min)
- [ ] Create `useSwipeGesture` hook
- [ ] Implement swipe detection
- [ ] Add to backspace key
- [ ] Delete word functionality
- [ ] Visual feedback

### Step 5: Long-Press Space Cursor Movement (45 min)
- [ ] Detect long-press on space
- [ ] Show cursor movement UI
- [ ] Track drag distance
- [ ] Update text input cursor position
- [ ] Visual indicator

### Step 6: Testing & Polish (30 min)
- [ ] Test on mobile viewport
- [ ] Test all gestures
- [ ] Verify compact mode
- [ ] Check performance
- [ ] User feedback

**Total Estimated Time:** 3-4 hours

---

## 📊 Acceptance Criteria

### Compact Mode:
- ✅ Toggle button works
- ✅ Shows only 3 letter rows
- ✅ Hides advanced UI
- ✅ Keyboard height reduced by ~40%

### Long-Press Alternates:
- ✅ Hold `.` → see `...`, `?`, `!`
- ✅ Hold `e` → see `é`, `è`, `ê`, `ë`
- ✅ Popup appears above key
- ✅ Tap alternate → inserts it
- ✅ Works with touch and mouse

### Swipe Backspace:
- ✅ Swipe left on backspace → deletes word
- ✅ Visual feedback during swipe
- ✅ Works smoothly on mobile

### Long-Press Space:
- ✅ Long-press space → enable cursor mode
- ✅ Drag left/right → cursor moves
- ✅ Release → cursor placed
- ✅ Visual indicator shown

---

## 🎨 UI Mockups

### Compact Mode Toggle:
```
┌─────────────────────────────────┐
│ [☰] lowercase  [Compact OFF] 🔧 │ ← Toggle here
├─────────────────────────────────┤
│ q w e r t y u i o p             │
│ a s d f g h j k l               │
│ z x c v b n m                   │
│ [123] [     Space     ] [↵]     │
└─────────────────────────────────┘
```

### Long-Press Popup:
```
     ┌───────────────────┐
     │ ... , ? !         │ ← Popup appears
     └─────────┬─────────┘
               │
         ┌─────▼─────┐
         │     .     │ ← Key being pressed
         └───────────┘
```

### Swipe Backspace:
```
     ┌─────────┐
     │   ⌫    │ ← Swipe left
     └─────────┘
        ←──────  (swipe gesture)

     Result: Deletes entire word
```

---

## 🧪 Testing Plan

### Manual Testing:
1. Toggle compact mode → verify 3 rows only
2. Long-press `.` key → verify popup appears
3. Tap alternate → verify inserts correctly
4. Swipe backspace → verify deletes word
5. Long-press space → verify cursor movement

### Device Testing:
- Chrome DevTools mobile emulation
- Touch events work correctly
- Mouse events work as fallback
- No performance issues

---

## 📁 Files to Create/Modify

### New Files:
1. `frontend/src/hooks/useLongPress.ts` - Long-press detection
2. `frontend/src/hooks/useSwipeGesture.ts` - Swipe gesture detection
3. `frontend/src/components/AlternateKeysPopup.tsx` - Popup menu
4. `frontend/src/config/alternateKeys.ts` - Key alternate mappings

### Modified Files:
1. `frontend/src/components/MobileKeyboard.tsx` - Add gestures, compact mode
2. `frontend/src/contexts/store.ts` - Add `isCompactMode` state
3. `frontend/src/App.tsx` - Hide advanced UI in compact mode
4. `frontend/src/components/TextInput.tsx` - Cursor movement support

---

## 🚀 Let's Start!

Beginning with **Step 1: Compact Mode Toggle**

This is the foundation for Phase 2 - once we have the toggle working,
we'll add the interactive gestures one by one.

Ready to implement? 🎯
