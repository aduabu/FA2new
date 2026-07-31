<?php
/**
 * FrontAccounting Enterprise REST API — GL Account DTO
 */

class GLAccountDto {
    public $account_code;
    public $account_name;
    public $class_name;
    public $account_type;
    public $balance;
    public $inactive;

    public function __construct(array $data) {
        $this->account_code = trim($data['account_code'] ?? '');
        $this->account_name = trim($data['account_name'] ?? '');
        $this->class_name = trim($data['class_name'] ?? 'ASSET');
        $this->account_type = trim($data['account_type'] ?? 'ASSET');
        $this->balance = (float)($data['balance'] ?? 0.00);
        $this->inactive = (int)($data['inactive'] ?? 0);
    }
}
