"""
ContextType ML Service
FastAPI application for machine learning-based context detection
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import os
from datetime import datetime

from .model import ContextDetectionModel
from .preprocessor import TextPreprocessor

# Initialize FastAPI app
app = FastAPI(
    title="ContextType ML Service",
    description="Machine Learning service for adaptive keyboard context detection",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model and preprocessor
model = ContextDetectionModel()
preprocessor = TextPreprocessor()


# Request/Response Models
class DetectionRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Text to analyze")
    previous_context: Optional[str] = Field(None, description="Previous detected context")
    use_ml: bool = Field(True, description="Use ML model (vs rule-based only)")


class ContextPrediction(BaseModel):
    context: str
    confidence: float


class DetectionResponse(BaseModel):
    context: str
    confidence: float
    detection_id: str
    timestamp: str
    method: str  # 'ml' or 'rule-based'
    alternative_contexts: List[ContextPrediction]
    processing_time_ms: float


class TrainingRequest(BaseModel):
    samples: List[dict]  # List of {text: str, label: str}


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_accuracy: Optional[float]
    timestamp: str


# API Endpoints

@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "service": "ContextType ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "detect": "/api/v1/detect",
            "train": "/api/v1/train",
            "health": "/health",
            "metrics": "/api/v1/metrics"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=model.is_trained,
        model_accuracy=model.get_accuracy() if model.is_trained else None,
        timestamp=datetime.utcnow().isoformat()
    )


@app.post("/api/v1/detect", response_model=DetectionResponse)
async def detect_context(request: DetectionRequest):
    """
    Detect context from text using ML model
    """
    import time
    start_time = time.time()

    try:
        # Preprocess text
        processed_text = preprocessor.preprocess(request.text)

        # Get prediction
        if request.use_ml and model.is_trained:
            result = model.predict(processed_text)
            method = "ml"
        else:
            # Fallback to rule-based (hybrid approach)
            result = model.predict_rule_based(processed_text)
            method = "rule-based"

        processing_time = (time.time() - start_time) * 1000  # Convert to ms

        # Generate unique ID
        import uuid
        detection_id = str(uuid.uuid4())

        return DetectionResponse(
            context=result['context'],
            confidence=result['confidence'],
            detection_id=detection_id,
            timestamp=datetime.utcnow().isoformat(),
            method=method,
            alternative_contexts=[
                ContextPrediction(context=alt['context'], confidence=alt['confidence'])
                for alt in result.get('alternatives', [])
            ],
            processing_time_ms=round(processing_time, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.post("/api/v1/train")
async def train_model(request: TrainingRequest):
    """
    Train or retrain the ML model with new data
    """
    try:
        if len(request.samples) < 10:
            raise HTTPException(
                status_code=400,
                detail="Need at least 10 samples to train"
            )

        # Extract texts and labels
        texts = [sample['text'] for sample in request.samples]
        labels = [sample['label'] for sample in request.samples]

        # Validate labels
        valid_labels = {'code', 'email', 'chat'}
        if not all(label in valid_labels for label in labels):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid labels. Must be one of: {valid_labels}"
            )

        # Train model
        accuracy = model.train(texts, labels)

        return {
            "status": "success",
            "samples_trained": len(texts),
            "accuracy": accuracy,
            "timestamp": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@app.get("/api/v1/metrics")
async def get_metrics():
    """
    Get model performance metrics
    """
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained yet")

    return {
        "accuracy": model.get_accuracy(),
        "is_trained": model.is_trained,
        "feature_count": model.get_feature_count(),
        "classes": model.get_classes(),
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/v1/load-pretrained")
async def load_pretrained_model():
    """
    Load pre-trained model from disk
    """
    try:
        success = model.load_model()
        if success:
            return {
                "status": "success",
                "message": "Pre-trained model loaded successfully",
                "accuracy": model.get_accuracy()
            }
        else:
            raise HTTPException(status_code=404, detail="No pre-trained model found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")


if __name__ == "__main__":
    # Run with: python -m app.main
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
