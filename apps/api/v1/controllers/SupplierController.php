<?php
/**
 * FrontAccounting Enterprise REST API — Supplier Controller
 */

class SupplierController {
    private $service;

    public function __construct(SupplierService $service) {
        $this->service = $service;
    }

    public function index() {
        $suppliers = $this->service->listSuppliers();
        Response::json($suppliers, 200, 'Suppliers retrieved successfully');
    }

    public function show($id) {
        $supplier = $this->service->getSupplierById($id);
        Response::json($supplier, 200, "Supplier #{$id} 360 overview retrieved");
    }

    public function related($id) {
        $related = $this->service->getSupplierRelatedRecords($id);
        Response::json($related, 200, "Supplier #{$id} related records retrieved");
    }

    public function history($id) {
        $history = AuditService::getEntityHistory('supplier', $id);
        Response::json($history, 200, "Supplier #{$id} audit history retrieved");
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $supplier = $this->service->createSupplier($input);
        Response::json($supplier, 201, 'Supplier created successfully');
    }
}
