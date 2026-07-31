import React from 'react';
import { AlertTriangle, X, Check, ArrowRight } from 'lucide-react';

export interface FieldDiff {
  field: string;
  label: string;
  originalValue: any;
  newValue: any;
}

interface UnsavedChangesModalProps {
  isOpen: boolean;
  title?: string;
  diffs: FieldDiff[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  title = 'Confirm Record Changes',
  diffs,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-border bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 rounded hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Diffs Table */}
        <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto">
          <p className="text-xs text-muted-foreground">
            Please review the field-level changes before committing to the database audit trail:
          </p>

          <div className="border border-border rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5">Field</th>
                  <th className="p-2.5">Original</th>
                  <th className="p-2.5">New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {diffs.map((d, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-2.5 font-medium text-foreground">{d.label || d.field}</td>
                    <td className="p-2.5 font-mono text-rose-400 line-through bg-rose-500/5">
                      {String(d.originalValue ?? 'N/A')}
                    </td>
                    <td className="p-2.5 font-mono text-emerald-400 font-bold bg-emerald-500/5 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      {String(d.newValue ?? 'N/A')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" /> Confirm & Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
