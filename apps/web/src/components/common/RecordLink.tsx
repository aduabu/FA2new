import React from 'react';
import { 
  BookOpen, Users, Package, Boxes, Landmark, FileText, 
  ShoppingCart, DollarSign, Receipt, Layers, Percent, ExternalLink 
} from 'lucide-react';

export type EntityType = 
  | 'gl_account' 
  | 'customer' 
  | 'supplier' 
  | 'item' 
  | 'bank_account' 
  | 'journal' 
  | 'sales_invoice' 
  | 'customer_payment' 
  | 'supplier_bill' 
  | 'dimension' 
  | 'tax';

interface RecordLinkProps {
  entity: EntityType;
  id: string | number;
  name?: string;
  className?: string;
  showIcon?: boolean;
  onNavigate?: (tab: string, payload?: any) => void;
}

export const RecordLink: React.FC<RecordLinkProps> = ({
  entity,
  id,
  name,
  className = '',
  showIcon = true,
  onNavigate
}) => {
  if (!id) return <span className="text-muted-foreground italic text-xs">N/A</span>;

  const getEntityConfig = () => {
    switch (entity) {
      case 'gl_account':
        return {
          tab: 'chart-accounts',
          payloadKey: 'accountCode',
          icon: BookOpen,
          badgeStyle: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/30',
          prefix: 'GL'
        };
      case 'customer':
        return {
          tab: 'customers',
          payloadKey: 'customerId',
          icon: Users,
          badgeStyle: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30',
          prefix: 'CUST'
        };
      case 'supplier':
        return {
          tab: 'suppliers',
          payloadKey: 'supplierId',
          icon: Package,
          badgeStyle: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/30',
          prefix: 'SUPP'
        };
      case 'item':
        return {
          tab: 'inventory',
          payloadKey: 'itemCode',
          icon: Boxes,
          badgeStyle: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30',
          prefix: 'ITEM'
        };
      case 'bank_account':
        return {
          tab: 'bank-trans',
          payloadKey: 'accountCode',
          icon: Landmark,
          badgeStyle: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/30',
          prefix: 'BANK'
        };
      case 'journal':
        return {
          tab: 'gl-journal',
          payloadKey: 'transNo',
          icon: FileText,
          badgeStyle: 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border-slate-500/30',
          prefix: 'JRN'
        };
      case 'sales_invoice':
        return {
          tab: 'sales-invoice',
          payloadKey: 'transNo',
          icon: ShoppingCart,
          badgeStyle: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30',
          prefix: 'INV'
        };
      case 'customer_payment':
        return {
          tab: 'customer-payment',
          payloadKey: 'transNo',
          icon: DollarSign,
          badgeStyle: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30',
          prefix: 'PAY'
        };
      case 'supplier_bill':
        return {
          tab: 'supplier-bill',
          payloadKey: 'transNo',
          icon: Receipt,
          badgeStyle: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30',
          prefix: 'BILL'
        };
      case 'dimension':
        return {
          tab: 'dimensions',
          payloadKey: 'dimensionId',
          icon: Layers,
          badgeStyle: 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border-violet-500/30',
          prefix: 'DIM'
        };
      case 'tax':
        return {
          tab: 'taxes',
          payloadKey: 'taxId',
          icon: Percent,
          badgeStyle: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30',
          prefix: 'TAX'
        };
      default:
        return {
          tab: 'dashboard',
          payloadKey: 'id',
          icon: ExternalLink,
          badgeStyle: 'bg-muted text-muted-foreground',
          prefix: 'REC'
        };
    }
  };

  const config = getEntityConfig();
  const Icon = config.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(config.tab, { [config.payloadKey]: id });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (onNavigate) {
        onNavigate(config.tab, { [config.payloadKey]: id });
      }
    }
  };

  const displayText = name ? `${id} — ${name}` : `${id}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      title={`Open ${entity.replace('_', ' ')}: ${id}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${config.badgeStyle} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span className="truncate">{displayText}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-40 hover:opacity-100 flex-shrink-0 ml-0.5" />
    </button>
  );
};
