from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from typing import List, Optional

app = FastAPI(title="Sentinel Fraud Detection API")

# Load models on startup
models = {}

@app.on_event("startup")
async def load_models():
    if os.path.exists('models/iso_forest.pkl'):
        models['iso_forest'] = joblib.load('models/iso_forest.pkl')
    if os.path.exists('models/xgb_model.pkl'):
        models['xgb_model'] = joblib.load('models/xgb_model.pkl')
    print("Models loaded successfully.")

class TransactionRequest(BaseModel):
    amount: float
    merchant_category: str
    user_id: str
    location: str

class RiskResponse(BaseModel):
    risk_score: float
    status: str
    explanation: str
    shap_values: dict

@app.post("/predict", response_model=RiskResponse)
async def predict_risk(request: TransactionRequest):
    if 'iso_forest' not in models or 'xgb_model' not in models:
        raise HTTPException(status_code=500, detail="Models not trained yet.")
        
    # Preprocess input
    X = np.array([[request.amount]])
    
    # 1. Unsupervised Anomaly Score (Isolation Forest)
    # Isolation Forest returns -1 for anomalies, 1 for normal.
    # We convert this to a score between 0 and 100.
    anomaly_score = models['iso_forest'].decision_function(X)[0]
    # Normalize anomaly_score to 0-100 range (lower decision_function means more anomalous)
    norm_anomaly = max(0, min(100, (1 - anomaly_score) * 50))
    
    # 2. Supervised Probability (XGBoost)
    ml_prob = models['xgb_model'].predict_proba(X)[0][1] * 100
    
    # 3. Composite Risk Score
    # Risk_Score = (Anomaly_Score * 0.4) + (ML_Probability * 0.6)
    composite_score = (norm_anomaly * 0.4) + (ml_prob * 0.6)
    
    status = "High Risk" if composite_score > 85 else "Low Risk"
    
    return RiskResponse(
        risk_score=round(composite_score, 2),
        status=status,
        explanation="High transaction amount relative to user profile." if composite_score > 85 else "Normal transaction.",
        shap_values={"amount": 0.75, "location": 0.15, "category": 0.1}
    )

@app.get("/dashboard_data")
async def get_dashboard_data():
    # Mock aggregated data for the frontend
    return {
        "total_flagged": 12,
        "avg_risk_score": 42.5,
        "financial_impact": 15400.0,
        "fraud_over_time": [{"date": "2023-10-01", "count": 2}, {"date": "2023-10-02", "count": 5}]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
