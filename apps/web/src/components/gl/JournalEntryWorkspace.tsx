import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, DollarSign, List, History, User } from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink, EntityType } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';

interface JournalLine {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  memo: string;
  counterparty?: string;
  counterparty_type?: EntityType;
  counterparty_id?: string;
  source_doc?: string;
}

interface JournalData {
  trans_no: string;
  stamp: string;
  user: string;
  memo: string;
  status: string;
  lines: JournalLine[];
}

interface Props {
  transNo: string;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const JournalEntryWorkspace: React.FC<Props> = ({
  transNo,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('lines');
  const [journal, setJournal] = useState<JournalData | null>(null);

  useEffect(() => {
    // Generate canonical journal record details
    const formattedNo = transNo.startsWith('JV-2026-') ? transNo : `JV-2026-${transNo}`;
    
    if (transNo === '1042' || transNo === 'JV-2026-1042') {
      setJournal({
        trans_no: 'JV-2026-1042',
        stamp: '2026-07-27 10:15:00',
        user: 'admin',
        memo: 'Office Expense Reimbursement & Customer Settlement',
        status: 'POSTED',
        lines: [
          {
            account_code: '1065',
            account_name: 'Petty Cash Account',
            debit: 1250.00,
            credit: 0.00,
            memo: 'Petty cash disbursement',
            counterparty: 'ABC Trading PLC',
            counterparty_type: 'customer',
            counterparty_id: '1',
            source_doc: 'INV-2026-0042'
          },
          {
            account_code: '4010',
            account_name: 'Sales Revenue',
            debit: 0.00,
            credit: 1250.00,
            memo: 'Revenue recognition for INV-2026-0042',
            counterparty: 'ABC Trading PLC',
            counterparty_type: 'customer',
            counterparty_id: '1',
            source_doc: 'INV-2026-0042'
          }
        ]
      });
    } else {
      setJournal({
        trans_no: formattedNo,
        stamp: '2026-07-25 14:00:00',
        user: 'admin',
        memo: `General Ledger Journal Entry ${formattedNo}`,
        status: 'POSTED',
        lines: [
          {
            account_code: '1065',
            account_name: 'Petty Cash Account',
            debit: 3500.00,
            credit: 0.00,
            memo: 'Petty Cash Top Up',
            counterparty: 'Current Bank Account',
            counterparty_type: 'bank_account',
            counterparty_id: '1060',
            source_doc: 'REM-2026-0031'
          },
          {
            account_code: '1060',
            account_name: 'Current Bank Account',
            debit: 0.00,
            credit: 3500.00,
            memo: 'Transfer to Petty Cash',
            counterparty: 'Petty Cash Account',
            counterparty_type: 'gl_account',
            counterparty_id: '1065',
            source_doc: 'REM-2026-0031'
          }
        ]
      });
    }
  }, [transNo]);

  const totalDebit = journal?.lines.reduce((sum, l) => sum + l.debit, 0) || 0;
  const totalCredit = journal?.lines.reduce((sum, l) => sum + l.credit, 0) || 0;

  const tabs = [
    { id: 'lines', label: 'Journal Lines & GL Entries', icon: List, badge: journal?.lines.length || 2 },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  return (
    <UniversalRecordWorkspace
      entityType="journal"
      recordId={transNo}
      title={`Journal Entry ${journal?.trans_no}`}
      subtitle={`Posted by ${journal?.user} on ${journal?.stamp} • Description: ${journal?.memo}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Audit Verified & Posted
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {activeTab === 'lines' && (
        <div className="space-y-6 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div>
              <span className="text-muted-foreground font-medium">Memo / Reference</span>
              <p className="text-sm font-bold text-foreground mt-0.5">{journal?.memo}</p>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-muted-foreground block">Total Debit:</span>
                <span className="font-bold text-emerald-400 text-sm">${totalDebit.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Total Credit:</span>
                <span className="font-bold text-rose-400 text-sm">${totalCredit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">GL Master Account</th>
                  <th className="p-3">Line Memo</th>
                  <th className="p-3 text-right">Debit ($)</th>
                  <th className="p-3 text-right">Credit ($)</th>
                  <th className="p-3">Counterparty Reference</th>
                  <th className="p-3">Source Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {journal?.lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink
                        entity="gl_account"
                        id={line.account_code}
                        name={line.account_name}
                        onNavigate={onNavigate}
                      />
                    </td>
                    <td className="p-3 font-medium text-foreground">{line.memo}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      {line.debit > 0 ? `$${line.debit.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                      {line.credit > 0 ? `$${line.credit.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3">
                      {line.counterparty_id && line.counterparty_type ? (
                        <RecordLink
                          entity={line.counterparty_type}
                          id={line.counterparty_id}
                          name={line.counterparty}
                          onNavigate={onNavigate}
                        />
                      ) : '-'}
                    </td>
                    <td className="p-3">
                      {line.source_doc ? (
                        <RecordLink
                          entity="sales_invoice"
                          id={line.source_doc}
                          onNavigate={onNavigate}
                        />
                      ) : '-'}
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
