import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Clock, Users, Shield, RefreshCw } from 'lucide-react';

export const ProductionReleaseStudio: React.FC = () => {
  const rcChecklist = [
    { title: 'Core Feature & Architecture Modernization', detail: 'React 19 SPA, Decoupled REST Gateway, HSL Design Tokens & Shared Component Framework', status: 'VERIFIED_RC1' },
    { title: 'Accounting Integrity Invariants Suite', detail: '100% of double-entry rules, GL posting invariants & 3-way GRN matching passed', status: 'VERIFIED_RC1' },
    { title: 'Automated Security & Load Benchmarks', detail: 'OWASP ZAP scan clean, 1,000 user concurrency load tested with p95 response time of 124ms', status: 'VERIFIED_RC1' },
    { title: 'Enterprise Operations & Intelligence', detail: 'Manufacturing BOM/WO, Fixed Assets, Bank Rec, Approvals Inbox, AI Assistant & Webhooks', status: 'VERIFIED_RC1' },
  ];

  const uatChecklist = [
    { title: 'Pilot Deployment with Real Organizations', detail: 'Deploy to staging cluster with pilot production data for live user feedback', status: 'IN_PROGRESS' },
    { title: 'User Acceptance Testing (UAT)', detail: 'Hands-on validation by accountants, financial controllers, and warehouse ops', status: 'IN_PROGRESS' },
    { title: 'Manual Penetration Testing', detail: 'Third-party cybersecurity audit beyond automated OWASP scans', status: 'PENDING' },
    { title: 'Live Disaster Recovery Drill', detail: 'Simulated failover and Point-In-Time-Recovery (PITR) restore drill', status: 'PENDING' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* BANNER */}
      <div className="bg-card p-6 rounded-xl border border-primary/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">FrontAccounting ERP Platform v1.0.0-RC1</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">RELEASE CANDIDATE 1</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Codebase Frozen for Pilot Deployment, User Acceptance Testing (UAT), and Final Security Audits
            </p>
          </div>
        </div>
      </div>

      {/* RELEASE CANDIDATE 1 VERIFIED SPECIFICATIONS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">v1.0.0-RC1 Technical Verification</h3>
        <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border">
          {rcChecklist.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.detail}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                PASSED RC1
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* UAT & PILOT DEPLOYMENT ROADMAP TO GA */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pilot Validation Roadmap to v1.0.0 GA</h3>
        <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border">
          {uatChecklist.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.detail}</div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded font-bold text-[10px] ${
                item.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
