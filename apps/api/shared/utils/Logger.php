<?php
/**
 * FrontAccounting Enterprise REST API — Logger & Audit Trail Helper
 */

class Logger {
    public static function log($level, $message, array $context = []) {
        $logPath = VARLOG_PATH . '/api_requests.log';
        $logEntry = sprintf(
            "[%s] [%s] %s %s\n",
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $message,
            !empty($context) ? json_encode($context) : ''
        );
        @file_put_contents($logPath, $logEntry, FILE_APPEND);
    }

    public static function info($message, array $context = []) {
        self::log('INFO', $message, $context);
    }

    public static function error($message, array $context = []) {
        self::log('ERROR', $message, $context);
    }
}
