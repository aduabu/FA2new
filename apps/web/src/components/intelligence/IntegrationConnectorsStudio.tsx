import React from 'react';
import { Globe, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const IntegrationConnectorsStudio: React.FC = () => {
  const connectors = [
    { id: 'CONN-01', name: 'Stripe Payment Gateway', type: 'Payment Gateway', status: 'CONNECTED', lastSync: '2026-07-27 18:24:15' },
    { id: 'CONN-02', name: 'Plaid Open Banking Live Feed', type: 'Banking API', status: 'CONNECTED', lastSync: '2026-07-27 18:00:00' },
    { id: 'CONN-03', name: 'ZATCA / PEPPOL E-Invoicing Tax Clearance', type: 'Tax Authority', status: 'CONNECTED', lastSync: '2026-07-27 18:24:15' },
    { id: 'CONN-04', name: 'Salesforce CRM Account Sync', type: 'CRM Hook', status: 'CONNECTED', lastSync: '2026-07-27 15:10:00' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Enterprise Integration Framework & Webhooks
          </h2>
          <p className="text-xs text-muted-foreground">Outgoing HMAC Webhooks Engine & Open Connector Framework</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> 4 Active External Connectors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((c) => (
          <div key={c.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between space-y-3 hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{c.type}</span>
                <h3 className="font-bold text-sm text-foreground mt-1.5">{c.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE
              </span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
              <span>Last Event Dispatch: <strong className="text-foreground font-mono">{c.lastSync}</strong></span>
              <button className="text-primary font-semibold hover:underline">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
