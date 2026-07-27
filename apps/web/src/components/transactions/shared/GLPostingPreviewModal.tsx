import React from 'react';
import { X, CheckCircle2, Scale, ShieldCheck } from 'lucide-react';

interface GLPostingLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo?: string;
}

interface GLPostingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPost: () => void;
  documentTitle: string;
  reference: string;
  postings: GLPostingLine[];
}

export const GLPostingPreviewModal: React.FC<GLPostingPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmPost,
  documentTitle,
  reference,
  postings
}) => {
  if (!isOpen) return null;

  const totalDebit = postings.reduce((sum, p) => sum + p.debit, 0);
  const totalCredit = postings.reduce((sum, p) => sum + p.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-foreground">GL Posting Preview & Verification</h3>
              <p className="text-[11px] text-muted-foreground">{documentTitle} — {reference}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* POSTING LINES GRID */}
        <div className="p-4 overflow-y-auto max-h-80 space-y-3">
          <p className="text-xs text-muted-foreground">
            The following general ledger journal entries will be executed atomically via FrontAccounting Core Engine:
          </p>

          <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-2.5 w-28">GL Code</th>
                <th className="p-2.5">Account Name</th>
                <th className="p-2.5 w-28 text-right">Debit ($)</th>
                <th className="p-2.5 w-28 text-right">Credit ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {postings.map((p, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="p-2.5 font-bold text-primary">{p.accountCode}</td>
                  <td className="p-2.5 font-sans font-medium text-foreground">{p.accountName}</td>
                  <td className="p-2.5 text-right">{p.debit > 0 ? `$${p.debit.toFixed(2)}` : '-'}</td>
                  <td className="p-2.5 text-right">{p.credit > 0 ? `$${p.credit.toFixed(2)}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER & CONFIRM BUTTON */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>Debits: <strong className="text-emerald-500">${totalDebit.toFixed(2)}</strong></div>
            <div>Credits: <strong className="text-emerald-500">${totalCredit.toFixed(2)}</strong></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80">
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirmPost();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Post Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
