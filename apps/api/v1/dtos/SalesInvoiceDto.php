<?php
/**
 * FrontAccounting Enterprise REST API — Sales Invoice DTO
 */

class SalesInvoiceDto {
    public $debtor_no;
    public $customer_name;
    public $tran_date;
    public $due_date;
    public $comments;
    public $line_items;

    public function __construct(array $data) {
        $this->debtor_no = (int)($data['debtor_no'] ?? 1);
        $this->customer_name = trim($data['customer_name'] ?? '');
        $this->tran_date = $data['tran_date'] ?? date('Y-m-d');
        $this->due_date = $data['due_date'] ?? date('Y-m-d', strtotime('+30 days'));
        $this->comments = trim($data['comments'] ?? '');
        $this->line_items = $data['line_items'] ?? [];
    }
}
