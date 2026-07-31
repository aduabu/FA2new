<?php
/**
 * FrontAccounting Enterprise REST API — Inventory Repository
 */

class InventoryRepository {
    private $acl;

    public function __construct(InventoryAcl $acl) {
        $this->acl = $acl;
    }

    public function getItems() {
        return $this->acl->getItems();
    }

    public function getItemByCode($code) {
        return $this->acl->getItemByCode($code);
    }

    public function getItemRelatedRecords($code) {
        return $this->acl->getItemRelatedRecords($code);
    }

    public function createItem(InventoryDto $dto) {
        return $this->acl->createItem($dto);
    }
}
