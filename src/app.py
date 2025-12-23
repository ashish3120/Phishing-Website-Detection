from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# Import your feature extraction logic
from .extract_features import extract_features

# ---------------------------
# Initialize FastAPI app
# ---------------------------
app = FastAPI(title="Phishing Detection API")

# ---------------------------
# CORS Middleware (REQUIRED)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://phishing-website-detection-f9lp.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=False,  # 🔑 IMPORTANT CHANGE
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Load model and metadata
# (loaded ONCE at startup)
# ---------------------------
model = joblib.load("src/best_model.joblib")
training_columns = joblib.load("src/training_columns.joblib")

# ---------------------------
# Request schema
# ---------------------------
class URLRequest(BaseModel):
    url: str

# ---------------------------
# Health check route
# ---------------------------
@app.get("/")
def index():
    return {"message": "Phishing Detection API is running!"}

# ---------------------------
# Prediction route
# ---------------------------
@app.post("/predict")
def predict(request: URLRequest):
    try:
        url = request.url.strip()

        # Extract features from URL
        feats = extract_features(url)

        # Align features with training columns
        row = {col: feats.get(col, 0) for col in training_columns}
        df = pd.DataFrame([row])

        # Make prediction
        pred = model.predict(df)[0]
        label = "phishing" if pred == 1 else "legitimate"

        # Prediction probability (if supported)
        probability = None
        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(df)[0].max())

        return {
            "url": url,
            "prediction": label,
            "confidence": probability
        }

    except Exception as e:
        return {"error": str(e)}
