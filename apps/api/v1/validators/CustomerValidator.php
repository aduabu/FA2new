<?php
/**
 * FrontAccounting Enterprise REST API — Customer Validator
 */

class CustomerValidator {
    public static function validate(CustomerDto $dto) {
        $errors = [];
        if (empty($dto->name)) {
            $errors[] = 'Customer name is required.';
        }
        if (strlen($dto->name) < 2) {
            $errors[] = 'Customer name must be at least 2 characters.';
        }
        if ($dto->credit_limit < 0) {
            $errors[] = 'Credit limit cannot be negative.';
        }
        return $errors;
    }
}
