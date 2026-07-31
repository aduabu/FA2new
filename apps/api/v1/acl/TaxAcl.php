<?php
/**
 * FrontAccounting Enterprise REST API — Tax Configuration Anti-Corruption Layer (ACL)
 */

class TaxAcl {
    private function ensureTable($pdo) {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS 0_tax_types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                rate DOUBLE NOT NULL DEFAULT 0,
                sales_gl_code VARCHAR(15) NOT NULL DEFAULT '2150',
                purchasing_gl_code VARCHAR(15) NOT NULL DEFAULT '2150',
                inactive TINYINT(1) NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }

    private function logAudit($pdo, $type, $transNo, $desc) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO 0_audit_trail (type, trans_no, user, stamp, description)
                VALUES (:type, :trans_no, :user, :stamp, :description)
            ");
            $stmt->execute([
                ':type' => $type,
                ':trans_no' => $transNo,
                ':user' => 'admin',
                ':stamp' => date('Y-m-d H:i:s'),
                ':description' => $desc
            ]);
        } catch (Exception $e) {
            // Ignore audit trail logging exceptions if table does not exist
        }
    }

    public function getTaxTypes($includeArchived = true) {
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $sql = "SELECT id, name, rate, sales_gl_code, purchasing_gl_code, inactive FROM 0_tax_types";
        if (!$includeArchived) {
            $sql .= " WHERE inactive = 0";
        }
        $sql .= " ORDER BY id ASC";

        $stmt = $pdo->query($sql);
        $results = $stmt->fetchAll();
        if (empty($results)) {
            return [
                ['id' => 1, 'name' => 'Standard GST / VAT (10%)', 'rate' => 10.00, 'sales_gl_code' => '2150', 'purchasing_gl_code' => '2150', 'inactive' => 0],
                ['id' => 2, 'name' => 'Reduced Rate Tax (5%)', 'rate' => 5.00, 'sales_gl_code' => '2150', 'purchasing_gl_code' => '2150', 'inactive' => 0],
                ['id' => 3, 'name' => 'Zero Rated Tax Exemption (0%)', 'rate' => 0.00, 'sales_gl_code' => '2150', 'purchasing_gl_code' => '2150', 'inactive' => 0]
            ];
        }
        foreach ($results as &$t) {
            $t['id'] = (int)$t['id'];
            $t['rate'] = (float)$t['rate'];
            $t['inactive'] = (int)$t['inactive'];
        }
        return $results;
    }

    public function createTaxType($data) {
        if (empty($data['name'])) {
            throw new Exception("Tax name is required.", 422);
        }

        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        return Database::transaction(function($pdo) use ($data) {
            $stmt = $pdo->prepare("
                INSERT INTO 0_tax_types (name, rate, sales_gl_code, purchasing_gl_code, inactive)
                VALUES (:name, :rate, :sales_gl_code, :purchasing_gl_code, 0)
            ");
            $stmt->execute([
                ':name' => $data['name'],
                ':rate' => (float)$data['rate'],
                ':sales_gl_code' => $data['sales_gl_code'] ?? '2150',
                ':purchasing_gl_code' => $data['purchasing_gl_code'] ?? '2150'
            ]);
            $id = (int)$pdo->lastInsertId();

            $this->logAudit($pdo, 98, $id, "Created Tax Type #{$id} '{$data['name']}' at rate {$data['rate']}%");

            return [
                'id' => $id,
                'name' => $data['name'],
                'rate' => (float)$data['rate'],
                'sales_gl_code' => $data['sales_gl_code'] ?? '2150',
                'purchasing_gl_code' => $data['purchasing_gl_code'] ?? '2150',
                'inactive' => 0
            ];
        });
    }

    public function updateTaxType($id, $data) {
        $id = (int)$id;
        if (empty($data['name'])) {
            throw new Exception("Tax name is required.", 422);
        }

        $pdo = Database::pdo();
        $this->ensureTable($pdo);

        return Database::transaction(function($pdo) use ($id, $data) {
            $stmt = $pdo->prepare("
                UPDATE 0_tax_types
                SET name = :name, rate = :rate, sales_gl_code = :sales_gl_code, purchasing_gl_code = :purchasing_gl_code
                WHERE id = :id
            ");
            $stmt->execute([
                ':name' => $data['name'],
                ':rate' => (float)$data['rate'],
                ':sales_gl_code' => $data['sales_gl_code'] ?? '2150',
                ':purchasing_gl_code' => $data['purchasing_gl_code'] ?? '2150',
                ':id' => $id
            ]);

            $this->logAudit($pdo, 98, $id, "Updated Tax Type #{$id} '{$data['name']}' properties");

            return [
                'id' => $id,
                'name' => $data['name'],
                'rate' => (float)$data['rate'],
                'sales_gl_code' => $data['sales_gl_code'] ?? '2150',
                'purchasing_gl_code' => $data['purchasing_gl_code'] ?? '2150',
                'inactive' => 0
            ];
        });
    }

    public function archiveTaxType($id) {
        $id = (int)$id;
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $stmt = $pdo->prepare("UPDATE 0_tax_types SET inactive = 1 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $this->logAudit($pdo, 98, $id, "Archived Tax Type #{$id}");
        return ['id' => $id, 'inactive' => 1];
    }

    public function restoreTaxType($id) {
        $id = (int)$id;
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $stmt = $pdo->prepare("UPDATE 0_tax_types SET inactive = 0 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $this->logAudit($pdo, 98, $id, "Restored archived Tax Type #{$id}");
        return ['id' => $id, 'inactive' => 0];
    }
}

