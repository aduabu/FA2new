import React, { useState } from 'react';
import { Landmark, Upload, CheckCircle2 } from 'lucide-react';

interface Props {
  initialAccountCode?: string;
}

export const BankReconciliationStudio: React.FC<Props> = ({ initialAccountCode }) => {
  const [isMatched, setIsMatched] = useState(false);
  const [bankAccount, setBankAccount] = useState(initialAccountCode || '1060');

  const bankLines = [
    { id: 1, date: '2026-07-27', desc: 'ACH Receipt: Acme Global Logistics', amount: 2645.50, status: 'MATCHED' },
    { id: 2, date: '2026-07-26', desc: 'Wire Transfer: Industrial Components', amount: -5400.00, status: 'MATCHED' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" /> Bank Statement Reconciliation Studio
          </h2>
          <p className="text-xs text-muted-foreground">Match Electronic Bank Statements (OFX/CSV) with System Bank Ledger</p>
        </div>

        <button 
          onClick={() => setIsMatched(true)}
          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
        >
          <Upload className="w-4 h-4" /> Import Bank Statement (CSV / OFX)
        </button>
      </div>

      {/* RECONCILIATION SUMMARY BANNER */}
      <div className="p-5 rounded-xl bg-card border border-border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">Target Bank Account:</span>
          <div className="text-sm font-bold text-foreground mt-0.5">{bankAccount} — Current Bank Account</div>
        </div>
        <div>
          <span className="text-muted-foreground">Bank Statement Ending Balance:</span>
          <div className="text-sm font-bold text-emerald-500 mt-0.5">$412,900.00</div>
        </div>
        <div>
          <span className="text-muted-foreground">System GL Ledger Balance:</span>
          <div className="text-sm font-bold text-emerald-500 mt-0.5">$412,900.00</div>
        </div>
        <div>
          <span className="text-muted-foreground">Reconciliation Variance:</span>
          <div className="text-sm font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> $0.00 (100% Matched)
          </div>
        </div>
      </div>

      {/* MATCHED LINES TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Statement Lines vs Ledger Matches</h3>
          <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All 2 Transactions Reconciled
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-32">Date</th>
              <th className="p-3.5">Bank Statement Description</th>
              <th className="p-3.5 w-36 text-right">Amount ($)</th>
              <th className="p-3.5 w-32 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {bankLines.map((l) => (
              <tr key={l.id} className="hover:bg-muted/20">
                <td className="p-3.5 text-muted-foreground">{l.date}</td>
                <td className="p-3.5 font-sans font-medium text-foreground">{l.desc}</td>
                <td className={`p-3.5 text-right font-bold ${l.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ${l.amount.toFixed(2)}
                </td>
                <td className="p-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                    RECONCILED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
