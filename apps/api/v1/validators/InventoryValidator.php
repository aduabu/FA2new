<?php
/**
 * FrontAccounting Enterprise REST API — Inventory Item Validator
 */

class InventoryValidator {
    public static function validate(InventoryItemDto $dto) {
        $errors = [];
        if (empty($dto->item_code)) {
            $errors[] = 'Item code is required.';
        }
        if (empty($dto->description)) {
            $errors[] = 'Item description is required.';
        }
        if ($dto->material_cost < 0) {
            $errors[] = 'Material cost cannot be negative.';
        }
        return $errors;
    }
}
