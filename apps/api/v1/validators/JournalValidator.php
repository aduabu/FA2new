<?php
/**
 * FrontAccounting Enterprise REST API — Manual Journal Validator
 */

class JournalValidator {
    public static function validate(JournalEntryDto $dto) {
        $errors = [];
        if (empty($dto->lines) || count($dto->lines) < 2) {
            $errors[] = 'Journal entry must contain at least two line items (Debit & Credit).';
        }

        $totalDebit = 0.0;
        $totalCredit = 0.0;
        foreach ($dto->lines as $line) {
            $totalDebit += (float)($line['debit'] ?? 0);
            $totalCredit += (float)($line['credit'] ?? 0);
        }

        if (abs($totalDebit - $totalCredit) > 0.01) {
            $errors[] = sprintf("Journal entry is not balanced. Total Debit ($%.2f) != Total Credit ($%.2f)", $totalDebit, $totalCredit);
        }

        return $errors;
    }
}
