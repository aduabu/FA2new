<?php
/**
 * FrontAccounting Enterprise REST API — Inventory Item DTO
 */

class InventoryItemDto {
    public $item_code;
    public $stock_id;
    public $description;
    public $category;
    public $material_cost;
    public $qty_on_hand;

    public function __construct(array $data) {
        $this->item_code = strtoupper(trim($data['item_code'] ?? ''));
        $this->stock_id = strtoupper(trim($data['stock_id'] ?? $this->item_code));
        $this->description = trim($data['description'] ?? '');
        $this->category = trim($data['category'] ?? 'General');
        $this->material_cost = (float)($data['material_cost'] ?? 0.00);
        $this->qty_on_hand = (int)($data['qty_on_hand'] ?? 0);
    }
}
