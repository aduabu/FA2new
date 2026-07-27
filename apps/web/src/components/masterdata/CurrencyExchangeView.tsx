import React from 'react';
import { DollarSign, Plus, Globe, CheckCircle2 } from 'lucide-react';

export const CurrencyExchangeView: React.FC = () => {
  const currencies = [
    { curr_abrev: 'USD', currency: 'US Dollars', curr_symbol: '$', hundreds_name: 'Cents', exchange_rate: 1.0000, is_home: true },
    { curr_abrev: 'EUR', currency: 'Euros', curr_symbol: '€', hundreds_name: 'Cents', exchange_rate: 1.0850, is_home: false },
    { curr_abrev: 'GBP', currency: 'Pound Sterling', curr_symbol: '£', hundreds_name: 'Pence', exchange_rate: 1.2920, is_home: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Currencies & Foreign Exchange Rates
          </h2>
          <p className="text-xs text-muted-foreground">Multi-Currency Accounts & Daily Exchange Rate Conversions</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> Add Currency
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currencies.map((c) => (
          <div key={c.curr_abrev} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{c.curr_abrev}</span>
                  {c.is_home && (
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">HOME CURRENCY</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.currency}</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center font-bold text-foreground text-sm">
                {c.curr_symbol}
              </div>
            </div>

            <div className="pt-3 border-t border-border space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Sub-Unit:</span>
                <span className="font-medium text-foreground">{c.hundreds_name}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Exchange Rate (vs Home):</span>
                <span className="font-mono font-bold text-primary">{c.exchange_rate.toFixed(4)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
