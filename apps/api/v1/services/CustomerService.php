<?php
/**
 * FrontAccounting Enterprise REST API — Customer Application Service
 */

class CustomerService {
    private $repository;

    public function __construct(CustomerRepository $repository) {
        $this->repository = $repository;
    }

    public function listCustomers() {
        return $this->repository->getCustomers();
    }

    public function getCustomerById($id) {
        return $this->repository->getCustomerById($id);
    }

    public function getCustomerRelatedRecords($id) {
        return $this->repository->getCustomerRelatedRecords($id);
    }

    public function createCustomer(array $inputData) {
        $dto = new CustomerDto($inputData);
        return $this->repository->createCustomer($dto);
    }
}
