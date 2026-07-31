<?php
/**
 * FrontAccounting Enterprise REST API — Supplier Validator
 */

class SupplierValidator {
    public static function validate(SupplierDto $dto) {
        $errors = [];
        if (empty($dto->supp_name)) {
            $errors[] = 'Supplier name is required.';
        }
        if (strlen($dto->supp_name) < 2) {
            $errors[] = 'Supplier name must be at least 2 characters.';
        }
        return $errors;
    }
}
