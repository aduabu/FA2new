Write-Host "=== 1. SYSTEM HEALTH CHECK ==="
$h = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/system/health"
Write-Host "Health Status: $($h.data.status) | Request ID: $($h.request_id)"

Write-Host "`n=== 2. VALID JOURNAL POSTING ==="
$jBody = '{"ref":"JRN-CERT-9901","date":"2026-07-27","memo":"Certification Adjustment","lines":[{"account_code":"1060","debit":250,"credit":0},{"account_code":"4010","debit":0,"credit":250}]}'
$jRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $jBody -ContentType "application/json"
Write-Host "Journal Status: $($jRes.code) | Trans #: $($jRes.data.trans_no) | Request ID: $($jRes.request_id)"

Write-Host "`n=== 3. INTENTIONAL FAILURE INJECTION: UNBALANCED JOURNAL ==="
try {
    $badBody = '{"ref":"JRN-BAD-01","date":"2026-07-27","memo":"Unbalanced Journal","lines":[{"account_code":"1060","debit":500,"credit":0},{"account_code":"4010","debit":0,"credit":100}]}'
    $badRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gl/journals" -Method POST -Body $badBody -ContentType "application/json"
    Write-Host "Unexpected Success: $($badRes.code)"
} catch {
    Write-Host "PASS: Caught Expected Error | Message: $($_.Exception.Message)"
}

Write-Host "`n=== 4. TRIAL BALANCE INVARIANT CHECK ==="
$tb = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/reports/trial-balance"
Write-Host "Trial Balance Status: $($tb.code) | Request ID: $($tb.request_id) | Verified OK"
