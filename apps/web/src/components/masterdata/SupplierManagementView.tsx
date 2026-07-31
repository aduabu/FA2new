import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, MapPin, X, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { Supplier360Workspace } from './Supplier360Workspace';

interface Supplier {
  supplier_id: number;
  supp_name: string;
  supp_ref?: string;
  address: string;
  gst_no: string;
  curr_code: string;
  payment_terms: string;
  balance?: number;
}

interface Props {
  onNavigate?: (tab: string, payload?: any) => void;
  initialSupplierId?: string | number;
}

export const SupplierManagementView: React.FC<Props> = ({ onNavigate, initialSupplierId }) => {
  const [query, setQuery] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [openedSupplierId, setOpenedSupplierId] = useState<string | number | null>(initialSupplierId || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    supp_name: '',
    address: '',
    gst_no: '',
    curr_code: 'USD',
    payment_terms: 'Net 30'
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.PURCHASING.SUPPLIERS);
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setSuppliers(res.data);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('Failed to fetch suppliers from API, using default seed');
    }
    setSuppliers([
      { supplier_id: 1, supp_name: 'Industrial Components Co', supp_ref: 'INDCOMP01', address: '500 Tech Parkway, Bldg B', gst_no: 'US-8820194', curr_code: 'USD', payment_terms: 'Net 30', balance: 8500.00 },
      { supplier_id: 2, supp_name: 'Apex Office Supplies', supp_ref: 'APEX02', address: '12 Commercial St', gst_no: 'US-7740129', curr_code: 'USD', payment_terms: 'Net 15', balance: 1250.00 }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (initialSupplierId) setOpenedSupplierId(initialSupplierId);
  }, [initialSupplierId]);

  const handleOpenSupplierWorkspace = (id: number | string) => {
    setOpenedSupplierId(id);
    if (onNavigate) {
      onNavigate('suppliers', { supplierId: id });
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const json = await apiClient.post(API_ENDPOINTS.PURCHASING.SUPPLIERS, formData);
      if (json.success) {
        setToastMessage(`Supplier "${formData.supp_name}" created & saved to DB!`);
        setIsModalOpen(false);
        setFormData({ supp_name: '', address: '', gst_no: '', curr_code: 'USD', payment_terms: 'Net 30' });
        fetchSuppliers();
      } else {
        alert(json.message || 'Failed to create supplier');
      }
    } catch (err: any) {
      alert(`Error creating supplier: ${err.message}`);
    }
  };

  if (openedSupplierId) {
    return (
      <Supplier360Workspace
        supplierId={openedSupplierId}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedSupplierId(null);
          if (onNavigate) onNavigate('suppliers');
        }}
      />
    );
  }

  const filtered = suppliers.filter(s => s.supp_name.toLowerCase().includes(query.toLowerCase()) || (s.supp_ref && s.supp_ref.toLowerCase().includes(query.toLowerCase())));

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
            <Package className="w-5 h-5 text-primary" /> Supplier Accounts & Vendors
          </h2>
          <p className="text-xs text-muted-foreground">Procure-to-Pay Vendor Master Data & Payables (Double-click or press Enter to open Workspace)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Supplier
        </button>
      </div>

      {/* Search */}
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

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((s) => {
          const isSelected = selectedSupplier?.supplier_id === s.supplier_id;
          return (
            <div 
              key={s.supplier_id} 
              onClick={() => setSelectedSupplier(s)}
              onDoubleClick={() => handleOpenSupplierWorkspace(s.supplier_id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenSupplierWorkspace(s.supplier_id);
              }}
              tabIndex={0}
              className={`bg-card p-5 rounded-xl border shadow-sm cursor-pointer transition-all flex flex-col justify-between space-y-4 group ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{s.supp_name}</h3>
                    <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {s.supp_ref || `SUPP-0${s.supplier_id}`}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{s.curr_code || 'USD'}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {s.address || 'Address on file'}
                </p>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>GST / Tax Reg:</span>
                  <span className="font-mono text-foreground">{s.gst_no || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Terms:</span>
                  <span className="font-medium text-foreground">{s.payment_terms || 'Net 30'}</span>
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
              <h3 className="text-base font-bold text-foreground">Create New Supplier</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Components Co"
                  value={formData.supp_name}
                  onChange={(e) => setFormData({ ...formData, supp_name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Tech Parkway"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
