import React, { useState } from 'react';
import { Plus, Trash2, Scale, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export const JournalEntryGrid: React.FC = () => {
  const [docDate, setDocDate] = useState('2026-07-27');
  const [ref, setRef] = useState('JRN-2026-0104');
  const [memo, setMemo] = useState('Quarter-end depreciation adjustment');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountCode: '6810', accountName: 'Depreciation Expense', debit: 12450.00, credit: 0 },
    { id: '2', accountCode: '1060', accountName: 'Accumulated Depr - Equipment', debit: 0, credit: 12450.00 },
  ]);
  const [isPosted, setIsPosted] = useState(false);

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
      // Add credit line
      setLines([...lines, { id: Date.now().toString(), accountCode: '1060', accountName: 'Current Bank Account', debit: 0, credit: diff }]);
    } else if (diff < 0) {
      // Add debit line
      setLines([...lines, { id: Date.now().toString(), accountCode: '6810', accountName: 'Depreciation Expense', debit: Math.abs(diff), credit: 0 }]);
    }
  };

  const handlePostJournal = () => {
    if (!isBalanced) return;
    setIsPosted(true);
    setTimeout(() => setIsPosted(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* POSTED TOAST */}
      {isPosted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Journal Entry Posted to GL</div>
            <div className="text-xs opacity-80">Reference: {ref} — Posted to 0_gl_trans with Audit Ref</div>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manual Journal Entry Workspace</h2>
          <p className="text-xs text-muted-foreground">General Ledger Posting & Balancing Studio</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAutoBalance}
            className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Scale className="w-4 h-4 text-amber-500" /> Auto-Balance (Ctrl+B)
          </button>
          <button 
            disabled={!isBalanced}
            onClick={handlePostJournal}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-all ${
              isBalanced 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }`}
          >
            <Save className="w-4 h-4" /> Post Journal (Ctrl+S)
          </button>
        </div>
      </div>

      {/* HEADER INPUTS CARD */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Journal Reference</label>
          <input 
            type="text" 
            value={ref} 
            onChange={(e) => setRef(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Posting Date</label>
          <input 
            type="date" 
            value={docDate} 
            onChange={(e) => setDocDate(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Document Memo / Reason</label>
          <input 
            type="text" 
            value={memo} 
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* BALANCED JOURNAL GRID */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Debit & Credit Lines</h3>
          <button 
            onClick={addLine}
            className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Line (F2)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 w-36">Account Code</th>
                <th className="p-3">Account Name</th>
                <th className="p-3 w-36 text-right">Debit ($)</th>
                <th className="p-3 w-36 text-right">Credit ($)</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lines.map((line, index) => (
                <tr key={line.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 text-center text-muted-foreground font-mono">{index + 1}</td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={line.accountCode} 
                      onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-mono font-medium focus:border-primary"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={line.accountName} 
                      onChange={(e) => updateLine(line.id, 'accountName', e.target.value)}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium focus:border-primary"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={line.debit} 
                      onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium text-right focus:border-primary"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={line.credit} 
                      onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium text-right focus:border-primary"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => removeLine(line.id)}
                      className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* JOURNAL BALANCE STATUS BAR */}
        <div className={`p-4 border-t border-border flex items-center justify-between text-xs font-semibold ${
          isBalanced ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Journal Balanced — Ready for GL Posting</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Journal Imbalanced by ${Math.abs(totalDebit - totalCredit).toFixed(2)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-6 text-foreground font-mono">
            <div>Total Debits: <strong className="text-emerald-500">${totalDebit.toFixed(2)}</strong></div>
            <div>Total Credits: <strong className="text-emerald-500">${totalCredit.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
