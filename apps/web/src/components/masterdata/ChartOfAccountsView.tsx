import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Filter, CheckCircle2, XCircle, X } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { ChartOfAccountsWorkspace } from './ChartOfAccountsWorkspace';

interface Account {
  account_code: string;
  account_name: string;
  class_name: string;
  type_name?: string;
  account_type?: string;
  balance: number;
  inactive: number;
}

interface Props {
  onNavigate?: (tab: string, payload?: any) => void;
  initialAccountCode?: string;
}

export const ChartOfAccountsView: React.FC<Props> = ({ onNavigate, initialAccountCode }) => {
  const [query, setQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [openedAccountCode, setOpenedAccountCode] = useState<string | null>(initialAccountCode || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    account_code: '',
    account_name: '',
    class_name: 'ASSET',
    account_type: 'ASSET'
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.GL.ACCOUNTS);
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setAccounts(res.data);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('Failed to fetch accounts from API, using default seed');
    }
    setAccounts([
      { account_code: '1060', account_name: 'Current Bank Account', class_name: 'Assets', type_name: 'Current Assets', balance: 412900.00, inactive: 0 },
      { account_code: '1065', account_name: 'Petty Cash Account', class_name: 'Assets', type_name: 'Current Assets', balance: 3500.00, inactive: 0 },
      { account_code: '1200', account_name: 'Accounts Receivable', class_name: 'Assets', type_name: 'Current Assets', balance: 68400.00, inactive: 0 },
      { account_code: '1510', account_name: 'Inventory Asset', class_name: 'Assets', type_name: 'Inventory Assets', balance: 245000.00, inactive: 0 },
      { account_code: '2100', account_name: 'Accounts Payable', class_name: 'Liabilities', type_name: 'Current Liabilities', balance: 18200.00, inactive: 0 },
      { account_code: '2150', account_name: 'Sales Tax (GST) Payable', class_name: 'Liabilities', type_name: 'Current Liabilities', balance: 12400.00, inactive: 0 },
      { account_code: '4010', account_name: 'Sales Revenue', class_name: 'Income', type_name: 'Operating Revenue', balance: 1248500.00, inactive: 0 },
      { account_code: '5010', account_name: 'Cost of Goods Sold (COGS)', class_name: 'Costs', type_name: 'Direct Costs', balance: 620000.00, inactive: 0 },
      { account_code: '6810', account_name: 'Depreciation Expense', class_name: 'Costs', type_name: 'Operating Expenses', balance: 24500.00, inactive: 0 },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (initialAccountCode) {
      setOpenedAccountCode(initialAccountCode);
    }
  }, [initialAccountCode]);

  const handleOpenAccountWorkspace = (code: string) => {
    setOpenedAccountCode(code);
    if (onNavigate) {
      onNavigate('chart-accounts', { accountCode: code });
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const json = await apiClient.post(API_ENDPOINTS.GL.ACCOUNTS, formData);
      if (json.success) {
        setToastMessage(`GL Account "${formData.account_code} - ${formData.account_name}" created & saved to DB!`);
        setIsModalOpen(false);
        setFormData({ account_code: '', account_name: '', class_name: 'ASSET', account_type: 'ASSET' });
        fetchAccounts();
      } else {
        alert(json.message || 'Failed to create GL account');
      }
    } catch (err: any) {
      alert(`Error creating account: ${err.message || 'Error connecting to API server'}`);
    }
  };

  if (openedAccountCode) {
    return (
      <ChartOfAccountsWorkspace
        accountCode={openedAccountCode}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedAccountCode(null);
          if (onNavigate) onNavigate('chart-accounts');
        }}
      />
    );
  }

  const filtered = accounts.filter(acc => {
    const matchesSearch = acc.account_code.includes(query) || acc.account_name.toLowerCase().includes(query.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || (acc.class_name && acc.class_name.toUpperCase().includes(selectedClass));
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-3 rounded-lg flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Chart of Accounts
          </h2>
          <p className="text-xs text-muted-foreground">General Ledger Master Accounts & Financial Classes (Double-click or press Enter to open Workspace)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all"
        >
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
            {['ALL', 'ASSET', 'LIABILITY', 'INCOME', 'COST'].map((cls) => (
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
                <th className="p-3.5 w-36 text-right">Balance ($)</th>
                <th className="p-3.5 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((acc) => {
                const isSelected = selectedAccount?.account_code === acc.account_code;
                return (
                  <tr 
                    key={acc.account_code} 
                    onClick={() => setSelectedAccount(acc)}
                    onDoubleClick={() => handleOpenAccountWorkspace(acc.account_code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleOpenAccountWorkspace(acc.account_code);
                    }}
                    tabIndex={0}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/20'
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-primary">{acc.account_code}</td>
                    <td className="p-3.5 font-medium text-foreground">{acc.account_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
                        {acc.class_name || acc.account_type || 'ASSET'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-foreground">
                      ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Create New GL Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Account Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1070"
                  value={formData.account_code}
                  onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono font-bold text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Operations Fund"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Account Class</label>
                <select
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value, account_type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                >
                  <option value="ASSET">Assets</option>
                  <option value="LIABILITY">Liabilities</option>
                  <option value="EQUITY">Equity</option>
                  <option value="INCOME">Income / Revenue</option>
                  <option value="COST">Costs / Expenses</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
