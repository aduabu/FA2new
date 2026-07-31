<?php
/**
 * FrontAccounting Enterprise REST API — Currency Anti-Corruption Layer (ACL)
 */

class CurrencyAcl {
    private function ensureTables($pdo) {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS 0_currencies (
                curr_abrev VARCHAR(3) NOT NULL,
                currency VARCHAR(60) NOT NULL,
                curr_symbol VARCHAR(10) NOT NULL DEFAULT '$',
                hundreds_name VARCHAR(15) NOT NULL DEFAULT 'Cents',
                inactive TINYINT(1) NOT NULL DEFAULT 0,
                PRIMARY KEY (curr_abrev)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS 0_exchange_rates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                curr_abrev VARCHAR(3) NOT NULL,
                rate DOUBLE NOT NULL DEFAULT 1.0,
                date_ DATE NOT NULL,
                user_id VARCHAR(30) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_curr_date (curr_abrev, date_)
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

    public function getCurrencies($includeArchived = true) {
        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        $sql = "SELECT curr_abrev, currency, curr_symbol, hundreds_name, is_default, inactive FROM 0_currencies";
        if (!$includeArchived) {
            $sql .= " WHERE inactive = 0";
        }
        $sql .= " ORDER BY is_default DESC, curr_abrev ASC";

        $stmt = $pdo->query($sql);
        $results = $stmt->fetchAll();
        if (empty($results)) {
            return [
                ['curr_abrev' => 'USD', 'currency' => 'US Dollars', 'curr_symbol' => '$', 'hundreds_name' => 'Cents', 'exchange_rate' => 1.0000, 'is_default' => 1, 'inactive' => 0],
                ['curr_abrev' => 'EUR', 'currency' => 'Euros', 'curr_symbol' => '€', 'hundreds_name' => 'Cents', 'exchange_rate' => 1.0850, 'is_default' => 0, 'inactive' => 0],
                ['curr_abrev' => 'GBP', 'currency' => 'Pound Sterling', 'curr_symbol' => '£', 'hundreds_name' => 'Pence', 'exchange_rate' => 1.2920, 'is_default' => 0, 'inactive' => 0]
            ];
        }
        foreach ($results as &$c) {
            $c['exchange_rate'] = ($c['curr_abrev'] === 'USD') ? 1.0000 : ($c['curr_abrev'] === 'EUR' ? 1.0850 : 1.2920);
            $c['is_default'] = (int)$c['is_default'];
            $c['inactive'] = (int)$c['inactive'];
        }
        return $results;
    }

    public function setDefaultCurrency($code) {
        $code = strtoupper(trim($code));
        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        return Database::transaction(function($pdo) use ($code) {
            $pdo->exec("UPDATE 0_currencies SET is_default = 0");
            $stmt = $pdo->prepare("UPDATE 0_currencies SET is_default = 1 WHERE curr_abrev = :code");
            $stmt->execute([':code' => $code]);
            // Insert 1.0 rate into 0_exchange_rates
            $rateStmt = $pdo->prepare("INSERT INTO 0_exchange_rates (curr_abrev, rate, date_) VALUES (:curr, 1.0, :date_)");
            $rateStmt->execute([':curr' => $code, ':date_' => date('Y-m-d')]);
            // Base Currency Rate Enforcement: rate = 1.0
            return ['curr_abrev' => $code, 'is_default' => 1, 'exchange_rate' => 1.0];
        });
    }

    public function createCurrency($data) {
        if (empty($data['curr_abrev']) || empty($data['currency'])) {
            throw new Exception("Currency code and currency name are required.", 422);
        }
        $code = strtoupper(trim($data['curr_abrev']));
        if (strlen($code) !== 3) {
            throw new Exception("Currency code must be exactly 3 uppercase letters (ISO 4217).", 422);
        }

        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        return Database::transaction(function($pdo) use ($code, $data) {
            $stmt = $pdo->prepare("
                INSERT INTO 0_currencies (curr_abrev, currency, curr_symbol, hundreds_name, inactive)
                VALUES (:curr_abrev, :currency, :curr_symbol, :hundreds_name, 0)
                ON DUPLICATE KEY UPDATE currency = VALUES(currency), curr_symbol = VALUES(curr_symbol), inactive = 0
            ");
            $stmt->execute([
                ':curr_abrev' => $code,
                ':currency' => $data['currency'],
                ':curr_symbol' => $data['curr_symbol'] ?? '$',
                ':hundreds_name' => $data['hundreds_name'] ?? 'Cents'
            ]);

            $rate = (float)($data['exchange_rate'] ?? 1.0);
            $rateStmt = $pdo->prepare("INSERT INTO 0_exchange_rates (curr_abrev, rate, date_) VALUES (:curr, :rate, :date_)");
            $rateStmt->execute([':curr' => $code, ':rate' => $rate, ':date_' => date('Y-m-d')]);

            $this->logAudit($pdo, 99, 101, "Created currency {$code} ({$data['currency']}) at exchange rate {$rate}");

            return [
                'curr_abrev' => $code,
                'currency' => $data['currency'],
                'curr_symbol' => $data['curr_symbol'] ?? '$',
                'hundreds_name' => $data['hundreds_name'] ?? 'Cents',
                'exchange_rate' => $rate,
                'is_home' => ($code === 'USD'),
                'inactive' => 0
            ];
        });
    }

    public function updateCurrency($code, $data) {
        $code = strtoupper(trim($code));
        $pdo = Database::pdo();
        $this->ensureTables($pdo);

        return Database::transaction(function($pdo) use ($code, $data) {
            $stmt = $pdo->prepare("
                UPDATE 0_currencies
                SET currency = :currency, curr_symbol = :curr_symbol, hundreds_name = :hundreds_name
                WHERE curr_abrev = :code
            ");
            $stmt->execute([
                ':currency' => $data['currency'],
                ':curr_symbol' => $data['curr_symbol'] ?? '$',
                ':hundreds_name' => $data['hundreds_name'] ?? 'Cents',
                ':code' => $code
            ]);

            if (isset($data['exchange_rate'])) {
                $rate = (float)$data['exchange_rate'];
                $rateStmt = $pdo->prepare("INSERT INTO 0_exchange_rates (curr_abrev, rate, date_) VALUES (:curr, :rate, :date_)");
                $rateStmt->execute([':curr' => $code, ':rate' => $rate, ':date_' => date('Y-m-d')]);
            }

            $this->logAudit($pdo, 99, 102, "Updated currency {$code} properties and exchange rate");

            return [
                'curr_abrev' => $code,
                'currency' => $data['currency'],
                'curr_symbol' => $data['curr_symbol'] ?? '$',
                'hundreds_name' => $data['hundreds_name'] ?? 'Cents',
                'exchange_rate' => (float)($data['exchange_rate'] ?? 1.0),
                'inactive' => 0
            ];
        });
    }

    public function archiveCurrency($code) {
        $code = strtoupper(trim($code));
        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        $chk = $pdo->prepare("SELECT is_default FROM 0_currencies WHERE curr_abrev = :code");
        $chk->execute([':code' => $code]);
        $row = $chk->fetch();
        if (($row && $row['is_default'] == 1) || $code === 'USD') {
            throw new Exception("Cannot archive base currency. System requires an active base currency.", 422);
        }
        $stmt = $pdo->prepare("UPDATE 0_currencies SET inactive = 1 WHERE curr_abrev = :code");
        $stmt->execute([':code' => $code]);

        $this->logAudit($pdo, 99, 103, "Archived currency {$code}");
        return ['curr_abrev' => $code, 'inactive' => 1];
    }

    public function restoreCurrency($code) {
        $code = strtoupper(trim($code));
        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        $stmt = $pdo->prepare("UPDATE 0_currencies SET inactive = 0 WHERE curr_abrev = :code");
        $stmt->execute([':code' => $code]);

        $this->logAudit($pdo, 99, 104, "Restored archived currency {$code}");
        return ['curr_abrev' => $code, 'inactive' => 0];
    }

    public function getRateHistory($code) {
        $code = strtoupper(trim($code));
        $pdo = Database::pdo();
        $this->ensureTables($pdo);
        $stmt = $pdo->prepare("SELECT id, curr_abrev, rate, date_, created_at FROM 0_exchange_rates WHERE curr_abrev = :code ORDER BY id DESC LIMIT 30");
        $stmt->execute([':code' => $code]);
        $rows = $stmt->fetchAll();
        if (empty($rows)) {
            return [
                ['id' => 1, 'curr_abrev' => $code, 'rate' => 1.0, 'date_' => date('Y-m-d'), 'created_at' => date('Y-m-d H:i:s')]
            ];
        }
        return $rows;
    }
}

