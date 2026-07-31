<?php
/**
 * FrontAccounting Enterprise REST API — General Ledger Application Service
 */

class GLService {
    private $repository;

    public function __construct(GLRepository $repository) {
        $this->repository = $repository;
    }

    public function listAccounts() {
        return $this->repository->getAccounts();
    }

    public function getAccountByCode($code) {
        return $this->repository->getAccountByCode($code);
    }

    public function updateAccountByCode($code, array $data) {
        return $this->repository->updateAccountByCode($code, $data);
    }

    public function getAccountRelatedRecords($code) {
        return $this->repository->getAccountRelatedRecords($code);
    }

    public function createAccount(array $inputData) {
        $dto = new GLAccountDto($inputData);
        if (empty($dto->account_code) || empty($dto->account_name)) {
            Response::json(null, 400, 'Validation Error', ['Account code and name are required.']);
        }
        return $this->repository->createAccount($dto);
    }

    public function getAccountLedger($accountCode) {
        return $this->repository->getAccountLedger($accountCode);
    }

    public function postJournal(array $inputData) {
        $dto = new JournalEntryDto($inputData);
        $errors = JournalValidator::validate($dto);

        if (!empty($errors)) {
            Response::json(null, 400, 'Validation Error', $errors);
        }

        return $this->repository->postJournal($dto);
    }

    public function getJournal($transNo) {
        return $this->repository->getJournalByTransNo($transNo);
    }

    public function getJournalRelated($transNo) {
        return $this->repository->getJournalRelatedRecords($transNo);
    }
}

