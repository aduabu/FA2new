import React, { useState } from 'react';
import { Landmark, Plus, Calculator, Calendar, CheckCircle2 } from 'lucide-react';

export const FixedAssetStudio: React.FC = () => {
  const [isDepreciated, setIsDepreciated] = useState(false);

  const assets = [
    { id: 'FA-1001', desc: 'Heavy CNC Milling Machine', class: 'Plant & Machinery', date: '2025-01-15', cost: 120000.00, depr: 24000.00, bookValue: 96000.00, rate: 20 },
    { id: 'FA-2004', desc: 'Executive Transport Vehicle', class: 'Motor Vehicles', date: '2025-06-01', cost: 45000.00, depr: 9000.00, bookValue: 36000.00, rate: 20 },
  ];

  const totalCost = assets.reduce((s, a) => s + a.cost, 0);
  const totalDepr = assets.reduce((s, a) => s + a.depr, 0);
  const totalBookValue = assets.reduce((s, a) => s + a.bookValue, 0);

  const handleRunDepreciation = () => {
    setIsDepreciated(true);
    setTimeout(() => setIsDepreciated(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" /> Fixed Assets Register & Depreciation
          </h2>
          <p className="text-xs text-muted-foreground">Asset Management, Depreciation Schedules & Journal Postings</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRunDepreciation}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Calculator className="w-4 h-4" /> Run Period Depreciation
          </button>
          <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" /> Acquire New Asset
          </button>
        </div>
      </div>

      {isDepreciated && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Period Depreciation Journal Executed</div>
            <div className="text-xs opacity-80">Posted DR Depreciation Expense (6810) / CR Accumulated Depreciation</div>
          </div>
        </div>
      )}

      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Total Asset Acquisition Cost</div>
          <div className="text-2xl font-bold text-foreground mt-1">${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Accumulated Depreciation</div>
          <div className="text-2xl font-bold text-rose-500 mt-1">${totalDepr.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Net Asset Book Value</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">${totalBookValue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
      </div>

      {/* REGISTER TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-28">Asset Code</th>
              <th className="p-3.5">Asset Description</th>
              <th className="p-3.5 w-36">Asset Class</th>
              <th className="p-3.5 w-28">Purchase Date</th>
              <th className="p-3.5 w-32 text-right">Cost ($)</th>
              <th className="p-3.5 w-32 text-right">Accum Depr ($)</th>
              <th className="p-3.5 w-32 text-right">Book Value ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {assets.map((a) => (
              <tr key={a.id} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-primary">{a.id}</td>
                <td className="p-3.5 font-sans font-medium text-foreground">{a.desc}</td>
                <td className="p-3.5 font-sans text-muted-foreground">{a.class}</td>
                <td className="p-3.5 font-sans text-muted-foreground">{a.date}</td>
                <td className="p-3.5 text-right font-bold">${a.cost.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td className="p-3.5 text-right text-rose-500">${a.depr.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td className="p-3.5 text-right font-bold text-emerald-500">${a.bookValue.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
