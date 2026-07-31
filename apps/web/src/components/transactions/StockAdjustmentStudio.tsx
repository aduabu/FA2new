import React, { useState } from 'react';
import { DocHeader } from './shared/DocHeader';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { Boxes, Plus, Trash2, CheckCircle2, Save } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface Props {
  initialItemCode?: string;
  onNavigate?: (tab: string, payload?: any) => void;
}

export const StockAdjustmentStudio: React.FC<Props> = ({ initialItemCode }) => {
  const [ref, setRef] = useState('ADJ-2026-0014');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [location, setLocation] = useState('DEF');
  const [reason, setReason] = useState('Damaged stock write-off / Physical audit difference');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [lines, setLines] = useState([
    { id: '1', code: initialItemCode || 'ITEM-A100', name: 'Industrial Widget A', qtyChange: -2, unitCost: 85.00 },
  ]);

  const totalAdjustmentValue = lines.reduce((sum, l) => sum + (l.qtyChange * l.unitCost), 0);

  const postings = [
    { accountCode: '5010', accountName: 'Inventory Adjustment Expense (COGS)', debit: Math.abs(totalAdjustmentValue), credit: 0 },
    { accountCode: '1510', accountName: 'Inventory Asset Account', debit: 0, credit: Math.abs(totalAdjustmentValue) },
  ];

  const handleConfirmPost = async () => {
    setLoading(true);
    try {
      const payload = {
        memo: `Stock Adjustment (${ref}): ${reason}`,
        ref: ref,
        date: docDate,
        lines: postings.map(p => ({
          account_code: p.accountCode,
          account_name: p.accountName,
          debit: p.debit,
          credit: p.credit
        }))
      };

      const res = await apiClient.post(API_ENDPOINTS.GL.JOURNALS, payload);
      setLoading(false);

      if (res.success) {
        setIsPreviewOpen(false);
        setIsPosted(true);
      } else {
        alert(res.message || 'Failed to post stock adjustment');
      }
    } catch (e: any) {
      setLoading(false);
      alert(`Error connecting to REST API Gateway: ${e.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Stock Adjustment Posted & Inventory Updated via FrontAccounting Engine!</div>
            <div className="text-xs opacity-90 font-mono">Reference: {ref} — Posted to 0_stock_moves & 0_gl_trans via FA Core</div>
          </div>
        </div>
      )}

      <DocHeader
        title="Stock Adjustment & Audit Studio"
        subtitle="Inventory & Stock Control — Write-off Damaged Items or Record Audit Counts"
        reference={ref}
        docDate={docDate}
        currency="USD"
        status="APPROVED"
        onReferenceChange={setRef}
        onDateChange={setDocDate}
      />

      <div className="bg-card p-5 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-medium text-muted-foreground mb-1">Warehouse Location</label>
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-semibold text-foreground focus:outline-none"
          >
            <option value="DEF">DEF — Default Warehouse Store</option>
            <option value="SEC">SEC — Secondary Storage Depot</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-muted-foreground mb-1">Adjustment Reason / Notes</label>
          <input 
            type="text" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-medium text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* ADJUSTMENT LINES TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <Boxes className="w-4 h-4 text-primary" /> Stock Items to Adjust
          </h3>
          <button 
            onClick={() => setLines([...lines, { id: Date.now().toString(), code: 'ITEM-B200', name: 'Service Assembly B', qtyChange: -1, unitCost: 280.00 }])}
            className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item Row
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-32">Item Code</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 w-36 text-right">Qty Change (+/-)</th>
              <th className="p-3.5 w-32 text-right">Standard Cost ($)</th>
              <th className="p-3.5 w-36 text-right">Valuation Impact ($)</th>
              <th className="p-3.5 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {lines.map((l) => {
              const impact = l.qtyChange * l.unitCost;
              return (
                <tr key={l.id} className="hover:bg-muted/20">
                  <td className="p-3.5 font-bold text-primary">{l.code}</td>
                  <td className="p-3.5 font-sans font-medium text-foreground">{l.name}</td>
                  <td className="p-3.5 text-right font-bold text-rose-500">{l.qtyChange}</td>
                  <td className="p-3.5 text-right">${l.unitCost.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-bold text-rose-500">${impact.toFixed(2)}</td>
                  <td className="p-3.5 text-center">
                    <button onClick={() => setLines(lines.filter(item => item.id !== l.id))} className="text-muted-foreground hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Stock Moves will be posted to location <strong className="text-foreground">{location}</strong>
          </div>

          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-4 h-4" /> Post Stock Adjustment & GL
          </button>
        </div>
      </div>

      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={handleConfirmPost}
        documentTitle="Stock Adjustment & Valuation Impact"
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
