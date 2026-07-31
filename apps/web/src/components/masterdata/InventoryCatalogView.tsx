import React, { useState, useEffect } from 'react';
import { Boxes, Search, Plus, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { InventoryItemWorkspace } from './InventoryItemWorkspace';

interface StockItem {
  stock_id: string;
  description: string;
  category_name?: string;
  material_cost: number;
  labour_cost?: number;
  overhead_cost?: number;
  inactive: number;
  qoh?: number;
}

interface Props {
  onNavigate?: (tab: string, payload?: any) => void;
  initialItemCode?: string;
}

export const InventoryCatalogView: React.FC<Props> = ({ onNavigate, initialItemCode }) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [openedItemCode, setOpenedItemCode] = useState<string | null>(initialItemCode || null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.INVENTORY.ITEMS);
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setItems(res.data);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('Failed to fetch inventory items from API, using default seed');
    }
    setItems([
      { stock_id: 'ITEM-A100', description: 'Industrial Hydraulic Valve Assembly A100', category_name: 'Assemblies', material_cost: 120.00, labour_cost: 25.00, overhead_cost: 10.00, inactive: 0, qoh: 450 },
      { stock_id: 'ITEM-B200', description: 'Heavy Duty Steel Bearing B200', category_name: 'Components', material_cost: 45.00, labour_cost: 5.00, overhead_cost: 2.50, inactive: 0, qoh: 1200 },
      { stock_id: 'ITEM-C300', description: 'Precision Copper Coupling C300', category_name: 'Hardware', material_cost: 18.50, labour_cost: 2.00, overhead_cost: 1.00, inactive: 0, qoh: 850 }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (initialItemCode) setOpenedItemCode(initialItemCode);
  }, [initialItemCode]);

  const handleOpenItemWorkspace = (code: string) => {
    setOpenedItemCode(code);
    if (onNavigate) {
      onNavigate('inventory', { itemCode: code });
    }
  };

  if (openedItemCode) {
    return (
      <InventoryItemWorkspace
        itemCode={openedItemCode}
        onNavigate={onNavigate || (() => {})}
        onBack={() => {
          setOpenedItemCode(null);
          if (onNavigate) onNavigate('inventory');
        }}
      />
    );
  }

  const filtered = items.filter(item => item.stock_id.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" /> Inventory Stock Catalog
          </h2>
          <p className="text-xs text-muted-foreground">Finished Goods, Assemblies & Material Inventory (Double-click or press Enter to open Workspace)</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search stock ID or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5 w-32">Stock ID</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 w-32">Category</th>
                <th className="p-3.5 w-28 text-right">Material Cost ($)</th>
                <th className="p-3.5 w-28 text-right">QOH Units</th>
                <th className="p-3.5 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const isSelected = selectedItem?.stock_id === item.stock_id;
                return (
                  <tr 
                    key={item.stock_id} 
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => handleOpenItemWorkspace(item.stock_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleOpenItemWorkspace(item.stock_id);
                    }}
                    tabIndex={0}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/20'
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-primary">{item.stock_id}</td>
                    <td className="p-3.5 font-medium text-foreground">{item.description}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
                        {item.category_name || 'Assemblies'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-foreground">${item.material_cost.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">{item.qoh || 0}</td>
                    <td className="p-3.5 text-center">
                      {item.inactive === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
