<?php
/**
 * FrontAccounting Enterprise REST API — Sales Invoice Validator
 */

class InvoiceValidator {
    public static function validate(SalesInvoiceDto $dto) {
        $errors = [];
        if ($dto->debtor_no <= 0) {
            $errors[] = 'A valid customer must be selected.';
        }
        if (empty($dto->line_items)) {
            $errors[] = 'Invoice must contain at least one line item.';
        }
        return $errors;
    }
}
