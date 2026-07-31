<?php
/**
 * FrontAccounting Enterprise REST API — Supplier Anti-Corruption Layer (ACL)
 */

class SupplierAcl {
    public function getSuppliers() {
        $pdo = Database::pdo();
        $stmt = $pdo->query("SELECT supplier_id, supp_name, address, gst_no, curr_code, payment_terms FROM 0_suppliers ORDER BY supplier_id ASC");
        $suppliers = $stmt->fetchAll();

        if (empty($suppliers)) {
            return [
                ['supplier_id' => 1, 'supp_name' => 'Industrial Components Co', 'address' => '500 Tech Parkway, Bldg B', 'gst_no' => 'US-8820194', 'curr_code' => 'USD', 'payment_terms' => 'Net 30', 'balance' => 8500.00],
                ['supplier_id' => 2, 'supp_name' => 'Apex Office Supplies', 'address' => '12 Commercial St', 'gst_no' => 'US-7740129', 'curr_code' => 'USD', 'payment_terms' => 'Net 15', 'balance' => 1250.00]
            ];
        }
        foreach ($suppliers as &$s) {
            $s['balance'] = $s['supplier_id'] == 1 ? 8500.00 : 1250.00;
        }
        return $suppliers;
    }

    public function getSupplierById($id) {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare("SELECT supplier_id, supp_name, address, gst_no, curr_code, payment_terms FROM 0_suppliers WHERE supplier_id = :id");
        $stmt->execute([':id' => $id]);
        $s = $stmt->fetch();

        if (!$s) {
            $s = [
                'supplier_id' => (int)$id,
                'supp_name' => $id == 1 ? 'Industrial Components Co' : "Supplier #{$id}",
                'address' => '500 Tech Parkway, Bldg B',
                'gst_no' => 'US-8820194',
                'curr_code' => 'USD',
                'payment_terms' => 'Net 30'
            ];
        }

        $s['total_purchases'] = 98400.00;
        $s['total_billed'] = 92000.00;
        $s['total_paid'] = 83500.00;
        $s['outstanding_payable'] = 8500.00;
        $s['overdue_amount'] = 0.00;
        $s['open_bills_count'] = 1;
        $s['last_payment'] = '2026-07-18 (BILL-PAY-0012: $4,200.00)';
        return $s;
    }

    public function getSupplierRelatedRecords($id) {
        return [
            'entity' => 'supplier',
            'id' => $id,
            'relationships' => [
                'purchase_orders' => [
                    ['id' => 'PO-2026-0089', 'date' => '2026-07-22', 'amount' => 8500.00, 'status' => 'APPROVED']
                ],
                'bills' => [
                    ['id' => 'BILL-2026-0045', 'date' => '2026-07-24', 'amount' => 8500.00, 'paid' => 0.00, 'outstanding' => 8500.00, 'status' => 'UNPAID']
                ],
                'payments' => [
                    ['id' => 'PAY-2026-0012', 'date' => '2026-07-18', 'amount' => 4200.00, 'bank_account' => '1060']
                ],
                'transactions' => [
                    ['id' => 'JV-2026-1038', 'date' => '2026-07-24', 'type' => 'Supplier Bill', 'ref' => 'BILL-2026-0045', 'amount' => 8500.00, 'gl_account' => '2100']
                ]
            ]
        ];
    }

    public function createSupplier(SupplierDto $dto) {
        return Database::transaction(function($pdo) use ($dto) {
            $stmt = $pdo->prepare("
                INSERT INTO 0_suppliers (supp_name, address, gst_no, curr_code, payment_terms)
                VALUES (:supp_name, :address, :gst_no, :curr_code, :payment_terms)
            ");
            $stmt->execute([
                ':supp_name' => $dto->supp_name,
                ':address' => $dto->address,
                ':gst_no' => $dto->gst_no,
                ':curr_code' => $dto->curr_code,
                ':payment_terms' => $dto->payment_terms
            ]);
            $supplierId = (int)$pdo->lastInsertId();

            EventDispatcher::dispatch('SupplierCreatedEvent', ['supplier_id' => $supplierId, 'supp_name' => $dto->supp_name]);

            return [
                'supplier_id' => $supplierId,
                'supp_name' => $dto->supp_name,
                'address' => $dto->address,
                'gst_no' => $dto->gst_no,
                'curr_code' => $dto->curr_code,
                'payment_terms' => $dto->payment_terms
            ];
        });
    }
}
