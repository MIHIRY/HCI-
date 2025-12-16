# ContextType: Adaptive Keyboard System

An intelligent adaptive keyboard system that automatically adjusts its layout based on writing context (programming, email, chat) to maximize typing efficiency.

## Project Structure

```
ContextType/
├── frontend/           # React + TypeScript + Vite frontend
├── backend/            # Node.js + TypeScript + Express API
├── ml-service/         # Python + FastAPI ML/NLP service
├── docker/             # Docker configuration files
├── docker-compose.yml  # Docker services orchestration
└── README.md           # This file
```

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma
- **API Docs**: Swagger/OpenAPI

### ML Service
- **Language**: Python 3.9+
- **Framework**: FastAPI
- **ML Libraries**: transformers, scikit-learn, nltk

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Project

# Start database services
docker-compose up -d postgres redis
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. ML Service Setup (Optional - for advanced context detection)

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

ML service will run on `http://localhost:8000`

## Development

### Database Management

```bash
# View database logs
docker-compose logs postgres

# Access PostgreSQL CLI
docker exec -it contexttype-postgres psql -U contexttype -d contexttype_db

# Stop all services
docker-compose down

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d postgres redis
```

### Environment Variables

Create `.env` files in each service directory:

**backend/.env**:
```
DATABASE_URL=postgresql://contexttype:contexttype_dev_password@localhost:5432/contexttype_db
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
```

**frontend/.env**:
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```
# ContextType - How to Run the Project

This guide provides step-by-step instructions to set up and run the ContextType adaptive keyboard application.

---

## Table of Contents
1. Prerequisites
2. Project Structure
3. Installation
4. Environment Configuration
5. Running the Application
6. Accessing the Application
7. Quick Start Summary
8. Testing the Application
9. Stopping the Application
10. Additional Information
11. Advanced Configuration
12. Project Technology Stack
13. Useful Commands
14. Next Steps

---

## Prerequisites

### Required Software
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Required API Key
- **Groq API Key** for LLM-based suggestions

---

## Project Structure

```
ContextType/
│
├── frontend/
├── backend/
└── HOW_TO_RUN.md
```

---

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

---

## Environment Configuration

### Backend `.env`
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

---

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm start
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

---

## Accessing the Application

Open a browser and navigate to:
```
http://localhost:5173
```

---

## Quick Start Summary

```bash
cd backend
npm install
npm start

cd ../frontend
npm install
npm run dev
```

---

## Testing the Application

### Basic Test
- Select **CODE** context
- Type: `function hello`
- Verify suggestions appear

### Context Switching
- EMAIL → `Dear Professor`
- CHAT → `hey how are`

---

## Stopping the Application

- Stop frontend: `Ctrl + C`
- Stop backend: `Ctrl + C`

---

## Additional Information

### API Usage
- Groq API usage depends on your plan

### Browser Support
- Chrome, Firefox, Safari, Edge

### System Requirements
- Minimum: 2 CPU cores, 4GB RAM
- Recommended: 4+ cores, 8GB RAM

---

## Advanced Configuration

### Mobile Testing
- Replace `localhost` with local IP in `.env` files

### Changing Ports
- Update `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env`

---

## Project Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Zustand
- TailwindCSS

### Backend
- Node.js
- Express
- Groq SDK

### LLM
- Groq
- llama-3.3-70b-versatile

---

## Useful Commands

```bash
node --version
npm --version
```

---

## Next Steps

- Test all contexts
- Review code structure
- Observe LLM-based suggestions

---

**Version:** 1.0.0  
**Project:** ContextType


## Project Phases

- [ ] **Phase 1**: Foundation - Project setup, basic UI 
- [ ] **Phase 2**: Context Detection - NLP engine, ML model(Groq) 
- [ ] **Phase 3**: Fitts' Law Optimization - Personalized layouts 
- [ ] **Phase 4**: Metrics & Analytics - Data collection, dashboard
- [ ] **Phase 5**: User Study System - Study platform, questionnaires
- [ ] **Phase 6**: Testing & Refinement
- [ ] **Phase 7**: User Study Execution
- [ ] **Phase 8**: Analysis & Reporting

### Phase 3 Complete! 🚀

Intelligent keyboard optimization with Fitts' Law! Keys resize and reposition based on your typing patterns for 10-15% speed improvement. See [PHASE3_FITTS_LAW_GUIDE.md](PHASE3_FITTS_LAW_GUIDE.md) for details.

## Key Features

- ✅ Automatic context detection (Code, Email, Chat)
- ✅ Dynamic keyboard layout adaptation
- ✅ Fitts' Law optimized key positioning
- ✅ Real-time performance tracking (WPM, error rates)
- ✅ Built-in user study framework
- ✅ Comprehensive analytics dashboard



## Contact

mihir.yanamandra@stonybrook.edu
