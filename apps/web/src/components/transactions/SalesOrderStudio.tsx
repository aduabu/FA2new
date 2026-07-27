import React, { useState } from 'react';
import { DocHeader } from './shared/DocHeader';
import { DocStatusBar } from './shared/DocStatusBar';
import { PartySelector } from './shared/PartySelector';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { Plus, Trash2, Save, Send, CheckCircle2 } from 'lucide-react';

export const SalesOrderStudio: React.FC = () => {
  const [currentStep, setCurrentStep] = useState('SO');
  const [customer, setCustomer] = useState('1');
  const [ref, setRef] = useState('SO-2026-0094');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [dueDate, setDueDate] = useState('2026-08-27');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const steps = [
    { id: 'QUOTE', label: '1. Quotation' },
    { id: 'SO', label: '2. Sales Order' },
    { id: 'DELIVERY', label: '3. Delivery Dispatch' },
    { id: 'INVOICE', label: '4. Invoice Posted' },
    { id: 'PAID', label: '5. Fully Paid' },
  ];

  const customers = [
    { id: '1', name: 'Acme Global Logistics', ref: 'ACME01', address: '100 Logistics Way, Chicago IL', currency: 'USD', creditLimit: 50000 },
    { id: '2', name: 'Apex Systems Inc', ref: 'APEX02', address: '450 Tech Pkwy, Austin TX', currency: 'USD', creditLimit: 25000 },
  ];

  const [lines, setLines] = useState([
    { id: '1', code: 'ITEM-A100', name: 'Industrial Widget A', qty: 5, price: 150.00, discount: 0 },
    { id: '2', code: 'ITEM-B200', name: 'Service Assembly B', qty: 1, price: 450.00, discount: 0 },
  ]);

  const subtotal = lines.reduce((sum, l) => sum + (l.qty * l.price * (1 - l.discount/100)), 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const postings = [
    { accountCode: '1200', accountName: 'Accounts Receivable (Acme Global)', debit: grandTotal, credit: 0 },
    { accountCode: '4010', accountName: 'Sales Revenue', debit: 0, credit: subtotal },
    { accountCode: '2150', accountName: 'Sales Tax (GST) Payable', debit: 0, credit: tax },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Sales Order Converted & Invoice Posted</div>
            <div className="text-xs opacity-80">Reference: {ref} — Transacted via FA Core Engine</div>
          </div>
        </div>
      )}

      {/* WORKFLOW STATUS BAR */}
      <DocStatusBar steps={steps} currentStepId={currentStep} />

      {/* DOCUMENT HEADER */}
      <DocHeader
        title="Sales Order Studio"
        subtitle="Order-to-Cash Workflow — Sales Order & Stock Reservation"
        reference={ref}
        docDate={docDate}
        dueDate={dueDate}
        currency="USD"
        status="APPROVED"
        onReferenceChange={setRef}
        onDateChange={setDocDate}
        onDueDateChange={setDueDate}
      />

      {/* PARTY & SETTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PartySelector
            label="Customer Account"
            parties={customers}
            selectedId={customer}
            onSelect={setCustomer}
          />
        </div>

        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Order Actions</h4>
            <p className="text-xs text-muted-foreground mb-4">Stock reserved automatically on order confirmation.</p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" /> Convert to Invoice & Post GL
            </button>
          </div>
        </div>
      </div>

      {/* ITEM GRID */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Order Line Items</h3>
          <button 
            onClick={() => setLines([...lines, { id: Date.now().toString(), code: 'ITEM-A100', name: 'Industrial Widget A', qty: 1, price: 150.00, discount: 0 }])}
            className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item Line
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3 w-32">Item Code</th>
              <th className="p-3">Description</th>
              <th className="p-3 w-24 text-right">Qty</th>
              <th className="p-3 w-32 text-right">Price ($)</th>
              <th className="p-3 w-36 text-right">Total ($)</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lines.map((l) => (
              <tr key={l.id} className="hover:bg-muted/20">
                <td className="p-3 font-mono font-bold text-primary">{l.code}</td>
                <td className="p-3 font-medium text-foreground">{l.name}</td>
                <td className="p-3 text-right font-semibold">{l.qty}</td>
                <td className="p-3 text-right font-mono">${l.price.toFixed(2)}</td>
                <td className="p-3 text-right font-mono font-bold text-foreground">${(l.qty * l.price).toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button onClick={() => setLines(lines.filter(item => item.id !== l.id))} className="text-muted-foreground hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal:</span><span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax (10%):</span><span className="font-semibold text-foreground">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border"><span>Grand Total:</span><span className="text-primary">${grandTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* POSTING PREVIEW MODAL */}
      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={() => {
          setIsPosted(true);
          setCurrentStep('INVOICE');
        }}
        documentTitle="Sales Order to Sales Invoice Conversion"
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
