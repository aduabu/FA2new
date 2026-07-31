import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Landmark, 
  BookOpen, 
  FileText, 
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
  Award,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fa_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      try {
        localStorage.setItem('fa_sidebar_collapsed', String(nextState));
      } catch (e) {}
      return nextState;
    });
  };

  const menuGroups = [
    {
      title: 'CONTROL CENTER',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'v1-release', label: 'v1.0.0-RC1 Release Candidate', icon: Award },
        { id: 'ai-assistant', label: 'AI Assistant & Insights', icon: Sparkles },
        { id: 'ai-config', label: 'AI Router & Gemini Setup', icon: Cpu },
        { id: 'trial-balance', label: 'Trial Balance Studio', icon: BarChart3 },
        { id: 'integrity-tests', label: 'Accounting Integrity Suite', icon: ShieldCheck },
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
      title: 'DEVELOPER & SYSTEM ADMIN',
      items: [
        { id: 'dev-status', label: 'Local Dev & Environment', icon: Terminal },
        { id: 'qa-suite', label: 'Full QA & Load Benchmark', icon: Activity },
        { id: 'plugin-sdk', label: 'Plugin SDK & API Docs', icon: Code },
        { id: 'tenant-mgmt', label: 'Multi-Tenant Operations', icon: Layers },
        { id: 'integrations', label: 'Webhooks & External API', icon: Zap },
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
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border h-screen flex flex-col flex-shrink-0 select-none transition-all duration-150 ease-in-out`}>
      {/* Brand Header & Collapse Toggle */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shadow-md flex-shrink-0">
            FA
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="font-semibold text-xs leading-none text-foreground truncate">FrontAccounting</h1>
              <span className="text-[10px] text-muted-foreground">Platform v1.0.0-RC1</span>
            </div>
          )}
        </div>

        <button 
          onClick={toggleCollapse}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h2 className="px-2 text-[9px] font-bold tracking-wider text-muted-foreground uppercase truncate">
                {group.title}
              </h2>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2' : 'justify-between px-2.5 py-1.5'} rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={`p-2.5 border-t border-border bg-muted/30 text-[10px] text-muted-foreground flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <span className="truncate">Tenant: Training Co.</span>}
        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="API Gateway Connected"></span>
      </div>
    </aside>
  );
};
