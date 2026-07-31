import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, List, History, FileText, Landmark } from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface PaymentData {
  trans_no: string;
  payment_ref: string;
  date: string;
  debtor_no: number;
  customer_name: string;
  amount: number;
  bank_account: string;
  bank_name: string;
  journal_ref: string;
  allocated_invoices: { id: string; allocated_amount: number }[];
}

interface Props {
  transNo: string;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const CustomerPaymentWorkspace: React.FC<Props> = ({
  transNo,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    const fetchPaymentWorkspace = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(API_ENDPOINTS.SALES.SINGLE_PAYMENT(transNo));
        if (res.success && res.data) {
          setPayment(res.data);
        }
      } catch {
        const formattedNo = transNo.startsWith('REM-2026-') ? transNo : `REM-2026-${transNo}`;
        setPayment({
          trans_no: transNo,
          payment_ref: formattedNo,
          date: '2026-07-20',
          debtor_no: 1,
          customer_name: 'ABC Trading PLC',
          amount: 3500.00,
          bank_account: '1060',
          bank_name: 'Current Bank Account',
          journal_ref: 'JV-2026-1039',
          allocated_invoices: [
            { id: 'INV-2026-0042', allocated_amount: 1425.00 },
            { id: 'INV-2026-0038', allocated_amount: 2075.00 }
          ]
        });
      }
      setLoading(false);
    };

    fetchPaymentWorkspace();
  }, [transNo]);

  const tabs = [
    { id: 'overview', label: 'Payment Remittance & Allocations', icon: DollarSign, badge: payment?.allocated_invoices.length || 2 },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">Loading Customer Payment Workspace...</div>;
  }

  return (
    <UniversalRecordWorkspace
      entityType="customer_payment"
      recordId={transNo}
      title={`Customer Payment ${payment?.payment_ref}`}
      subtitle={`Customer: ${payment?.customer_name} • Date: ${payment?.date} • Amount: $${(payment?.amount || 0).toFixed(2)}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Fully Allocated
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-muted-foreground block mb-1">Customer Account:</span>
              <RecordLink entity="customer" id={payment?.debtor_no || 1} name={payment?.customer_name} onNavigate={onNavigate} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Deposited Bank Account:</span>
              <RecordLink entity="bank_account" id={payment?.bank_account || '1060'} name={payment?.bank_name} onNavigate={onNavigate} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Payment Remittance #:</span>
              <span className="font-mono font-bold text-foreground text-sm">{payment?.payment_ref}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Total Remitted Amount:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">${(payment?.amount || 0).toFixed(2)} USD</span>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/40 border-b border-border font-bold text-foreground flex items-center justify-between">
              <span>Invoice Allocations</span>
              <span className="text-[11px] text-muted-foreground font-normal">Click any invoice to open invoice workspace</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Target Invoice</th>
                  <th className="p-3 text-right">Allocated Payment Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {payment?.allocated_invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="sales_invoice" id={inv.id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">${inv.allocated_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-foreground">Associated GL Journal</h4>
            <div className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Payment Journal Entry</span>
              </div>
              <RecordLink entity="journal" id={(payment?.journal_ref || 'JV-2026-1039').replace('JV-2026-', '')} name={payment?.journal_ref} onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      )}
    </UniversalRecordWorkspace>
  );
};
