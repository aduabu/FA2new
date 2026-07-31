<?php
/**
 * FrontAccounting Enterprise REST API — Inventory Controller
 */

class InventoryController {
    private $service;

    public function __construct(InventoryService $service) {
        $this->service = $service;
    }

    public function index() {
        $items = $this->service->listItems();
        Response::json($items, 200, 'Inventory items retrieved successfully');
    }

    public function show($code) {
        $item = $this->service->getItemByCode($code);
        Response::json($item, 200, "Inventory Item {$code} overview retrieved");
    }

    public function related($code) {
        $related = $this->service->getItemRelatedRecords($code);
        Response::json($related, 200, "Inventory Item {$code} related records retrieved");
    }

    public function history($code) {
        $history = AuditService::getEntityHistory('item', $code);
        Response::json($history, 200, "Inventory Item {$code} audit history retrieved");
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $item = $this->service->createItem($input);
        Response::json($item, 201, 'Inventory item created successfully');
    }
}
