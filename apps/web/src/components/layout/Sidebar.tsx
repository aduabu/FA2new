import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Landmark, 
  BookOpen, 
  FileText, 
  Settings, 
  ChevronRight,
  Users,
  Percent,
  Globe,
  Layers,
  DollarSign,
  PackageCheck,
  SlidersHorizontal,
  ShieldCheck,
  BarChart3,
  Clock,
  Factory,
  CheckSquare,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Code,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const menuGroups = [
    {
      title: 'CONTROL CENTER',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'v1-release', label: 'v1.0.0-RC1 Release Candidate', icon: Award },
        { id: 'ai-assistant', label: 'AI Assistant & Insights', icon: Sparkles },
        { id: 'trial-balance', label: 'Trial Balance Studio', icon: BarChart3 },
        { id: 'integrity-tests', label: 'Accounting Integrity Suite', icon: ShieldCheck },
        { id: 'qa-suite', label: 'Full QA & Load Benchmark', icon: Activity },
      ]
    },
    {
      title: 'DEVELOPER & TENANTS',
      items: [
        { id: 'plugin-sdk', label: 'Plugin SDK & API Docs', icon: Code },
        { id: 'tenant-mgmt', label: 'Multi-Tenant Operations', icon: Layers },
        { id: 'integrations', label: 'Webhooks & External API', icon: Zap },
      ]
    },
    {
      title: 'ENTERPRISE OPERATIONS',
      items: [
        { id: 'work-orders', label: 'Manufacturing & Work Orders', icon: Factory },
        { id: 'fixed-assets', label: 'Fixed Assets Register', icon: Landmark },
        { id: 'bank-rec', label: 'Bank Statement Reconciliation', icon: Landmark },
        { id: 'approvals', label: 'Workflow & Approval Inbox', icon: CheckSquare },
        { id: 'scheduler', label: 'Scheduler & Redis Workers', icon: Cpu },
      ]
    },
    {
      title: 'TRANSACTION ENGINE',
      items: [
        { id: 'sales-order', label: 'Sales Orders & Quotes', icon: ShoppingCart },
        { id: 'sales-invoice', label: 'Sales Invoices', icon: FileText },
        { id: 'customer-payment', label: 'Customer Payments & Alloc', icon: DollarSign },
        { id: 'supplier-bill', label: 'Supplier Bills & 3-Way GRN', icon: PackageCheck },
        { id: 'bank-trans', label: 'Bank Payments & Transfers', icon: Landmark },
        { id: 'gl-journal', label: 'Manual Journal Entries', icon: BookOpen },
        { id: 'stock-adj', label: 'Stock Adjustments & Audit', icon: SlidersHorizontal },
      ]
    },
    {
      title: 'MASTER DATA PLATFORM',
      items: [
        { id: 'chart-accounts', label: 'Chart of Accounts (GL)', icon: BookOpen },
        { id: 'customers', label: 'Customer Accounts', icon: Users },
        { id: 'suppliers', label: 'Supplier Vendors', icon: Package },
        { id: 'inventory', label: 'Inventory Items Catalog', icon: Boxes },
        { id: 'taxes', label: 'Tax Types & Rates', icon: Percent },
        { id: 'currencies', label: 'Currencies & Rates', icon: Globe },
        { id: 'dimensions', label: 'Dimensions & Cost Centers', icon: Layers },
      ]
    },
    {
      title: 'AUDIT & GOVERNANCE',
      items: [
        { id: 'audit-trail', label: 'Enterprise Audit Trail', icon: Clock },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg shadow-md">
          FA
        </div>
        <div>
          <h1 className="font-semibold text-sm leading-none text-foreground">FrontAccounting</h1>
          <span className="text-xs text-muted-foreground">Platform v1.0.0-RC1</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {group.title}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Tenant: Training Co.</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Gateway Connected"></span>
      </div>
    </aside>
  );
};
