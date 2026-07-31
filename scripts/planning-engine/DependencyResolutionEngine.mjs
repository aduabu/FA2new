/**
 * REF ERP Enterprise Planning Engine — Phase 3: Dependency Resolution Engine
 */

export const DEPENDENCY_GRAPH = {
  DB_SCHEMA: [],
  ACL_METHODS: ['DB_SCHEMA'],
  AUDIT_LOGGING: ['ACL_METHODS'],
  GATEWAY_ROUTES: ['ACL_METHODS'],
  ENDPOINT_CONFIG: ['GATEWAY_ROUTES'],
  UI_VIEW: ['ENDPOINT_CONFIG'],
  UI_ACTIONS: ['UI_VIEW'],
  PRINT_PDF: ['UI_VIEW'],
  AI_ROUTER: ['UI_VIEW'],
  DASHBOARD_KPIS: ['UI_VIEW'],
  KEYBOARD_SHORTCUTS: ['UI_ACTIONS', 'PRINT_PDF'],
  QA_TYPECHECK: ['UI_VIEW'],
  QA_BUILD: ['QA_TYPECHECK'],
  QA_REST_SUITE: ['GATEWAY_ROUTES', 'AUDIT_LOGGING'],
  CERTIFICATION: ['QA_BUILD', 'QA_REST_SUITE']
};

export class DependencyResolutionEngine {
  static getOrder() {
    return [
      'DB_SCHEMA',
      'ACL_METHODS',
      'AUDIT_LOGGING',
      'GATEWAY_ROUTES',
      'ENDPOINT_CONFIG',
      'UI_VIEW',
      'UI_ACTIONS',
      'PRINT_PDF',
      'AI_ROUTER',
      'DASHBOARD_KPIS',
      'KEYBOARD_SHORTCUTS',
      'QA_TYPECHECK',
      'QA_BUILD',
      'QA_REST_SUITE',
      'CERTIFICATION'
    ];
  }

  static checkPrerequisites(targetStep, completedSteps) {
    const prereqs = DEPENDENCY_GRAPH[targetStep] || [];
    const missing = prereqs.filter(p => !completedSteps.includes(p));
    return {
      satisfied: missing.length === 0,
      missing
    };
  }
}
