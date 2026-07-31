<?php
/**
 * FrontAccounting Enterprise REST API — Journal Entry DTO
 */

class JournalEntryDto {
    public $tran_date;
    public $memo;
    public $lines;

    public function __construct(array $data) {
        $this->tran_date = $data['tran_date'] ?? date('Y-m-d');
        $this->memo = trim($data['memo'] ?? '');
        $this->lines = $data['lines'] ?? [];
    }
}
