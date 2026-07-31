import React, { useState, useEffect } from 'react';
import { DocHeader } from './shared/DocHeader';
import { GLPostingPreviewModal } from './shared/GLPostingPreviewModal';
import { ArrowRightLeft, ArrowDownLeft, ArrowUpRight, CheckCircle2, Save, Landmark } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { BankingWorkspace } from './BankingWorkspace';

interface Props {
  initialAccountCode?: string;
  onNavigate?: (tab: string, payload?: any) => void;
}

export const BankTransactionStudio: React.FC<Props> = ({ initialAccountCode, onNavigate }) => {
  const [transType, setTransType] = useState<'PAYMENT' | 'DEPOSIT' | 'TRANSFER'>('PAYMENT');
  const [ref, setRef] = useState('BP-2026-0082');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [fromAccount, setFromAccount] = useState(initialAccountCode || '1060');
  const [toAccount, setToAccount] = useState('1065');
  const [amount, setAmount] = useState(1500.00);
  const [memo, setMemo] = useState('Petty cash bank replenishment');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openedAccountCode, setOpenedAccountCode] = useState<string | null>(null);

  useEffect(() => {
    if (initialAccountCode) {
      setOpenedAccountCode(initialAccountCode);
    }
  }, [initialAccountCode]);

  if (openedAccountCode) {
    return (
      <BankingWorkspace
        accountCode={openedAccountCode}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedAccountCode(null);
          if (onNavigate) onNavigate('bank-trans');
        }}
      />
    );
  }

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

  const handleConfirmPost = async () => {
    setLoading(true);
    try {
      const payload = {
        memo: `Bank Transaction ${transType} (${ref}): ${memo}`,
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
        alert(res.message || 'Failed to post bank transaction');
      }
    } catch (e: any) {
      setLoading(false);
      alert(`Error connecting to REST API Gateway: ${e.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Bank Transaction Executed via FrontAccounting Engine!</div>
              <div className="text-xs opacity-90 font-mono">Reference: {ref} — Posted to Bank Ledger & Audit Trail</div>
            </div>
          </div>
          <button 
            onClick={() => setOpenedAccountCode(fromAccount)}
            className="px-3 py-1.5 rounded bg-emerald-500 text-white font-bold hover:bg-emerald-600 text-xs transition-colors"
          >
            Open Bank Workspace
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
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
            <ArrowRightLeft className="w-4 h-4 text-primary" /> Inter-Bank Transfer
          </button>
        </div>

        <button
          onClick={() => setOpenedAccountCode(fromAccount)}
          className="px-3.5 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 flex items-center gap-1.5 border border-border"
        >
          <Landmark className="w-4 h-4 text-primary" /> Open Bank Account Workspace ({fromAccount})
        </button>
      </div>

      <DocHeader
        title={`Bank ${transType.toLowerCase()} Studio`}
        subtitle="Bank Payment & Inter-Bank Transfer"
        reference={ref}
        docDate={docDate}
        onDateChange={setDocDate}
        currency="USD"
        status={isPosted ? 'POSTED' : 'DRAFT'}
      />

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-muted-foreground font-medium mb-1.5">Source Bank Account</label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
            >
              <option value="1060">1060 — Current Bank Account ($412,900.00)</option>
              <option value="1065">1065 — Petty Cash Account ($3,500.00)</option>
            </select>
          </div>

          {transType === 'TRANSFER' && (
            <div>
              <label className="block text-muted-foreground font-medium mb-1.5">Destination Bank Account</label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
              >
                <option value="1065">1065 — Petty Cash Account ($3,500.00)</option>
                <option value="1060">1060 — Current Bank Account ($412,900.00)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-muted-foreground font-medium mb-1.5">Transaction Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono font-bold text-primary text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1.5">Description / Memo</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground font-semibold"
          >
            Preview GL Ledger Impact
          </button>

          <button
            onClick={handleConfirmPost}
            disabled={isPosted || loading || amount <= 0}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {loading ? 'Processing...' : isPosted ? 'Executed' : 'Execute & Post Bank Transaction'}
          </button>
        </div>
      </div>

      <GLPostingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmPost={handleConfirmPost}
        documentTitle={`Bank ${transType}`}
        reference={ref}
        postings={postings}
      />
    </div>
  );
};
