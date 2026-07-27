import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Step {
  id: string;
  label: string;
}

interface DocStatusBarProps {
  steps: Step[];
  currentStepId: string;
}

export const DocStatusBar: React.FC<DocStatusBarProps> = ({ steps, currentStepId }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between overflow-x-auto">
      {steps.map((step, idx) => {
        const isPassed = idx < currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isPassed ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30' :
                'bg-muted text-muted-foreground'
              }`}>
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium ${
                isCurrent ? 'text-primary font-bold' :
                isPassed ? 'text-foreground' :
                'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-4 min-w-[30px] rounded ${
                idx < currentIndex ? 'bg-emerald-500' : 'bg-border'
              }`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
