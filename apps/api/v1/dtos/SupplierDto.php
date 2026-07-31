<?php
/**
 * FrontAccounting Enterprise REST API — Supplier DTO
 */

class SupplierDto {
    public $supplier_id;
    public $supp_name;
    public $address;
    public $curr_code;
    public $payment_terms;

    public function __construct(array $data) {
        $this->supplier_id = isset($data['supplier_id']) ? (int)$data['supplier_id'] : null;
        $this->supp_name = trim($data['supp_name'] ?? '');
        $this->address = trim($data['address'] ?? '');
        $this->curr_code = strtoupper(trim($data['curr_code'] ?? 'USD'));
        $this->payment_terms = trim($data['payment_terms'] ?? 'Net 30');
    }
}
