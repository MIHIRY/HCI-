# ContextType - Code Structure Documentation

> **Comprehensive guide to the ContextType codebase organization, architecture, and component relationships**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [ML Service (Optional)](#ml-service-optional)
6. [Data Flow](#data-flow)
7. [Key Components](#key-components)
8. [Configuration](#configuration)
9. [Development Guide](#development-guide)
10. [Testing](#testing)

---

## Project Overview

ContextType is an intelligent adaptive mobile keyboard system consisting of three main services:

- **Frontend** (React + TypeScript + Vite): User interface and client-side logic
- **Backend** (Node.js + Express): API server with Groq LLM integration
- **ML Service** (Python + FastAPI): Optional context detection service

---

## Directory Structure

```
ContextType/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── config/             # Configuration files
│   │   ├── contexts/           # State management (Zustand)
│   │   ├── services/           # API service clients
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # Application entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Dependencies and scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── tsconfig.json           # TypeScript configuration
│
├── backend/                     # Express.js backend API
│   ├── routes/                 # API route handlers
│   │   └── suggestions.js      # Suggestion endpoint
│   ├── services/               # Business logic services
│   │   └── groq.js             # Groq LLM integration
│   ├── src/                    # TypeScript source (optional)
│   │   ├── controllers/        # Request controllers
│   │   ├── routes/             # TypeScript routes
│   │   └── services/           # TypeScript services
│   ├── prisma/                 # Database schema (optional)
│   ├── server.js               # Main server file
│   ├── package.json            # Dependencies and scripts
│   ├── .env                    # Environment variables (gitignored)
│   └── .env.example            # Example environment file
│
├── ml-service/                  # Python ML service (optional)
│   ├── app/                    # FastAPI application
│   │   ├── main.py             # API entry point
│   │   ├── model.py            # ML model logic
│   │   └── preprocessor.py    # Text preprocessing
│   ├── models/                 # Trained model files
│   ├── data/                   # Training data
│   ├── tests/                  # Unit tests
│   ├── requirements.txt        # Python dependencies
│   └── train_model.py          # Model training script
│
├── docker/                      # Docker configuration files
├── plots/                       # Generated visualization plots
├── docker-compose.yml           # Docker services orchestration
├── generate_plots.py            # Plot generation script
├── PLOTS_GUIDE.md              # Plot documentation
├── CODE_STRUCTURE.md           # This file
└── README.md                   # Main project README

```

---

## Frontend Architecture

### Overview

The frontend is a **React 19** application built with **TypeScript** and **Vite**, using **Zustand** for state management and **Tailwind CSS** for styling.

### Directory Breakdown

#### `src/components/` - React Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **App.tsx** | Main application container | Session management, context detection, layout loading |
| **MobileKeyboard.tsx** | Mobile-optimized keyboard | Touch events, gesture support, key rendering |
| **TextInput.tsx** | Text input field | Real-time context detection, metrics tracking |
| **SuggestionStrip.tsx** | AI suggestion bar | Displays predictions, handles selection |
| **ContextIndicator.tsx** | Shows current context | Visual indicator for Code/Email/Chat |
| **MetricsDisplay.tsx** | Performance metrics | WPM, error rate, accuracy |
| **KeyHeatmap.tsx** | Key usage heatmap | Frequency visualization per context |
| **SymbolPanel.tsx** | Context-specific symbols | Dynamic symbol panel switching |
| **OptimizationVisualizer.tsx** | Layout optimization display | Shows Fitts' Law effects |
| **LayoutPreferences.tsx** | User preferences UI | Toggle features, compact mode |
| **AlternateKeysPopup.tsx** | Long-press key variants | Special character selection |

**Component Hierarchy:**
```
App
├── TextInput
├── ContextIndicator
├── SuggestionStrip
├── MobileKeyboard
│   ├── SymbolPanel
│   └── AlternateKeysPopup
├── MetricsDisplay
├── KeyHeatmap
├── OptimizationVisualizer
└── LayoutPreferences
```

#### `src/hooks/` - Custom React Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| **useSuggestions.ts** | Fetch AI suggestions | `{ suggestions, isLoading, error }` |
| **useOptimizedLayout.ts** | Manage layout optimization | `{ layout, isOptimizationEnabled }` |
| **useMobileDetection.ts** | Detect mobile viewport | `{ isMobile, isTablet }` |
| **useLongPress.ts** | Handle long-press gestures | `{ onTouchStart, onTouchEnd }` |
| **useSwipeGesture.ts** | Handle swipe gestures | `{ onSwipeLeft, onSwipeRight }` |

**Hook Dependencies:**
- All hooks use React's `useState`, `useEffect`, `useCallback`, `useRef`
- Hooks can compose other hooks for complex functionality

#### `src/utils/` - Utility Functions

| File | Purpose | Key Functions |
|------|---------|---------------|
| **contextDetector.ts** | Detect writing context | `detectContextWithHistory()`, `scoreCodeContext()`, `scoreEmailContext()`, `scoreChatContext()` |
| **layoutOptimizer.ts** | Generate optimized layouts | `generateOptimizedLayout()`, `optimizeKeyPositions()` |
| **fittsLaw.ts** | Fitts' Law calculations | `calculateMovementTime()`, `optimizeKeySize()`, `optimizeKeyPosition()` |
| **keyFrequencyTracker.ts** | Track key usage | `trackKeyPress()`, `getFrequencies()`, `resetFrequencies()` |

**Utility Function Flow:**
```
User Types Text
    ↓
contextDetector.ts → Analyzes text → Returns context
    ↓
layoutOptimizer.ts → Uses fittsLaw.ts → Generates layout
    ↓
keyFrequencyTracker.ts → Tracks usage → Updates frequencies
```

#### `src/config/` - Configuration Files

| File | Purpose | Exports |
|------|---------|---------|
| **mobileLayout.ts** | Base keyboard layouts | Layout objects for each context |
| **symbolPanels.ts** | Context-specific symbols | Symbol arrays for Code/Email/Chat |
| **alternateKeys.ts** | Long-press key variants | Character mappings |

#### `src/contexts/` - State Management

**`store.ts` - Zustand Store**

The central state management using Zustand:

```typescript
interface AppState {
  // Core state
  currentContext: ContextType;           // 'code' | 'email' | 'chat'
  currentLayout: KeyboardLayout | null;  // Active keyboard layout
  inputText: string;                     // User input
  isCompactMode: boolean;                // Compact UI mode

  // Metrics
  sessionStartTime: number;              // Session timestamp
  totalKeyPresses: number;               // Total keys pressed
  correctKeyPresses: number;             // Correct keys
  currentWPM: number;                    // Words per minute

  // Actions
  setContext: (context: ContextType) => void;
  setLayout: (layout: KeyboardLayout) => void;
  setInputText: (text: string) => void;
  startSession: () => void;
  recordKeyPress: (isCorrect: boolean) => void;
  // ... more actions
}
```

**State Flow:**
1. User interaction triggers action
2. Action updates state
3. Components re-render with new state
4. Side effects run in `useEffect` hooks

#### `src/services/` - API Clients

**`suggestionService.ts` - Backend Communication**

```typescript
export async function fetchSuggestions(
  text: string,
  context: ContextType,
  maxSuggestions: number = 5
): Promise<Suggestion[]> {
  // Makes POST request to backend
  // Returns typed suggestion objects
}
```

**API Communication Flow:**
```
Component → useSuggestions hook → suggestionService
                                        ↓
                                   Backend API
                                        ↓
                                   Groq LLM
                                        ↓
                          Return suggestions to component
```

#### `src/types/` - TypeScript Types

**`index.ts` - Type Definitions**

```typescript
// Core types
export type ContextType = 'code' | 'email' | 'chat';

export interface KeyData {
  key: string;
  label?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  isSpecial?: boolean;
  action?: string;
}

export interface KeyboardLayout {
  id: string;
  context: ContextType;
  rows: KeyData[][];
  metadata?: {
    optimized: boolean;
    timestamp: number;
  };
}

export interface Suggestion {
  text: string;
  confidence: number;
  source: 'llm' | 'pattern' | 'cache';
}

// ... more types
```

### Frontend Build Process

```
Source Code (.tsx, .ts)
    ↓
TypeScript Compiler (tsc) → Type checking
    ↓
Vite Build Tool → Bundling, optimization
    ↓
Tailwind CSS → Utility class processing
    ↓
Production Build (dist/)
```

---

## Backend Architecture

### Overview

The backend is a **Node.js** application using **Express.js** framework with **Groq SDK** for LLM integration.

### File Structure

```
backend/
├── server.js              # Main entry point
├── routes/
│   └── suggestions.js     # Suggestion endpoint
├── services/
│   └── groq.js            # Groq LLM service
├── .env                   # Environment variables
└── package.json           # Dependencies
```

### Core Files

#### `server.js` - Main Server

```javascript
// Key responsibilities:
1. Initialize Express app
2. Configure middleware (CORS, JSON parsing, logging)
3. Register routes (/api/v1/suggestions)
4. Error handling
5. Health check endpoint (/health)
6. Start HTTP server on PORT
```

**Middleware Stack:**
```
Request
  ↓
CORS middleware → Allow frontend origin
  ↓
JSON parser → Parse request body
  ↓
Logger → Log request details
  ↓
Routes → Handle endpoints
  ↓
Error handler → Catch errors
  ↓
Response
```

#### `routes/suggestions.js` - Suggestion Route Handler

```javascript
POST /api/v1/suggestions

Request Body:
{
  "text": "user input text",
  "context": "code" | "email" | "chat",
  "max_suggestions": 5
}

Response:
{
  "suggestions": [
    { "text": "suggestion1", "confidence": 0.9, "source": "llm" },
    ...
  ],
  "context": "code",
  "timestamp": "2025-12-15T..."
}
```

**Request Flow:**
1. Validate request body
2. Check context is valid
3. Call `getSuggestions()` from groq service
4. Return formatted response
5. Handle errors

#### `services/groq.js` - Groq LLM Integration

**Key Functions:**

```javascript
export async function getSuggestions(text, context, maxSuggestions) {
  // 1. Check pattern matching (10% of requests)
  const patternMatch = checkCommonPatterns(text, context);
  if (patternMatch) return patternMatch;

  // 2. Extract context window (last 6-15 words)
  const contextWindow = extractContextWindow(text);

  // 3. Get context-specific system prompt
  const systemPrompt = getSystemPrompt(context);

  // 4. Call Groq API
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: contextWindow }
    ],
    temperature: 0.2,
    max_tokens: 100
  });

  // 5. Parse and validate response
  // 6. Return suggestions
}
```

**Pattern Matching:**
- Instant responses for common phrases
- No API call needed
- ~10% of requests

**LLM Analysis:**
- Context-aware prompts
- 0.2 temperature (focused)
- ~90% of requests

**System Prompts:**
```javascript
const PROMPTS = {
  code: "You are an intelligent code completion AI...",
  email: "You are an intelligent email writing assistant...",
  chat: "You are an intelligent casual chat assistant..."
};
```

### Backend Request Lifecycle

```
1. Client sends POST request
        ↓
2. CORS middleware validates origin
        ↓
3. JSON parser extracts body
        ↓
4. Logger logs request
        ↓
5. Route handler validates input
        ↓
6. groq.js service processes request
        ↓
    Pattern match? → Return instantly
        ↓ No
    Call Groq API → Get LLM predictions
        ↓
7. Format response
        ↓
8. Return to client
```

### Environment Variables

**`.env` file:**
```
PORT=3001
GROQ_API_KEY=gsk_your_api_key_here
FRONTEND_URL=http://localhost:5173
```

**`.env.example` template provided for reference**

---

## ML Service (Optional)

### Overview

Python-based FastAPI service for advanced context detection using machine learning.

**Note:** The current production system uses client-side rule-based context detection. The ML service is optional and can enhance accuracy.

### Structure

```
ml-service/
├── app/
│   ├── main.py          # FastAPI application
│   ├── model.py         # ML model (TF-IDF + Naive Bayes)
│   └── preprocessor.py  # Text preprocessing
├── models/              # Saved model files
├── data/                # Training datasets
├── train_model.py       # Model training script
└── requirements.txt     # Python dependencies
```

### Key Files

#### `app/main.py` - FastAPI Server

```python
@app.post("/predict")
async def predict_context(request: TextRequest):
    """
    Predict context for given text

    Request:
    {
        "text": "user input"
    }

    Response:
    {
        "context": "code" | "email" | "chat",
        "confidence": 0.95,
        "scores": {
            "code": 0.95,
            "email": 0.03,
            "chat": 0.02
        }
    }
    """
```

#### `app/model.py` - ML Model

```python
class ContextClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.classifier = MultinomialNB()

    def train(self, texts, labels):
        # TF-IDF vectorization
        # Naive Bayes training

    def predict(self, text):
        # Feature extraction
        # Classification
        # Return context + confidence
```

#### `train_model.py` - Model Training

```python
# Load training data from data/
# Preprocess text
# Train TF-IDF vectorizer
# Train Naive Bayes classifier
# Save model to models/
```

### Running ML Service

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```

**Service runs on:** `http://localhost:8000`

### Integration with Backend

If enabled, backend can call ML service:

```javascript
// Optional: Use ML service instead of client-side detection
const mlResponse = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: JSON.stringify({ text: userInput })
});
const { context, confidence } = await mlResponse.json();
```

---

## Data Flow

### Complete User Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER TYPES TEXT                                          │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND - TextInput Component                          │
│    - Captures input                                         │
│    - Updates Zustand store                                  │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CONTEXT DETECTION (Client-Side)                         │
│    - contextDetector.ts analyzes text                      │
│    - Scores: code/email/chat                               │
│    - Applies safeguards (cooldown, threshold)              │
│    - Updates context in store                              │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. LAYOUT OPTIMIZATION                                      │
│    - useOptimizedLayout hook detects context change        │
│    - layoutOptimizer.ts generates new layout               │
│    - fittsLaw.ts optimizes key sizes/positions             │
│    - keyFrequencyTracker.ts provides usage data            │
│    - Updates layout in store                               │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. KEYBOARD RENDERING                                       │
│    - MobileKeyboard component receives new layout          │
│    - Re-renders with optimized keys                        │
│    - SymbolPanel updates context-specific symbols          │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. SUGGESTION GENERATION (Parallel)                        │
│    - useSuggestions hook triggers on input change          │
│    - Debounce: 350ms pause or commit signal                │
│    - Gate check: min chars, min words                      │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND API CALL                                         │
│    - suggestionService.ts → POST /api/v1/suggestions       │
│    - Backend validates request                             │
│    - groq.js service processes                             │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
┌──────────────┐  ┌─────────────────┐
│ Pattern Match│  │ Groq LLM Call   │
│ (~10%)       │  │ (~90%)          │
│ Instant      │  │ llama-3.1-70b   │
│ No API call  │  │ Context prompt  │
└──────┬───────┘  └────────┬────────┘
       └──────────┬─────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. RETURN SUGGESTIONS                                       │
│    - Backend formats response                               │
│    - Returns to frontend                                    │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. DISPLAY SUGGESTIONS                                      │
│    - SuggestionStrip component updates                     │
│    - Shows top 5 predictions                                │
│    - User can tap to select                                 │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. METRICS TRACKING                                        │
│    - keyFrequencyTracker updates usage                     │
│    - Zustand store updates WPM, accuracy                   │
│    - MetricsDisplay shows real-time stats                  │
│    - KeyHeatmap visualizes frequency                       │
└─────────────────────────────────────────────────────────────┘
```

### State Update Flow

```
User Action (typing, key press, suggestion select)
    ↓
Zustand Action Called (setInputText, recordKeyPress, etc.)
    ↓
Store State Updated
    ↓
React Components Re-render (subscribed to changed state)
    ↓
useEffect Hooks Run (side effects like API calls)
    ↓
Additional State Updates (suggestions loaded, metrics calculated)
    ↓
Final UI Update
```

---

## Key Components

### 1. Context Detection System

**Location:** `frontend/src/utils/contextDetector.ts`

**Algorithm:**

```typescript
function detectContextWithHistory(
  text: string,
  previousContext: ContextType,
  switchThreshold: number = 0.65
): ContextDetectionResult {

  // Step 1: Score each context (0.0 - 1.0)
  const scores = {
    code: scoreCodeContext(text),    // Keywords, symbols, patterns
    email: scoreEmailContext(text),  // Formal phrases, structure
    chat: scoreChatContext(text)     // Casual language, emojis
  };

  // Step 2: Apply recency weighting (70% recent, 30% full)
  const recentText = getRecentText(text, 100); // Last 100 chars
  const recentScores = { /* score recent text */ };
  const weighted = combineScores(scores, recentScores, 0.7);

  // Step 3: Check strong signals (override all)
  if (hasStrongCodeSignal(text)) {
    return { context: 'code', confidence: 0.95 };
  }

  // Step 4: Apply cooldown (prevent rapid switching)
  if (isWithinCooldown(3000)) { // 3 seconds
    return { context: previousContext, confidence: 0.8 };
  }

  // Step 5: Check sentence boundaries
  const atBoundary = isAtSentenceBoundary(text);
  const threshold = atBoundary ? 0.55 : 0.75;

  // Step 6: Determine winner
  const winner = getHighestScore(weighted);

  if (winner.score >= threshold && winner.context !== previousContext) {
    startCooldown();
    return { context: winner.context, confidence: winner.score };
  }

  return { context: previousContext, confidence: 0.7 };
}
```

**Scoring Functions:**

```typescript
function scoreCodeContext(text: string): number {
  let score = 0.0;

  // Keywords (function, const, class, etc.)
  const keywords = text.match(/\b(function|const|class|...)\b/gi);
  score += Math.min((keywords?.length || 0) * 0.15, 0.6);

  // Symbols ({}, [], (), etc.)
  const symbols = text.match(/[{}()\[\];:<>]/g);
  score += Math.min((symbols?.length || 0) * 0.10, 0.4);

  // Patterns (camelCase, operators)
  if (/[a-z]+[A-Z]/.test(text)) score += 0.2;
  if (/===|!==|&&|\|\|/.test(text)) score += 0.3;

  return Math.min(score, 1.0);
}

// Similar for scoreEmailContext() and scoreChatContext()
```

### 2. Layout Optimization Engine

**Location:** `frontend/src/utils/layoutOptimizer.ts`

**Process:**

```typescript
function generateOptimizedLayout(
  context: ContextType,
  isOptimizationEnabled: boolean
): KeyboardLayout {

  // 1. Get base layout for context
  const baseLayout = getBaseLayout(context);

  if (!isOptimizationEnabled) {
    return baseLayout;
  }

  // 2. Get key frequencies from tracker
  const frequencies = keyFrequencyTracker.getFrequencies(context);

  // 3. Optimize each key
  const optimizedRows = baseLayout.rows.map(row =>
    row.map(key => optimizeKey(key, frequencies))
  );

  // 4. Apply Fitts' Law positioning
  const positioned = applyFittsLawPositioning(optimizedRows);

  // 5. Add context-specific styling
  const styled = applyContextStyling(positioned, context);

  return {
    id: `${context}-optimized-${Date.now()}`,
    context,
    rows: styled,
    metadata: {
      optimized: true,
      timestamp: Date.now()
    }
  };
}

function optimizeKey(key: KeyData, frequencies: Map<string, number>) {
  const freq = frequencies.get(key.key) || 0;

  // Optimize size using Fitts' Law
  const optimizedWidth = fittsLaw.optimizeKeySize(
    key.width || 60,
    freq,
    48,  // min
    90   // max
  );

  // Optimize position (closer to center if frequent)
  const optimizedPosition = fittsLaw.optimizeKeyPosition(
    key,
    freq,
    { x: key.x || 0, y: key.y || 0 }
  );

  return {
    ...key,
    width: optimizedWidth,
    x: optimizedPosition.x,
    y: optimizedPosition.y
  };
}
```

### 3. Fitts' Law Implementation

**Location:** `frontend/src/utils/fittsLaw.ts`

**Core Formula:**

```typescript
// Fitts' Law: MT = a + b × log₂(D/W + 1)
// MT = Movement Time
// D = Distance to target
// W = Width of target
// a, b = empirically determined constants

export function calculateMovementTime(
  distance: number,
  targetWidth: number,
  a: number = 50,   // Base time (ms)
  b: number = 150   // Scaling factor
): number {
  const indexOfDifficulty = Math.log2(distance / targetWidth + 1);
  return a + b * indexOfDifficulty;
}

export function optimizeKeySize(
  baseSize: number,
  frequency: number,
  minSize: number = 48,
  maxSize: number = 90
): number {
  // Higher frequency → larger key (easier to hit)
  const scale = 1.0 + Math.min(frequency / 200, 0.4);
  const optimized = baseSize * scale;
  return Math.max(minSize, Math.min(maxSize, optimized));
}

export function optimizeKeyPosition(
  key: KeyData,
  frequency: number,
  basePosition: Position
): Position {
  // Higher frequency → closer to center
  const homePosition = { x: 500, y: 300 }; // Screen center
  const attraction = Math.min(frequency / 100, 0.4);

  return {
    x: basePosition.x + (homePosition.x - basePosition.x) * attraction,
    y: basePosition.y + (homePosition.y - basePosition.y) * attraction
  };
}
```

### 4. Suggestion System

**Frontend Hook:** `frontend/src/hooks/useSuggestions.ts`

```typescript
export function useSuggestions({
  text,
  context,
  enabled,
  debounceMs = 350,
  maxSuggestions = 5
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce input
  const debouncedText = useDebounce(text, debounceMs);

  useEffect(() => {
    if (!enabled || !shouldFetchSuggestions(debouncedText)) {
      return;
    }

    fetchSuggestionsAsync();
  }, [debouncedText, context]);

  async function fetchSuggestionsAsync() {
    setIsLoading(true);
    try {
      const results = await suggestionService.fetchSuggestions(
        debouncedText,
        context,
        maxSuggestions
      );
      setSuggestions(results);
    } catch (error) {
      console.error('Suggestion error:', error);
      setSuggestions(getFallbackSuggestions(context));
    } finally {
      setIsLoading(false);
    }
  }

  return { suggestions, isLoading };
}
```

**Backend Service:** `backend/services/groq.js`

```javascript
export async function getSuggestions(text, context, maxSuggestions) {
  // 1. Pattern matching (fast path)
  const patterns = {
    'how are you': ['doing', '?', 'today', 'feeling'],
    'public static void': ['main', 'execute', 'run', 'process'],
    'I hope this email': ['finds', 'reaches', 'helps', 'serves']
  };

  for (const [pattern, suggestions] of Object.entries(patterns)) {
    if (text.toLowerCase().includes(pattern)) {
      return suggestions.map((text, i) => ({
        text,
        confidence: 0.9 - (i * 0.1),
        source: 'pattern'
      }));
    }
  }

  // 2. LLM analysis (slow path)
  const contextWindow = extractContextWindow(text, 6, 15);
  const systemPrompt = getSystemPrompt(context);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: contextWindow }
    ],
    temperature: 0.2,
    max_tokens: 100
  });

  const parsed = JSON.parse(completion.choices[0].message.content);

  return parsed.map((text, i) => ({
    text,
    confidence: 0.85 - (i * 0.05),
    source: 'llm'
  }));
}
```

---

## Configuration

### Frontend Configuration

#### `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

#### `tailwind.config.js`
```javascript
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        code: '#3b82f6',
        email: '#6b7280',
        chat: '#8b5cf6'
      }
    }
  }
};
```

### Backend Configuration

#### Environment Variables
```bash
# .env
PORT=3001
GROQ_API_KEY=gsk_your_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Docker Configuration

#### `docker-compose.yml`
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:3001/api/v1

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - GROQ_API_KEY=${GROQ_API_KEY}

  ml-service:
    build: ./ml-service
    ports:
      - "8000:8000"
```

---

## Development Guide

### Setup Instructions

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ContextType
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add GROQ_API_KEY

# Start server
npm start
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Start dev server
npm run dev
```

#### 4. ML Service Setup (Optional)
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start service
python app/main.py
```

### Development Workflow

```
1. Make changes to code
2. Hot reload automatically updates
3. Check browser console for errors
4. Check backend terminal for logs
5. Test functionality
6. Commit changes
```

### Adding New Features

#### Adding a New Component

```bash
# Create component file
frontend/src/components/MyComponent.tsx

# Import in App.tsx or parent component
import MyComponent from './components/MyComponent';

# Use in JSX
<MyComponent prop1="value" />
```

#### Adding a New API Endpoint

```bash
# 1. Create route handler
backend/routes/my-route.js

# 2. Register in server.js
import myRouter from './routes/my-route.js';
app.use('/api/v1', myRouter);

# 3. Create frontend service
frontend/src/services/myService.ts

# 4. Use in component
const data = await myService.fetchData();
```

#### Adding a New Utility Function

```bash
# 1. Create utility file
frontend/src/utils/myUtil.ts

export function myFunction() {
  // logic
}

# 2. Import and use
import { myFunction } from '@/utils/myUtil';
```

### Code Style Guidelines

**TypeScript/JavaScript:**
- Use TypeScript for all frontend code
- Use ES6+ features (arrow functions, destructuring, etc.)
- Prefer functional components with hooks
- Use meaningful variable names
- Add comments for complex logic

**React:**
- One component per file
- Use functional components
- Extract custom hooks for reusable logic
- Keep components small and focused
- Use TypeScript for props

**CSS:**
- Use Tailwind utility classes
- Avoid custom CSS unless necessary
- Use consistent spacing (p-4, m-2, etc.)

---

## Testing

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Backend Testing

```bash
cd backend

# Run tests
npm test

# Test API endpoints manually
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/v1/suggestions \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world","context":"chat"}'
```

### Manual Testing Checklist

- [ ] Type in different contexts (code, email, chat)
- [ ] Verify context switches correctly
- [ ] Check suggestions appear
- [ ] Test suggestion selection
- [ ] Verify keyboard layout changes
- [ ] Check metrics update
- [ ] Test compact mode
- [ ] Test on mobile viewport
- [ ] Test gestures (long-press, swipe)

---

## Troubleshooting

### Common Issues

**1. Frontend won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Backend can't connect to Groq**
```bash
# Check .env file has valid API key
# Test API key: curl with authentication
```

**3. CORS errors**
```bash
# Check FRONTEND_URL in backend/.env matches frontend URL
# Verify cors middleware in server.js
```

**4. Suggestions not appearing**
```bash
# Check browser console for errors
# Check backend logs for API errors
# Verify Groq API key is valid
# Check network tab for failed requests
```

**5. Layout not optimizing**
```bash
# Check isOptimizationEnabled in store
# Verify keyFrequencyTracker is tracking
# Check fittsLaw calculations
```

---

## Performance Optimization

### Frontend Optimizations

1. **Layout Caching:** Layouts cached to avoid regeneration
2. **Debouncing:** 350ms debounce on suggestions
3. **Memoization:** Use `useMemo` for expensive calculations
4. **Lazy Loading:** Code splitting with dynamic imports
5. **Virtual Rendering:** Only render visible keys

### Backend Optimizations

1. **Pattern Matching:** 10% of requests return instantly
2. **LLM Caching:** Cache similar requests
3. **Connection Pooling:** Reuse HTTP connections
4. **Gzip Compression:** Compress responses
5. **Request Validation:** Fail fast on invalid input

---

## Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend
cd backend
npm install --production
# Ready to deploy
```

### Environment Variables (Production)

```bash
# Backend
PORT=3001
GROQ_API_KEY=<production_key>
FRONTEND_URL=https://your-domain.com
NODE_ENV=production

# Frontend
VITE_API_URL=https://api.your-domain.com/api/v1
```

### Deployment Platforms

- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Backend:** Railway, Render, Heroku, AWS EC2
- **Database:** PostgreSQL on Railway, Supabase, AWS RDS
- **ML Service:** Railway, Google Cloud Run, AWS Lambda

---

## Contributing

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add: my feature description"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create pull request
```

### Commit Message Format

```
Type: Short description

Detailed description (if needed)

Types:
- Add: New feature
- Fix: Bug fix
- Update: Improve existing feature
- Refactor: Code restructure
- Docs: Documentation
- Style: Code formatting
- Test: Add tests
```

---

## Additional Resources

### Documentation Files

- `README.md` - Project overview and quick start
- `CODE_STRUCTURE.md` - This file
- `PLOTS_GUIDE.md` - Visualization documentation
- `PHASE3_FITTS_LAW_GUIDE.md` - Fitts' Law implementation
- `HOW_TO_RUN_COMPLETE_GUIDE.md` - Detailed setup guide

### Key Technologies

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com)
- [Groq API](https://console.groq.com/docs)

---

## License

MIT License - See LICENSE file for details

---

## Contact

For questions or issues, please refer to the project documentation or create an issue in the repository.

---

**Last Updated:** December 15, 2025
**Version:** 1.0
**Maintained by:** ContextType Development Team
