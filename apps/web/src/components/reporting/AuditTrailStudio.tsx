import React from 'react';
import { ShieldCheck, User, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const AuditTrailStudio: React.FC = () => {
  const auditLogs = [
    { id: 104, stamp: '2026-07-27 18:24:15', user: 'admin', typeName: 'Sales Invoice', transNo: '1042', desc: 'Invoice INV-2026-0042 posted to GL & Customer Receivables' },
    { id: 103, stamp: '2026-07-27 18:20:00', user: 'admin', typeName: 'Customer Payment', transNo: '31', desc: 'Payment REM-2026-0031 allocated to INV-1042 ($2,645.50)' },
    { id: 102, stamp: '2026-07-27 18:15:30', user: 'demouser', typeName: 'Supplier Bill', transNo: '51', desc: 'Supplier bill BILL-2026-0051 matched 3-way with GRN-2026-0012' },
    { id: 101, stamp: '2026-07-27 17:45:00', user: 'admin', typeName: 'GL Journal Entry', transNo: '104', desc: 'Manual journal adjustment JRN-2026-0104 executed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Enterprise Audit Trail & Action History
          </h2>
          <p className="text-xs text-muted-foreground">Immutable Compliance Audit Log & User Activity Timeline</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Audit Vault Active
        </span>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-card flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground"></div>
              </div>

              <div className="flex-1 bg-muted/40 p-4 rounded-xl border border-border space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> {log.typeName} #{log.transNo}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3 h-3" /> {log.stamp}
                  </span>
                </div>
                <p className="text-xs text-foreground font-medium">{log.desc}</p>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-muted-foreground" /> User: <strong>{log.user}</strong></span>
                  <span>| Audit Record #{log.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
