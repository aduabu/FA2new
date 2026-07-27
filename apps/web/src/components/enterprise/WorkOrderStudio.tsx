import React, { useState } from 'react';
import { Factory, Plus, CheckCircle2, Layers, PackageCheck, Play } from 'lucide-react';

export const WorkOrderStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WO' | 'BOM'>('WO');
  const [isCompleted, setIsCompleted] = useState(false);

  const workOrders = [
    { id: 1, ref: 'WO-2026-0012', stockId: 'ITEM-B200', name: 'Service Assembly B', req: 10, manufactured: 10, status: 'COMPLETED', releasedDate: '2026-07-01' },
    { id: 2, ref: 'WO-2026-0015', stockId: 'ITEM-B200', name: 'Service Assembly B', req: 25, manufactured: 0, status: 'IN_PROGRESS', releasedDate: '2026-07-20' },
  ];

  const bomComponents = [
    { code: 'ITEM-A100', name: 'Industrial Widget A', qty: 2, unitCost: 85.00, totalCost: 170.00 },
    { code: 'RAW-C010', name: 'Steel Fastener Ring', qty: 4, unitCost: 12.50, totalCost: 50.00 },
  ];

  const totalBOMCost = bomComponents.reduce((s, c) => s + c.totalCost, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" /> Manufacturing & Work Order Studio
          </h2>
          <p className="text-xs text-muted-foreground">Bill of Materials (BOM), Material Issues & Finished Goods Receipts</p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('WO')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'WO' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Work Orders (WO)
          </button>
          <button
            onClick={() => setActiveTab('BOM')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'BOM' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bill of Materials (BOM)
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Work Order WO-2026-0015 Released to Production</div>
            <div className="text-xs opacity-80">Component stock reserved & Work in Progress (WIP) GL ledger updated</div>
          </div>
        </div>
      )}

      {activeTab === 'WO' ? (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Active Production Orders</h3>
            <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Raise New Work Order
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5 w-32">WO Reference</th>
                <th className="p-3.5 w-32">Item Code</th>
                <th className="p-3.5">Product Description</th>
                <th className="p-3.5 w-24 text-right">Target Qty</th>
                <th className="p-3.5 w-24 text-right">Produced</th>
                <th className="p-3.5 w-32 text-center">Status</th>
                <th className="p-3.5 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-muted/20">
                  <td className="p-3.5 font-mono font-bold text-primary">{wo.ref}</td>
                  <td className="p-3.5 font-mono font-semibold">{wo.stockId}</td>
                  <td className="p-3.5 font-medium text-foreground">{wo.name}</td>
                  <td className="p-3.5 text-right font-bold">{wo.req}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-500">{wo.manufactured}</td>
                  <td className="p-3.5 text-center">
                    {wo.status === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">COMPLETED</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold text-[10px]">IN PROGRESS</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {wo.status === 'IN_PROGRESS' && (
                      <button 
                        onClick={() => setIsCompleted(true)}
                        className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-[10px] flex items-center gap-1 mx-auto transition-all"
                      >
                        <Play className="w-3 h-3" /> Issue Components
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-sm text-foreground">Parent Product Assembly: ITEM-B200 (Service Assembly B)</h3>
              <p className="text-xs text-muted-foreground">Standard BOM Cost Roll-up & Components Breakdown</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Total Unit Production Cost:</span>
              <div className="text-lg font-bold text-primary font-mono">${totalBOMCost.toFixed(2)}</div>
            </div>
          </div>

          <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3 w-32">Component Code</th>
                <th className="p-3">Component Description</th>
                <th className="p-3 w-24 text-right">BOM Qty</th>
                <th className="p-3 w-32 text-right">Unit Cost ($)</th>
                <th className="p-3 w-36 text-right">Extended Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {bomComponents.map((c) => (
                <tr key={c.code} className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-primary">{c.code}</td>
                  <td className="p-3 font-sans font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-right font-bold">{c.qty}</td>
                  <td className="p-3 text-right">${c.unitCost.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-foreground">${c.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
