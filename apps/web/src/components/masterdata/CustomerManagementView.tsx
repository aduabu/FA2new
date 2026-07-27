import React, { useState } from 'react';
import { Users, Search, Plus, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

interface Customer {
  debtor_no: number;
  name: string;
  debtor_ref: string;
  address: string;
  tax_id: string;
  curr_code: string;
  credit_limit: number;
  payment_terms: string;
  balance: number;
}

export const CustomerManagementView: React.FC = () => {
  const [query, setQuery] = useState('');

  const customers: Customer[] = [
    { debtor_no: 1, name: 'Acme Global Logistics', debtor_ref: 'ACME01', address: '100 Logistics Way, Suite 400, Chicago, IL', tax_id: 'US-99824102', curr_code: 'USD', credit_limit: 50000, payment_terms: 'Net 30 Days', balance: 12450.00 },
    { debtor_no: 2, name: 'Apex Systems Inc', debtor_ref: 'APEX02', address: '450 Technology Parkway, Austin, TX', tax_id: 'US-44120934', curr_code: 'USD', credit_limit: 25000, payment_terms: 'Net 15 Days', balance: 0.00 },
    { debtor_no: 3, name: 'Global Retailers Ltd', debtor_ref: 'GRL03', address: '12 Commerce Square, London, UK', tax_id: 'GB-882310492', curr_code: 'EUR', credit_limit: 100000, payment_terms: 'Net 30 Days', balance: 8920.50 },
  ];

  const filtered = customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.debtor_ref.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Customer Accounts & Branches
          </h2>
          <p className="text-xs text-muted-foreground">Order-to-Cash Customer Master Data & Receivables</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Customer
        </button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search customer name or reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div key={c.debtor_no} className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                  <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{c.debtor_ref}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{c.curr_code}</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {c.address}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ID:</span>
                <span className="font-mono text-foreground">{c.tax_id}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Credit Limit:</span>
                <span className="font-semibold text-foreground">${c.credit_limit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Terms:</span>
                <span className="font-medium text-foreground">{c.payment_terms}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                <span>Receivables Balance:</span>
                <span className={c.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                  ${c.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
