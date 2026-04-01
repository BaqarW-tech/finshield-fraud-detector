import { Transaction, Invoice, Payroll } from '../types';
import { subDays, format } from 'date-fns';

const categories = ['Retail', 'Travel', 'Dining', 'Services', 'Electronics', 'Healthcare'];
const locations = ['New York, NY', 'San Francisco, CA', 'London, UK', 'Berlin, DE', 'Tokyo, JP', 'Sydney, AU'];
const vendors = ['Cloud Solutions Inc', 'Global Logistics', 'Office Depot', 'Amazon Web Services', 'Stripe Payments', 'Zoom Video'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

export const generateMockTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }).map((_, i) => {
    const amount = Math.floor(Math.random() * 5000) + 10;
    const isAnomalous = Math.random() > 0.9;
    
    // Inject anomalies
    let riskScore = Math.floor(Math.random() * 40);
    let explanation = '';
    
    if (isAnomalous) {
      riskScore = 85 + Math.floor(Math.random() * 15);
      if (amount > 4500) explanation = 'Unusually high transaction amount for user profile.';
      else if (Math.random() > 0.5) explanation = 'Multiple transactions from same IP in short interval.';
      else explanation = 'Transaction location inconsistent with user history.';
    }

    return {
      id: `tx-${i}`,
      timestamp: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd HH:mm:ss'),
      amount,
      merchantCategory: categories[Math.floor(Math.random() * categories.length)],
      userId: `user-${Math.floor(Math.random() * 100)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      riskScore,
      status: riskScore > 85 ? 'Fraudulent' : 'Legitimate',
      isReviewed: false,
      explanation
    };
  });
};

export const generateMockInvoices = (count: number): Invoice[] => {
  return Array.from({ length: count }).map((_, i) => {
    const amount = Math.floor(Math.random() * 20000) + 500;
    const isAnomalous = Math.random() > 0.92;
    
    let riskScore = Math.floor(Math.random() * 30);
    if (isAnomalous) {
      riskScore = 80 + Math.floor(Math.random() * 20);
    }

    return {
      id: `inv-${i}`,
      vendorName: vendors[Math.floor(Math.random() * vendors.length)],
      amount,
      paymentDate: format(subDays(new Date(), Math.floor(Math.random() * 15)), 'yyyy-MM-dd'),
      status: riskScore > 85 ? 'Flagged' : 'Approved',
      riskScore,
      isReviewed: false
    };
  });
};

export const generateMockPayroll = (count: number): Payroll[] => {
  return Array.from({ length: count }).map((_, i) => {
    const salary = Math.floor(Math.random() * 10000) + 3000;
    const overtime = Math.random() > 0.8 ? Math.floor(Math.random() * 2000) : 0;
    const bankAccountChanged = Math.random() > 0.95;
    
    let riskScore = Math.floor(Math.random() * 20);
    if (bankAccountChanged) riskScore += 40;
    if (overtime > 1500) riskScore += 30;

    return {
      id: `pay-${i}`,
      employeeId: `emp-${1000 + i}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary,
      overtime,
      bankAccountChanged,
      riskScore,
      isReviewed: false
    };
  });
};
