<?php
/**
 * FrontAccounting Enterprise REST API — Customer DTO
 */

class CustomerDto {
    public $debtor_no;
    public $name;
    public $address;
    public $tax_id;
    public $curr_code;
    public $credit_limit;
    public $payment_terms;

    public function __construct(array $data) {
        $this->debtor_no = isset($data['debtor_no']) ? (int)$data['debtor_no'] : null;
        $this->name = trim($data['name'] ?? '');
        $this->address = trim($data['address'] ?? '');
        $this->tax_id = trim($data['tax_id'] ?? '');
        $this->curr_code = strtoupper(trim($data['curr_code'] ?? 'USD'));
        $this->credit_limit = (float)($data['credit_limit'] ?? 10000.00);
        $this->payment_terms = trim($data['payment_terms'] ?? 'Net 30');
    }
}
