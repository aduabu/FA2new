/**
 * REF ERP Enterprise Planning Engine — Business Rules Engine Layer
 * 
 * Evaluates Accounting & Domain Business Rules to prevent false certification
 * when technical completeness (CRUD/UI) is present but business invariants are missing.
 */

import fs from 'fs';
import path from 'path';

export class BusinessRulesEngine {
  constructor(rulesDir) {
    this.rulesDir = rulesDir;
  }

  evaluateModule(targetName, scanReport) {
    const rulesFilePath = path.join(this.rulesDir, `${targetName}.json`);
    if (!fs.existsSync(rulesFilePath)) {
      return {
        hasBusinessRules: false,
        businessCompletenessPercent: 100,
        satisfiedRules: [],
        missingRules: []
      };
    }

    const rulesData = JSON.parse(fs.readFileSync(rulesFilePath, 'utf-8'));
    const requiredRules = rulesData.requiredBusinessCapabilities || [];
    
    const satisfiedRules = [];
    const missingRules = [];

    // Read full code text from scanned files
    let combinedCodeText = '';
    Object.values(scanReport.files).forEach(fPath => {
      if (fPath && fs.existsSync(fPath)) {
        combinedCodeText += '\n' + fs.readFileSync(fPath, 'utf-8');
      }
    });

    requiredRules.forEach(rule => {
      const isPresent = rule.codePattern && combinedCodeText.includes(rule.codePattern);
      if (isPresent) {
        satisfiedRules.push(rule);
      } else {
        missingRules.push(rule);
      }
    });

    const totalCount = requiredRules.length;
    const satisfiedCount = satisfiedRules.length;
    const businessCompletenessPercent = totalCount > 0 ? Math.round((satisfiedCount / totalCount) * 100) : 100;

    return {
      hasBusinessRules: true,
      businessCompletenessPercent,
      satisfiedRules,
      missingRules
    };
  }
}
