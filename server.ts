import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMockTransactions, generateMockInvoices, generateMockPayroll } from './src/data/mockData';
import { Transaction, DashboardMetrics } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // In-memory data store for the preview session
  let transactions = generateMockTransactions(100);
  let invoices = generateMockInvoices(50);
  let payroll = generateMockPayroll(30);

  // API Routes
  app.get('/api/dashboard_data', (req, res) => {
    const flagged = transactions.filter(t => t.riskScore > 85 && !t.isReviewed);
    const avgRisk = transactions.reduce((acc, t) => acc + t.riskScore, 0) / transactions.length;
    const impact = flagged.reduce((acc, t) => acc + t.amount, 0);

    // Group by category
    const categories = transactions.reduce((acc: any, t) => {
      if (t.riskScore > 80) {
        acc[t.merchantCategory] = (acc[t.merchantCategory] || 0) + 1;
      }
      return acc;
    }, {});

    const metrics: DashboardMetrics = {
      totalFlagged: flagged.length,
      avgRiskScore: Math.round(avgRisk),
      financialImpact: impact,
      fraudOverTime: Array.from({ length: 7 }).map((_, i) => ({
        date: `Day ${i + 1}`,
        count: Math.floor(Math.random() * 10)
      })),
      fraudByCategory: Object.entries(categories).map(([category, value]) => ({
        category,
        value: value as number
      }))
    };

    res.json(metrics);
  });

  app.get('/api/transactions', (req, res) => {
    res.json(transactions);
  });

  app.post('/api/predict', (req, res) => {
    const { amount, location, merchantCategory } = req.body;
    
    // Simple simulated risk engine
    let riskScore = Math.floor(Math.random() * 30);
    let explanation = 'Normal transaction pattern.';

    if (amount > 4000) {
      riskScore = 88;
      explanation = 'High transaction amount detected.';
    } else if (location === 'Unknown') {
      riskScore = 75;
      explanation = 'Unverified location.';
    }

    res.json({
      riskScore,
      status: riskScore > 85 ? 'Fraudulent' : 'Legitimate',
      explanation,
      shapValues: {
        amount: 0.65,
        location: 0.2,
        history: 0.15
      }
    });
  });

  app.post('/api/review/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    transactions = transactions.map(t => 
      t.id === id ? { ...t, isReviewed: true, status } : t
    );
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sentinel Server running on http://localhost:${PORT}`);
  });
}

startServer();
