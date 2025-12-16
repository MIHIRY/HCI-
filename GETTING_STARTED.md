# Getting Started with ContextType

Welcome to ContextType! This guide will help you get the project up and running.

## ✅ What's Been Implemented (Phase 1)

The foundation of the ContextType adaptive keyboard system has been set up:

### Frontend ✅
- **React 18 + TypeScript + Vite** - Modern, fast development setup
- **Tailwind CSS** - Utility-first styling with custom keyboard themes
- **Zustand** - Lightweight state management
- **Components Created**:
  - `Keyboard` - Adaptive keyboard display with context-specific layouts
  - `TextInput` - Smart text area with real-time word/character count
  - `ContextIndicator` - Visual context display with manual override
  - `MetricsDisplay` - Real-time performance metrics (WPM, keystrokes, time)
  - `App` - Main application layout integrating all components

### Backend ✅
- **Node.js + TypeScript + Express** - Robust API server
- **Prisma ORM** - Type-safe database access
- **API Endpoints Implemented**:
  - `/api/v1/context/detect` - Rule-based context detection
  - `/api/v1/layout/:context` - Keyboard layout retrieval
  - `/api/v1/metrics/*` - Performance tracking endpoints
  - `/api/v1/study/*` - User study management endpoints
- **Context Detection Engine** - Rule-based algorithm detecting Code/Email/Chat contexts
- **Socket.IO** - Real-time WebSocket support for live updates

### Database ✅
- **PostgreSQL Schema** - Complete database schema with Prisma
- **Docker Compose** - Ready-to-use database configuration
- **Tables**: Users, Sessions, Keystrokes, Context Detections, Metrics, Tasks, etc.

## 🚀 Running the Project

### Option 1: Frontend Only (Quick Start)

If you just want to see the UI and test the adaptive keyboard:

```bash
# Navigate to frontend
cd frontend

# Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

**Note**: The frontend will run in "offline mode" with mock data. You can still:
- Type in the text area
- Manually switch between Code/Email/Chat modes
- See the adaptive keyboard change layouts
- View real-time metrics (WPM, keystrokes, time)

### Option 2: Full Stack (Frontend + Backend)

To enable context detection and full functionality:

#### Step 1: Start the Backend

```bash
# Navigate to backend
cd backend

# Start the development server
npm run dev
```

The backend will start on `http://localhost:3000`

#### Step 2: Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

Now you'll have:
- ✅ Automatic context detection as you type
- ✅ Real API communication
- ✅ Full keyboard layout switching

### Option 3: With Database (Complete Setup)

**Prerequisites**: Docker Desktop must be installed

#### Step 1: Install Docker

Download and install Docker Desktop from:
- Windows/Mac: https://www.docker.com/products/docker-desktop

#### Step 2: Start Database Services

```bash
# From project root
docker compose up -d postgres redis
```

#### Step 3: Setup Database Schema

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Note: The database is already initialized with schema from docker/init-db.sql
# If you need to run Prisma migrations:
# npm run prisma:migrate
```

#### Step 4: Start Backend & Frontend

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🧪 Testing the System

### Test Context Detection

Try typing these sample texts to see the keyboard adapt:

**Code Context:**
```
function calculateSum(a, b) {
  return a + b;
}
```

**Email Context:**
```
Dear Dr. Smith,

I hope this email finds you well. I wanted to reach out regarding the upcoming meeting.

Best regards,
John
```

**Chat Context:**
```
omg that's so cool! 😊 btw are you coming to the party? lol can't wait!!!
```

### Manual Context Override

Click the context buttons (💻 Code, ✉ Email, 💬 Chat) in the Context Indicator panel to manually switch modes.

## 📁 Project Structure

```
ContextType/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # Zustand store
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app
│   └── package.json
│
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic (context detection)
│   │   └── index.ts       # Server entry
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
├── docker/
│   └── init-db.sql        # PostgreSQL initialization
│
├── docker-compose.yml     # Docker services
└── README.md
```

## 🎯 Key Features You Can Test Now

1. **Adaptive Keyboard** ✅
   - Three distinct layouts for Code, Email, Chat
   - Color-coded keys per context
   - Smooth transitions

2. **Context Detection** ✅
   - Rule-based keyword detection
   - Confidence scoring
   - Automatic layout switching

3. **Real-Time Metrics** ✅
   - Words Per Minute (WPM)
   - Total keystrokes
   - Session time
   - Character count

4. **Manual Override** ✅
   - Force specific context
   - Instant layout switching
   - Visual feedback

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection issues
- Ensure Docker Desktop is running
- Check if PostgreSQL container is up: `docker ps`
- Verify `.env` file in backend/ has correct `DATABASE_URL`

### Context detection not working
- Make sure backend is running (`npm run dev` in backend/)
- Check browser console for errors (F12)
- Ensure `.env` in frontend/ has `VITE_API_URL=http://localhost:3000/api/v1`

## 📝 Next Steps (Future Phases)

The following features are planned for future implementation:

- [ ] **Phase 2**: Machine Learning context detection model
- [ ] **Phase 3**: Advanced Fitts' Law keyboard optimizations
- [ ] **Phase 4**: Comprehensive analytics dashboard with charts
- [ ] **Phase 5**: User study platform with task management
- [ ] **Phase 6**: Error tracking and correction analysis
- [ ] **Phase 7**: Data export and analysis tools

## 🙋 Need Help?

- Check the main `README.md` for general project info
- Review `ContextType_Project_Documentation.md` for detailed specifications
- Check backend logs in the terminal running `npm run dev`
- Check frontend console (F12 in browser)

## 🎉 You're All Set!

The ContextType adaptive keyboard is ready to use. Start typing and watch the keyboard intelligently adapt to your context!
