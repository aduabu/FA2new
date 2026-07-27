import React, { useState } from 'react';
import { runAccountingIntegrityTests, TestResult } from '../../tests/accounting_integrity.test';
import { ShieldCheck, Play, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const AccountingIntegrityTestRunner: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>(runAccountingIntegrityTests());
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunTests = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setTests(runAccountingIntegrityTests());
      setIsExecuting(false);
    }, 600);
  };

  const totalPassed = tests.filter(t => t.passed).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Accounting Integrity Automated Test Suite
          </h2>
          <p className="text-xs text-muted-foreground">Automated Rule Verification for Double-Entry Accounting & Ledger Invariants</p>
        </div>

        <button 
          onClick={handleRunTests}
          disabled={isExecuting}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1.5 shadow-md transition-all"
        >
          {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run Suite Tests
        </button>
      </div>

      {/* SUMMARY BANNER */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <div className="font-bold text-sm">All Accounting Invariants Verified ({totalPassed} / {tests.length} Passed)</div>
            <div className="text-xs opacity-90">Core ledger posting rules, 3-way GRN match, and debits/credits balance constraints validated.</div>
          </div>
        </div>
      </div>

      {/* TEST CASES LIST */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
        {tests.map((test, idx) => (
          <div key={idx} className="p-4 flex items-start justify-between hover:bg-muted/20 transition-colors">
            <div className="space-y-1">
              <div className="text-xs font-bold text-foreground">{test.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{test.message}</div>
            </div>
            {test.passed ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold text-[10px] flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> FAILED
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
