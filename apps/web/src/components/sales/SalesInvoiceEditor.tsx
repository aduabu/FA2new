import React, { useState } from 'react';
import { Plus, Trash2, Save, Printer, Eye, Calendar, User, FileText, CheckCircle } from 'lucide-react';

interface InvoiceLine {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  unitPrice: number;
  discount: number;
}

export const SalesInvoiceEditor: React.FC = () => {
  const [customer, setCustomer] = useState('1');
  const [docDate, setDocDate] = useState('2026-07-27');
  const [dueDate, setDueDate] = useState('2026-08-27');
  const [ref, setRef] = useState('INV-2026-0042');
  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: '1', itemCode: 'ITEM-A100', description: 'Industrial Widget A', qty: 10, unitPrice: 150.00, discount: 0 },
    { id: '2', itemCode: 'ITEM-B200', description: 'Service Assembly B', qty: 2, unitPrice: 450.00, discount: 5 },
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const addLine = () => {
    const newLine: InvoiceLine = {
      id: Date.now().toString(),
      itemCode: 'ITEM-A100',
      description: 'Industrial Widget A',
      qty: 1,
      unitPrice: 100.00,
      discount: 0
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof InvoiceLine, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const subtotal = lines.reduce((acc, line) => {
    const lineTotal = line.qty * line.unitPrice * (1 - line.discount / 100);
    return acc + lineTotal;
  }, 0);

  const freight = 50.00;
  const tax = (subtotal + freight) * 0.10; // 10% GST
  const grandTotal = subtotal + freight + tax;

  const handleProcessInvoice = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* SUCCESS NOTIFICATION TOAST */}
      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Sales Invoice Posted Successfully</div>
              <div className="text-xs opacity-80">Reference: {ref} — Posted to GL Ledger & Customer Receivables</div>
            </div>
          </div>
          <button className="px-3 py-1 bg-emerald-500 text-white rounded text-xs font-semibold hover:bg-emerald-600 transition-colors">
            Print PDF
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Sales Invoice Editor</h2>
          <p className="text-xs text-muted-foreground">Order-to-Cash Workflow — Create & Post Sales Invoice</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 flex items-center gap-2 transition-colors">
            <Eye className="w-4 h-4" /> Live Preview
          </button>
          <button 
            onClick={handleProcessInvoice}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> Process & Post (Ctrl+S)
          </button>
        </div>
      </div>

      {/* FORM INPUTS CARD */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Customer Account</label>
          <select 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          >
            <option value="1">Acme Global Logistics (ACME01)</option>
            <option value="2">Apex Systems Inc (APEX02)</option>
            <option value="3">Global Retailers Ltd (GRL03)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Document Reference</label>
          <input 
            type="text" 
            value={ref} 
            onChange={(e) => setRef(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Invoice Date</label>
          <input 
            type="date" 
            value={docDate} 
            onChange={(e) => setDocDate(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Due Date</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* DYNAMIC LINE ITEMS GRID */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Invoice Line Items</h3>
          <button 
            onClick={addLine}
            className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Line (F2)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 w-36">Item Code</th>
                <th className="p-3">Description</th>
                <th className="p-3 w-24 text-right">Quantity</th>
                <th className="p-3 w-32 text-right">Unit Price ($)</th>
                <th className="p-3 w-24 text-right">Discount (%)</th>
                <th className="p-3 w-36 text-right">Line Total ($)</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lines.map((line, index) => {
                const lineTotal = line.qty * line.unitPrice * (1 - line.discount / 100);
                return (
                  <tr key={line.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-center text-muted-foreground font-mono">{index + 1}</td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={line.itemCode} 
                        onChange={(e) => updateLine(line.id, 'itemCode', e.target.value)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-mono font-medium focus:border-primary"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={line.description} 
                        onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium focus:border-primary"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={line.qty} 
                        onChange={(e) => updateLine(line.id, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium text-right focus:border-primary"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={line.unitPrice} 
                        onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium text-right focus:border-primary"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={line.discount} 
                        onChange={(e) => updateLine(line.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-medium text-right focus:border-primary"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold text-foreground">
                      ${lineTotal.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => removeLine(line.id)}
                        className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SUMMARY CALCULATIONS FOOTER */}
        <div className="p-5 bg-muted/20 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Tax Calculation: Standard 10% GST Applied</div>
            <div>Posting GL: 1200 Accounts Receivable / 4010 Sales Revenue</div>
          </div>

          <div className="w-full md:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping & Freight:</span>
              <span className="font-semibold text-foreground">${freight.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Sales Tax (GST 10%):</span>
              <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Grand Total ($):</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
