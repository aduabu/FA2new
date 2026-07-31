<?php
/**
 * FrontAccounting Enterprise REST API — Sales Controller
 */

class SalesController {
    private $service;

    public function __construct(SalesService $service) {
        $this->service = $service;
    }

    public function postInvoice() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $invoice = $this->service->postInvoice($input);
        Response::json($invoice, 201, 'Sales invoice posted successfully');
    }

    public function showInvoice($transNo) {
        $data = $this->service->getInvoice($transNo);
        Response::json($data, 200, "Sales invoice {$transNo} retrieved");
    }

    public function relatedInvoice($transNo) {
        $data = $this->service->getInvoiceRelated($transNo);
        Response::json($data, 200, "Related records for sales invoice {$transNo} retrieved");
    }

    public function showPayment($transNo) {
        $data = $this->service->getPayment($transNo);
        Response::json($data, 200, "Customer payment {$transNo} retrieved");
    }

    public function relatedPayment($transNo) {
        $data = $this->service->getPaymentRelated($transNo);
        Response::json($data, 200, "Related records for customer payment {$transNo} retrieved");
    }

    public function showBill($transNo) {
        $data = $this->service->getBill($transNo);
        Response::json($data, 200, "Supplier bill {$transNo} retrieved");
    }

    public function relatedBill($transNo) {
        $data = $this->service->getBillRelated($transNo);
        Response::json($data, 200, "Related records for supplier bill {$transNo} retrieved");
    }
}

