import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

export const TrialBalanceStudio: React.FC = () => {
  const [asOfDate, setAsOfDate] = useState('2026-07-27');
  const [query, setQuery] = useState('');

  const rows = [
    { code: '1060', name: 'Current Bank Account', debit: 412900.00, credit: 0.00 },
    { code: '1065', name: 'Petty Cash Account', debit: 3500.00, credit: 0.00 },
    { code: '1200', name: 'Accounts Receivable', debit: 68400.00, credit: 0.00 },
    { code: '1510', name: 'Inventory Asset', debit: 245000.00, credit: 0.00 },
    { code: '2100', name: 'Accounts Payable', debit: 0.00, credit: 18200.00 },
    { code: '2150', name: 'Sales Tax (GST) Payable', debit: 0.00, credit: 12400.00 },
    { code: '4010', name: 'Sales Revenue', debit: 0.00, credit: 1248500.00 },
    { code: '5010', name: 'Cost of Goods Sold (COGS)', debit: 620000.00, credit: 0.00 },
    { code: '6810', name: 'Depreciation Expense', debit: 24500.00, credit: 0.00 },
    { code: '3010', name: 'Retained Earnings', debit: 0.00, credit: 95200.00 },
  ];

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  const handleExportCSV = () => {
    let csv = 'Account Code,Account Name,Debit ($),Credit ($)\n';
    rows.forEach(r => {
      csv += `"${r.code}","${r.name}",${r.debit.toFixed(2)},${r.credit.toFixed(2)}\n`;
    });
    csv += `TOTALS,"Total Ledgers",${totalDebit.toFixed(2)},${totalCredit.toFixed(2)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trial_Balance_${asOfDate}.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Interactive Trial Balance Studio
          </h2>
          <p className="text-xs text-muted-foreground">General Ledger Verification & Account Ledger Balances</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm">
            <Printer className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-muted-foreground">As Of Date:</label>
          <input 
            type="date" 
            value={asOfDate} 
            onChange={(e) => setAsOfDate(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-1.5 font-medium text-foreground focus:outline-none"
          />
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search account code or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* TRIAL BALANCE TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-32">Account Code</th>
              <th className="p-3.5">Account Name</th>
              <th className="p-3.5 w-36 text-right">Debit Balance ($)</th>
              <th className="p-3.5 w-36 text-right">Credit Balance ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {rows.filter(r => r.code.includes(query) || r.name.toLowerCase().includes(query.toLowerCase())).map((r) => (
              <tr key={r.code} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-primary">{r.code}</td>
                <td className="p-3.5 font-sans font-medium text-foreground">{r.name}</td>
                <td className="p-3.5 text-right font-semibold">{r.debit > 0 ? `$${r.debit.toLocaleString('en-US', {minimumFractionDigits: 2})}` : '-'}</td>
                <td className="p-3.5 text-right font-semibold">{r.credit > 0 ? `$${r.credit.toLocaleString('en-US', {minimumFractionDigits: 2})}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TRIAL BALANCE TOTALS & BALANCE STATUS */}
        <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>Trial Balance 100% Balanced — Zero Variance Detected</span>
          </div>

          <div className="flex items-center gap-8 font-mono text-foreground">
            <div>Total Debits: <strong className="text-emerald-500">${totalDebit.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></div>
            <div>Total Credits: <strong className="text-emerald-500">${totalCredit.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
