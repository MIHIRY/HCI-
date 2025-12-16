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

## Project Phases

- [x] **Phase 1**: Foundation - Project setup, basic UI ✅
- [x] **Phase 2**: Context Detection - NLP engine, ML model ✅
- [x] **Phase 3**: Fitts' Law Optimization - Personalized layouts ✅
- [ ] **Phase 4**: Metrics & Analytics - Data collection, dashboard
- [ ] **Phase 5**: User Study System - Study platform, questionnaires
- [ ] **Phase 6**: Testing & Refinement
- [ ] **Phase 7**: User Study Execution
- [ ] **Phase 8**: Analysis & Reporting

### Phase 3 Complete! 🚀

Intelligent keyboard optimization with Fitts' Law! Keys resize and reposition based on your typing patterns for 10-15% speed improvement. See [PHASE3_FITTS_LAW_GUIDE.md](PHASE3_FITTS_LAW_GUIDE.md) for details.

**Previous Phases:**
- Phase 2: ML-powered context detection (95-98% accuracy) - [PHASE2_ML_GUIDE.md](PHASE2_ML_GUIDE.md)
- Phase 1: Foundation and basic UI - [GETTING_STARTED.md](GETTING_STARTED.md)

## Key Features

- ✅ Automatic context detection (Code, Email, Chat)
- ✅ Dynamic keyboard layout adaptation
- ✅ Fitts' Law optimized key positioning
- ✅ Real-time performance tracking (WPM, error rates)
- ✅ Built-in user study framework
- ✅ Comprehensive analytics dashboard

## Contributing

Please refer to `ContextType_Project_Documentation.md` for detailed specifications and implementation guidelines.

## License

[Specify License]

## Contact

[Your contact information]
