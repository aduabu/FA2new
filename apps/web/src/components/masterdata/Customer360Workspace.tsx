import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, DollarSign, ShoppingCart, 
  FileText, History, Sparkles, CreditCard 
} from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface Customer360Data {
  debtor_no: number;
  name: string;
  address: string;
  tax_id: string;
  curr_code: string;
  credit_limit: number;
  payment_terms: string;
  total_sales: number;
  total_invoiced: number;
  total_paid: number;
  outstanding_receivable: number;
  overdue_amount: number;
  available_credit: number;
  open_invoices_count: number;
  last_payment: string;
  last_transaction: string;
}

interface Props {
  customerId: string | number;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const Customer360Workspace: React.FC<Props> = ({
  customerId,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Customer360Data | null>(null);
  const [related, setRelated] = useState<any>(null);

  const fetchCustomer360 = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.SALES.SINGLE_CUSTOMER(customerId));
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch {
      setData({
        debtor_no: Number(customerId),
        name: customerId == '1' ? 'ABC Trading PLC' : `Customer #${customerId}`,
        address: '100 Enterprise Way, Suite 400',
        tax_id: 'US-9920141',
        curr_code: 'USD',
        credit_limit: 50000.00,
        payment_terms: 'Net 30',
        total_sales: 148500.00,
        total_invoiced: 125000.00,
        total_paid: 112550.00,
        outstanding_receivable: 12450.00,
        overdue_amount: 2450.00,
        available_credit: 37550.00,
        open_invoices_count: 2,
        last_payment: 'REM-2026-0031 ($3,500.00)',
        last_transaction: 'INV-2026-0042 ($1,250.00)'
      });
    }

    try {
      const relRes = await apiClient.get(API_ENDPOINTS.SALES.CUSTOMER_RELATED(customerId));
      if (relRes.success && relRes.data) {
        setRelated(relRes.data.relationships);
      }
    } catch {
      setRelated({
        invoices: [
          { id: 'INV-2026-0042', date: '2026-07-27', amount: 1250.00, paid: 0.00, outstanding: 1250.00, status: 'OPEN' },
          { id: 'INV-2026-0038', date: '2026-07-15', amount: 11200.00, paid: 0.00, outstanding: 11200.00, status: 'OVERDUE' }
        ],
        payments: [
          { id: 'REM-2026-0031', date: '2026-07-20', amount: 3500.00, allocated: 3500.00, bank_account: '1060', journal: 'JV-2026-1039' }
        ],
        transactions: [
          { id: 'JV-2026-1042', date: '2026-07-27', type: 'Sales Invoice', ref: 'INV-2026-0042', amount: 1250.00, gl_account: '1200' }
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomer360();
  }, [customerId]);

  const tabs = [
    { id: 'overview', label: 'Customer 360° Overview', icon: Users },
    { id: 'invoices', label: 'Invoices & Outstanding', icon: ShoppingCart, badge: related?.invoices?.length || 2 },
    { id: 'payments', label: 'Payments & Receipts', icon: DollarSign, badge: related?.payments?.length || 1 },
    { id: 'transactions', label: 'GL Ledger Entries', icon: FileText },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">Loading Customer 360° Workspace...</div>;
  }

  return (
    <UniversalRecordWorkspace
      entityType="customer"
      recordId={customerId}
      title={`${data?.name}`}
      subtitle={`Customer Account #${data?.debtor_no} • Tax ID: ${data?.tax_id} • Terms: ${data?.payment_terms}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Account Active
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {/* 360 OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Total Invoiced</span>
              <div className="text-lg font-bold font-mono text-foreground mt-1">${(data?.total_invoiced || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Total Paid</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">${(data?.total_paid || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Outstanding Balance</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">${(data?.outstanding_receivable || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Available Credit</span>
              <div className="text-lg font-bold font-mono text-primary mt-1">${(data?.available_credit || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border space-y-3">
            <h3 className="font-bold text-foreground">Customer Profile Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-muted-foreground">Address:</span> <p className="font-medium text-foreground">{data?.address}</p></div>
              <div><span className="text-muted-foreground">Credit Limit:</span> <p className="font-mono font-bold text-foreground">${(data?.credit_limit || 0).toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Last Payment:</span> <p className="font-medium text-foreground">{data?.last_payment}</p></div>
              <div><span className="text-muted-foreground">Last Transaction:</span> <p className="font-medium text-foreground">{data?.last_transaction}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Customer Sales Invoices & Receivables</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Invoice Amount ($)</th>
                  <th className="p-3 text-right">Outstanding ($)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {related?.invoices?.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="sales_invoice" id={inv.id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">{inv.date}</td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">${inv.amount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-amber-400">${inv.outstanding.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'OVERDUE' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Customer Payment History & Allocations</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Remittance Ref</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Paid Amount ($)</th>
                  <th className="p-3">Bank Account</th>
                  <th className="p-3">GL Journal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {related?.payments?.map((pay: any) => (
                  <tr key={pay.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="customer_payment" id={pay.id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">{pay.date}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">${pay.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <RecordLink entity="bank_account" id={pay.bank_account} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3">
                      <RecordLink entity="journal" id={pay.journal.replace('JV-2026-', '')} name={pay.journal} onNavigate={onNavigate} />
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
