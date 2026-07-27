import React from 'react';
import { User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

interface Party {
  id: string;
  name: string;
  ref: string;
  address?: string;
  taxId?: string;
  currency: string;
  paymentTerms?: string;
  creditLimit?: number;
  balance?: number;
}

interface PartySelectorProps {
  label: string;
  parties: Party[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const PartySelector: React.FC<PartySelectorProps> = ({
  label,
  parties,
  selectedId,
  onSelect
}) => {
  const activeParty = parties.find(p => p.id === selectedId) || parties[0];

  return (
    <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
        <User className="w-4 h-4 text-primary" /> {label}
      </label>

      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
      >
        {parties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.ref}) — {p.currency}
          </option>
        ))}
      </select>

      {activeParty && (
        <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1.5">
          {activeParty.address && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{activeParty.address}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-muted-foreground">Payment Terms: <strong className="text-foreground">{activeParty.paymentTerms || 'Net 30 Days'}</strong></span>
            {activeParty.creditLimit !== undefined && (
              <span className="text-muted-foreground">Credit Limit: <strong className="text-foreground">${activeParty.creditLimit.toLocaleString()}</strong></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
