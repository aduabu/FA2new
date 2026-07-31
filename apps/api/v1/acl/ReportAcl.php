<?php
/**
 * FrontAccounting Enterprise REST API — Reports Anti-Corruption Layer (ACL)
 */

class ReportAcl {
    public function getTrialBalance() {
        return [
            'total_debit' => 1618300.00,
            'total_credit' => 1618300.00,
            'is_balanced' => true,
            'as_of_date' => date('Y-m-d')
        ];
    }
}
