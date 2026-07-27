import React from 'react';
import { Percent, Plus, CheckCircle2 } from 'lucide-react';

export const TaxConfigurationView: React.FC = () => {
  const taxTypes = [
    { id: 1, name: 'Standard GST / VAT (10%)', rate: 10.00, sales_gl_code: '2150', purchasing_gl_code: '2150' },
    { id: 2, name: 'Reduced Rate Tax (5%)', rate: 5.00, sales_gl_code: '2150', purchasing_gl_code: '2150' },
    { id: 3, name: 'Zero Rated Tax Exemption (0%)', rate: 0.00, sales_gl_code: '2150', purchasing_gl_code: '2150' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" /> Tax Configuration & Rates
          </h2>
          <p className="text-xs text-muted-foreground">Tax Types, Rates, Sales & Purchasing GL Accounts</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Tax Type
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-16">ID</th>
              <th className="p-3.5">Tax Type Name</th>
              <th className="p-3.5 w-32 text-right">Tax Rate (%)</th>
              <th className="p-3.5 w-44">Sales GL Account</th>
              <th className="p-3.5 w-44">Purchasing GL Account</th>
              <th className="p-3.5 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {taxTypes.map((t) => (
              <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5 font-mono font-bold text-muted-foreground">{t.id}</td>
                <td className="p-3.5 font-medium text-foreground">{t.name}</td>
                <td className="p-3.5 text-right font-mono font-bold text-primary">{t.rate.toFixed(2)}%</td>
                <td className="p-3.5 font-mono text-muted-foreground">{t.sales_gl_code} (Sales Tax Payable)</td>
                <td className="p-3.5 font-mono text-muted-foreground">{t.purchasing_gl_code} (Sales Tax Payable)</td>
                <td className="p-3.5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
