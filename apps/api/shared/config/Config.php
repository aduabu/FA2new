<?php
/**
 * FrontAccounting Enterprise REST API — Shared Centralized Configuration
 * Handles Environment, Database, Redis, JWT Secrets, Logging & Feature Flags
 */

class Config {
    private static $settings = [];

    public static function init() {
        self::$settings = [
            'app_env' => getenv('APP_ENV') ?: 'development',
            'app_debug' => getenv('APP_DEBUG') === 'true',
            'app_version' => getenv('APP_VERSION') ?: 'v1.0.0-RC1',
            'app_commit' => getenv('APP_GIT_COMMIT') ?: 'c88aa07',

            // Database Settings
            'db_host' => getenv('DB_HOST') ?: 'mysql',
            'db_port' => getenv('DB_PORT') ?: '3306',
            'db_name' => getenv('DB_NAME') ?: 'frontacct',
            'db_user' => getenv('DB_USER') ?: 'fa_user',
            'db_pass' => getenv('DB_PASS') ?: 'fa_password',
            'db_prefix' => getenv('DB_PREFIX') ?: '0_',

            // Redis Settings
            'redis_host' => getenv('REDIS_HOST') ?: 'redis',
            'redis_port' => getenv('REDIS_PORT') ?: '6379',
            'redis_pass' => getenv('REDIS_PASSWORD') ?: '',

            // JWT Security Settings
            'jwt_secret' => getenv('JWT_SECRET') ?: 'fa_enterprise_dev_secret_key_change_in_production_2026',
            'jwt_expiration_hours' => (int)(getenv('JWT_EXPIRATION_HOURS') ?: 8),

            // Feature Flags
            'feature_flags' => [
                'enable_ai_advisory' => getenv('AI_ENGINE_ENABLED') === 'true',
                'enable_ocr_bill_parsing' => true,
                'enable_redis_workers' => true,
                'enable_zatca_einvoicing' => true,
                'manufacturing_enabled' => true,
                'fixed_assets_enabled' => true,
                'plugin_sdk_enabled' => true,
                'multi_tenant_enabled' => true
            ]
        ];
    }

    public static function get($key, $default = null) {
        if (empty(self::$settings)) {
            self::init();
        }
        return self::$settings[$key] ?? $default;
    }
}
