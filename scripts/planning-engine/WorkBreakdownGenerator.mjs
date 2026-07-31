/**
 * REF ERP Enterprise Planning Engine — Phase 6, 7, 8: Work Breakdown & Execution Plan Generator
 */

export class WorkBreakdownGenerator {
  static generateExecutionPlan(scanReport) {
    const { moduleId, targetName, files, coverage } = scanReport;

    const tasks = [
      {
        id: 'TASK-1',
        name: 'Database & ACL Data Persistence Layer',
        file: files.acl,
        missing: !coverage.hasUpdate || !coverage.hasArchive || !coverage.hasRestore || !coverage.hasAudit,
        actions: [
          'Add inactive TINYINT(1) column check in ensureTable()',
          'Implement update method with database transaction',
          'Implement archive (inactive = 1) and restore (inactive = 0) methods',
          'Integrate logAudit() writing structured records to 0_audit_trail'
        ],
        acceptanceCriteria: 'ACL class handles CRUD, archive, restore, and 0_audit_trail logging without PDO exceptions.'
      },
      {
        id: 'TASK-2',
        name: 'API Gateway Routes & Endpoint Registry',
        file: files.routes,
        missing: !coverage.hasArchiveRoute || !coverage.hasRestoreRoute,
        actions: [
          'Add endpoint definitions to apiEndpoints.ts',
          'Register regex routes for POST /taxes/{id}, POST /taxes/{id}/archive, POST /taxes/{id}/restore in routes.php',
          'Ensure raw payload stream inputData is properly decoded'
        ],
        acceptanceCriteria: 'Gateway routes return HTTP 200/201 JSON envelopes with request_id headers.'
      },
      {
        id: 'TASK-3',
        name: 'Frontend React View & State Management',
        file: files.view,
        missing: !coverage.hasTabs || !coverage.hasEditModal || !coverage.hasDuplicate,
        actions: [
          'Build Active / Archived tab state filtering',
          'Implement instant search bar (Ctrl+F)',
          'Implement Edit modal dialog & Duplicate action handler',
          'Implement Archive & Restore action handlers'
        ],
        acceptanceCriteria: 'Data grid renders active/archived tabs and edits without console errors.'
      },
      {
        id: 'TASK-4',
        name: 'Enterprise Printing & PDF System',
        file: files.view,
        missing: !coverage.hasPrintModal,
        actions: [
          'Build Print Preview modal dialog (Ctrl+P)',
          'Add @media print CSS rules hiding navigation chrome & developer tools',
          'Format official branded PDF document header'
        ],
        acceptanceCriteria: 'Window print action renders clean printable document.'
      },
      {
        id: 'TASK-5',
        name: 'Gemini AI Assistant Integration',
        file: files.view,
        missing: !coverage.hasAiDrawer,
        actions: [
          'Connect GeminiCapabilityRouter via POST /api/v1/ai/query',
          'Render AI Assistant Drawer with domain analysis prompt'
        ],
        acceptanceCriteria: 'AI drawer fetches compliance insights cleanly.'
      },
      {
        id: 'TASK-6',
        name: 'Executive Dashboard Analytics Integration',
        file: files.view,
        missing: !coverage.hasKpiCards,
        actions: [
          'Build summary KPI cards for active count, archived count, and key metrics'
        ],
        acceptanceCriteria: 'KPI summary cards render live counts.'
      },
      {
        id: 'TASK-7',
        name: 'Keyboard Shortcuts & Accessibility',
        file: files.view,
        missing: !coverage.hasShortcuts,
        actions: [
          'Bind Ctrl+N (New), Ctrl+P (Print), Ctrl+F (Search), and Esc (Close)'
        ],
        acceptanceCriteria: 'Key bindings trigger modal & search handlers.'
      },
      {
        id: 'TASK-8',
        name: 'Quality Assurance & Automated Verification',
        file: 'Automated Suite',
        missing: !coverage.hasAudit,
        actions: [
          'Run npm run typecheck (0 errors)',
          'Run npm run build (Clean Vite bundle)',
          'Execute PowerShell REST verification suite',
          'Verify MySQL 0_audit_trail entries'
        ],
        acceptanceCriteria: 'All typecheck, build, REST, and audit tests pass.'
      }
    ];

    const completedCount = tasks.filter(t => !t.missing).length;
    const completionPercent = Math.round((completedCount / tasks.length) * 100);

    return {
      moduleId,
      targetName,
      completionPercent,
      isCertified: completionPercent === 100,
      tasks
    };
  }
}
