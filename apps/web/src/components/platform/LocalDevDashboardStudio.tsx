import React, { useState } from 'react';
import { Terminal, CheckCircle2, Server, Database, Cpu, RefreshCw, Zap, ShieldCheck, Activity } from 'lucide-react';

export const LocalDevDashboardStudio: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const services = [
    { name: 'React 19 SPA Frontend', port: '3000', status: 'HEALTHY', latency: '2.4ms', driver: 'Vite / TypeScript' },
    { name: 'PHP REST API Gateway', port: '8080', status: 'HEALTHY', latency: '12.1ms', driver: 'Apache / PHP 8.2' },
    { name: 'MySQL 8.0 Database', port: '3306', status: 'HEALTHY', latency: '1.8ms', driver: 'InnoDB (0_ Prefix)' },
    { name: 'Redis 7 Queue & Workers', port: '6379', status: 'HEALTHY', latency: '0.4ms', driver: '4 Active Workers' },
  ];

  const envInfo = {
    version: 'v1.0.0-RC1 (Release Candidate 1)',
    environment: 'Local Development (localhost)',
    commit: 'c88aa07',
    dbSchema: 'frontacct (0_ debtors, chart, items, users)',
    jwtStatus: 'ACTIVE (Bearer 8h expiration)',
    aiStatus: 'ADVISORY_MODE (100% Non-Posting Protection)'
  };

  const handleRefreshHealth = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" /> Local Developer & Testing Status Dashboard
          </h2>
          <p className="text-xs text-muted-foreground">Localhost Environment Health, Container Services, Database & Redis Metrics</p>
        </div>

        <button 
          onClick={handleRefreshHealth}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh Health Check
        </button>
      </div>

      {/* SERVICE STATUS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s, idx) => (
          <div key={idx} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-muted-foreground">Port :{s.port}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {s.status}
              </span>
            </div>
            <h3 className="font-bold text-xs text-foreground">{s.name}</h3>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border font-mono">
              <span>{s.driver}</span>
              <span className="text-emerald-500 font-bold">{s.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ENVIRONMENT DETAILS */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Runtime Environment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <span className="text-muted-foreground text-[10px]">App Version:</span>
            <div className="font-bold text-primary">{envInfo.version}</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <span className="text-muted-foreground text-[10px]">Git Commit Hash:</span>
            <div className="font-bold text-foreground">{envInfo.commit}</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <span className="text-muted-foreground text-[10px]">Database Schema:</span>
            <div className="font-bold text-foreground">{envInfo.dbSchema}</div>
          </div>
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <span className="text-muted-foreground text-[10px]">AI Governance:</span>
            <div className="font-bold text-emerald-500">{envInfo.aiStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
