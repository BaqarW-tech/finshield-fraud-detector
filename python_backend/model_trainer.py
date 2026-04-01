import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from xgboost import XGBClassifier
import joblib
import os

def train_models(transactions_df):
    """
    Trains unsupervised (Isolation Forest) and supervised (XGBoost) models.
    """
    # 1. Unsupervised: Isolation Forest for Anomaly Detection
    # Features: amount, merchant_category (encoded), location (encoded)
    X_unsupervised = transactions_df[['amount']]
    iso_forest = IsolationForest(contamination=0.05, random_state=42)
    iso_forest.fit(X_unsupervised)
    
    # 2. Supervised: XGBoost for Fraud Classification
    # Features: amount, merchant_category (encoded), location (encoded)
    # Target: is_fraud
    X_supervised = transactions_df[['amount']]
    y_supervised = transactions_df['is_fraud']
    
    xgb_model = XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
    xgb_model.fit(X_supervised, y_supervised)
    
    # Save models
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(iso_forest, 'models/iso_forest.pkl')
    joblib.dump(xgb_model, 'models/xgb_model.pkl')
    
    print("Models trained and saved successfully.")

if __name__ == "__main__":
    tx_df = pd.read_csv('transactions.csv')
    train_models(tx_df)
