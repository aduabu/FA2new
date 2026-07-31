<?php
/**
 * FrontAccounting Enterprise REST API — General Ledger Repository
 */

class GLRepository {
    private $acl;

    public function __construct(GLAcl $acl) {
        $this->acl = $acl;
    }

    public function getAccounts() {
        return $this->acl->getAccounts();
    }

    public function getAccountByCode($code) {
        return $this->acl->getAccountByCode($code);
    }

    public function updateAccountByCode($code, array $data) {
        return $this->acl->updateAccountByCode($code, $data);
    }

    public function getAccountRelatedRecords($code) {
        return $this->acl->getAccountRelatedRecords($code);
    }

    public function createAccount(GLAccountDto $dto) {
        return $this->acl->createAccount($dto);
    }

    public function getAccountLedger($accountCode) {
        return $this->acl->getAccountLedger($accountCode);
    }

    public function postJournal(JournalEntryDto $dto) {
        return $this->acl->postJournal($dto);
    }

    public function getJournalByTransNo($transNo) {
        return $this->acl->getJournalByTransNo($transNo);
    }

    public function getJournalRelatedRecords($transNo) {
        return $this->acl->getJournalRelatedRecords($transNo);
    }
}

