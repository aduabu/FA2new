<?php
/**
 * FrontAccounting Enterprise REST API — Customer Repository
 */

class CustomerRepository {
    private $acl;

    public function __construct(CustomerAcl $acl) {
        $this->acl = $acl;
    }

    public function getCustomers() {
        return $this->acl->getCustomers();
    }

    public function getCustomerById($id) {
        return $this->acl->getCustomerById($id);
    }

    public function getCustomerRelatedRecords($id) {
        return $this->acl->getCustomerRelatedRecords($id);
    }

    public function createCustomer(CustomerDto $dto) {
        return $this->acl->createCustomer($dto);
    }
}
