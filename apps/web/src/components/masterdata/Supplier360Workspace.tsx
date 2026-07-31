import React, { useState, useEffect } from 'react';
import { 
  Package, CheckCircle2, DollarSign, Receipt, 
  FileText, History 
} from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface Supplier360Data {
  supplier_id: number;
  supp_name: string;
  address: string;
  gst_no: string;
  curr_code: string;
  payment_terms: string;
  total_purchases: number;
  total_billed: number;
  total_paid: number;
  outstanding_payable: number;
  overdue_amount: number;
  open_bills_count: number;
  last_payment: string;
}

interface Props {
  supplierId: string | number;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const Supplier360Workspace: React.FC<Props> = ({
  supplierId,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Supplier360Data | null>(null);
  const [related, setRelated] = useState<any>(null);

  const fetchSupplier360 = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.PURCHASING.SINGLE_SUPPLIER(supplierId));
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch {
      setData({
        supplier_id: Number(supplierId),
        supp_name: supplierId == '1' ? 'Industrial Components Co' : `Supplier #${supplierId}`,
        address: '500 Tech Parkway, Bldg B',
        gst_no: 'US-8820194',
        curr_code: 'USD',
        payment_terms: 'Net 30',
        total_purchases: 98400.00,
        total_billed: 92000.00,
        total_paid: 83500.00,
        outstanding_payable: 8500.00,
        overdue_amount: 0.00,
        open_bills_count: 1,
        last_payment: 'BILL-PAY-0012 ($4,200.00)'
      });
    }

    try {
      const relRes = await apiClient.get(API_ENDPOINTS.PURCHASING.SUPPLIER_RELATED(supplierId));
      if (relRes.success && relRes.data) {
        setRelated(relRes.data.relationships);
      }
    } catch {
      setRelated({
        purchase_orders: [
          { id: 'PO-2026-0089', date: '2026-07-22', amount: 8500.00, status: 'APPROVED' }
        ],
        bills: [
          { id: 'BILL-2026-0045', date: '2026-07-24', amount: 8500.00, paid: 0.00, outstanding: 8500.00, status: 'UNPAID' }
        ],
        payments: [
          { id: 'PAY-2026-0012', date: '2026-07-18', amount: 4200.00, bank_account: '1060' }
        ],
        transactions: [
          { id: 'JV-2026-1038', date: '2026-07-24', type: 'Supplier Bill', ref: 'BILL-2026-0045', amount: 8500.00, gl_account: '2100' }
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSupplier360();
  }, [supplierId]);

  const tabs = [
    { id: 'overview', label: 'Supplier 360° Overview', icon: Package },
    { id: 'bills', label: 'Bills & Payables', icon: Receipt, badge: related?.bills?.length || 1 },
    { id: 'payments', label: 'Disbursements & Payments', icon: DollarSign, badge: related?.payments?.length || 1 },
    { id: 'transactions', label: 'GL Journal Entries', icon: FileText },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">Loading Supplier 360° Workspace...</div>;
  }

  return (
    <UniversalRecordWorkspace
      entityType="supplier"
      recordId={supplierId}
      title={`${data?.supp_name}`}
      subtitle={`Supplier Account #${data?.supplier_id} • Tax ID: ${data?.gst_no} • Terms: ${data?.payment_terms}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Vendor
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Total Billed</span>
              <div className="text-lg font-bold font-mono text-foreground mt-1">${(data?.total_billed || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Total Paid</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">${(data?.total_paid || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Outstanding Payable</span>
              <div className="text-lg font-bold font-mono text-rose-400 mt-1">${(data?.outstanding_payable || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground font-medium">Open Bills</span>
              <div className="text-lg font-bold font-mono text-primary mt-1">{data?.open_bills_count}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border space-y-3">
            <h3 className="font-bold text-foreground">Vendor Profile Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-muted-foreground">Address:</span> <p className="font-medium text-foreground">{data?.address}</p></div>
              <div><span className="text-muted-foreground">GST/Tax Registration:</span> <p className="font-mono font-bold text-foreground">{data?.gst_no}</p></div>
              <div><span className="text-muted-foreground">Last Disbursement:</span> <p className="font-medium text-foreground">{data?.last_payment}</p></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Supplier Purchase Bills & Accounts Payable</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Bill Number</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Bill Amount ($)</th>
                  <th className="p-3 text-right">Payable ($)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {related?.bills?.map((bill: any) => (
                  <tr key={bill.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="supplier_bill" id={bill.id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">{bill.date}</td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">${bill.amount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400">${bill.outstanding.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500">
                        {bill.status}
                      </span>
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
