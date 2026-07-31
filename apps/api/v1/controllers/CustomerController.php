<?php
/**
 * FrontAccounting Enterprise REST API — Customer Controller
 */

class CustomerController {
    private $service;

    public function __construct(CustomerService $service) {
        $this->service = $service;
    }

    public function index() {
        $customers = $this->service->listCustomers();
        Response::json($customers, 200, 'Customers retrieved successfully');
    }

    public function show($id) {
        $customer = $this->service->getCustomerById($id);
        Response::json($customer, 200, "Customer #{$id} 360 overview retrieved");
    }

    public function related($id) {
        $related = $this->service->getCustomerRelatedRecords($id);
        Response::json($related, 200, "Customer #{$id} related records retrieved");
    }

    public function history($id) {
        $history = AuditService::getEntityHistory('customer', $id);
        Response::json($history, 200, "Customer #{$id} audit history retrieved");
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $customer = $this->service->createCustomer($input);
        Response::json($customer, 201, 'Customer created successfully');
    }
}
