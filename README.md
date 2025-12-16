# ContextType: Adaptive Keyboard System

An intelligent adaptive keyboard system that provides context-aware text suggestions using LLM technology. The system automatically detects writing context (programming, email, chat) and provides intelligent next-word predictions.

---

## 📋 Overview

ContextType is a web-based adaptive keyboard interface that leverages the Groq LLM API to provide intelligent, context-aware text suggestions in real-time. The system helps users type faster and more accurately by predicting the next word based on the current context.

---

## 🏗️ Project Structure

```
ContextType/
│
├── frontend/              # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── store/        # Zustand state management
│   │   └── types/        # TypeScript type definitions
│   ├── package.json
│   └── .env              # Frontend environment variables
│
├── backend/              # Node.js + Express backend
│   ├── services/
│   │   └── groq.js      # Groq LLM integration
│   ├── routes/
│   │   └── suggestions.js
│   ├── server.js
│   ├── package.json
│   └── .env             # Backend environment variables (API keys)
│
├── HOW_TO_RUN.md        # Detailed setup and running instructions
└── README.md            # This file
```

---

## 🚀 Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (fast development and builds)
- **Styling**: Tailwind CSS (utility-first CSS)
- **State Management**: Zustand (lightweight state management)
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js (web server)
- **LLM Integration**: Groq SDK (llama-3.3-70b-versatile)
- **Environment Config**: dotenv
- **CORS**: Express CORS middleware

### AI/LLM
- **Provider**: Groq
- **Model**: llama-3.3-70b-versatile (70B parameter model)
- **Purpose**: Context-aware next-word prediction
- **API**: RESTful API integration

---

## ✨ Key Features

### 1. Context-Aware Suggestions
- **CODE**: Optimized for programming syntax (functions, variables, keywords)
- **EMAIL**: Professional email writing (formal language, common phrases)
- **CHAT**: Casual conversation (slang, emojis, abbreviations)

### 2. Real-Time LLM Integration
- Direct integration with Groq's llama-3.3-70b-versatile model
- Fast response times (<200ms average)
- Intelligent next-word prediction based on full text context

### 3. Performance Metrics
- **WPM (Words Per Minute)**: Real-time typing speed tracking
- **Total Keystrokes**: Cumulative keystroke counter
- **Characters Typed**: Character count tracking

### 4. Smart Triggering
- Commit signal detection (space, punctuation, newline)
- Pause-based suggestion triggering (350ms threshold)
- Minimum-change gate rules to prevent excessive API calls

---

## 📦 Prerequisites

Before running the project, you need:

1. **Node.js** (v16.0.0 or higher)
   - Download: https://nodejs.org/

2. **npm** (v8.0.0 or higher)
   - Comes with Node.js

3. **Groq API Key** (Required)
   - Sign up: https://console.groq.com/
   - Create API key from dashboard

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env)**:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**📖 For detailed setup instructions, see [HOW_TO_RUN.md](HOW_TO_RUN.md)**

---

## 🎯 Usage

1. **Select Context**: Click on `CODE`, `EMAIL`, or `CHAT` button
2. **Start Typing**: Type in the text input area
3. **View Suggestions**: Suggestions appear below the input
4. **Select Suggestion**: Click a suggestion to insert it
5. **Monitor Performance**: Check metrics on the right panel

---

## 🔧 Development

### Backend Architecture

```
Backend (Port 3001)
│
├── server.js              # Express server setup
├── routes/
│   └── suggestions.js     # POST /api/v1/suggestions endpoint
└── services/
    └── groq.js           # Groq LLM client and logic
```

**Key Files:**
- `server.js`: Express server configuration, CORS setup, routing
- `groq.js`: Groq client initialization, system prompts, suggestion generation
- `suggestions.js`: REST API endpoint for fetching suggestions

### Frontend Architecture

```
Frontend (Port 5173)
│
├── src/
│   ├── components/
│   │   ├── ContextSelector.tsx     # Context switching buttons
│   │   ├── MetricsDisplay.tsx      # Performance metrics
│   │   └── SuggestionStrip.tsx     # Suggestion display
│   ├── hooks/
│   │   └── useSuggestions.ts       # Suggestion fetching logic
│   ├── services/
│   │   └── suggestionService.ts    # API client
│   └── store/
│       └── useAppStore.ts          # Zustand global state
```

**Key Components:**
- `useSuggestions`: Custom hook managing suggestion fetching, caching, and gate rules
- `suggestionService`: HTTP client for backend API communication
- `useAppStore`: Global state (text, context, metrics)

