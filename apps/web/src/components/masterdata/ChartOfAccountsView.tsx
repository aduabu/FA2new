import React, { useState } from 'react';
import { BookOpen, Search, Plus, Filter, CheckCircle2, XCircle } from 'lucide-react';

interface Account {
  account_code: string;
  account_name: string;
  class_name: string;
  type_name: string;
  balance: number;
  inactive: number;
}

export const ChartOfAccountsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  const accounts: Account[] = [
    { account_code: '1060', account_name: 'Current Bank Account', class_name: 'Assets', type_name: 'Current Assets', balance: 412900.00, inactive: 0 },
    { account_code: '1065', account_name: 'Petty Cash Account', class_name: 'Assets', type_name: 'Current Assets', balance: 3500.00, inactive: 0 },
    { account_code: '1200', account_name: 'Accounts Receivable', class_name: 'Assets', type_name: 'Current Assets', balance: 68400.00, inactive: 0 },
    { account_code: '1510', account_name: 'Inventory Asset', class_name: 'Assets', type_name: 'Inventory Assets', balance: 245000.00, inactive: 0 },
    { account_code: '2100', account_name: 'Accounts Payable', class_name: 'Liabilities', type_name: 'Current Liabilities', balance: 18200.00, inactive: 0 },
    { account_code: '2150', account_name: 'Sales Tax (GST) Payable', class_name: 'Liabilities', type_name: 'Current Liabilities', balance: 12400.00, inactive: 0 },
    { account_code: '4010', account_name: 'Sales Revenue', class_name: 'Income', type_name: 'Operating Revenue', balance: 1248500.00, inactive: 0 },
    { account_code: '5010', account_name: 'Cost of Goods Sold (COGS)', class_name: 'Costs', type_name: 'Direct Costs', balance: 620000.00, inactive: 0 },
    { account_code: '6810', account_name: 'Depreciation Expense', class_name: 'Costs', type_name: 'Operating Expenses', balance: 24500.00, inactive: 0 },
  ];

  const filtered = accounts.filter(acc => {
    const matchesSearch = acc.account_code.includes(query) || acc.account_name.toLowerCase().includes(query.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || acc.class_name.toUpperCase() === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Chart of Accounts
          </h2>
          <p className="text-xs text-muted-foreground">General Ledger Master Accounts & Financial Classes</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New GL Account
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search code or account name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
            {['ALL', 'ASSETS', 'LIABILITIES', 'INCOME', 'COSTS'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedClass === cls ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5 w-28">Account Code</th>
                <th className="p-3.5">Account Name</th>
                <th className="p-3.5 w-32">Class</th>
                <th className="p-3.5 w-44">Account Type</th>
                <th className="p-3.5 w-36 text-right">Balance ($)</th>
                <th className="p-3.5 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((acc) => (
                <tr key={acc.account_code} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-primary">{acc.account_code}</td>
                  <td className="p-3.5 font-medium text-foreground">{acc.account_name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
                      {acc.class_name}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{acc.type_name}</td>
                  <td className="p-3.5 text-right font-mono font-semibold text-foreground">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-center">
                    {acc.inactive === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
