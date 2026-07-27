import React, { useState } from 'react';
import { DocHeader } from './shared/DocHeader';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { Landmark, ArrowRightLeft, ArrowDownLeft, ArrowUpRight, CheckCircle2, Save } from 'lucide-react';

export const BankTransactionStudio: React.FC = () => {
  const [transType, setTransType] = useState<'PAYMENT' | 'DEPOSIT' | 'TRANSFER'>('PAYMENT');
  const [ref, setRef] = useState('BP-2026-0082');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [fromAccount, setFromAccount] = useState('1060');
  const [toAccount, setToAccount] = useState('1065');
  const [amount, setAmount] = useState(1500.00);
  const [memo, setMemo] = useState('Petty cash bank replenishment');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const postings = transType === 'TRANSFER' ? [
    { accountCode: toAccount, accountName: 'Petty Cash Account', debit: amount, credit: 0 },
    { accountCode: fromAccount, accountName: 'Current Bank Account', debit: 0, credit: amount },
  ] : transType === 'PAYMENT' ? [
    { accountCode: '6810', accountName: 'Operating Expense', debit: amount, credit: 0 },
    { accountCode: fromAccount, accountName: 'Current Bank Account', debit: 0, credit: amount },
  ] : [
    { accountCode: fromAccount, accountName: 'Current Bank Account', debit: amount, credit: 0 },
    { accountCode: '4010', accountName: 'Misc Income', debit: 0, credit: amount },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Bank Transaction Executed</div>
            <div className="text-xs opacity-80">Reference: {ref} — Posted to Bank Ledger via FA Core Engine</div>
          </div>
        </div>
      )}

      {/* TRANSACTION TYPE SELECTOR TABS */}
      <div className="bg-card p-2 rounded-xl border border-border flex items-center gap-2 max-w-md">
        <button
          onClick={() => { setTransType('PAYMENT'); setRef('BP-2026-0082'); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            transType === 'PAYMENT' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-400" /> Bank Payment
        </button>

        <button
          onClick={() => { setTransType('DEPOSIT'); setRef('BD-2026-0044'); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            transType === 'DEPOSIT' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Bank Deposit
        </button>

        <button
          onClick={() => { setTransType('TRANSFER'); setRef('BT-2026-0019'); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            transType === 'TRANSFER' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-amber-400" /> Bank Transfer
        </button>
      </div>

      <DocHeader
        title={transType === 'TRANSFER' ? 'Inter-Bank Transfer Studio' : transType === 'PAYMENT' ? 'Bank Payment Studio' : 'Bank Deposit Studio'}
        subtitle="Banking & Cash Management — Execute Direct Bank Transactions"
        reference={ref}
        docDate={docDate}
        currency="USD"
        status="APPROVED"
        onReferenceChange={setRef}
        onDateChange={setDocDate}
      />

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-muted-foreground mb-1">
              {transType === 'TRANSFER' ? 'Source Bank Account' : transType === 'PAYMENT' ? 'Paid From Bank Account' : 'Deposited To Bank Account'}
            </label>
            <select 
              value={fromAccount} 
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-semibold text-foreground focus:outline-none"
            >
              <option value="1060">1060 — Current Bank Account ($412,900)</option>
              <option value="1065">1065 — Petty Cash Account ($3,500)</option>
            </select>
          </div>

          {transType === 'TRANSFER' && (
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Destination Bank Account</label>
              <select 
                value={toAccount} 
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 font-semibold text-foreground focus:outline-none"
              >
                <option value="1065">1065 — Petty Cash Account ($3,500)</option>
                <option value="1060">1060 — Current Bank Account ($412,900)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium text-muted-foreground mb-1">Transaction Amount ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-bold text-sm text-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-muted-foreground mb-1">Memo / Description</label>
            <input 
              type="text" 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-medium text-foreground focus:outline-none"
            />
          </div>
        </div>

        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-md"
        >
          <Save className="w-4 h-4" /> Preview GL Impact & Post Bank Transaction
        </button>
      </div>

      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={() => setIsPosted(true)}
        documentTitle="Bank Transaction Posting"
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
