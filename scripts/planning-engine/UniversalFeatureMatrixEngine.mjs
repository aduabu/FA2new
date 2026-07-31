/**
 * REF ERP Enterprise Planning Engine — Phase 1: Universal Feature Matrix Engine
 */

export const UNIVERSAL_FEATURE_MATRIX = [
  // 1. Module Lifecycle & CRUD Governance
  { id: 'CRUD_VIEW', category: 'LIFECYCLE', name: 'View Catalog Grid', defaultMandatory: true, requires: ['DB_SELECT', 'API_GET', 'UI_VIEW'] },
  { id: 'CRUD_CREATE', category: 'LIFECYCLE', name: 'Create Record Form', defaultMandatory: true, requires: ['DB_INSERT', 'API_POST', 'UI_MODAL'] },
  { id: 'CRUD_EDIT', category: 'LIFECYCLE', name: 'Edit Record Form', defaultMandatory: true, requires: ['DB_UPDATE', 'API_POST_ID', 'UI_MODAL_EDIT'] },
  { id: 'CRUD_DUPLICATE', category: 'LIFECYCLE', name: 'Duplicate Action', defaultMandatory: true, requires: ['UI_DUPLICATE_HANDLER'] },
  { id: 'CRUD_ARCHIVE', category: 'LIFECYCLE', name: 'Archive Soft Delete', defaultMandatory: true, requires: ['DB_INACTIVE_COL', 'API_ARCHIVE', 'UI_ARCHIVE'] },
  { id: 'CRUD_RESTORE', category: 'LIFECYCLE', name: 'Restore Action', defaultMandatory: true, requires: ['API_RESTORE', 'UI_RESTORE'] },
  { id: 'AUDIT_TRAIL', category: 'SECURITY', name: 'Structured Audit Trail Logging', defaultMandatory: true, requires: ['DB_AUDIT_TABLE', 'ACL_LOG_AUDIT'] },

  // 2. Search, Navigation & Discoverability
  { id: 'SEARCH_INSTANT', category: 'SEARCH', name: 'Instant Search Bar', defaultMandatory: true, requires: ['UI_SEARCH_INPUT'] },
  { id: 'SEARCH_SHORTCUT', category: 'SEARCH', name: 'Search Shortcut (Ctrl+F)', defaultMandatory: true, requires: ['UI_KEYBOARD_LISTENER'] },
  { id: 'TABS_ACTIVE_ARCHIVED', category: 'SEARCH', name: 'Active / Archived Tabs', defaultMandatory: true, requires: ['UI_TAB_STATE'] },

  // 3. Enterprise Printing & PDF
  { id: 'PRINT_PREVIEW', category: 'PRINTING', name: 'Print Preview Modal', defaultMandatory: true, requires: ['UI_PRINT_MODAL', 'CSS_MEDIA_PRINT'] },
  { id: 'PRINT_SHORTCUT', category: 'PRINTING', name: 'Print Shortcut (Ctrl+P)', defaultMandatory: true, requires: ['UI_KEYBOARD_LISTENER'] },

  // 4. AI Capability Router
  { id: 'AI_AUDITOR', category: 'AI', name: 'Gemini AI Assistant Drawer', defaultMandatory: true, requires: ['API_AI_QUERY', 'UI_AI_DRAWER'] },

  // 5. Executive Dashboard Analytics
  { id: 'DASHBOARD_KPIS', category: 'DASHBOARD', name: 'Executive Summary KPI Cards', defaultMandatory: true, requires: ['UI_KPI_CARDS'] },

  // 6. Keyboard Shortcuts & Accessibility
  { id: 'SHORTCUT_NEW', category: 'ACCESSIBILITY', name: 'New Record Shortcut (Ctrl+N)', defaultMandatory: true, requires: ['UI_KEYBOARD_LISTENER'] },
  { id: 'SHORTCUT_ESC', category: 'ACCESSIBILITY', name: 'Close Modal Shortcut (Esc)', defaultMandatory: true, requires: ['UI_KEYBOARD_LISTENER'] },

  // 7. Quality & Compliance
  { id: 'TYPECHECK_PASS', category: 'QUALITY', name: 'TypeScript Typecheck (0 Errors)', defaultMandatory: true, requires: ['NPM_TYPECHECK'] },
  { id: 'BUILD_PASS', category: 'QUALITY', name: 'Production Bundle Build Pass', defaultMandatory: true, requires: ['NPM_BUILD'] },
  { id: 'REST_TESTS_PASS', category: 'QUALITY', name: 'Automated REST Verification Pass', defaultMandatory: true, requires: ['REST_SUITE'] },
];

export class UniversalFeatureMatrixEngine {
  static getFeatures() {
    return UNIVERSAL_FEATURE_MATRIX;
  }

  static getFeatureById(id) {
    return UNIVERSAL_FEATURE_MATRIX.find(f => f.id === id);
  }
}
