import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, MapPin, X, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { Customer360Workspace } from './Customer360Workspace';

interface Customer {
  debtor_no: number;
  name: string;
  debtor_ref?: string;
  address: string;
  tax_id: string;
  curr_code: string;
  credit_limit: number;
  payment_terms: string;
  balance?: number;
}

interface Props {
  onNavigate?: (tab: string, payload?: any) => void;
  initialCustomerId?: string | number;
}

export const CustomerManagementView: React.FC<Props> = ({ onNavigate, initialCustomerId }) => {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openedCustomerId, setOpenedCustomerId] = useState<string | number | null>(initialCustomerId || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    tax_id: '',
    curr_code: 'USD',
    credit_limit: 50000,
    payment_terms: 'Net 30'
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.SALES.CUSTOMERS);
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCustomers(res.data);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('Failed to fetch live customers from API, using default seed');
    }
    setCustomers([
      { debtor_no: 1, name: 'ABC Trading PLC', debtor_ref: 'ACME01', address: '100 Enterprise Way, Suite 400', tax_id: 'US-9920141', curr_code: 'USD', credit_limit: 50000, payment_terms: 'Net 30', balance: 12450.00 },
      { debtor_no: 2, name: 'Global Retailers Ltd', debtor_ref: 'GRL02', address: '55 Market Square', tax_id: 'US-8810294', curr_code: 'USD', credit_limit: 25000, payment_terms: 'Net 15', balance: 8920.50 }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialCustomerId) setOpenedCustomerId(initialCustomerId);
  }, [initialCustomerId]);

  const handleOpenCustomerWorkspace = (id: number | string) => {
    setOpenedCustomerId(id);
    if (onNavigate) {
      onNavigate('customers', { customerId: id });
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const json = await apiClient.post(API_ENDPOINTS.SALES.CUSTOMERS, formData);
      if (json.success) {
        setToastMessage(`Customer "${formData.name}" created successfully and saved to DB!`);
        setIsModalOpen(false);
        setFormData({ name: '', address: '', tax_id: '', curr_code: 'USD', credit_limit: 50000, payment_terms: 'Net 30' });
        fetchCustomers();
      } else {
        alert(json.message || 'Failed to create customer');
      }
    } catch (err: any) {
      alert(`Error creating customer: ${err.message}`);
    }
  };

  if (openedCustomerId) {
    return (
      <Customer360Workspace
        customerId={openedCustomerId}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedCustomerId(null);
          if (onNavigate) onNavigate('customers');
        }}
      />
    );
  }

  const filtered = customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || (c.debtor_ref && c.debtor_ref.toLowerCase().includes(query.toLowerCase())));

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Customer Accounts & Branches
          </h2>
          <p className="text-xs text-muted-foreground">Order-to-Cash Customer Master Data & Receivables (Double-click or press Enter to open Workspace)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Customer
        </button>
      </div>

      {/* Search */}
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

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => {
          const isSelected = selectedCustomer?.debtor_no === c.debtor_no;
          return (
            <div 
              key={c.debtor_no} 
              onClick={() => setSelectedCustomer(c)}
              onDoubleClick={() => handleOpenCustomerWorkspace(c.debtor_no)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenCustomerWorkspace(c.debtor_no);
              }}
              tabIndex={0}
              className={`bg-card p-5 rounded-xl border shadow-sm cursor-pointer transition-all flex flex-col justify-between space-y-4 group ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
                    <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {c.debtor_ref || `CUST-0${c.debtor_no}`}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{c.curr_code || 'USD'}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {c.address || 'Address on file'}
                </p>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ID:</span>
                  <span className="font-mono text-foreground">{c.tax_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Credit Limit:</span>
                  <span className="font-semibold text-foreground">${(c.credit_limit || 50000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Terms:</span>
                  <span className="font-medium text-foreground">{c.payment_terms || 'Net 30'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Create New Customer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Logistics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Business Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Enterprise Way"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Tax Registration ID</label>
                <input
                  type="text"
                  placeholder="e.g. US-9920141"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                />
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
