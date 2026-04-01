import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_financial_data(n_samples=1000):
    """
    Generates realistic financial data with synthetic anomalies.
    """
    # 1. Transactions
    transactions = []
    categories = ['Retail', 'Travel', 'Dining', 'Services', 'Electronics', 'Healthcare']
    locations = ['New York, NY', 'San Francisco, CA', 'London, UK', 'Berlin, DE', 'Tokyo, JP']
    
    for i in range(n_samples):
        is_fraud = np.random.choice([0, 1], p=[0.95, 0.05])
        amount = np.random.exponential(scale=100) if not is_fraud else np.random.uniform(1000, 5000)
        
        # Anomaly: Round dollar amount just below approval limit (e.g., $999)
        if np.random.random() > 0.98:
            amount = 999.0
            is_fraud = 1
            
        transactions.append({
            'id': f'TX_{i}',
            'amount': round(amount, 2),
            'timestamp': datetime.now() - timedelta(days=random.randint(0, 30)),
            'merchant_category': random.choice(categories),
            'user_id': f'USER_{random.randint(1, 100)}',
            'location': random.choice(locations),
            'is_fraud': is_fraud
        })
        
    # 2. Invoices
    invoices = []
    vendors = ['Cloud Solutions', 'Global Logistics', 'Office Depot', 'AWS', 'Stripe']
    
    for i in range(n_samples // 10):
        is_anomaly = np.random.choice([0, 1], p=[0.92, 0.08])
        amount = np.random.uniform(500, 20000)
        
        # Anomaly: Duplicate invoice
        if is_anomaly and i > 0:
            prev_invoice = invoices[-1]
            invoices.append(prev_invoice.copy())
            continue
            
        invoices.append({
            'id': f'INV_{i}',
            'vendor': random.choice(vendors),
            'amount': round(amount, 2),
            'date': datetime.now() - timedelta(days=random.randint(0, 15)),
            'status': 'Approved' if not is_anomaly else 'Flagged'
        })
        
    return pd.DataFrame(transactions), pd.DataFrame(invoices)

if __name__ == "__main__":
    tx_df, inv_df = generate_financial_data()
    tx_df.to_csv('transactions.csv', index=False)
    inv_df.to_csv('invoices.csv', index=False)
    print("Data generated successfully.")
