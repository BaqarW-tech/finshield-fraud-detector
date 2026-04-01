# Sentinel: Fraud & Risk Detection System 🛡️

Sentinel is a comprehensive, AI-powered financial risk detection system designed to identify fraudulent transactions and internal accounting anomalies (invoices/payroll) in real-time.

## 🚀 Why This is Important for Business 
- **Hybrid AI Model**: Combines **Unsupervised Learning** (Isolation Forest) for anomaly detection with **Supervised Learning** (XGBoost) for fraud classification.
- **Explainable AI (XAI)**: Uses **SHAP values** to explain *why* a transaction was flagged, providing transparency for risk analysts.
- **Business Impact**: Reduces manual review time by an estimated **80%** by prioritizing high-risk items through a composite risk scoring engine.
- **Full-Stack Architecture**: Features a high-performance **FastAPI** backend and a modern **React** dashboard with real-time data visualization.

## 🛠️ Technical Stack
- **Backend**: Python (FastAPI), Scikit-learn, XGBoost, Pandas, NumPy, SHAP.
- **Frontend**: React, Recharts (Visualization), Tailwind CSS, Framer Motion.
- **Database**: SQLite (for portability) / PostgreSQL.
- **Deployment**: Docker & Docker Compose support.

## 📊 Features
1. **Real-time Risk Scoring**: Composite score (0-100) based on anomaly detection and historical patterns.
2. **Anomaly Detection**: Identifies outliers in transaction amounts, frequency, and location.
3. **Internal Control Monitoring**: Detects duplicate invoices, round-dollar approval limit bypassing, and payroll anomalies.
4. **Interactive Dashboard**: KPI cards, time-series fraud analysis, and merchant category heatmaps.
5. **Human-in-the-Loop**: Ability to mark flags as "False Positive" or "Confirmed Fraud" to retrain the models.

## ⚙️ Setup Instructions

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Manual Setup
1. **Backend**:
   ```bash
   cd python_backend
   pip install -r requirements.txt
   python data_generator.py  # Generate synthetic data
   python model_trainer.py   # Train the initial models
   uvicorn main:app --reload
   ```
2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

## 📈 Screenshots

---
Developed by BaqarW-tech 
