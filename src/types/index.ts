export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  merchantCategory: string;
  userId: string;
  location: string;
  riskScore: number;
  status: 'Legitimate' | 'Fraudulent';
  isReviewed: boolean;
  explanation?: string;
}

export interface Invoice {
  id: string;
  vendorName: string;
  amount: number;
  paymentDate: string;
  status: 'Pending' | 'Approved' | 'Flagged';
  riskScore: number;
  isReviewed: boolean;
}

export interface Payroll {
  id: string;
  employeeId: string;
  department: string;
  salary: number;
  overtime: number;
  bankAccountChanged: boolean;
  riskScore: number;
  isReviewed: boolean;
}

export interface DashboardMetrics {
  totalFlagged: number;
  avgRiskScore: number;
  financialImpact: number;
  fraudOverTime: { date: string; count: number }[];
  fraudByCategory: { category: string; value: number }[];
}
