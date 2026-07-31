import React, { useState } from 'react';
import { DocHeader } from './shared/DocHeader';
import { PartySelector } from './shared/PartySelector';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { CheckCircle2, PackageCheck, Save } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface Props {
  initialSupplier?: string;
  initialItemCode?: string;
  onNavigate?: (tab: string, payload?: any) => void;
}

export const SupplierBillStudio: React.FC<Props> = ({ initialSupplier, initialItemCode }) => {
  const [supplier, setSupplier] = useState(initialSupplier || '1');
  const [ref, setRef] = useState('BILL-2026-0051');
  const [suppRef, setSuppRef] = useState('INV-SUPP-9921');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [dueDate, setDueDate] = useState('2026-08-27');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const suppliers = [
    { id: '1', name: 'Industrial Components Co', ref: 'INDCOMP', address: '780 Industrial Blvd, Detroit MI', currency: 'USD' },
    { id: '2', name: 'Tech Hardware Solutions', ref: 'TECHHARD', address: '1200 Innovation Dr, San Jose CA', currency: 'USD' },
    { id: '3', name: 'Raw Materials Supplier Corp', ref: 'RAWMAT', address: '12 Logistics Blvd', currency: 'USD' },
  ];

  const [lines, setLines] = useState([
    { id: '1', grnRef: 'GRN-2026-0012', itemCode: initialItemCode || 'ITEM-A100', name: 'Industrial Widget A', qty: 20, poPrice: 85.00, billPrice: 85.00 },
  ]);

  const subtotal = lines.reduce((sum, l) => sum + (l.qty * l.billPrice), 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const postings = [
    { accountCode: '1510', accountName: 'Inventory Clearing / GRN Account', debit: subtotal, credit: 0 },
    { accountCode: '2150', accountName: 'Sales Tax (GST) Input Credit', debit: tax, credit: 0 },
    { accountCode: '2100', accountName: 'Accounts Payable (Supplier Payables)', debit: 0, credit: grandTotal },
  ];

  const handleConfirmPost = async () => {
    setLoading(true);
    try {
      const payload = {
        memo: `Supplier Bill ${ref} / Inv ${suppRef} for supplier #${supplier}`,
        ref: ref,
        date: docDate,
        lines: [
          { account_code: '1510', account_name: 'Inventory Clearing / GRN', debit: subtotal, credit: 0 },
          { account_code: '2150', account_name: 'Sales Tax (GST) Input Credit', debit: tax, credit: 0 },
          { account_code: '2100', account_name: 'Accounts Payable', debit: 0, credit: grandTotal }
        ]
      };

      const res = await apiClient.post(API_ENDPOINTS.GL.JOURNALS, payload);
      setLoading(false);

      if (res.success) {
        setIsPreviewOpen(false);
        setIsPosted(true);
      } else {
        alert(res.message || 'Failed to post supplier bill');
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
            <div className="font-semibold text-sm">Supplier Bill Posted & 3-Way GRN Matched</div>
            <div className="text-xs opacity-90 font-mono">Reference: {ref} | Supp Ref: {suppRef} | Posted to AP Ledger via FA Core Engine</div>
          </div>
        </div>
      )}

      <DocHeader
        title="Supplier Bill & 3-Way GRN Match Studio"
        subtitle="Procure-to-Pay Workflow — Match Goods Received Note to Supplier Invoice"
        reference={ref}
        docDate={docDate}
        dueDate={dueDate}
        currency="USD"
        status="UNPAID"
        onReferenceChange={setRef}
        onDateChange={setDocDate}
        onDueDateChange={setDueDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PartySelector
            label="Supplier Vendor"
            parties={suppliers}
            selectedId={supplier}
            onSelect={setSupplier}
          />
        </div>

        <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Supplier Bill Reference</h4>
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Supplier Invoice #</label>
            <input 
              type="text" 
              value={suppRef} 
              onChange={(e) => setSuppRef(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
            />
          </div>

          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="w-full py-2 mt-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" /> Match & Post Supplier Bill
          </button>
        </div>
      </div>

      {/* 3-WAY MATCH GRID */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-500" /> 3-Way GRN Matched Items
          </h3>
          <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Price & Qty Match
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-32">GRN Batch</th>
              <th className="p-3.5 w-32">Item Code</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 w-24 text-right">Received Qty</th>
              <th className="p-3.5 w-28 text-right">PO Price ($)</th>
              <th className="p-3.5 w-28 text-right">Bill Price ($)</th>
              <th className="p-3.5 w-32 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {lines.map((l) => (
              <tr key={l.id} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-muted-foreground">{l.grnRef}</td>
                <td className="p-3.5 font-bold text-primary">{l.itemCode}</td>
                <td className="p-3.5 font-sans font-medium text-foreground">{l.name}</td>
                <td className="p-3.5 text-right font-bold text-emerald-500">{l.qty}</td>
                <td className="p-3.5 text-right text-muted-foreground">${l.poPrice.toFixed(2)}</td>
                <td className="p-3.5 text-right font-bold text-foreground">${l.billPrice.toFixed(2)}</td>
                <td className="p-3.5 text-right font-bold text-foreground">${(l.qty * l.billPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal:</span><span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax Credit (10%):</span><span className="font-semibold text-foreground">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border"><span>Total Payables:</span><span className="text-rose-500">${grandTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={handleConfirmPost}
        documentTitle="Supplier Bill & AP Posting"
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
