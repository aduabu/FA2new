import React, { useState } from 'react';
import { Package, Search, Plus, MapPin, DollarSign } from 'lucide-react';

interface Supplier {
  supplier_id: number;
  supp_name: string;
  supp_ref: string;
  address: string;
  tax_group_name: string;
  curr_code: string;
  payment_terms: string;
  balance: number;
}

export const SupplierManagementView: React.FC = () => {
  const [query, setQuery] = useState('');

  const suppliers: Supplier[] = [
    { supplier_id: 1, supp_name: 'Industrial Components Co', supp_ref: 'INDCOMP', address: '780 Industrial Blvd, Detroit, MI', tax_group_name: 'Standard GST', curr_code: 'USD', payment_terms: 'Net 30 Days', balance: 5400.00 },
    { supplier_id: 2, supp_name: 'Tech Hardware Solutions', supp_ref: 'TECHHARD', address: '1200 Innovation Drive, San Jose, CA', tax_group_name: 'Standard GST', curr_code: 'USD', payment_terms: 'Net 30 Days', balance: 12800.00 },
  ];

  const filtered = suppliers.filter(s => s.supp_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Supplier Master Records
          </h2>
          <p className="text-xs text-muted-foreground">Procure-to-Pay Vendor Accounts & Accounts Payable</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Supplier
        </button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search supplier name or reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div key={s.supplier_id} className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{s.supp_name}</h3>
                  <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{s.supp_ref}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{s.curr_code}</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {s.address}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Tax Group:</span>
                <span className="font-medium text-foreground">{s.tax_group_name}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Terms:</span>
                <span className="font-medium text-foreground">{s.payment_terms}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                <span>Payables Balance:</span>
                <span className="text-rose-500">${s.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
