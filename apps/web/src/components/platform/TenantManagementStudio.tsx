import React, { useState } from 'react';
import { Layers, Plus, Database, ShieldCheck, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export const TenantManagementStudio: React.FC = () => {
  const [tenants, setTenants] = useState([
    { tenantId: 0, companyName: 'Training & Demo Company', prefix: '0_', status: 'ACTIVE', storage: '14.2 MB', createdAt: '2026-01-01' },
    { tenantId: 1, companyName: 'Acme Enterprise Subsidiary', prefix: '1_', status: 'ACTIVE', storage: '88.5 MB', createdAt: '2026-03-15' },
  ]);

  const [isProvisioned, setIsProvisioned] = useState(false);

  const handleProvisionTenant = () => {
    setIsProvisioned(true);
    setTimeout(() => setIsProvisioned(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Multi-Tenant Operations & Provisioning
          </h2>
          <p className="text-xs text-muted-foreground">Tenant Isolation (`0_`, `1_`), Resource Quotas, Backup & Point-in-Time Recovery</p>
        </div>

        <button 
          onClick={handleProvisionTenant}
          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Provision New Company Tenant
        </button>
      </div>

      {isProvisioned && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Tenant Provisioned Successfully</div>
            <div className="text-xs opacity-80">Table prefix `2_` created with isolated database schema</div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-24">Tenant ID</th>
              <th className="p-3.5">Company Name</th>
              <th className="p-3.5 w-32">Table Prefix</th>
              <th className="p-3.5 w-32 font-mono">Storage Used</th>
              <th className="p-3.5 w-32">Created Date</th>
              <th className="p-3.5 w-28 text-center">Status</th>
              <th className="p-3.5 w-36 text-center">Backup / Restore</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {tenants.map((t) => (
              <tr key={t.tenantId} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-primary">#{t.tenantId}</td>
                <td className="p-3.5 font-sans font-semibold text-foreground">{t.companyName}</td>
                <td className="p-3.5 text-muted-foreground">{t.prefix}</td>
                <td className="p-3.5 font-bold text-foreground">{t.storage}</td>
                <td className="p-3.5 font-sans text-muted-foreground">{t.createdAt}</td>
                <td className="p-3.5 text-center font-sans">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                    {t.status}
                  </span>
                </td>
                <td className="p-3.5 text-center font-sans">
                  <button className="px-2 py-1 rounded bg-muted hover:bg-primary hover:text-white text-[10px] font-bold transition-colors">
                    Backup Snapshot
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
