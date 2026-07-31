/**
 * REF ERP Enterprise Planning Engine — Phase 4 & 5: Repository Scanner & Coverage Analyzer
 */

import fs from 'fs';
import path from 'path';

export class RepositoryScanner {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
  }

  scanModule(moduleId, targetName) {
    const aclPath = path.join(this.workspaceRoot, 'apps', 'api', 'v1', 'acl', `${targetName}Acl.php`);
    const routesPath = path.join(this.workspaceRoot, 'apps', 'api', 'v1', 'routes.php');
    const endpointsPath = path.join(this.workspaceRoot, 'apps', 'web', 'src', 'config', 'apiEndpoints.ts');
    
    // Find view file
    const viewsDir = path.join(this.workspaceRoot, 'apps', 'web', 'src', 'components', 'masterdata');
    let viewPath = null;
    if (fs.existsSync(viewsDir)) {
      const files = fs.readdirSync(viewsDir);
      const match = files.find(f => f.toLowerCase().includes(targetName.toLowerCase()));
      if (match) {
        viewPath = path.join(viewsDir, match);
      }
    }

    const report = {
      moduleId,
      targetName,
      files: {
        acl: aclPath,
        routes: routesPath,
        endpoints: endpointsPath,
        view: viewPath
      },
      coverage: {}
    };

    // 1. ACL Analysis
    if (fs.existsSync(aclPath)) {
      const content = fs.readFileSync(aclPath, 'utf-8');
      report.coverage.aclExists = true;
      report.coverage.hasCreate = content.includes('create');
      report.coverage.hasUpdate = content.includes('update');
      report.coverage.hasArchive = content.includes('archive') || content.includes('inactive = 1');
      report.coverage.hasRestore = content.includes('restore') || content.includes('inactive = 0');
      report.coverage.hasAudit = content.includes('0_audit_trail') || content.includes('logAudit');
    } else {
      report.coverage.aclExists = false;
    }

    // 2. Gateway Routes Analysis
    if (fs.existsSync(routesPath)) {
      const content = fs.readFileSync(routesPath, 'utf-8');
      const targetLower = targetName.toLowerCase();
      const targetPlural = targetLower === 'currency' ? 'currencies' : (targetLower === 'tax' ? 'taxes' : `${targetLower}s`);
      report.coverage.routesExist = content.includes(`/${targetPlural}`);
      report.coverage.hasArchiveRoute = content.includes(`/${targetPlural}/`) && content.includes('/archive');
      report.coverage.hasRestoreRoute = content.includes(`/${targetPlural}/`) && content.includes('/restore');
    }

    // 3. Frontend View Analysis
    if (viewPath && fs.existsSync(viewPath)) {
      const content = fs.readFileSync(viewPath, 'utf-8');
      report.coverage.viewExists = true;
      report.coverage.hasTabs = content.includes('activeTab') || content.includes('ARCHIVED');
      report.coverage.hasSearch = content.includes('searchQuery') || content.includes('Ctrl+F');
      report.coverage.hasEditModal = content.includes('isEditMode') || content.includes('Edit');
      report.coverage.hasDuplicate = content.includes('handleDuplicate') || content.includes('Duplicate');
      report.coverage.hasPrintModal = content.includes('isPrintModalOpen') || content.includes('@media print');
      report.coverage.hasAiDrawer = content.includes('Gemini') || content.includes('Sparkles') || content.includes('AI');
      report.coverage.hasKpiCards = content.includes('grid-cols') && content.includes('activeCount');
      report.coverage.hasShortcuts = content.includes('addEventListener') && content.includes('keydown');
    } else {
      report.coverage.viewExists = false;
    }

    return report;
  }
}
