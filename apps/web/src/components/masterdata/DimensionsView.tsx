import React from 'react';
import { Layers, Plus, CheckCircle2 } from 'lucide-react';

export const DimensionsView: React.FC = () => {
  const dimensions = [
    { id: 1, reference: 'DIM-COST-01', name: 'North America Sales Division', type_: 1, date_: '2026-01-01', due_: '2026-12-31', closed: 0 },
    { id: 2, reference: 'DIM-COST-02', name: 'EMEA Operations & Logistics', type_: 1, date_: '2026-01-01', due_: '2026-12-31', closed: 0 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Cost & Profit Center Dimensions
          </h2>
          <p className="text-xs text-muted-foreground">Multi-Dimensional Financial Reporting & Departmental Accounting</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Dimension
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-36">Reference</th>
              <th className="p-3.5">Dimension Name</th>
              <th className="p-3.5 w-32">Start Date</th>
              <th className="p-3.5 w-32">Target End Date</th>
              <th className="p-3.5 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {dimensions.map((d) => (
              <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5 font-mono font-bold text-primary">{d.reference}</td>
                <td className="p-3.5 font-medium text-foreground">{d.name}</td>
                <td className="p-3.5 text-muted-foreground">{d.date_}</td>
                <td className="p-3.5 text-muted-foreground">{d.due_}</td>
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
