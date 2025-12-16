# ContextType: Adaptive Keyboard System
## Comprehensive Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Frontend Requirements](#frontend-requirements)
4. [Backend Requirements](#backend-requirements)
5. [Context Detection Engine](#context-detection-engine)
6. [Keyboard Layout System](#keyboard-layout-system)
7. [Data Collection & Analytics](#data-collection-analytics)
8. [User Study Framework](#user-study-framework)
9. [Technology Stack](#technology-stack)
10. [Development Phases](#development-phases)
11. [API Specifications](#api-specifications)
12. [Testing Strategy](#testing-strategy)

---

## 1. Project Overview

### 1.1 Purpose
ContextType is an intelligent adaptive keyboard system that automatically adjusts its layout and functionality based on the user's writing context (programming, email, chat) to maximize typing efficiency and minimize errors.

### 1.2 Core Features
- **Automatic Context Detection**: Real-time identification of writing context
- **Dynamic Layout Adaptation**: Three distinct keyboard modes (Code, Email, Chat)
- **Fitts' Law Optimization**: Scientifically positioned keys for maximum efficiency
- **Performance Tracking**: Comprehensive metrics collection (WPM, error rates, task completion)
- **User Study Platform**: Built-in controlled testing environment

### 1.3 Success Metrics
- Increased typing speed (WPM) compared to static keyboards
- Reduced error rates across different contexts
- Improved task completion efficiency
- Positive user satisfaction scores

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Keyboard   │  │   Context    │  │  Analytics   │  │
│  │   Renderer   │  │   Indicator  │  │  Dashboard   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                     API LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Context    │  │   Layout     │  │   Metrics    │  │
│  │   API        │  │   API        │  │   API        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   NLP/ML     │  │   Layout     │  │   Data       │  │
│  │   Engine     │  │   Manager    │  │   Storage    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction Flow

1. **User types text** → Frontend captures input
2. **Text sent to Backend** → Context Detection Engine analyzes
3. **Context determined** → Layout Manager selects appropriate keyboard mode
4. **Layout instructions returned** → Frontend renders adaptive keyboard
5. **Metrics collected** → Data Storage saves performance data
6. **Real-time updates** → Dashboard displays analytics

---

## 3. Frontend Requirements

### 3.1 Core Components

#### 3.1.1 Adaptive Keyboard Renderer
**Purpose**: Render and animate keyboard layout transitions

**Requirements**:
- Responsive keyboard display (desktop, tablet)
- Smooth transition animations between modes (300-500ms)
- Touch/click event handling
- Visual feedback for key presses
- Key highlighting for frequently used keys
- Customizable key sizes based on Fitts' Law calculations

**Key Features**:
- Dynamic key positioning
- Color-coded modes (Code: blue theme, Email: professional gray, Chat: vibrant colors)
- Haptic feedback simulation
- Accessibility support (keyboard navigation, screen reader compatible)

#### 3.1.2 Text Input Area
**Purpose**: Capture user input and provide writing environment

**Requirements**:
- Multi-line text editor with syntax highlighting (for code mode)
- Real-time character/word count
- Auto-save functionality
- Placeholder text based on context
- Copy/paste support
- Undo/redo functionality

#### 3.1.3 Context Indicator
**Purpose**: Display current detected context to user

**Requirements**:
- Visual badge showing current mode (Code/Email/Chat)
- Confidence level indicator (percentage bar)
- Mode transition notifications
- Manual override option (user can force a specific mode)
- Tooltip explanations for each mode

#### 3.1.4 Analytics Dashboard
**Purpose**: Real-time and historical performance visualization

**Requirements**:
- Real-time WPM display
- Error rate graph
- Context switching frequency chart
- Key heatmap (which keys pressed most)
- Session duration tracking
- Comparison charts (adaptive vs static keyboard)
- Export data functionality (CSV/JSON)

#### 3.1.5 User Study Interface
**Purpose**: Controlled testing environment for research

**Requirements**:
- Task assignment system
- Instructions display
- Timer with visual countdown
- Task completion indicators
- Progress bar through study phases
- Post-task questionnaire forms
- Consent form integration

### 3.2 State Management

**Global State Requirements**:
- Current keyboard mode (code/email/chat)
- User input buffer
- Context detection confidence score
- Performance metrics (current session)
- User preferences and settings
- Study phase tracking (if in study mode)

### 3.3 UI/UX Requirements

**Design Principles**:
- Minimalist interface to focus on keyboard
- Clear visual distinction between modes
- Non-intrusive context switching
- Responsive design (1024px minimum width)
- Dark/light theme support
- Accessibility compliance (WCAG 2.1 AA)

**Layout Structure**:
```
┌────────────────────────────────────────┐
│  Header: Logo | Context Badge | Timer  │
├────────────────────────────────────────┤
│                                        │
│           Text Input Area              │
│         (30% of viewport)              │
│                                        │
├────────────────────────────────────────┤
│                                        │
│        Adaptive Keyboard Display       │
│         (50% of viewport)              │
│                                        │
├────────────────────────────────────────┤
│  Footer: Stats | Settings | Help       │
└────────────────────────────────────────┘
```

---

## 4. Backend Requirements

### 4.1 Core Services

#### 4.1.1 Context Detection Service
**Purpose**: Analyze text and determine writing context

**Responsibilities**:
- Receive text input via API
- Perform NLP analysis
- Apply ML classification model
- Return context with confidence score
- Log detection results for model improvement

**Processing Pipeline**:
1. Text preprocessing (tokenization, lowercasing)
2. Feature extraction (word frequency, syntactic patterns)
3. Keyword detection (programming terms, formal phrases, slang)
4. Pattern matching (code syntax, email structure, emoji)
5. ML model inference
6. Confidence calculation
7. Result caching for efficiency

#### 4.1.2 Layout Management Service
**Purpose**: Manage keyboard layouts and transitions

**Responsibilities**:
- Store layout configurations for each mode
- Calculate optimal key positions using Fitts' Law
- Generate layout JSON for frontend
- Handle layout customization requests
- Version control for layouts

**Layout Calculation Logic**:
- Assign larger hit targets to frequently used keys
- Position common keys closer to home row
- Calculate movement time based on distance and target size
- Apply context-specific optimizations

#### 4.1.3 Metrics Collection Service
**Purpose**: Collect and aggregate performance data

**Responsibilities**:
- Receive keystroke events
- Calculate WPM in real-time
- Track error patterns
- Compute task completion times
- Store data in time-series format
- Generate statistical summaries

**Metrics to Track**:
- Words per minute (WPM)
- Error rate (errors per 100 keystrokes)
- Correction frequency
- Context switch frequency
- Key press duration
- Inter-key interval
- Task completion time
- Mouse/keyboard usage ratio

#### 4.1.4 User Study Management Service
**Purpose**: Orchestrate user study sessions

**Responsibilities**:
- Assign participants to conditions (adaptive vs static)
- Generate randomized task sequences
- Manage study phases
- Collect qualitative feedback
- Store consent and demographic data
- Export study results

### 4.2 Database Schema

#### 4.2.1 Users Collection
```
{
  user_id: UUID,
  created_at: timestamp,
  study_group: string (adaptive/static/control),
  demographics: {
    age_range: string,
    typing_experience: string,
    programming_experience: string
  },
  consent_given: boolean
}
```

#### 4.2.2 Sessions Collection
```
{
  session_id: UUID,
  user_id: UUID,
  start_time: timestamp,
  end_time: timestamp,
  keyboard_type: string (adaptive/static),
  tasks_completed: array[task_id]
}
```

#### 4.2.3 Keystrokes Collection (Time-Series)
```
{
  keystroke_id: UUID,
  session_id: UUID,
  timestamp: timestamp,
  key: string,
  context_mode: string,
  is_error: boolean,
  correction: boolean,
  key_duration: float (ms)
}
```

#### 4.2.4 Context_Detections Collection
```
{
  detection_id: UUID,
  session_id: UUID,
  timestamp: timestamp,
  text_sample: string (last 100 chars),
  detected_context: string,
  confidence_score: float,
  previous_context: string,
  features: object (keyword counts, patterns)
}
```

#### 4.2.5 Performance_Metrics Collection
```
{
  metric_id: UUID,
  session_id: UUID,
  timestamp: timestamp,
  wpm: float,
  error_rate: float,
  context_mode: string,
  task_id: UUID
}
```

#### 4.2.6 Tasks Collection
```
{
  task_id: UUID,
  task_type: string (code/email/chat),
  description: string,
  target_text: string (for transcription tasks),
  expected_duration: int (seconds),
  difficulty_level: int (1-5)
}
```

### 4.3 API Endpoints Structure

All endpoints should follow RESTful conventions and return JSON responses.

**Base URL**: `/api/v1`

**Authentication**: JWT token-based (for user study participants)

---

## 5. Context Detection Engine

### 5.1 Detection Strategy

#### 5.1.1 Rule-Based Detection (Fast Path)
**Purpose**: Quick detection using pattern matching for clear cases

**Code Mode Triggers**:
- Keywords: function, class, def, const, let, var, import, return, if, else, while, for
- Symbols: {}, [], (), ;, //, /*, */, =>, ===
- Patterns: camelCase, snake_case, function declarations
- File extensions in text (optional): .py, .js, .java

**Email Mode Triggers**:
- Keywords: Dear, Sincerely, Regards, Hi [Name], Subject:, To:, From:
- Phrases: "I hope this email finds you", "Thank you for", "Please find attached"
- Formal punctuation density (high comma, period usage)
- Formal vocabulary (utilize, furthermore, regarding)

**Chat Mode Triggers**:
- Keywords: lol, omg, btw, brb, tbh, ngl
- Emoji presence: 😊, 👍, ❤️, 😂
- Informal contractions: gonna, wanna, kinda
- Question marks in rapid succession
- All caps words
- Repeated punctuation: !!!, ???

#### 5.1.2 Machine Learning Model (Fallback)
**Purpose**: Handle ambiguous cases and improve over time

**Model Type**: Multi-class Text Classification
- Algorithm: Fine-tuned BERT or similar transformer model
- Classes: code, email, chat
- Training data: 10,000+ labeled samples per class
- Features: Word embeddings, syntactic patterns, structural features

**Training Data Sources**:
- GitHub code samples (various languages)
- Email datasets (Enron corpus, sent emails with consent)
- Social media chat logs (anonymized)
- Synthetic data generation

**Model Performance Requirements**:
- Accuracy: >90% on test set
- Inference time: <100ms per request
- Confidence calibration: reliable probability scores

### 5.2 Context Detection Algorithm

**Hybrid Approach**:

```
Input: text_buffer (last 200 characters)

1. Preprocessing:
   - Tokenize text
   - Extract last N tokens (50-100)
   - Identify structural elements

2. Rule-Based Check:
   - Calculate keyword scores for each context
   - If any score > 0.8 threshold: RETURN context (FAST)

3. ML Model Inference:
   - Generate embeddings
   - Pass through classifier
   - Get probability distribution

4. Confidence Thresholding:
   - If max probability > 0.7: RETURN highest probability context
   - Else: RETURN previous context (maintain stability)

5. Smoothing:
   - Apply temporal smoothing (don't switch too frequently)
   - Require N consecutive detections before switching

Output: {context: string, confidence: float}
```

### 5.3 Context Switching Logic

**Switching Rules**:
- Minimum dwell time: 5 seconds before allowing switch
- Confidence threshold: 0.75 to trigger switch
- Consecutive confirmations: 3 in a row to switch
- Manual override: User can force context immediately

**Edge Cases**:
- Mixed content (code in email): Prioritize more recent text
- Empty buffer: Default to previous context or neutral mode
- Ambiguous text: Maintain current context (stability over accuracy)

---

## 6. Keyboard Layout System

### 6.1 Layout Design Principles

#### 6.1.1 Fitts' Law Application
**Formula**: Time = a + b × log₂(Distance / Size + 1)

**Optimization Strategy**:
- Assign larger keys to frequent characters
- Position common keys closer to center/home row
- Group related keys (operators with operators)
- Minimize finger travel distance

#### 6.1.2 Layout Modes

**Code Mode Layout**:
```
Primary Keys (larger, centered):
- Brackets: {}, [], (), <>
- Operators: =, +, -, *, /, %
- Special: ; : . , " '
- Frequent letters: e, t, a, i, o, n
- Tab key (indentation)

Secondary Keys:
- Numbers: 0-9 (top row)
- Symbols: #, $, @, &, |, \
- Arrows: ← ↑ ↓ →

Features:
- Autocomplete suggestions (top 5)
- Syntax snippet buttons (for, if, function)
- Comment toggle
```

**Email Mode Layout**:
```
Primary Keys:
- Punctuation: . , ; : ! ?
- Common words: the, and, to, for, with (word buttons)
- Formal closings: Sincerely, Regards, Best
- Capital letters easily accessible

Secondary Keys:
- Numbers
- Special chars: @, #
- Formatting: bold, italic, underline buttons

Features:
- Email templates
- Greeting suggestions
- Signature insertion button
```

**Chat Mode Layout**:
```
Primary Keys:
- Emoji shortcuts (😊, 😂, ❤️, 👍, 🔥)
- Slang abbreviations: lol, brb, omg, idk
- Casual punctuation: ! ? ...
- Lowercase emphasis

Secondary Keys:
- GIF search button
- Sticker panel access
- Voice message option

Features:
- Emoji picker
- Recent emoji
- Inline reactions
```

### 6.2 Layout Configuration Format (JSON)

```json
{
  "mode": "code",
  "version": "1.0",
  "layout": {
    "rows": [
      {
        "row_id": 1,
        "keys": [
          {
            "key_id": "left_brace",
            "character": "{",
            "position": {"x": 100, "y": 50},
            "size": {"width": 60, "height": 60},
            "frequency_rank": 3,
            "color": "#3b82f6",
            "haptic": true
          },
          // ... more keys
        ]
      }
    ]
  },
  "special_buttons": [
    {
      "button_id": "autocomplete",
      "label": "Suggestions",
      "action": "show_autocomplete",
      "position": {"x": 500, "y": 200}
    }
  ],
  "styling": {
    "theme": "code_blue",
    "key_border_radius": 8,
    "spacing": 5
  }
}
```

### 6.3 Dynamic Key Sizing Algorithm

**Input**: Character frequency map from user's typing history

**Process**:
1. Calculate frequency percentile for each character
2. Map percentile to size range (40px - 80px)
3. Assign positions using clustering algorithm
4. Ensure minimum spacing (5px) between keys
5. Validate accessibility (minimum target size 44px)

**Output**: Optimized layout configuration

---

## 7. Data Collection & Analytics

### 7.1 Real-Time Metrics

#### 7.1.1 Typing Speed (WPM)
**Calculation**:
```
WPM = (Characters Typed / 5) / (Time in Minutes)
```

**Collection Frequency**: Every 5 seconds
**Display**: Line chart with rolling average

#### 7.1.2 Error Rate
**Calculation**:
```
Error Rate = (Total Errors / Total Keystrokes) × 100
```

**Error Types**:
- Incorrect key press (corrected with backspace)
- Uncorrected errors (detected via Levenshtein distance)

#### 7.1.3 Task Completion Metrics
- Time to complete task
- Number of breaks/pauses (>3 seconds)
- Context switches during task
- Satisfaction rating (1-5 scale)

### 7.2 Analytics Processing

#### 7.2.1 Aggregation Pipeline
1. **Raw Data Collection**: Keystroke-level events
2. **Sessionization**: Group events into sessions
3. **Metric Calculation**: Compute WPM, error rates
4. **Context Annotation**: Tag with detected context
5. **Statistical Summary**: Mean, median, std dev
6. **Comparative Analysis**: Adaptive vs static

#### 7.2.2 Visualization Requirements
- Real-time dashboards (WebSocket updates)
- Historical trend graphs
- Heatmaps (key usage frequency)
- Comparison charts (before/after, adaptive/static)
- Statistical significance testing results

### 7.3 Data Export

**Export Formats**:
- CSV: For statistical analysis in R/Python
- JSON: For programmatic access
- PDF: Summary reports with visualizations

**Export Contents**:
- Anonymized user IDs
- Session timestamps
- Performance metrics
- Context distribution
- Error patterns
- Demographic correlations (if consented)

---

## 8. User Study Framework

### 8.1 Study Design

#### 8.1.1 Participants
- **Target**: Minimum 5 participants (mentioned in abstract)
- **Recommended**: 20-30 participants for statistical power
- **Recruitment**: University students, office workers, developers

**Inclusion Criteria**:
- Age 18-65
- Comfortable with typing
- Native or fluent English speaker
- No motor impairments affecting typing

**Exclusion Criteria**:
- Previous exposure to adaptive keyboards
- Severe RSI or typing-related injuries

#### 8.1.2 Study Conditions

**Between-Subjects Design**:
- **Group A**: Adaptive keyboard (ContextType)
- **Group B**: Static keyboard (control)

**Within-Subjects Alternative**:
- Each participant uses both keyboards
- Counterbalanced order to control for learning effects

#### 8.1.3 Tasks

**Code Writing Tasks** (3 tasks):
1. Write a function to calculate Fibonacci sequence
2. Fix syntax errors in provided code snippet
3. Complete a simple API endpoint implementation

**Email Composition Tasks** (3 tasks):
1. Write a professional meeting request email
2. Compose a thank you email to a colleague
3. Draft a formal complaint response

**Chat Messaging Tasks** (3 tasks):
1. Have a casual conversation with a friend (simulated)
2. Respond to 10 rapid-fire questions
3. Share excitement about a recent event with emoji

### 8.2 Study Protocol

**Session Flow** (45-60 minutes per participant):

1. **Introduction** (5 min)
   - Welcome and overview
   - Explain study purpose
   - Obtain informed consent

2. **Demographic Survey** (3 min)
   - Age, gender, occupation
   - Typing experience
   - Programming experience

3. **Tutorial** (5 min)
   - Demonstrate keyboard features
   - Practice task (not recorded)
   - Answer questions

4. **Task Block 1: Code** (10 min)
   - 3 coding tasks
   - Record performance

5. **Break** (2 min)

6. **Task Block 2: Email** (10 min)
   - 3 email tasks
   - Record performance

7. **Break** (2 min)

8. **Task Block 3: Chat** (10 min)
   - 3 chat tasks
   - Record performance

9. **Post-Study Questionnaire** (8 min)
   - NASA-TLX (workload assessment)
   - SUS (System Usability Scale)
   - Custom satisfaction questions
   - Open-ended feedback

10. **Debrief** (5 min)
    - Explain study results
    - Answer questions
    - Provide compensation info

### 8.3 Questionnaires

#### 8.3.1 Pre-Study Demographics
- Age range
- Gender (optional)
- Occupation
- Years of typing experience
- Programming experience (beginner/intermediate/advanced/none)
- Estimated daily typing hours
- Familiarity with mobile keyboards

#### 8.3.2 Post-Task Questions (after each block)
1. How easy was it to complete this task? (1-5 scale)
2. Did you notice the keyboard changing? (yes/no)
3. If yes, was it helpful or distracting? (helpful/neutral/distracting)

#### 8.3.3 Post-Study Questionnaire

**System Usability Scale (SUS)** - 10 questions, 1-5 scale:
1. I think I would like to use this keyboard frequently
2. I found the keyboard unnecessarily complex
3. I thought the keyboard was easy to use
4. I think I would need technical support to use this keyboard
5. I found the various functions well integrated
6. There was too much inconsistency in the keyboard
7. I imagine most people would learn to use this keyboard quickly
8. I found the keyboard very awkward to use
9. I felt very confident using the keyboard
10. I needed to learn a lot before I could use the keyboard

**Custom Questions**:
1. How noticeable were the keyboard changes? (1-5)
2. How helpful was the automatic context detection? (1-5)
3. Would you use this keyboard in daily work? (yes/maybe/no)
4. What did you like most about the keyboard?
5. What would you improve?
6. Any additional comments?

### 8.4 Data Analysis Plan

#### 8.4.1 Quantitative Analysis
- **Primary Metrics**: WPM, error rate
- **Statistical Tests**: 
  - T-test (adaptive vs static, if between-subjects)
  - Repeated measures ANOVA (if within-subjects)
  - Effect size calculation (Cohen's d)
- **Significance Level**: p < 0.05

#### 8.4.2 Qualitative Analysis
- Thematic analysis of open-ended responses
- Common pain points identification
- Feature preference patterns
- Improvement suggestions categorization

---

## 9. Technology Stack

### 9.1 Frontend Stack

**Framework**: React 18+ with TypeScript
- **Rationale**: Component-based, strong typing, large ecosystem

**State Management**: Redux Toolkit or Zustand
- **Rationale**: Centralized state for complex interactions

**UI Library**: Tailwind CSS + Headless UI
- **Rationale**: Rapid development, customizable, accessible

**Charting**: Chart.js or Recharts
- **Rationale**: Interactive charts for analytics

**Real-Time**: Socket.io-client
- **Rationale**: WebSocket support for live updates

**Build Tool**: Vite
- **Rationale**: Fast development server, optimized builds

### 9.2 Backend Stack

**Runtime**: Node.js 18+ with TypeScript
- **Rationale**: JavaScript full-stack, async I/O

**Framework**: Express.js or Fastify
- **Rationale**: Lightweight, flexible routing

**Database**: PostgreSQL (primary) + Redis (caching)
- **PostgreSQL**: Relational data, complex queries
- **Redis**: Session caching, real-time data

**ORM**: Prisma or TypeORM
- **Rationale**: Type-safe database access

**API Documentation**: OpenAPI/Swagger
- **Rationale**: Auto-generated API docs

### 9.3 ML/NLP Stack

**Language**: Python 3.9+
- **Rationale**: Rich ML ecosystem

**Framework**: FastAPI
- **Rationale**: High-performance Python web framework

**ML Libraries**:
- **scikit-learn**: Traditional ML algorithms
- **transformers (Hugging Face)**: BERT-based models
- **NLTK/spaCy**: Text preprocessing

**Model Serving**: TensorFlow Serving or TorchServe
- **Rationale**: Production-grade model deployment

### 9.4 Infrastructure

**Containerization**: Docker
- **Rationale**: Consistent environments

**Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **Rationale**: Service management, scaling

**Monitoring**: Prometheus + Grafana
- **Rationale**: Metrics collection and visualization

**Logging**: Winston (Node.js) + ELK Stack
- **Rationale**: Centralized logging

### 9.5 Development Tools

**Version Control**: Git + GitHub
**CI/CD**: GitHub Actions
**Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)
**Testing**: Jest (unit), Cypress (e2e)
**Documentation**: Markdown + Docusaurus

---

## 10. Development Phases

### Phase 1: Foundation (Weeks 1-2)

**Goals**: Setup infrastructure, basic UI

**Tasks**:
- Initialize repositories (frontend, backend, ML service)
- Setup development environment (Docker, configs)
- Create basic React app with routing
- Implement static keyboard UI
- Setup database schema
- Create API skeleton with documentation

**Deliverables**:
- Running development environment
- Basic keyboard display
- API endpoint scaffolding
- Database initialized

### Phase 2: Context Detection (Weeks 3-4)

**Goals**: Build NLP engine, rule-based detection

**Tasks**:
- Collect training data
- Implement rule-based detection logic
- Build ML classification model
- Create context detection API endpoint
- Integrate with frontend (basic)
- Unit testing for detection logic

**Deliverables**:
- Working context detection service
- Accuracy metrics report
- API integration complete

### Phase 3: Adaptive Keyboard (Weeks 5-6)

**Goals**: Implement layout switching, animations

**Tasks**:
- Design three keyboard layouts (code, email, chat)
- Implement layout rendering engine
- Create smooth transition animations
- Integrate context detection with layout switching
- Add keyboard interaction handlers
- Apply Fitts' Law optimizations

**Deliverables**:
- Fully functional adaptive keyboard
- Three distinct mode layouts
- Smooth transitions

### Phase 4: Metrics & Analytics (Weeks 7-8)

**Goals**: Data collection, visualization

**Tasks**:
- Implement keystroke logging
- Build metrics calculation service
- Create real-time analytics dashboard
- Design visualizations (charts, graphs)
- Implement data export functionality
- Performance optimization (caching, indexing)

**Deliverables**:
- Comprehensive analytics dashboard
- Data export feature
- Performance reports

### Phase 5: User Study System (Weeks 9-10)

**Goals**: Build study platform, questionnaires

**Tasks**:
- Design study workflow (onboarding to completion)
- Implement task assignment system
- Create questionnaire forms
- Build consent management
- Implement participant randomization
- Setup study data storage

**Deliverables**:
- Complete user study platform
- All questionnaires implemented
- Study protocol automated

### Phase 6: Testing & Refinement (Weeks 11-12)

**Goals**: Bug fixes, optimization, pilot testing

**Tasks**:
- Conduct pilot study (2-3 participants)
- Gather feedback and iterate
- Performance optimization
- Security audit
- Accessibility testing
- Cross-browser testing

**Deliverables**:
- Bug-free application
- Performance benchmarks met
- Pilot study results

### Phase 7: User Study Execution (Weeks 13-14)

**Goals**: Recruit and run main study

**Tasks**:
- Recruit participants (minimum 5, ideally 20+)
- Schedule and conduct study sessions
- Monitor data collection
- Provide participant support
- Collect all data

**Deliverables**:
- Complete study data from all participants
- Raw metrics and questionnaire responses

### Phase 8: Analysis & Reporting (Weeks 15-16)

**Goals**: Analyze data, write paper

**Tasks**:
- Statistical analysis
- Create visualizations for results
- Write research paper/report
- Prepare presentation
- Document insights and findings

**Deliverables**:
- Complete analysis report
- Research paper draft
- Presentation slides

---

## 11. API Specifications

### 11.1 Context Detection API

#### POST `/api/v1/context/detect`

**Purpose**: Analyze text and return detected context

**Request**:
```json
{
  "text": "function calculateSum(a, b) { return a + b; }",
  "user_id": "uuid",
  "session_id": "uuid",
  "previous_context": "email" // optional
}
```

**Response**:
```json
{
  "context": "code",
  "confidence": 0.92,
  "timestamp": "2025-10-30T10:30:00Z",
  "detection_id": "uuid",
  "alternative_contexts": [
    {"context": "email", "confidence": 0.05},
    {"context": "chat", "confidence": 0.03}
  ]
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request (text too short)
- 500: Server error

### 11.2 Layout API

#### GET `/api/v1/layout/{context}`

**Purpose**: Retrieve keyboard layout for specific context

**Parameters**:
- `context`: code | email | chat

**Response**:
```json
{
  "mode": "code",
  "version": "1.0",
  "layout": { /* layout configuration */ },
  "cache_duration": 3600 // seconds
}
```

#### GET `/api/v1/layout/user/{user_id}`

**Purpose**: Get personalized layout based on user's typing patterns

**Response**: Custom layout with optimized key sizes

### 11.3 Metrics API

#### POST `/api/v1/metrics/keystroke`

**Purpose**: Log individual keystroke event

**Request**:
```json
{
  "session_id": "uuid",
  "timestamp": "2025-10-30T10:30:00.123Z",
  "key": "a",
  "context_mode": "code",
  "is_error": false,
  "key_duration": 87.5 // milliseconds
}
```

**Response**:
```json
{
  "recorded": true,
  "keystroke_id": "uuid"
}
```

#### GET `/api/v1/metrics/session/{session_id}`

**Purpose**: Retrieve aggregated metrics for a session

**Response**:
```json
{
  "session_id": "uuid",
  "duration_seconds": 1800,
  "total_keystrokes": 3450,
  "wpm_average": 62.5,
  "error_rate": 2.3,
  "context_distribution": {
    "code": 0.6,
    "email": 0.3,
    "chat": 0.1
  },
  "tasks_completed": 8
}
```

### 11.4 User Study API

#### POST `/api/v1/study/participant`

**Purpose**: Register new study participant

**Request**:
```json
{
  "demographics": {
    "age_range": "25-34",
    "occupation": "software engineer",
    "typing_experience_years": 10
  },
  "consent_given": true,
  "study_group": "adaptive" // assigned by system
}
```

**Response**:
```json
{
  "user_id": "uuid",
  "study_group": "adaptive",
  "session_token": "jwt_token"
}
```

#### GET `/api/v1/study/tasks/{user_id}`

**Purpose**: Get assigned tasks for participant

**Response**:
```json
{
  "tasks": [
    {
      "task_id": "uuid",
      "type": "code",
      "description": "Write a function to reverse a string",
      "order": 1,
      "estimated_duration": 300 // seconds
    },
    // ... more tasks
  ]
}
```

#### POST `/api/v1/study/task/complete`

**Purpose**: Mark task as completed and record metrics

**Request**:
```json
{
  "task_id": "uuid",
  "user_id": "uuid",
  "completion_time": 287, // seconds
  "satisfaction_rating": 4,
  "comments": "The keyboard was very responsive"
}
```

---

## 12. Testing Strategy

### 12.1 Unit Testing

**Frontend**:
- Component rendering tests
- State management tests
- Utility function tests
- **Coverage Target**: 80%

**Backend**:
- API endpoint tests
- Service logic tests
- Database query tests
- **Coverage Target**: 85%

**ML Service**:
- Model inference tests
- Preprocessing tests
- Confidence calculation tests
- **Coverage Target**: 75%

### 12.2 Integration Testing

**API Integration**:
- Frontend-Backend communication
- Database operations
- ML service calls
- WebSocket connections

**End-to-End Flows**:
- Complete typing session
- Context switching
- Data export
- Study completion

### 12.3 Performance Testing

**Load Testing**:
- Concurrent users: 50+
- API response time: <200ms (p95)
- Context detection: <100ms
- Layout switching: <50ms

**Stress Testing**:
- Extended sessions (2+ hours)
- Rapid context switching
- Large data exports

### 12.4 Usability Testing

**Pre-Study Usability**:
- 3-5 users test interface
- Think-aloud protocol
- Identify confusing elements
- Iterate on design

**Accessibility Testing**:
- Keyboard-only navigation
- Screen reader compatibility
- Color contrast ratios
- Touch target sizes (minimum 44px)

### 12.5 User Acceptance Testing

**Pilot Study**:
- 2-3 participants
- Full study protocol
- Identify issues
- Refine procedures

**Success Criteria**:
- System runs smoothly for all participants
- Data collection is complete and accurate
- Participants can complete all tasks
- No critical bugs or crashes

---

## Appendix A: Keyboard Layout Examples

### Code Mode Visual Layout
```
┌─────┬─────┬─────┬─────┬─────┐
│ {   │ (   │ [   │ <   │ "   │  Large, frequently used
├─────┼─────┼─────┼─────┼─────┤
│ }   │ )   │ ]   │ >   │ '   │  in code
├─────┼─────┼─────┼─────┼─────┤
│ =   │ +   │ -   │ *   │ /   │  Operators
├─────┼─────┼─────┼─────┼─────┤
│ ;   │ :   │ .   │ ,   │ _   │  Punctuation
└─────┴─────┴─────┴─────┴─────┘
```

### Email Mode Visual Layout
```
┌─────┬─────┬─────┬─────┬─────┐
│ .   │ ,   │ ;   │ :   │ !   │  Formal punctuation
├─────┼─────┼─────┼─────┼─────┤
│ the │ and │ to  │ for │with │  Common words
├─────┼─────┼─────┼─────┼─────┤
│Dear │Thanks│Best│Rgds │Snc. │  Templates
└─────┴─────┴─────┴─────┴─────┘
```

### Chat Mode Visual Layout
```
┌─────┬─────┬─────┬─────┬─────┐
│ 😊  │ 😂  │ ❤️  │ 👍  │ 🔥  │  Quick emoji
├─────┼─────┼─────┼─────┼─────┤
│ lol │ omg │ btw │ brb │ idk │  Abbreviations
├─────┼─────┼─────┼─────┼─────┤
│ !!! │ ??? │ ... │ :D  │ <3  │  Informal punct.
└─────┴─────┴─────┴─────┴─────┘
```

---

## Appendix B: Sample Tasks

### Code Task Example 1
**Title**: Fibonacci Function
**Description**: Write a function that calculates the nth Fibonacci number.
**Target Code**:
```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Email Task Example 1
**Title**: Meeting Request
**Description**: Write an email requesting a 30-minute meeting with your manager next week.
**Expected Elements**:
- Professional greeting
- Purpose statement
- Time proposal
- Formal closing

### Chat Task Example 1
**Title**: Exciting News
**Description**: Tell your friend about getting concert tickets using enthusiastic, casual language.
**Expected Elements**:
- Casual greeting
- Emoji usage
- Excitement expression
- Informal language

---

## Appendix C: Data Privacy & Ethics

### 12.1 Informed Consent
- Clear explanation of study purpose
- Data usage disclosure
- Right to withdraw at any time
- Anonymization procedures
- Contact information for questions

### 12.2 Data Anonymization
- Replace user IDs with random hashes
- Remove personally identifiable information
- Aggregate demographic data
- Secure storage with encryption

### 12.3 IRB Approval
- Submit protocol to Institutional Review Board
- Include consent forms
- Detail data security measures
- Specify participant risks (minimal: typing fatigue)

---

## Appendix D: Success Criteria

### Technical Success
- [ ] Context detection accuracy >90%
- [ ] API response time <200ms (p95)
- [ ] Zero data loss during study
- [ ] System uptime >99% during study period

### Research Success
- [ ] Statistically significant improvement in WPM (p < 0.05)
- [ ] Reduction in error rate compared to control
- [ ] Positive user satisfaction (SUS score >70)
- [ ] Minimum 5 participants complete full study

### Publication Success
- [ ] Results worthy of HCI conference submission
- [ ] Novel contribution to adaptive interface research
- [ ] Clear practical applications demonstrated
- [ ] Reproducible methodology documented

---

## Next Steps for AI Implementation

When you're ready to code, the AI should:

1. **Start with Phase 1**: Setup project structure, basic UI
2. **Use this document as specification**: Each section has clear requirements
3. **Follow the technology stack**: Consistent tools throughout
4. **Implement incrementally**: Test each phase before moving on
5. **Maintain documentation**: Update as implementation evolves

**Priority Components to Code First**:
1. Static keyboard UI (no detection yet)
2. Text input area with basic metrics
3. Context detection API (rule-based only initially)
4. Simple layout switching
5. Metrics dashboard

This documentation provides complete specifications for building ContextType end-to-end. Every component, API, and feature is detailed with enough clarity for AI-assisted development.

