import React from 'react';
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, FileText, CheckCircle2, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const cashFlowData = [
  { month: 'Jan', inflows: 120000, outflows: 85000 },
  { month: 'Feb', inflows: 145000, outflows: 92000 },
  { month: 'Mar', inflows: 130000, outflows: 88000 },
  { month: 'Apr', inflows: 168000, outflows: 110000 },
  { month: 'May', inflows: 190000, outflows: 125000 },
  { month: 'Jun', inflows: 210000, outflows: 140000 },
  { month: 'Jul', inflows: 248000, outflows: 152000 },
];

interface Props {
  onNavigate?: (tab: string, payload?: any) => void;
}

export const ExecutiveDashboard: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* KPI METRIC CARDS HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div 
          onClick={() => onNavigate?.('trial-balance')}
          className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Revenue (YTD)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">$1,248,500.00</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last period</span>
          </div>
        </div>

        {/* Total Expense */}
        <div 
          onClick={() => onNavigate?.('trial-balance')}
          className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">$842,100.00</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-2 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-2.1% optimized overhead</span>
          </div>
        </div>

        {/* Operating Margin */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Net Operating Margin</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">32.5%</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% profitability growth</span>
          </div>
        </div>

        {/* Bank & Cash Balances */}
        <div 
          onClick={() => onNavigate?.('bank-trans')}
          className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Bank & Cash Liquidity</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">$412,900.00</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
            <span>2 Active Bank Accounts</span>
          </div>
        </div>
      </div>

      {/* CHARTS & APPROVALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CASH FLOW RECHARTS GRAPH */}
        <div className="lg:col-span-2 bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground">Monthly Cash Inflows vs Outflows</h3>
              <p className="text-xs text-muted-foreground">Real-time ledger data stream</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Inflows
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Outflows
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorInflows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutflows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="inflows" stroke="#3B82F6" fillOpacity={1} fill="url(#colorInflows)" strokeWidth={2} />
                <Area type="monotone" dataKey="outflows" stroke="#EF4444" fillOpacity={1} fill="url(#colorOutflows)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PENDING APPROVAL QUEUE */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Approvals</span>
            </h3>
            <button onClick={() => onNavigate?.('approvals')} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold hover:bg-amber-500/20">3 Action Required</button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="p-3 rounded-lg bg-muted/40 border border-border hover:border-primary/40 transition-colors">
              <div className="flex justify-between items-start text-xs font-semibold text-foreground">
                <span>Purchase Order PO-2026-0089</span>
                <span className="text-primary">$14,500.00</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Supplier: Industrial Components Co</div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => onNavigate?.('approvals')} className="flex-1 py-1 bg-primary text-primary-foreground rounded text-[11px] font-medium hover:bg-primary/90 transition-colors">Approve</button>
                <button onClick={() => onNavigate?.('approvals')} className="flex-1 py-1 bg-muted text-muted-foreground hover:bg-destructive hover:text-white rounded text-[11px] font-medium transition-colors">Reject</button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border hover:border-primary/40 transition-colors">
              <div className="flex justify-between items-start text-xs font-semibold text-foreground">
                <span>Manual Journal JV-2026-0012</span>
                <span className="text-primary">$50,000.00</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Quarter-end depreciation adjustment</div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => onNavigate?.('approvals')} className="flex-1 py-1 bg-primary text-primary-foreground rounded text-[11px] font-medium hover:bg-primary/90 transition-colors">Approve</button>
                <button onClick={() => onNavigate?.('approvals')} className="flex-1 py-1 bg-muted text-muted-foreground hover:bg-destructive hover:text-white rounded text-[11px] font-medium transition-colors">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS & QUICK LAUNCHERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STOCK SHORTAGE ALERTS */}
        <div className="lg:col-span-2 bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Low Stock & Reorder Alerts</span>
            </h3>
            <button onClick={() => onNavigate?.('inventory')} className="text-xs text-primary font-medium hover:underline">View All Inventory</button>
          </div>

          <div className="divide-y divide-border">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold text-[10px]">OUT OF STOCK</span>
                <span className="font-medium text-foreground">ITEM-A100 — Industrial Widget A</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Qty: <strong className="text-rose-500">0</strong> / Reorder: 10</span>
                <button 
                  onClick={() => onNavigate?.('supplier-bill', { itemCode: 'ITEM-A100' })}
                  className="px-2.5 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-[11px] font-medium transition-colors"
                >
                  Raise PO
                </button>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-[10px]">LOW STOCK</span>
                <span className="font-medium text-foreground">ITEM-B200 — Service Assembly B</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Qty: <strong className="text-amber-500">3</strong> / Reorder: 15</span>
                <button 
                  onClick={() => onNavigate?.('supplier-bill', { itemCode: 'ITEM-B200' })}
                  className="px-2.5 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-[11px] font-medium transition-colors"
                >
                  Raise PO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LAUNCHPAD */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Quick Task Launchpad</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => onNavigate?.('sales-invoice')}
                className="p-3 rounded-lg bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-left transition-all group"
              >
                <Plus className="w-4 h-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-foreground">New Invoice</div>
                <div className="text-[10px] text-muted-foreground">Sales & AR</div>
              </button>

              <button 
                onClick={() => onNavigate?.('gl-journal')}
                className="p-3 rounded-lg bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-left transition-all group"
              >
                <Plus className="w-4 h-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-foreground">Journal Entry</div>
                <div className="text-[10px] text-muted-foreground">General Ledger</div>
              </button>

              <button 
                onClick={() => onNavigate?.('trial-balance')}
                className="p-3 rounded-lg bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-left transition-all group"
              >
                <FileText className="w-4 h-4 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-foreground">Trial Balance</div>
                <div className="text-[10px] text-muted-foreground">Financial Reports</div>
              </button>

              <button 
                onClick={() => onNavigate?.('bank-rec')}
                className="p-3 rounded-lg bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-left transition-all group"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-foreground">Bank Rec</div>
                <div className="text-[10px] text-muted-foreground">Cash & Banking</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
