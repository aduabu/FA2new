import React, { useState } from 'react';
import { Boxes, Search, Plus, AlertTriangle, Layers, Tag } from 'lucide-react';

interface Item {
  stock_id: string;
  description: string;
  category_name: string;
  units: string;
  mb_flag_name: string;
  actual_cost: number;
  sales_price: number;
  qty_on_hand: number;
  reorder_level: number;
}

export const InventoryCatalogView: React.FC = () => {
  const [query, setQuery] = useState('');

  const items: Item[] = [
    { stock_id: 'ITEM-A100', description: 'Industrial Widget A', category_name: 'Manufactured Goods', units: 'each', mb_flag_name: 'Purchased Item', actual_cost: 85.00, sales_price: 150.00, qty_on_hand: 0, reorder_level: 10 },
    { stock_id: 'ITEM-B200', description: 'Service Assembly B', category_name: 'Manufactured Goods', units: 'assembly', mb_flag_name: 'Manufactured Item', actual_cost: 280.00, sales_price: 450.00, qty_on_hand: 3, reorder_level: 15 },
    { stock_id: 'SERV-C300', description: 'On-Site Technical Maintenance', category_name: 'Professional Services', units: 'hr', mb_flag_name: 'Service Item', actual_cost: 0.00, sales_price: 120.00, qty_on_hand: 0, reorder_level: 0 },
  ];

  const filtered = items.filter(i => i.stock_id.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" /> Inventory & Stock Items Catalog
          </h2>
          <p className="text-xs text-muted-foreground">Product Items, Services, Assemblies & Reorder Points</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Item
        </button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search stock code or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5 w-32">Item Code</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 w-40">Category</th>
                <th className="p-3.5 w-32">Item Type</th>
                <th className="p-3.5 w-24 text-right">Standard Cost</th>
                <th className="p-3.5 w-24 text-right">Selling Price</th>
                <th className="p-3.5 w-32 text-center">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const isLow = item.qty_on_hand <= item.reorder_level && item.reorder_level > 0;
                return (
                  <tr key={item.stock_id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-primary">{item.stock_id}</td>
                    <td className="p-3.5 font-medium text-foreground">{item.description}</td>
                    <td className="p-3.5 text-muted-foreground">{item.category_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
                        {item.mb_flag_name}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">${item.actual_cost.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-foreground">${item.sales_price.toFixed(2)}</td>
                    <td className="p-3.5 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" /> Qty: {item.qty_on_hand} / Reorder: {item.reorder_level}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          {item.reorder_level === 0 ? 'N/A' : `Qty: ${item.qty_on_hand} ${item.units}`}
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
