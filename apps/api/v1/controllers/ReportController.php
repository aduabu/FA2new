<?php
/**
 * FrontAccounting Enterprise REST API — Report Controller
 */

class ReportController {
    private $service;

    public function __construct(ReportService $service) {
        $this->service = $service;
    }

    public function trialBalance() {
        $tb = $this->service->getTrialBalance();
        Response::json($tb, 200, 'Trial balance calculated successfully');
    }
}