---

## 🧪 Testing

### Manual Testing

1. **Context Switching Test**:
   - Switch between CODE, EMAIL, CHAT contexts
   - Verify suggestions change appropriately

2. **Suggestion Quality Test**:
   - CODE: Type `function hello`
   - EMAIL: Type `Dear Professor`
   - CHAT: Type `hey how are`
   - Verify relevant suggestions appear

3. **Performance Test**:
   - Type continuously for 1 minute
   - Check WPM calculation is accurate
   - Verify keystroke counting

### Backend Logs

Monitor backend terminal for:
```
🤖 CALLING GROQ LLM...
✅ GROQ SUGGESTIONS: [suggestions]
```

---

## 📊 System Prompts

The backend uses specialized prompts for each context:

### CODE Context
- Predicts programming syntax, keywords, identifiers
- Examples: `function`, `const`, `return`, method names

### EMAIL Context
- Predicts professional language, common phrases
- Examples: `Dear`, `Thank you for your`, formal closings

### CHAT Context
- Predicts casual language, slang, emojis
- Examples: `lol`, `yeah`, `omg`, conversational patterns

---

## 🔒 Environment Variables

### Backend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GROQ_API_KEY` | ✅ Yes | Groq API authentication key | `gsk_xxxxx...` |
| `PORT` | ⚠️ Optional | Backend server port (default: 3001) | `3001` |
| `FRONTEND_URL` | ⚠️ Optional | Frontend URL for CORS | `http://localhost:5173` |

### Frontend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API base URL | `http://localhost:3001` |
| `VITE_WS_URL` | ❌ Optional | WebSocket URL (future use) | `ws://localhost:3001` |

---

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /F /PID <PID>

   # Mac/Linux
   lsof -ti:3001 | xargs kill -9
   ```

2. **Invalid API Key**
   - Check `backend/.env` has correct `GROQ_API_KEY`
   - Restart backend after updating

3. **No Suggestions Appearing**
   - Verify backend is running
   - Check backend logs for errors
   - Ensure API key is valid

4. **Frontend Cannot Connect**
   - Verify `VITE_API_URL=http://localhost:3001` in `frontend/.env`
   - Restart frontend after updating

**For detailed troubleshooting, see [HOW_TO_RUN.md](HOW_TO_RUN.md)**

---

## 📈 Performance

### Expected Metrics

- **API Response Time**: <300ms average
- **Suggestion Latency**: <500ms (with debouncing)
- **Accuracy**: Depends on context and input quality
- **Rate Limit**: Based on Groq API plan (free tier: limited)

### Optimization Strategies

1. **Gate Rules**: Prevent excessive API calls
   - Minimum 3 characters since last request
   - Minimum 2 characters in current word

2. **Caching**: Store recent suggestions
   - 50 entry LRU cache
   - Context-aware cache keys

3. **Debouncing**: 350ms pause threshold
   - Reduces API calls during continuous typing
   - Triggers on commit signals (space, punctuation)

---

## 🚧 Known Limitations

1. **Internet Required**: Groq API requires internet connection
2. **API Rate Limits**: Free tier has request limits
3. **English Only**: Optimized for English language input
4. **Single User**: No multi-user support or authentication

---

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] User authentication and personalization
- [ ] Offline mode with local models
- [ ] Advanced metrics dashboard
- [ ] Custom context creation
- [ ] Voice input integration
- [ ] Mobile app version

---

## 📚 Documentation

- **[HOW_TO_RUN.md](HOW_TO_RUN.md)**: Comprehensive setup and running guide
- **Backend Code**: Well-commented JavaScript/Node.js code
- **Frontend Code**: TypeScript with type definitions

---

## 🛠️ Built With

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Express.js](https://expressjs.com/) - Backend framework
- [Groq](https://groq.com/) - LLM API provider
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

## 📄 License

This project is created for educational purposes as part of an HCI course project.

---

## 👤 Contact

**Mihir Yanamandra**
Email: mihir.yanamandra@stonybrook.edu
University: Stony Brook University

---

## 🙏 Acknowledgments

- Groq for providing fast LLM API access
- Stony Brook University HCI course
- Open-source community for tools and libraries

---

## 📝 Version History

- **v1.0.0** (December 2025)
  - Initial release
  - Groq LLM integration
  - Context-aware suggestions (CODE, EMAIL, CHAT)
  - Real-time performance metrics
  - React + Express architecture

---

**Last Updated**: December 2025
**Status**: Active Development
**Project Type**: HCI Course Project
