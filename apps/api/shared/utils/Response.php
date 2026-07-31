<?php
/**
 * FrontAccounting Enterprise REST API — Standardized JSON Response Formatter
 */

class Response {
    public static function json($data = null, $statusCode = 200, $message = 'Success', $errors = [], $meta = [], $errorCode = null) {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $executionMs = defined('REQUEST_START') ? round((microtime(true) - REQUEST_START) * 1000, 2) : 0;
        $requestId = defined('REQUEST_ID') ? REQUEST_ID : ('req_' . substr(md5(microtime()), 0, 12));

        $response = [
            'success' => $statusCode >= 200 && $statusCode < 400,
            'code' => $statusCode,
            'request_id' => $requestId,
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
            'meta' => array_merge([
                'timestamp' => date('c'),
                'execution_ms' => $executionMs,
                'api_version' => Config::get('app_version', 'v1.0.0-RC1')
            ], $meta)
        ];

        if ($errorCode !== null) {
            $response['error_code'] = $errorCode;
        }

        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit();
    }

    public static function error($message = 'Internal Server Error', $statusCode = 500, $errors = [], $errorCode = 'SERVER_ERROR') {
        self::json(null, $statusCode, $message, $errors, [], $errorCode);
    }
}
