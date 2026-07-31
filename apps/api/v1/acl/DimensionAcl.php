<?php
/**
 * FrontAccounting Enterprise REST API — Dimension Anti-Corruption Layer (ACL)
 */

class DimensionAcl {
    private function ensureTable($pdo) {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS 0_dimensions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reference VARCHAR(60) NOT NULL,
                name VARCHAR(60) NOT NULL,
                type_ TINYINT(1) NOT NULL DEFAULT 1,
                date_ DATE NOT NULL,
                due_ DATE NOT NULL,
                closed TINYINT(1) NOT NULL DEFAULT 0,
                inactive TINYINT(1) NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
        try {
            $pdo->exec("ALTER TABLE 0_dimensions ADD COLUMN inactive TINYINT(1) NOT NULL DEFAULT 0;");
        } catch (Exception $e) {
            // Ignore if column exists
        }
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
            // Ignore audit trail exception
        }
    }

    public function getDimensions($includeArchived = true) {
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $sql = "SELECT id, reference, name, type_, date_, due_, closed, inactive FROM 0_dimensions";
        if (!$includeArchived) {
            $sql .= " WHERE closed = 0 AND inactive = 0";
        }
        $sql .= " ORDER BY id ASC";

        $stmt = $pdo->query($sql);
        $results = $stmt->fetchAll();
        if (empty($results)) {
            return [
                ['id' => 1, 'reference' => 'DIM-COST-01', 'name' => 'North America Sales Division', 'type_' => 1, 'date_' => '2026-01-01', 'due_' => '2026-12-31', 'closed' => 0, 'inactive' => 0],
                ['id' => 2, 'reference' => 'DIM-COST-02', 'name' => 'EMEA Operations & Logistics', 'type_' => 1, 'date_' => '2026-01-01', 'due_' => '2026-12-31', 'closed' => 0, 'inactive' => 0]
            ];
        }
        foreach ($results as &$d) {
            $d['id'] = (int)$d['id'];
            $d['closed'] = (int)$d['closed'];
            $d['inactive'] = (int)($d['inactive'] ?? $d['closed']);
        }
        return $results;
    }

    public function createDimension($data) {
        if (empty($data['reference']) || empty($data['name'])) {
            throw new Exception("Dimension reference code and name are required.", 422);
        }

        $pdo = Database::pdo();
        $this->ensureTable($pdo);

        return Database::transaction(function($pdo) use ($data) {
            $stmt = $pdo->prepare("
                INSERT INTO 0_dimensions (reference, name, type_, date_, due_, closed, inactive)
                VALUES (:reference, :name, 1, :date_, :due_, 0, 0)
            ");
            $stmt->execute([
                ':reference' => strtoupper(trim($data['reference'])),
                ':name' => trim($data['name']),
                ':date_' => $data['date_'] ?? date('Y-m-d'),
                ':due_' => $data['due_'] ?? date('Y-m-d', strtotime('+1 year'))
            ]);
            $id = (int)$pdo->lastInsertId();

            $this->logAudit($pdo, 97, $id, "Created Cost Center Dimension #{$id} '{$data['reference']}' ({$data['name']})");

            return [
                'id' => $id,
                'reference' => strtoupper(trim($data['reference'])),
                'name' => trim($data['name']),
                'type_' => 1,
                'date_' => $data['date_'] ?? date('Y-m-d'),
                'due_' => $data['due_'] ?? date('Y-m-d', strtotime('+1 year')),
                'closed' => 0,
                'inactive' => 0
            ];
        });
    }

    public function updateDimension($id, $data) {
        $id = (int)$id;
        if (empty($data['reference']) || empty($data['name'])) {
            throw new Exception("Dimension reference code and name are required.", 422);
        }

        $pdo = Database::pdo();
        $this->ensureTable($pdo);

        return Database::transaction(function($pdo) use ($id, $data) {
            // Validate code uniqueness
            $chk = $pdo->prepare("SELECT id FROM 0_dimensions WHERE reference = :ref AND id != :id");
            $chk->execute([':ref' => strtoupper(trim($data['reference'])), ':id' => $id]);
            if ($chk->fetch()) {
                throw new Exception("Dimension reference code '{$data['reference']}' is already in use.", 422);
            }

            $stmt = $pdo->prepare("
                UPDATE 0_dimensions
                SET reference = :reference, name = :name, date_ = :date_, due_ = :due_
                WHERE id = :id
            ");
            $stmt->execute([
                ':reference' => strtoupper(trim($data['reference'])),
                ':name' => trim($data['name']),
                ':date_' => $data['date_'] ?? date('Y-m-d'),
                ':due_' => $data['due_'] ?? date('Y-m-d', strtotime('+1 year')),
                ':id' => $id
            ]);

            $this->logAudit($pdo, 97, $id, "Updated Dimension #{$id} code to '{$data['reference']}' and name to '{$data['name']}'");

            return [
                'id' => $id,
                'reference' => strtoupper(trim($data['reference'])),
                'name' => trim($data['name']),
                'type_' => 1,
                'date_' => $data['date_'] ?? date('Y-m-d'),
                'due_' => $data['due_'] ?? date('Y-m-d', strtotime('+1 year')),
                'closed' => 0,
                'inactive' => 0
            ];
        });
    }

    public function archiveDimension($id) {
        $id = (int)$id;
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $stmt = $pdo->prepare("UPDATE 0_dimensions SET closed = 1, inactive = 1 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $this->logAudit($pdo, 97, $id, "Archived Dimension #{$id}");
        return ['id' => $id, 'closed' => 1, 'inactive' => 1];
    }

    public function restoreDimension($id) {
        $id = (int)$id;
        $pdo = Database::pdo();
        $this->ensureTable($pdo);
        $stmt = $pdo->prepare("UPDATE 0_dimensions SET closed = 0, inactive = 0 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $this->logAudit($pdo, 97, $id, "Restored archived Dimension #{$id}");
        return ['id' => $id, 'closed' => 0, 'inactive' => 0];
    }
}

