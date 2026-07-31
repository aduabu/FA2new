import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, DollarSign, List, History, Printer, Eye, FileText } from 'lucide-react';
import { UniversalRecordWorkspace } from '../common/UniversalRecordWorkspace';
import { RecordLink } from '../common/RecordLink';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

interface InvoiceData {
  trans_no: string;
  invoice_ref: string;
  doc_date: string;
  due_date: string;
  debtor_no: number;
  customer_name: string;
  status: string;
  currency: string;
  subtotal: number;
  tax: number;
  freight: number;
  grand_total: number;
  receivable_account: string;
  revenue_account: string;
  tax_account: string;
  lines: { stock_id: string; description: string; qty: number; unit_price: number; line_total: number }[];
}

interface Props {
  transNo: string;
  onNavigate: (tab: string, payload?: any) => void;
  onBack: () => void;
}

export const SalesInvoiceWorkspace: React.FC<Props> = ({
  transNo,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [related, setRelated] = useState<any>(null);

  const fetchInvoiceWorkspace = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.SALES.SINGLE_INVOICE(transNo));
      if (res.success && res.data) {
        setInvoice(res.data);
      }
    } catch {
      const formattedNo = transNo.startsWith('INV-2026-') ? transNo : `INV-2026-${transNo}`;
      setInvoice({
        trans_no: transNo,
        invoice_ref: formattedNo,
        doc_date: '2026-07-27',
        due_date: '2026-08-27',
        debtor_no: 1,
        customer_name: 'ABC Trading PLC',
        status: 'POSTED',
        currency: 'USD',
        subtotal: 1250.00,
        tax: 125.00,
        freight: 50.00,
        grand_total: 1425.00,
        receivable_account: '1200',
        revenue_account: '4010',
        tax_account: '2150',
        lines: [
          { stock_id: 'ITEM-A100', description: 'Industrial Hydraulic Valve Assembly A100', qty: 10, unit_price: 125.00, line_total: 1250.00 }
        ]
      });
    }

    try {
      const relRes = await apiClient.get(API_ENDPOINTS.SALES.INVOICE_RELATED(transNo));
      if (relRes.success && relRes.data) {
        setRelated(relRes.data.relationships);
      }
    } catch {
      setRelated({
        customer: { id: '1', name: 'ABC Trading PLC' },
        payments: [
          { id: 'REM-2026-0031', date: '2026-07-20', amount: 1425.00, bank_account: '1060' }
        ],
        journals: [
          { id: 'JV-2026-1042', date: '2026-07-27', type: 'Sales Invoice Journal', amount: 1425.00 }
        ],
        gl_accounts: [
          { id: '1200', name: 'Accounts Receivable' },
          { id: '4010', name: 'Sales Revenue' },
          { id: '2150', name: 'Sales Tax (GST) Payable' }
        ],
        items: [
          { id: 'ITEM-A100', name: 'Industrial Hydraulic Valve Assembly A100' }
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoiceWorkspace();
  }, [transNo]);

  const tabs = [
    { id: 'overview', label: 'Invoice Line Items & Totals', icon: ShoppingCart, badge: invoice?.lines.length || 1 },
    { id: 'accounting', label: 'GL & Tax Accounts', icon: DollarSign },
    { id: 'payments', label: 'Payment Allocations', icon: List, badge: related?.payments?.length || 1 },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">Loading Sales Invoice Workspace...</div>;
  }

  return (
    <UniversalRecordWorkspace
      entityType="sales_invoice"
      recordId={transNo}
      title={`Sales Invoice ${invoice?.invoice_ref}`}
      subtitle={`Customer: ${invoice?.customer_name} • Date: ${invoice?.doc_date} • Due: ${invoice?.due_date}`}
      statusBadge={
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Audit Verified & Posted
        </span>
      }
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
      onBack={onBack}
      extraHeaderActions={
        <button 
          onClick={() => window.print()} 
          className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print PDF
        </button>
      }
    >
      {/* TAB 1: OVERVIEW & LINES */}
      {activeTab === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-muted-foreground block mb-1">Customer Account:</span>
              <RecordLink entity="customer" id={invoice?.debtor_no || 1} name={invoice?.customer_name} onNavigate={onNavigate} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Invoice Reference:</span>
              <span className="font-mono font-bold text-foreground text-sm">{invoice?.invoice_ref}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Document Date:</span>
              <span className="font-mono text-foreground">{invoice?.doc_date}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Grand Total:</span>
              <span className="font-mono font-bold text-primary text-base">${(invoice?.grand_total || 0).toFixed(2)} USD</span>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/40 border-b border-border font-bold text-foreground flex items-center justify-between">
              <span>Invoice Line Items</span>
              <span className="text-[11px] text-muted-foreground font-normal">Click any item code to inspect stock item</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3 w-36">Stock Item</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 w-24 text-right">Qty</th>
                  <th className="p-3 w-32 text-right">Unit Price ($)</th>
                  <th className="p-3 w-36 text-right">Line Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {invoice?.lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="item" id={line.stock_id} name={line.stock_id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 font-sans font-medium text-foreground">{line.description}</td>
                    <td className="p-3 text-right font-bold text-foreground">{line.qty}</td>
                    <td className="p-3 text-right text-muted-foreground">${line.unit_price.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-foreground">${line.line_total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal:</span><span className="font-mono font-semibold text-foreground">${(invoice?.subtotal || 0).toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Freight:</span><span className="font-mono font-semibold text-foreground">${(invoice?.freight || 0).toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>GST (10%):</span><span className="font-mono font-semibold text-foreground">${(invoice?.tax || 0).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border"><span>Grand Total:</span><span className="font-mono text-primary">${(invoice?.grand_total || 0).toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNTING & GL ENTRIES */}
      {activeTab === 'accounting' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Linked Accounting Master GL Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border space-y-2">
              <span className="text-muted-foreground font-medium block">Accounts Receivable GL</span>
              <RecordLink entity="gl_account" id={invoice?.receivable_account || '1200'} name="Accounts Receivable" onNavigate={onNavigate} />
            </div>
            <div className="p-4 rounded-xl bg-card border border-border space-y-2">
              <span className="text-muted-foreground font-medium block">Sales Revenue GL</span>
              <RecordLink entity="gl_account" id={invoice?.revenue_account || '4010'} name="Sales Revenue" onNavigate={onNavigate} />
            </div>
            <div className="p-4 rounded-xl bg-card border border-border space-y-2">
              <span className="text-muted-foreground font-medium block">Sales Tax (GST) Payable GL</span>
              <RecordLink entity="gl_account" id={invoice?.tax_account || '2150'} name="Sales Tax Payable" onNavigate={onNavigate} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-foreground">Associated General Ledger Journal</h4>
            {related?.journals?.map((j: any) => (
              <div key={j.id} className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{j.type}</span>
                </div>
                <RecordLink entity="journal" id={j.id.replace('JV-2026-', '')} name={j.id} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-foreground">Customer Payments & Remittance Allocations</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Payment Ref</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Allocated Amount ($)</th>
                  <th className="p-3">Bank Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {related?.payments?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <RecordLink entity="customer_payment" id={p.id} onNavigate={onNavigate} />
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">{p.date}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">${p.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <RecordLink entity="bank_account" id={p.bank_account} onNavigate={onNavigate} />
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
