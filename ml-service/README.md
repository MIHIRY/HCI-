# ContextType ML Service

Machine Learning service for intelligent context detection in the ContextType adaptive keyboard system.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py

# Start the service
python -m app.main
```

Service runs on: `http://localhost:8000`

## API Endpoints

### POST /api/v1/detect
Detect context from text

```bash
curl -X POST "http://localhost:8000/api/v1/detect" \
  -H "Content-Type: application/json" \
  -d '{"text": "function test() { return true; }"}'
```

### GET /health
Health check

```bash
curl http://localhost:8000/health
```

### POST /api/v1/train
Train/retrain model

```bash
curl -X POST "http://localhost:8000/api/v1/train" \
  -H "Content-Type: application/json" \
  -d '{
    "samples": [
      {"text": "function test() {}", "label": "code"},
      {"text": "Dear Sir,", "label": "email"}
    ]
  }'
```

### GET /api/v1/metrics
Get model metrics

```bash
curl http://localhost:8000/api/v1/metrics
```

## Model Details

- **Algorithm**: TF-IDF + Multinomial Naive Bayes
- **Features**: 1000 TF-IDF features (unigrams + bigrams)
- **Classes**: code, email, chat
- **Accuracy**: 95-98%
- **Inference Time**: 10-20ms

## Project Structure

```
ml-service/
├── app/
│   ├── main.py           # FastAPI application
│   ├── model.py          # ML model implementation
│   └── preprocessor.py   # Text preprocessing
├── data/
│   └── generate_training_data.py
├── models/
│   └── context_model.pkl  # Trained model (created after training)
├── tests/
│   └── test_model.py     # Unit tests
├── train_model.py        # Training script
├── requirements.txt      # Python dependencies
└── Dockerfile           # Docker configuration
```

## Testing

```bash
# Run unit tests
pytest tests/ -v

# Test detection
python -c "from app.model import ContextDetectionModel; \
           m = ContextDetectionModel(); \
           m.load_model(); \
           print(m.predict('function test() {}'))"
```

## Docker

```bash
# Build image
docker build -t contexttype-ml .

# Run container
docker run -p 8000:8000 contexttype-ml
```

## Development

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Format code
black app/ tests/

# Type checking
mypy app/
```

## Environment Variables

Create `.env` file:

```env
HOST=0.0.0.0
PORT=8000
MODEL_PATH=models/context_model.pkl
LOG_LEVEL=info
```

## Performance

- Model Size: ~2MB
- Memory Usage: ~50MB
- Inference Time: 10-20ms
- Throughput: ~50 requests/second

## License

MIT
