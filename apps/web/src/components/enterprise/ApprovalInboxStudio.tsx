import React, { useState } from 'react';
import { Clock, ShieldCheck, CheckCircle2, XCircle, FileText, User } from 'lucide-react';

export const ApprovalInboxStudio: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 'APP-901', title: 'High-Value Purchase Order PO-2026-0089', submitter: 'Purchasing Officer', amount: 14500.00, date: '2026-07-27', role: 'Department_Manager', status: 'PENDING' },
    { id: 'APP-902', title: 'Manual Depreciation Adjustment JV-2026-0012', submitter: 'Senior Accountant', amount: 50000.00, date: '2026-07-27', role: 'CFO', status: 'PENDING' },
  ]);

  const handleApprove = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
  };

  const handleReject = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Workflow & Approval Task Inbox
          </h2>
          <p className="text-xs text-muted-foreground">Decoupled Approval Chains & Digital Sign-off Center</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold">
          {tasks.filter(t => t.status === 'PENDING').length} Pending Tasks
        </span>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border">
        {tasks.map((t) => (
          <div key={t.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-muted/20 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
                <h3 className="font-bold text-sm text-foreground">{t.title}</h3>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-4">
                <span>Submitted by: <strong>{t.submitter}</strong></span>
                <span>Date: <strong>{t.date}</strong></span>
                <span>Required Role: <strong className="text-foreground">{t.role}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-foreground font-mono">${t.amount.toLocaleString()}</span>
              {t.status === 'PENDING' ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApprove(t.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(t.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-rose-500 hover:text-white flex items-center gap-1 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              ) : t.status === 'APPROVED' ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> REJECTED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
