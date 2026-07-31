import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, BookOpen, Layers, X, Users, Package, Boxes, Percent, Globe, ShieldCheck, FileText, Landmark, Clock, Settings, Star } from 'lucide-react';
import { getFavorites, getRecentRecords } from '../../utils/favoritesManager';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string, payload?: any) => void;
  userRole?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab, userRole = 'ADMIN' }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const favorites = getFavorites();
  const recents = getRecentRecords();

  // RBAC Permission Audit Index & Canonical Workspace Deep-Link Search Items
  const allActions = [
    { id: 'dashboard', title: 'Executive Control Center', type: 'Dashboard', icon: Layers, requiredRole: 'USER' },
    { id: 'chart-accounts', payload: { accountCode: '1065' }, title: '1065 — Petty Cash Account', type: 'GL Account Workspace', icon: BookOpen, requiredRole: 'USER' },
    { id: 'chart-accounts', payload: { accountCode: '1060' }, title: '1060 — Current Bank Account', type: 'GL Account Workspace', icon: BookOpen, requiredRole: 'USER' },
    { id: 'customers', payload: { customerId: '1' }, title: 'ABC Trading PLC (Customer #1)', type: 'Customer 360° Workspace', icon: Users, requiredRole: 'USER' },
    { id: 'suppliers', payload: { supplierId: '1' }, title: 'Industrial Components Co (Supplier #1)', type: 'Supplier 360° Workspace', icon: Package, requiredRole: 'USER' },
    { id: 'inventory', payload: { itemCode: 'ITEM-A100' }, title: 'ITEM-A100 — Industrial Hydraulic Valve', type: 'Item Workspace', icon: Boxes, requiredRole: 'USER' },
    { id: 'gl-journal', payload: { transNo: '1042' }, title: 'JV-2026-1042 — Office Expense Reimbursement', type: 'Journal Workspace', icon: FileText, requiredRole: 'USER' },
    { id: 'bank-trans', payload: { accountCode: '1060' }, title: 'Bank Account #1060 Workspace', type: 'Banking Workspace', icon: Landmark, requiredRole: 'USER' },
    
    // Standard Navigation
    { id: 'sales-invoice', title: 'Sales Invoice Editor (INV)', type: 'Order-to-Cash', icon: ShoppingCart, requiredRole: 'USER' },
    { id: 'customer-payment', title: 'Customer Payment & Allocation Engine', type: 'Order-to-Cash', icon: ShoppingCart, requiredRole: 'USER' },
    { id: 'supplier-bill', title: 'Supplier Bill & 3-Way GRN Match Studio', type: 'Procure-to-Pay', icon: Package, requiredRole: 'USER' },
    { id: 'gl-journal', title: 'Manual Journal Entry Studio (JRN)', type: 'General Ledger', icon: BookOpen, requiredRole: 'USER' },
    { id: 'bank-trans', title: 'Bank Payment & Inter-Bank Transfer', type: 'Banking', icon: Landmark, requiredRole: 'USER' },
    { id: 'stock-adj', title: 'Stock Adjustment & Valuation Studio', type: 'Inventory', icon: Boxes, requiredRole: 'USER' },
    { id: 'trial-balance', title: 'Trial Balance Financial Report', type: 'Financial Reports', icon: FileText, requiredRole: 'USER' },
    { id: 'audit-trail', title: 'Enterprise Audit Trail & Timeline', type: 'Compliance', icon: ShieldCheck, requiredRole: 'ADMIN' },
    { id: 'chart-accounts', title: 'Chart of Accounts (GL Master)', type: 'Master Data', icon: BookOpen, requiredRole: 'USER' },
    { id: 'customers', title: 'Customer Master Accounts & Branches', type: 'Master Data', icon: Users, requiredRole: 'USER' },
    { id: 'suppliers', title: 'Supplier Master Accounts & Vendors', type: 'Master Data', icon: Package, requiredRole: 'USER' },
    { id: 'inventory', title: 'Inventory Stock Catalog', type: 'Master Data', icon: Boxes, requiredRole: 'USER' },
    { id: 'taxes', title: 'Tax Configuration & Rates', type: 'Configuration', icon: Percent, requiredRole: 'ADMIN' },
    { id: 'currencies', title: 'Currencies & Foreign Exchange Rates', type: 'Configuration', icon: Globe, requiredRole: 'ADMIN' },
    { id: 'dimensions', title: 'Cost & Profit Center Dimensions', type: 'Configuration', icon: Layers, requiredRole: 'ADMIN' },
    { id: 'dev-status', title: 'Local Developer Status & Environment Dashboard', type: 'System Admin', icon: Settings, requiredRole: 'ADMIN' },
  ];

  // RBAC Permission Check Filter
  const filtered = allActions.filter(a => {
    const isAuthorized = userRole === 'ADMIN' || a.requiredRole === 'USER';
    const matchesSearch = a.title.toLowerCase().includes(query.toLowerCase()) || 
                          a.type.toLowerCase().includes(query.toLowerCase());
    return isAuthorized && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 animate-in fade-in">
      <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Search Petty Cash, Customer, Supplier, Item, Journal, or commands (Cmd+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {query === '' && favorites.length > 0 && (
            <div className="mb-2">
              <span className="px-3 text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> Favorites
              </span>
              {favorites.map((fav, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const tabMap: any = { gl_account: 'chart-accounts', customer: 'customers', supplier: 'suppliers', item: 'inventory', bank_account: 'bank-trans', journal: 'gl-journal' };
                    const keyMap: any = { gl_account: 'accountCode', customer: 'customerId', supplier: 'supplierId', item: 'itemCode', bank_account: 'accountCode', journal: 'transNo' };
                    onSelectTab(tabMap[fav.entity] || 'dashboard', { [keyMap[fav.entity] || 'id']: fav.id });
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-500/10 text-left group"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-amber-400">{fav.title}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">FAVORITE</span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">No matching authorized commands or ERP records found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectTab(item.id, item.payload);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground">{item.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary">
                    Open Workspace
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-3 border-t border-border bg-muted/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><strong>↑↓</strong> Navigate</span>
            <span><strong>↵</strong> Select</span>
            <span><strong>ESC</strong> Close</span>
          </div>
          <span className="font-mono text-[10px] flex items-center gap-1 text-emerald-500 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> RBAC Enforced ({userRole})
          </span>
        </div>
      </div>
    </div>
  );
};
