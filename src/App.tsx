import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  ShieldAlert, TrendingUp, DollarSign, Activity, 
  Search, Filter, ChevronRight, AlertTriangle, CheckCircle,
  Menu, Bell, User, LayoutDashboard, FileText, Users, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, DashboardMetrics } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export default function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, txRes] = await Promise.all([
          fetch('/api/dashboard_data'),
          fetch('/api/transactions')
        ]);
        const metricsData = await metricsRes.json();
        const txData = await txRes.json();
        setMetrics(metricsData);
        setTransactions(txData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReview = async (id: string, status: 'Legitimate' | 'Fraudulent') => {
    try {
      await fetch(`/api/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, isReviewed: true, status } : t));
    } catch (error) {
      console.error('Error reviewing transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse" />
          <p className="text-slate-600 font-medium">Initializing Sentinel Risk Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SENTINEL</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Activity size={20} />} 
            label="Risk Analysis" 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Invoices" 
            active={activeTab === 'invoices'} 
            onClick={() => setActiveTab('invoices')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Payroll" 
            active={activeTab === 'payroll'} 
            onClick={() => setActiveTab('payroll')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Risk Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search transactions, users, or categories..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <TrendingUp size={16} />
              Train Model
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              title="Flagged Transactions" 
              value={metrics?.totalFlagged || 0} 
              change="+12% from last week" 
              icon={<ShieldAlert className="text-red-600" />} 
              color="red"
            />
            <KPICard 
              title="Avg Risk Score" 
              value={`${metrics?.avgRiskScore || 0}/100`} 
              change="-2.4% improvement" 
              icon={<Activity className="text-blue-600" />} 
              color="blue"
            />
            <KPICard 
              title="Financial Impact" 
              value={`$${(metrics?.financialImpact || 0).toLocaleString()}`} 
              change="Potential loss prevented" 
              icon={<DollarSign className="text-emerald-600" />} 
              color="emerald"
            />
            <KPICard 
              title="System Health" 
              value="99.9%" 
              change="Model: XGBoost v2.1" 
              icon={<CheckCircle className="text-amber-600" />} 
              color="amber"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Fraud Detection Trends</h3>
                <select className="text-sm bg-slate-50 border-slate-200 rounded-md px-2 py-1 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics?.fraudOverTime}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Risk by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics?.fraudByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics?.fraudByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {metrics?.fraudByCategory.map((item, i) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-slate-600">{item.category}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value} cases</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspicious Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">High-Risk Suspicious Items</h3>
              <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">User / Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredTransactions.filter(t => t.riskScore > 70).slice(0, 10).map((tx) => (
                      <motion.tr 
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">{tx.userId}</span>
                            <span className="text-xs text-slate-500">{tx.merchantCategory}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          ${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  tx.riskScore > 85 ? "bg-red-500" : tx.riskScore > 60 ? "bg-amber-500" : "bg-blue-500"
                                )}
                                style={{ width: `${tx.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-600">{tx.riskScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            tx.status === 'Fraudulent' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleReview(tx.id, 'Legitimate')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Mark as Legitimate"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleReview(tx.id, 'Fraudulent')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Confirm Fraud"
                            >
                              <AlertTriangle size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function KPICard({ title, value, change, icon, color }: { title: string, value: string | number, change: string, icon: React.ReactNode, color: string }) {
  const colorClasses: Record<string, string> = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", colorClasses[color])}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-400">Live Updates</span>
      </div>
      <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      <p className="text-xs text-slate-400 mt-2 font-medium">{change}</p>
    </div>
  );
}
