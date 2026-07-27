import React from 'react';
import { Code, BookOpen, Layers, CheckCircle2, ShieldCheck, ExternalLink, Terminal } from 'lucide-react';

export const PluginSDKPortal: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" /> Public Developer Platform & Plugin SDK
          </h2>
          <p className="text-xs text-muted-foreground">Documented Extension Model, Plugin Manifest Specifications & OpenAPI 3.0 Portal</p>
        </div>

        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Plugin SDK v1.0 Ready
        </span>
      </div>

      {/* MANIFEST SPEC & CODE EXAMPLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PLUGIN MANIFEST JSON */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" /> Standard Plugin Manifest (`plugin.json`)
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">JSON Spec</span>
          </div>

          <pre className="bg-muted/60 p-4 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
{`{
  "plugin_id": "com.company.custom_report",
  "name": "Custom Executive Dashboard Widget",
  "version": "1.0.0",
  "min_fa_version": "2.4.20",
  "extension_points": [
    "dashboard_widget",
    "sidebar_menu",
    "post_gl_event_hook"
  ],
  "permissions": ["SA_SALESORDER"],
  "author": "Enterprise Dev Team"
}`}
          </pre>
        </div>

        {/* OPENAPI DEVELOPER PORTAL */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" /> Interactive OpenAPI 3.0 Developer Docs
            </h3>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">Swagger UI Live</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Explore and execute typed REST API requests against the enterprise gateway. Includes client SDK generators for TypeScript, Python, and C#.
          </p>

          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-2 font-mono">
            <div className="text-primary">GET /api/v1/system/openapi.json</div>
            <div className="text-emerald-500">GET /api/v1/gl/accounts</div>
            <div className="text-amber-500">POST /api/v1/sales/invoices</div>
          </div>
        </div>
      </div>
    </div>
  );
};
