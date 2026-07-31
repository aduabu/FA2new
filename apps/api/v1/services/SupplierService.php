<?php
/**
 * FrontAccounting Enterprise REST API — Supplier Application Service
 */

class SupplierService {
    private $repository;

    public function __construct(SupplierRepository $repository) {
        $this->repository = $repository;
    }

    public function listSuppliers() {
        return $this->repository->getSuppliers();
    }

    public function getSupplierById($id) {
        return $this->repository->getSupplierById($id);
    }

    public function getSupplierRelatedRecords($id) {
        return $this->repository->getSupplierRelatedRecords($id);
    }

    public function createSupplier(array $inputData) {
        $dto = new SupplierDto($inputData);
        return $this->repository->createSupplier($dto);
    }
}
