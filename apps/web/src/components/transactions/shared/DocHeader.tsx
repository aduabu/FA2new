import React from 'react';
import { Clock, Calendar, FileText, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

interface DocHeaderProps {
  title: string;
  subtitle: string;
  reference: string;
  docDate: string;
  dueDate?: string;
  currency: string;
  status: string;
  onReferenceChange?: (val: string) => void;
  onDateChange?: (val: string) => void;
  onDueDateChange?: (val: string) => void;
}

export const DocHeader: React.FC<DocHeaderProps> = ({
  title,
  subtitle,
  reference,
  docDate,
  dueDate,
  currency,
  status,
  onReferenceChange,
  onDateChange,
  onDueDateChange
}) => {
  return (
    <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
      {/* TITLE & STATUS ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> {title}
          </h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-mono font-bold">
            <Globe className="w-3.5 h-3.5 inline mr-1" /> {currency}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            status === 'POSTED' || status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
            status === 'UNPAID' || status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
            'bg-primary/10 text-primary'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {status}
          </span>
        </div>
      </div>

      {/* INPUT CONTROLS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-medium text-muted-foreground mb-1">Document Reference</label>
          <input 
            type="text" 
            value={reference} 
            onChange={(e) => onReferenceChange && onReferenceChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block font-medium text-muted-foreground mb-1">Document Date</label>
          <input 
            type="date" 
            value={docDate} 
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-medium text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {dueDate !== undefined && (
          <div>
            <label className="block font-medium text-muted-foreground mb-1">Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => onDueDateChange && onDueDateChange(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-medium text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};
