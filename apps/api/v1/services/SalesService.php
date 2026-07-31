<?php
/**
 * FrontAccounting Enterprise REST API — Sales Application Service
 */

class SalesService {
    private $acl;

    public function __construct(SalesAcl $acl) {
        $this->acl = $acl;
    }

    public function postInvoice(array $inputData) {
        $dto = new SalesInvoiceDto($inputData);
        $errors = InvoiceValidator::validate($dto);

        if (!empty($errors)) {
            Response::json(null, 400, 'Validation Error', $errors);
        }

        return $this->acl->postInvoice($dto);
    }

    public function getInvoice($transNo) {
        return $this->acl->getInvoiceByTransNo($transNo);
    }

    public function getInvoiceRelated($transNo) {
        return $this->acl->getInvoiceRelatedRecords($transNo);
    }

    public function getPayment($transNo) {
        return $this->acl->getPaymentByTransNo($transNo);
    }

    public function getPaymentRelated($transNo) {
        return $this->acl->getPaymentRelatedRecords($transNo);
    }

    public function getBill($transNo) {
        return $this->acl->getBillByTransNo($transNo);
    }

    public function getBillRelated($transNo) {
        return $this->acl->getBillRelatedRecords($transNo);
    }
}

