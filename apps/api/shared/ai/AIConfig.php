<?php
/**
 * FrontAccounting Enterprise REST API — Dynamic AI Configuration Engine
 * Manages capability-to-model mappings, safety policies, and generation settings.
 */

class AIConfig {
    private static $defaultCapabilities = [
        'FAST' => [
            'id' => 'FAST',
            'label' => 'Fast Response & High Throughput',
            'description' => 'Optimized for rapid transaction queries and quick ledger lookups',
            'env_var' => 'GEMINI_MODEL_FAST'
        ],
        'REASONING' => [
            'id' => 'REASONING',
            'label' => 'Advanced Financial Reasoning',
            'description' => 'Deep multi-step accounting variance & ledger reconciliation analysis',
            'env_var' => 'GEMINI_MODEL_REASONING'
        ],
        'LONG_CONTEXT' => [
            'id' => 'LONG_CONTEXT',
            'label' => 'Long Context Audit',
            'description' => 'Scans large transaction streams and historical audit trails',
            'env_var' => 'GEMINI_MODEL_LONG_CONTEXT'
        ],
        'FINANCIAL_ANALYSIS' => [
            'id' => 'FINANCIAL_ANALYSIS',
            'label' => 'Deep Financial Analysis',
            'description' => 'Executes comprehensive ratio analysis, cash flow forecasting, and OCR parsing',
            'env_var' => 'GEMINI_MODEL_FINANCIAL'
        ]
    ];

    public static function getCapabilities() {
        return array_values(self::$defaultCapabilities);
    }

    public static function getModelForCapability($capabilityId) {
        $capKey = strtoupper($capabilityId);

        // Check Database configuration
        try {
            $pdo = Database::pdo();
            $stmt = $pdo->prepare("SELECT config_value FROM 0_ai_config WHERE config_key = :key");
            $stmt->execute([':key' => "capability_{$capKey}"]);
            $row = $stmt->fetch();
            if (!empty($row['config_value'])) {
                return trim($row['config_value']);
            }
        } catch (Exception $e) {
            // DB fallback
        }

        // Check Environment Variable
        if (isset(self::$defaultCapabilities[$capKey])) {
            $envVar = self::$defaultCapabilities[$capKey]['env_var'];
            $envVal = getenv($envVar);
            if (!empty($envVal)) {
                return trim($envVal);
            }
        }

        // Global Fallback Env Var
        $globalDefault = getenv('GEMINI_DEFAULT_MODEL');
        if (!empty($globalDefault)) {
            return trim($globalDefault);
        }

        // System Configuration Property
        return Config::get('ai_model_default') ?: 'gemini-1.5-flash';
    }

    public static function getSettings() {
        $settings = [
            'temperature' => 0.2,
            'max_output_tokens' => 2048,
            'system_prompt' => 'You are an expert enterprise ERP financial AI assistant integrated with FrontAccounting.',
            'streaming' => false,
            'retry_attempts' => 3
        ];

        try {
            $pdo = Database::pdo();
            $stmt = $pdo->query("SELECT config_key, config_value FROM 0_ai_config WHERE config_key LIKE 'setting_%'");
            $rows = $stmt->fetchAll();
            foreach ($rows as $r) {
                $key = substr($r['config_key'], strlen('setting_'));
                $settings[$key] = is_numeric($r['config_value']) ? (float)$r['config_value'] : $r['config_value'];
            }
        } catch (Exception $e) {}

        return $settings;
    }

    public static function updateSetting($key, $value) {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare("
            INSERT INTO 0_ai_config (config_key, config_value)
            VALUES (:key, :val)
            ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
        ");
        $stmt->execute([':key' => $key, ':val' => (string)$value]);
    }
}
