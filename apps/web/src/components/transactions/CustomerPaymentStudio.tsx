import React, { useState } from 'react';
import { DocHeader } from './shared/DocHeader';
import { PartySelector } from './shared/PartySelector';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { DollarSign, CheckCircle2, Link2, Scale } from 'lucide-react';

export const CustomerPaymentStudio: React.FC = () => {
  const [customer, setCustomer] = useState('1');
  const [ref, setRef] = useState('REM-2026-0031');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [paymentAmount, setPaymentAmount] = useState(2645.50);
  const [bankAccount, setBankAccount] = useState('1060');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const customers = [
    { id: '1', name: 'Acme Global Logistics', ref: 'ACME01', address: '100 Logistics Way, Chicago IL', currency: 'USD', creditLimit: 50000 },
    { id: '2', name: 'Apex Systems Inc', ref: 'APEX02', address: '450 Tech Pkwy, Austin TX', currency: 'USD', creditLimit: 25000 },
  ];

  const openInvoices = [
    { id: 'INV-1042', date: '2026-07-27', total: 2645.50, allocated: 0.00, openAmount: 2645.50 },
    { id: 'INV-1038', date: '2026-06-15', total: 9800.00, allocated: 0.00, openAmount: 9800.00 },
  ];

  const postings = [
    { accountCode: bankAccount, accountName: 'Current Bank Account', debit: paymentAmount, credit: 0 },
    { accountCode: '1200', accountName: 'Accounts Receivable (Acme Global)', debit: 0, credit: paymentAmount },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Customer Payment & Allocation Posted</div>
            <div className="text-xs opacity-80">Reference: {ref} — Allocated to INV-1042 ($2,645.50) via FA Engine</div>
          </div>
        </div>
      )}

      <DocHeader
        title="Customer Payment & Allocation Engine"
        subtitle="Order-to-Cash Workflow — Log Receipt & Match Open Invoices"
        reference={ref}
        docDate={docDate}
        currency="USD"
        status="UNPAID"
        onReferenceChange={setRef}
        onDateChange={setDocDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PartySelector
            label="Received From Customer"
            parties={customers}
            selectedId={customer}
            onSelect={setCustomer}
          />
        </div>

        {/* PAYMENT AMOUNT & BANK ACCOUNT */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Payment Details</h4>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Bank / Cash Account</label>
            <select 
              value={bankAccount} 
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="1060">1060 — Current Bank Account ($412,900)</option>
              <option value="1065">1065 — Petty Cash Account ($3,500)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Receipt Amount ($)</label>
            <input 
              type="number" 
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-primary focus:outline-none"
            />
          </div>

          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="w-full py-2 mt-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <DollarSign className="w-4 h-4" /> Process Receipt & Allocate
          </button>
        </div>
      </div>

      {/* OPEN INVOICES ALLOCATION TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" /> Open Customer Invoices to Allocate
          </h3>
          <span className="text-xs text-muted-foreground">Match payment against open receivables</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-36">Invoice Ref</th>
              <th className="p-3.5 w-32">Invoice Date</th>
              <th className="p-3.5 w-32 text-right">Original Amount ($)</th>
              <th className="p-3.5 w-32 text-right">Open Amount ($)</th>
              <th className="p-3.5 w-36 text-right">Allocate Amount ($)</th>
              <th className="p-3.5 w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {openInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-primary">{inv.id}</td>
                <td className="p-3.5 text-muted-foreground">{inv.date}</td>
                <td className="p-3.5 text-right font-semibold">${inv.total.toFixed(2)}</td>
                <td className="p-3.5 text-right text-rose-500 font-bold">${inv.openAmount.toFixed(2)}</td>
                <td className="p-3.5 text-right">
                  <input 
                    type="number" 
                    defaultValue={inv.id === 'INV-1042' ? 2645.50 : 0}
                    className="w-32 bg-background border border-border rounded px-2 py-1 text-xs text-right font-bold text-emerald-500"
                  />
                </td>
                <td className="p-3.5 text-center">
                  <button className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold hover:bg-primary hover:text-white transition-colors">
                    Match
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={() => setIsPosted(true)}
        documentTitle="Customer Payment Receipt & Allocation"
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
