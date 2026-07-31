import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Scale, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { JournalEntryWorkspace } from './JournalEntryWorkspace';

interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

interface Props {
  initialAccountCode?: string;
  initialTransNo?: string;
  onNavigate?: (tab: string, payload?: any) => void;
}

export const JournalEntryGrid: React.FC<Props> = ({ initialAccountCode, initialTransNo, onNavigate }) => {
  const [docDate, setDocDate] = useState('2026-07-27');
  const [ref, setRef] = useState('JRN-2026-0104');
  const [memo, setMemo] = useState('Quarter-end depreciation adjustment');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountCode: initialAccountCode || '6810', accountName: 'Depreciation Expense', debit: 12450.00, credit: 0 },
    { id: '2', accountCode: '1060', accountName: 'Current Bank Account', debit: 0, credit: 12450.00 },
  ]);
  const [isPosted, setIsPosted] = useState(false);
  const [postedResult, setPostedResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openedTransNo, setOpenedTransNo] = useState<string | null>(initialTransNo || null);

  useEffect(() => {
    if (initialTransNo) setOpenedTransNo(initialTransNo);
  }, [initialTransNo]);

  if (openedTransNo) {
    return (
      <JournalEntryWorkspace
        transNo={openedTransNo}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedTransNo(null);
          if (onNavigate) onNavigate('gl-journal');
        }}
      />
    );
  }

  const totalDebit = lines.reduce((acc, l) => acc + l.debit, 0);
  const totalCredit = lines.reduce((acc, l) => acc + l.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), accountCode: '1060', accountName: 'Current Bank Account', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof JournalLine, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleAutoBalance = () => {
    const diff = totalDebit - totalCredit;
    if (diff > 0) {
      setLines([...lines, { id: Date.now().toString(), accountCode: '1060', accountName: 'Current Bank Account', debit: 0, credit: diff }]);
    } else if (diff < 0) {
      setLines([...lines, { id: Date.now().toString(), accountCode: '6810', accountName: 'Depreciation Expense', debit: Math.abs(diff), credit: 0 }]);
    }
  };

  const handlePostJournal = async () => {
    if (!isBalanced) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      const payload = {
        memo: memo,
        ref: ref,
        date: docDate,
        lines: lines.map(l => ({
          account_code: l.accountCode,
          account_name: l.accountName,
          debit: l.debit,
          credit: l.credit
        }))
      };

      const response = await apiClient.post(API_ENDPOINTS.GL.JOURNALS, payload);
      setLoading(false);

      if (response.success) {
        setPostedResult(response.data);
        setIsPosted(true);
      } else {
        setErrorMessage(response.message);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(`Connection Error: ${err.message || 'Unable to reach REST API Gateway'}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ERROR TOAST */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMessage}
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-400">✕</button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" /> Manual Journal Entry Studio
          </h2>
          <p className="text-xs text-muted-foreground">General Ledger Balanced Double-Entry Accounting</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleAutoBalance}
            disabled={isBalanced || isPosted}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isBalanced 
                ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10 cursor-default' 
                : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> {isBalanced ? 'Balanced' : 'Auto-Balance'}
          </button>

          <button 
            onClick={handlePostJournal}
            disabled={!isBalanced || isPosted || loading}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
              isBalanced && !isPosted && !loading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
            }`}
          >
            <Save className="w-4 h-4" /> {loading ? 'Posting to DB...' : isPosted ? 'Journal Posted' : 'Post Journal Entry'}
          </button>
        </div>
      </div>

      {/* SUCCESS POSTED BANNER */}
      {isPosted && postedResult && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-500 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <span className="font-bold">Journal Entry JV-2026-{postedResult.trans_no} successfully posted to DB!</span>
              <p className="text-[11px] opacity-80">Audit trail reference: #{postedResult.trans_no}. Double-click below to open workspace.</p>
            </div>
          </div>
          <button 
            onClick={() => setOpenedTransNo(String(postedResult.trans_no))}
            className="px-3 py-1.5 rounded bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
          >
            Open Journal Workspace
          </button>
        </div>
      )}

      {/* DOCUMENT HEADER CONTROLS */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-muted-foreground font-medium mb-1">Posting Date</label>
          <input 
            type="date" 
            disabled={isPosted}
            value={docDate} 
            onChange={(e) => setDocDate(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-muted-foreground font-medium mb-1">Source Document Ref</label>
          <input 
            type="text" 
            disabled={isPosted}
            value={ref} 
            onChange={(e) => setRef(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 font-mono text-primary font-bold focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-muted-foreground font-medium mb-1">Journal Description / Memo</label>
          <input 
            type="text" 
            disabled={isPosted}
            value={memo} 
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* JOURNAL GRID TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-44">GL Account Code</th>
              <th className="p-3.5">Account Title</th>
              <th className="p-3.5 w-36 text-right">Debit ($)</th>
              <th className="p-3.5 w-36 text-right">Credit ($)</th>
              <th className="p-3.5 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lines.map((l) => (
              <tr key={l.id} className="hover:bg-muted/20">
                <td className="p-3 font-mono font-bold text-primary">
                  <input
                    type="text"
                    disabled={isPosted}
                    value={l.accountCode}
                    onChange={(e) => updateLine(l.id, 'accountCode', e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
                  />
                </td>
                <td className="p-3 font-medium text-foreground">
                  <input
                    type="text"
                    disabled={isPosted}
                    value={l.accountName}
                    onChange={(e) => updateLine(l.id, 'accountName', e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
                  />
                </td>
                <td className="p-3 text-right font-mono">
                  <input
                    type="number"
                    disabled={isPosted}
                    value={l.debit || ''}
                    onChange={(e) => updateLine(l.id, 'debit', parseFloat(e.target.value) || 0)}
                    className="w-28 text-right bg-background border border-border rounded px-2 py-1 text-emerald-400 font-bold focus:outline-none focus:border-primary"
                  />
                </td>
                <td className="p-3 text-right font-mono">
                  <input
                    type="number"
                    disabled={isPosted}
                    value={l.credit || ''}
                    onChange={(e) => updateLine(l.id, 'credit', parseFloat(e.target.value) || 0)}
                    className="w-28 text-right bg-background border border-border rounded px-2 py-1 text-rose-400 font-bold focus:outline-none focus:border-primary"
                  />
                </td>
                <td className="p-3 text-center">
                  <button 
                    disabled={isPosted || lines.length <= 2}
                    onClick={() => removeLine(l.id)} 
                    className="p-1 rounded hover:bg-rose-500/10 text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30 font-bold border-t border-border">
            <tr>
              <td colSpan={2} className="p-3.5 text-right uppercase text-[10px] text-muted-foreground">
                Total Debit / Credit Check:
              </td>
              <td className="p-3.5 text-right font-mono text-emerald-400">${totalDebit.toFixed(2)}</td>
              <td className="p-3.5 text-right font-mono text-rose-400">${totalCredit.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        
        {!isPosted && (
          <div className="p-3 bg-card border-t border-border flex justify-between items-center">
            <button 
              onClick={addLine}
              className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
            <span className="text-[11px] text-muted-foreground">
              {isBalanced ? '✓ Journal is perfectly balanced' : `⚠ Unbalanced diff: $${Math.abs(totalDebit - totalCredit).toFixed(2)}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
