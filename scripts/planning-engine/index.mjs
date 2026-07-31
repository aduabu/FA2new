/**
 * REF ERP Enterprise Autonomous Planning Engine — CLI Entry Point
 * 
 * Usage:
 *   node scripts/planning-engine/index.mjs --scan MOD-01
 *   node scripts/planning-engine/index.mjs --scan MOD-02
 *   node scripts/planning-engine/index.mjs --scan MOD-03
 *   node scripts/planning-engine/index.mjs --all
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { UniversalFeatureMatrixEngine } from './UniversalFeatureMatrixEngine.mjs';
import { DependencyResolutionEngine } from './DependencyResolutionEngine.mjs';
import { RepositoryScanner } from './RepositoryScanner.mjs';
import { BusinessRulesEngine } from './BusinessRulesEngine.mjs';
import { RequirementInterpreter } from './RequirementInterpreter.mjs';
import { ImplementationPlanner } from './ImplementationPlanner.mjs';
import { WorkBreakdownGenerator } from './WorkBreakdownGenerator.mjs';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const rulesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'business-rules');

const MODULE_MAP = {
  'MOD-01': 'Currency',
  'MOD-02': 'Tax',
  'MOD-03': 'Dimension',
  'MOD-04': 'Customer',
  'MOD-05': 'Supplier'
};

function runEngineForModule(moduleId, targetName) {
  console.log(`\n=============================================================`);
  console.log(`🚀 ENTERPRISE PLANNING ENGINE SCANNING: ${moduleId} (${targetName})`);
  console.log(`=============================================================`);

  // Phase 4: Repository AST & Code Scanner
  const scanner = new RepositoryScanner(workspaceRoot);
  const scanReport = scanner.scanModule(moduleId, targetName);
  
  // Phase 5: Requirement Interpreter (Directives 11 & 12 Blueprint Expansion)
  const blueprints = RequirementInterpreter.interpretDirectives(['RECORD_WORKSPACE_STANDARD', 'BUSINESS_RULE_CERTIFICATION']);

  // Phase 6: Business Rules Completeness Evaluation
  const rulesEngine = new BusinessRulesEngine(rulesDir);
  const bizReport = rulesEngine.evaluateModule(targetName, scanReport);

  // Phase 7: Implementation Planning Gate & Self-Contained Packages
  const implPlan = ImplementationPlanner.createImplementationPlan(scanReport, {});
  
  // Phase 8: Derived Work Breakdown Structure
  const plan = WorkBreakdownGenerator.generateExecutionPlan(scanReport);

  const isFullyCertified = plan.completionPercent === 100 && bizReport.businessCompletenessPercent === 100;

  console.log(`\n📐 REQUIREMENT INTERPRETER ARCHITECTURAL BLUEPRINTS:`);
  blueprints.forEach(bp => {
    console.log(`\n  [${bp.requirementId}] ${bp.title}`);
    if (bp.components) {
      console.log(`  - Target UI Component Hierarchy:`);
      bp.components.forEach(c => console.log(`      * ${c}`));
    }
    if (bp.interactionHandlers) {
      console.log(`  - Required Interaction Handlers:`);
      bp.interactionHandlers.forEach(h => console.log(`      * ${h}`));
    }
  });

  console.log(`\n📊 MODULE COVERAGE & BUSINESS COMPLEATNESS STATUS:`);
  console.log(`- Module ID:                      ${plan.moduleId}`);
  console.log(`- Target Component:               ${plan.targetName}`);
  console.log(`- Technical Completeness Score:   ${plan.completionPercent}%`);
  console.log(`- Business Rules Completeness:   ${bizReport.businessCompletenessPercent}%`);
  console.log(`- Dual-Gate Certification Status: ${isFullyCertified ? '✅ CERTIFIED (TECHNICAL & BUSINESS PASS)' : '🟡 IN_PROGRESS / CERTIFICATION REFUSED'}`);

  if (bizReport.missingRules && bizReport.missingRules.length > 0) {
    console.log(`\n⚠️  MISSING ACCOUNTING / BUSINESS INVARIANTS:`);
    bizReport.missingRules.forEach(rule => {
      console.log(`   * [${rule.id}] ${rule.name}: ${rule.description}`);
    });
  }

  console.log(`\n🛠️  EXECUTION PACKAGES (IMPLEMENTATION STRATEGY & RISK ANALYSIS):`);
  implPlan.executionPackages.forEach(pkg => {
    console.log(`\n  [${pkg.packageId}] ${pkg.title}`);
    console.log(`  - Target Files:`);
    pkg.targetFiles.forEach(f => console.log(`      * [${f.action}] ${f.path} (${f.rationale})`));
    console.log(`  - Execution Strategy:`);
    pkg.strategy.forEach(s => console.log(`      ${s}`));
    console.log(`  - Risk & Mitigation:`);
    pkg.risks.forEach(r => console.log(`      * [${r.severity}] ${r.risk} -> Mitigation: ${r.mitigation}`));
    console.log(`  - Rollback Plan: ${pkg.rollbackPlan}`);
  });

  console.log(`\n📋 REPOSITORY-AWARE WORK BREAKDOWN STRUCTURE (WBS):`);
  plan.tasks.forEach(t => {
    const statusIcon = t.missing ? '🔴 MISSING' : '✅ COMPLETE';
    console.log(`\n  [${t.id}] ${t.name} (${statusIcon})`);
    console.log(`  - Target File: ${t.file || 'N/A'}`);
    console.log(`  - Actions:`);
    t.actions.forEach(a => console.log(`      * ${a}`));
    console.log(`  - Acceptance: ${t.acceptanceCriteria}`);
  });

  return plan;
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    Object.keys(MODULE_MAP).forEach(modId => {
      runEngineForModule(modId, MODULE_MAP[modId]);
    });
    return;
  }

  const scanIdx = args.indexOf('--scan');
  if (scanIdx !== -1 && args[scanIdx + 1]) {
    const modId = args[scanIdx + 1].toUpperCase();
    if (MODULE_MAP[modId]) {
      runEngineForModule(modId, MODULE_MAP[modId]);
    } else {
      console.error(`Unknown module ID: ${modId}. Available: ${Object.keys(MODULE_MAP).join(', ')}`);
    }
    return;
  }

  console.log(`
REF ERP Enterprise Autonomous Planning Engine CLI

Usage:
  node scripts/planning-engine/index.mjs --scan MOD-01
  node scripts/planning-engine/index.mjs --scan MOD-02
  node scripts/planning-engine/index.mjs --scan MOD-03
  node scripts/planning-engine/index.mjs --all
  `);
}

main();
