<?php
/**
 * FrontAccounting Enterprise REST API — General Ledger Controller
 */

class GLController {
    private $service;

    public function __construct(GLService $service) {
        $this->service = $service;
    }

    public function index() {
        $accounts = $this->service->listAccounts();
        Response::json($accounts, 200, 'Chart of accounts retrieved successfully');
    }

    public function show($accountCode) {
        $account = $this->service->getAccountByCode($accountCode);
        Response::json($account, 200, "GL Account {$accountCode} retrieved");
    }

    public function update($accountCode) {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $updated = $this->service->updateAccountByCode($accountCode, $input);
        Response::json($updated, 200, "GL Account {$accountCode} updated successfully");
    }

    public function related($accountCode) {
        $related = $this->service->getAccountRelatedRecords($accountCode);
        Response::json($related, 200, "Related records for GL Account {$accountCode} retrieved");
    }

    public function history($accountCode) {
        $logs = AuditService::getEntityHistory('gl_account', $accountCode);
        Response::json($logs, 200, "Audit history for GL Account {$accountCode} retrieved");
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $account = $this->service->createAccount($input);
        Response::json($account, 201, 'GL Account created successfully');
    }

    public function ledger($accountCode) {
        $ledger = $this->service->getAccountLedger($accountCode);
        Response::json($ledger, 200, "Account ledger for {$accountCode} retrieved");
    }

    public function postJournal() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $result = $this->service->postJournal($input);
        Response::json($result, 201, 'Journal entry posted successfully');
    }

    public function showJournal($transNo) {
        $data = $this->service->getJournal($transNo);
        Response::json($data, 200, "Journal entry {$transNo} retrieved");
    }

    public function relatedJournal($transNo) {
        $data = $this->service->getJournalRelated($transNo);
        Response::json($data, 200, "Related records for journal entry {$transNo} retrieved");
    }
}

