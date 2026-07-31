<?php
/**
 * FrontAccounting Enterprise REST API — Report Repository
 */

class ReportRepository {
    private $acl;

    public function __construct(ReportAcl $acl) {
        $this->acl = $acl;
    }

    public function getTrialBalance() {
        return $this->acl->getTrialBalance();
    }
}
