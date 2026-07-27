import React, { useState } from 'react';
import { Sparkles, Search, FileText, Upload, CheckCircle2, ArrowRight, Bot } from 'lucide-react';

export const AIAssistantStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleRunAiQuery = (queryText: string) => {
    setPrompt(queryText);
    setIsProcessing(true);
    setTimeout(() => {
      if (queryText.toLowerCase().includes('unpaid')) {
        setResponse({
          type: 'UNPAID_INVOICES',
          summary: 'Found 1 unpaid invoice over $1,000 for Acme Global Logistics.',
          results: [
            { inv: 'INV-1042', customer: 'Acme Global Logistics', amount: '$2,645.50', due: '2026-08-27', status: 'UNPAID' }
          ]
        });
      } else if (queryText.toLowerCase().includes('bank') || queryText.toLowerCase().includes('cash')) {
        setResponse({
          type: 'BANK_BALANCES',
          summary: 'Total Bank & Cash Liquidity across 2 active accounts is $416,400.00.',
          results: [
            { account: '1060 Current Bank Account', balance: '$412,900.00' },
            { account: '1065 Petty Cash Account', balance: '$3,500.00' }
          ]
        });
      } else {
        setResponse({
          type: 'FINANCIAL_INSIGHT',
          summary: 'Financial ledgers are 100% balanced. Year-to-Date revenue is $1,248,500.00 with a net operating margin of 32.5%.',
          results: []
        });
      }
      setIsProcessing(false);
    }, 500);
  };

  const handleSimulateOcr = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setOcrResult({
        supplier: 'Industrial Components Co',
        invNo: 'INV-SUPP-9921',
        amount: '$1,870.00',
        confidence: '98%',
        item: 'Industrial Widget A (Qty: 20)'
      });
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Enterprise AI Assistant & Intelligent Search
          </h2>
          <p className="text-xs text-muted-foreground">Natural Language Financial Querying, OCR Bill Processing & Automated Insights</p>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" /> AI Core Engine Active
        </span>
      </div>

      {/* NATURAL LANGUAGE QUERY BAR */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
        <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Natural Language ERP Assistant</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask AI e.g. 'Show unpaid invoices over $1,000' or 'What is our current cash position?'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <button 
            onClick={() => handleRunAiQuery(prompt || 'Show unpaid invoices')}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 flex items-center gap-2 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
        </div>

        {/* SAMPLE PROMPT BUTTONS */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground text-[11px]">Suggested prompts:</span>
          <button 
            onClick={() => handleRunAiQuery('Show unpaid invoices over $1,000')}
            className="px-2.5 py-1 rounded-md bg-muted hover:bg-primary/10 hover:text-primary text-[11px] font-medium transition-colors"
          >
            "Show unpaid invoices over $1,000"
          </button>
          <button 
            onClick={() => handleRunAiQuery('What is our current cash position?')}
            className="px-2.5 py-1 rounded-md bg-muted hover:bg-primary/10 hover:text-primary text-[11px] font-medium transition-colors"
          >
            "What is our current cash position?"
          </button>
        </div>
      </div>

      {/* AI RESPONSE CONTAINER */}
      {response && (
        <div className="bg-card p-5 rounded-xl border border-primary/40 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Bot className="w-4 h-4" /> AI Summary Response:
          </div>
          <p className="text-sm font-semibold text-foreground">{response.summary}</p>

          {response.results.length > 0 && (
            <div className="pt-2">
              <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted text-muted-foreground uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-2.5">Reference / Account</th>
                    <th className="p-2.5">Customer / Entity</th>
                    <th className="p-2.5 text-right">Amount ($)</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {response.results.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="p-2.5 font-bold text-primary">{r.inv || r.account}</td>
                      <td className="p-2.5 font-sans font-medium text-foreground">{r.customer || 'General Ledger'}</td>
                      <td className="p-2.5 text-right font-bold text-foreground">{r.amount || r.balance}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">VERIFIED</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* OCR BILL PARSER CARD */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-500" /> Automated Supplier Bill & Receipt OCR Parser
            </h3>
            <p className="text-xs text-muted-foreground">Upload PDF/Image invoices; AI extracts line items, taxes, and vendor details automatically</p>
          </div>
          <button 
            onClick={handleSimulateOcr}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> Simulate OCR Upload
          </button>
        </div>

        {ocrResult && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> OCR Extraction Success (Confidence: {ocrResult.confidence})
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-foreground font-mono">
              <div>Supplier: <strong>{ocrResult.supplier}</strong></div>
              <div>Invoice #: <strong>{ocrResult.invNo}</strong></div>
              <div>Total Amount: <strong>{ocrResult.amount}</strong></div>
              <div>Item: <strong>{ocrResult.item}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
