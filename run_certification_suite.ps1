Write-Host "============================================================"
Write-Host "REF ERP ENTERPRISE PLATFORM — MODULE CERTIFICATION TEST SUITE"
Write-Host "============================================================"

# TEST CASE GL-001: General Ledger Manual Journal Posting
Write-Host "`n[TEST CASE GL-001] General Ledger Double-Entry Invariant"
$glPayload = '{"ref":"JRN-VAL-1001","date":"2026-07-28","memo":"GL-001 Double Entry Test","lines":[{"account_code":"1060","debit":1250,"credit":0},{"account_code":"4010","debit":0,"credit":1250}]}'
$glRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $glPayload -ContentType "application/json"
Write-Host "GL-001 Status: $($glRes.code) | Trans #: $($glRes.data.trans_no) | Request ID: $($glRes.request_id) | Execution: $($glRes.meta.execution_ms)ms"

# TEST CASE SAL-001: Sales Invoice & Receivables Integration
Write-Host "`n[TEST CASE SAL-001] Sales Order-to-Cash Workflow"
$salPayload = '{"debtor_no":1,"doc_ref":"INV-VAL-2001","invoice_date":"2026-07-28","due_date":"2026-08-28","line_items":[{"stock_id":"ITEM-A100","description":"Industrial Widget A","qty":5,"price":150,"discount":0}]}'
$salRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/sales/invoices" -Method POST -Body $salPayload -ContentType "application/json"
Write-Host "SAL-001 Status: $($salRes.code) | Trans #: $($salRes.data.trans_no) | Ref: $($salRes.data.invoice_ref) | Request ID: $($salRes.request_id)"

# TEST CASE PUR-001: Supplier Bill 3-Way Match & Payables Integration
Write-Host "`n[TEST CASE PUR-001] Supplier Procure-to-Pay Workflow"
$purPayload = '{"ref":"BILL-VAL-3001","date":"2026-07-28","memo":"Supplier Bill Procure-to-Pay Test","lines":[{"account_code":"1510","debit":1500,"credit":0},{"account_code":"2150","debit":150,"credit":0},{"account_code":"2100","debit":0,"credit":1650}]}'
$purRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $purPayload -ContentType "application/json"
Write-Host "PUR-001 Status: $($purRes.code) | Trans #: $($purRes.data.trans_no) | Request ID: $($purRes.request_id)"

# TEST CASE INV-001: Inventory Valuation & Stock Movement
Write-Host "`n[TEST CASE INV-001] Inventory Stock Adjustment"
$invPayload = '{"ref":"ADJ-VAL-4001","date":"2026-07-28","memo":"Inventory Stock Adjustment Test","lines":[{"account_code":"5010","debit":170,"credit":0},{"account_code":"1510","debit":0,"credit":170}]}'
$invRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $invPayload -ContentType "application/json"
Write-Host "INV-001 Status: $($invRes.code) | Trans #: $($invRes.data.trans_no) | Request ID: $($invRes.request_id)"

# TEST CASE BNK-001: Bank Inter-Account Transfer
Write-Host "`n[TEST CASE BNK-001] Bank Inter-Account Transfer"
$bnkPayload = '{"ref":"BP-VAL-5001","date":"2026-07-28","memo":"Bank Inter-Account Transfer Test","lines":[{"account_code":"1065","debit":500,"credit":0},{"account_code":"1060","debit":0,"credit":500}]}'
$bnkRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $bnkPayload -ContentType "application/json"
Write-Host "BNK-001 Status: $($bnkRes.code) | Trans #: $($bnkRes.data.trans_no) | Request ID: $($bnkRes.request_id)"

# TEST CASE RPT-001: Financial Trial Balance Zero-Variance Audit
Write-Host "`n[TEST CASE RPT-001] Trial Balance Financial Reporting Audit"
$rptRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/reports/trial-balance"
Write-Host "RPT-001 Status: $($rptRes.code) | Request ID: $($rptRes.request_id) | Execution: $($rptRes.meta.execution_ms)ms"

# TEST CASE AI-001: Gemini AI Capability Router Execution
Write-Host "`n[TEST CASE AI-001] Gemini AI Capability Router Query"
$aiPayload = '{"capability_id":"REASONING","prompt":"Execute audit reconciliation"}'
$aiRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/ai/query" -Method POST -Body $aiPayload -ContentType "application/json"
Write-Host "AI-001 Status: $($aiRes.code) | Capability Used: $($aiRes.data.capability) | Provider: $($aiRes.data.provider) | Request ID: $($aiRes.request_id)"
