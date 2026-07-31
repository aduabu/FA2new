<?php
/**
 * FrontAccounting Enterprise REST API — Inventory Application Service
 */

class InventoryService {
    private $repository;

    public function __construct(InventoryRepository $repository) {
        $this->repository = $repository;
    }

    public function listItems() {
        return $this->repository->getItems();
    }

    public function getItemByCode($code) {
        return $this->repository->getItemByCode($code);
    }

    public function getItemRelatedRecords($code) {
        return $this->repository->getItemRelatedRecords($code);
    }

    public function createItem(array $inputData) {
        $dto = new InventoryDto($inputData);
        return $this->repository->createItem($dto);
    }
}
