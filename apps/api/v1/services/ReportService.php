<?php
/**
 * FrontAccounting Enterprise REST API — Report Application Service
 */

class ReportService {
    private $repository;

    public function __construct(ReportRepository $repository) {
        $this->repository = $repository;
    }

    public function getTrialBalance() {
        return $this->repository->getTrialBalance();
    }
}
