import React, { useState, useEffect } from 'react';
import { Terminal, Activity, ChevronUp, ChevronDown, CheckCircle2, XCircle, Clock, Copy, Trash2, ShieldCheck } from 'lucide-react';
import { TelemetryLog } from '../../utils/apiClient';

interface Props {
  userRole?: string;
}

export const DeveloperDiagnosticsBar: React.FC<Props> = ({ userRole = 'ADMIN' }) => {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TelemetryLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Restricted to ADMIN users or development environment
  if (userRole !== 'ADMIN' && process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    const handleTelemetry = (e: CustomEvent<TelemetryLog>) => {
      setLogs(prev => [e.detail, ...prev].slice(0, 50));
    };

    window.addEventListener('api_telemetry' as any, handleTelemetry as any);
    return () => {
      window.removeEventListener('api_telemetry' as any, handleTelemetry as any);
    };
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearLogs = () => {
    setLogs([]);
    setSelectedLog(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 text-slate-200 border-t border-slate-800 shadow-2xl font-sans text-xs">
      {/* Diagnostics Toggle Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-primary-400 font-bold tracking-wide uppercase text-[11px]">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Developer Diagnostics & API Telemetry</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
            {logs.length} Requests Recorded
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> ADMIN Authorized
          </span>
        </div>

        <div className="flex items-center gap-4">
          {logs.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-400">Latest:</span>
              <span className={logs[0].success ? 'text-emerald-400' : 'text-rose-400'}>
                {logs[0].method} {logs[0].url} ({logs[0].status}) - {logs[0].executionMs}ms
              </span>
            </div>
          )}
          <button className="text-slate-400 hover:text-slate-200">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Diagnostics Panel */}
      {isOpen && (
        <div className="h-64 border-t border-slate-800 flex divide-x divide-slate-800 bg-slate-950">
          {/* Request Log List */}
          <div className="w-1/2 overflow-y-auto divide-y divide-slate-900">
            <div className="p-2 bg-slate-900/50 flex items-center justify-between sticky top-0 backdrop-blur">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">API Request Telemetry Stream</span>
              <button 
                onClick={clearLogs}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear History
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic">
                No API requests recorded yet. Interact with the application to view real-time request telemetry.
              </div>
            ) : (
              logs.map(log => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors font-mono ${
                    selectedLog?.id === log.id ? 'bg-slate-900 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {log.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-300 w-12 text-[10px]">{log.method}</span>
                    <span className="truncate text-slate-400 text-[11px]">{log.url}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] shrink-0">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      log.status >= 200 && log.status < 300 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {log.status || 'ERR'}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.executionMs}ms
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Log Detail Inspector */}
          <div className="w-1/2 p-3 overflow-y-auto font-mono text-[11px] space-y-3 bg-slate-950">
            {selectedLog ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" /> Request Payload & Telemetry Inspector
                  </div>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(selectedLog, null, 2), selectedLog.id)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedId === selectedLog.id ? 'Copied JSON!' : 'Copy JSON'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <div className="text-slate-500">Request Correlation ID</div>
                    <div className="text-emerald-400 font-bold truncate">{selectedLog.requestId}</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <div className="text-slate-500">HTTP Status & Execution</div>
                    <div className="text-slate-200 font-bold">{selectedLog.status} ({selectedLog.executionMs} ms)</div>
                  </div>
                </div>

                {selectedLog.payload && (
                  <div>
                    <div className="text-slate-500 text-[10px] mb-1 font-sans font-semibold">Request Body Payload:</div>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 overflow-x-auto text-[10px]">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <div className="text-slate-500 text-[10px] mb-1 font-sans font-semibold">Server Response Payload:</div>
                  <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300 overflow-x-auto text-[10px]">
                    {typeof selectedLog.response === 'string' ? selectedLog.response : JSON.stringify(selectedLog.response, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Select an API request line from the left panel to inspect request headers, request ID, status codes, and raw JSON payloads.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
