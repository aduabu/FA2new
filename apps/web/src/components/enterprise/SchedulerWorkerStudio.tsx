import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, Clock, Play } from 'lucide-react';

export const SchedulerWorkerStudio: React.FC = () => {
  const jobs = [
    { job: 'Daily_Exchange_Rate_Update', freq: 'Daily 00:00', lastRun: '2026-07-27 00:00:02', status: 'SUCCESS' },
    { job: 'PDF_Report_Pre-Render_Queue', freq: 'Every 15m', lastRun: '2026-07-27 18:30:00', status: 'SUCCESS' },
    { job: 'Database_Nightly_Backup_Snapshot', freq: 'Daily 02:00', lastRun: '2026-07-27 02:00:14', status: 'SUCCESS' },
    { job: 'Email_Notification_Batch_Dispatcher', freq: 'Every 5m', lastRun: '2026-07-27 18:30:00', status: 'SUCCESS' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" /> Scheduler & Background Queue Workers
          </h2>
          <p className="text-xs text-muted-foreground">Redis-backed Asynchronous Job Queues & Automated Schedulers</p>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> 4 Redis Queue Workers Active
        </span>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 font-bold">Scheduled Job Name</th>
              <th className="p-3.5 w-36">Frequency</th>
              <th className="p-3.5 w-44">Last Execution Timestamp</th>
              <th className="p-3.5 w-32 text-center">Status</th>
              <th className="p-3.5 w-28 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {jobs.map((j, idx) => (
              <tr key={idx} className="hover:bg-muted/20">
                <td className="p-3.5 font-bold text-primary font-sans">{j.job}</td>
                <td className="p-3.5 text-muted-foreground font-sans">{j.freq}</td>
                <td className="p-3.5 text-muted-foreground">{j.lastRun}</td>
                <td className="p-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                    {j.status}
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  <button className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-[10px] flex items-center gap-1 mx-auto transition-all font-sans">
                    <Play className="w-3 h-3" /> Run Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
