<?php
/**
 * FrontAccounting Enterprise REST API — Supplier Repository
 */

class SupplierRepository {
    private $acl;

    public function __construct(SupplierAcl $acl) {
        $this->acl = $acl;
    }

    public function getSuppliers() {
        return $this->acl->getSuppliers();
    }

    public function getSupplierById($id) {
        return $this->acl->getSupplierById($id);
    }

    public function getSupplierRelatedRecords($id) {
        return $this->acl->getSupplierRelatedRecords($id);
    }

    public function createSupplier(SupplierDto $dto) {
        return $this->acl->createSupplier($dto);
    }
}
