import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle2, DollarSign, List, History } from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';

interface BankAccountData {
  account_code: string;
  bank_name: string;
  account_number: string;
  currency: string;
  balance: number;
  unreconciled_count: number;
}

interface Props {
  accountCode: string;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const BankingWorkspace: React.FC<Props> = ({
  accountCode,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState<BankAccountData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setBank({
      account_code: accountCode,
      bank_name: accountCode === '1060' ? 'Commercial Bank of Ethiopia (Main Operating)' : `Bank Account ${accountCode}`,
      account_number: '1000-8849-2019',
      currency: 'USD',
      balance: 412900.00,
      unreconciled_count: 3
    });

    setTransactions([
      { id: 'BANK-TR-0091', date: '2026-07-27', type: 'Customer Payment', amount: 3500.00, counterparty: 'ABC Trading PLC', counterparty_type: 'customer', counterparty_id: '1', ref: 'REM-2026-0031' },
      { id: 'BANK-TR-0084', date: '2026-07-25', type: 'Inter-Bank Transfer Out', amount: -3500.00, counterparty: 'Petty Cash Account', counterparty_type: 'gl_account', counterparty_id: '1065', ref: 'JV-2026-1039' }
    ]);
    setLoading(false);
  }, [accountCode]);

  const tabs = [
    { id: 'overview', label: 'Bank Account Overview', icon: Landmark },
    { id: 'transactions', label: 'Bank Transactions & Ledger', icon: List, badge: transactions.length },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">Loading Bank Workspace...</div>;
  }

  return (
    <UniversalRecordWorkspace
      entityType="bank_account"
      recordId={accountCode}
      title={`${bank?.bank_name}`}
      subtitle={`GL Code: #${bank?.account_code} • Account No: ${bank?.account_number} • Currency: ${bank?.currency}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Account Active & Synced
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Reconciled Ledger Balance</span>
              <div className="text-xl font-bold font-mono text-primary mt-1">${(bank?.balance || 0).toLocaleString()} USD</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Unreconciled Items</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">{bank?.unreconciled_count} Items</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">GL Master Account</span>
              <div className="mt-2">
                <RecordLink entity="gl_account" id={accountCode} name="Bank Master GL Account" onNavigate={onNavigate} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Associated Bank Transactions & Payments</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Transaction Type</th>
                  <th className="p-3 text-right">Amount ($)</th>
                  <th className="p-3">Counterparty</th>
                  <th className="p-3">Source Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tr) => (
                  <tr key={tr.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-primary">{tr.id}</td>
                    <td className="p-3 text-muted-foreground font-mono">{tr.date}</td>
                    <td className="p-3 font-medium text-foreground">{tr.type}</td>
                    <td className={`p-3 text-right font-mono font-bold ${tr.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${tr.amount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <RecordLink entity={tr.counterparty_type} id={tr.counterparty_id} name={tr.counterparty} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3">
                      <RecordLink entity="journal" id={tr.ref.replace('JV-2026-', '')} name={tr.ref} onNavigate={onNavigate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </UniversalRecordWorkspace>
  );
};
