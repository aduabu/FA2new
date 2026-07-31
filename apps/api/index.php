<?php
/**
 * FrontAccounting Enterprise REST API Gateway (v1.0.0 GA)
 * Enterprise Platform Services, Multi-Tenant Governance, Plugin SDK & Public API
 */

define('REQUEST_START', microtime(true));

// Correlation Request ID Header & Global Definition
$requestId = 'req_' . substr(md5(uniqid(microtime(), true)), 0, 12);
define('REQUEST_ID', $requestId);
header("X-Request-ID: {$requestId}");

// Output Buffering & Strict Errors Setup
ob_start();
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

// Shutdown Hook to Catch Fatal Errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) {
            ob_clean();
        }
        $requestId = defined('REQUEST_ID') ? REQUEST_ID : 'req_unknown';
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
        header("X-Request-ID: {$requestId}");
        echo json_encode([
            'success' => false,
            'code' => 500,
            'error_code' => 'FATAL_PHP_ERROR',
            'message' => 'Fatal Server Exception: ' . $error['message'],
            'request_id' => $requestId,
            'errors' => [
                'file' => basename($error['file']),
                'line' => $error['line']
            ],
            'meta' => [
                'timestamp' => date('c'),
                'execution_ms' => defined('REQUEST_START') ? round((microtime(true) - REQUEST_START) * 1000, 2) : 0,
                'api_version' => 'v1.0.0-RC1'
            ]
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit();
    }
});

// Global Uncaught Exception Handler
set_exception_handler(function($e) {
    if (ob_get_length()) {
        @ob_clean();
    }
    $requestId = defined('REQUEST_ID') ? REQUEST_ID : 'req_unknown';
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    header("X-Request-ID: {$requestId}");
    echo json_encode([
        'success' => false,
        'code' => 500,
        'error_code' => 'UNCAUGHT_EXCEPTION',
        'message' => $e->getMessage(),
        'request_id' => $requestId,
        'errors' => [
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ],
        'meta' => [
            'timestamp' => date('c'),
            'execution_ms' => defined('REQUEST_START') ? round((microtime(true) - REQUEST_START) * 1000, 2) : 0,
            'api_version' => 'v1.0.0-RC1'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
});

// CORS Preflight Handler
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Tenant-ID, X-Request-ID");
    header("Access-Control-Expose-Headers: X-Request-ID");
    http_response_code(200);
    exit();
}

// System Root Paths
$path_to_root = __DIR__ . '/../../FA-Source';
define('VARLIB_PATH', $path_to_root . '/tmp');
define('VARLOG_PATH', $path_to_root . '/tmp');

// Load Shared Infrastructure
require_once __DIR__ . '/shared/config/Config.php';
require_once __DIR__ . '/shared/utils/Response.php';
require_once __DIR__ . '/shared/utils/Database.php';
require_once __DIR__ . '/shared/utils/Logger.php';
require_once __DIR__ . '/shared/utils/EventDispatcher.php';
require_once __DIR__ . '/shared/middleware/AuthMiddleware.php';

// Load Shared AI Router & Provider Abstraction
require_once __DIR__ . '/shared/ai/AIConfig.php';
require_once __DIR__ . '/shared/ai/GeminiProviderAdapter.php';
require_once __DIR__ . '/shared/ai/GeminiCapabilityRouter.php';

// Initialize System Config
Config::init();

// Load v1 DTOs
require_once __DIR__ . '/v1/dtos/CustomerDto.php';
require_once __DIR__ . '/v1/dtos/SupplierDto.php';
require_once __DIR__ . '/v1/dtos/InventoryItemDto.php';
require_once __DIR__ . '/v1/dtos/GLAccountDto.php';
require_once __DIR__ . '/v1/dtos/SalesInvoiceDto.php';
require_once __DIR__ . '/v1/dtos/JournalEntryDto.php';

// Load v1 Validators
require_once __DIR__ . '/v1/validators/CustomerValidator.php';
require_once __DIR__ . '/v1/validators/SupplierValidator.php';
require_once __DIR__ . '/v1/validators/InventoryValidator.php';
require_once __DIR__ . '/v1/validators/InvoiceValidator.php';
require_once __DIR__ . '/v1/validators/JournalValidator.php';

// Load v1 ACL Domain Adapters
require_once __DIR__ . '/v1/acl/CustomerAcl.php';
require_once __DIR__ . '/v1/acl/SupplierAcl.php';
require_once __DIR__ . '/v1/acl/InventoryAcl.php';
require_once __DIR__ . '/v1/acl/GLAcl.php';
require_once __DIR__ . '/v1/acl/SalesAcl.php';
require_once __DIR__ . '/v1/acl/ReportAcl.php';
require_once __DIR__ . '/v1/acl/CurrencyAcl.php';
require_once __DIR__ . '/v1/acl/TaxAcl.php';
require_once __DIR__ . '/v1/acl/DimensionAcl.php';

// Load v1 Repositories
require_once __DIR__ . '/v1/repositories/CustomerRepository.php';
require_once __DIR__ . '/v1/repositories/SupplierRepository.php';
require_once __DIR__ . '/v1/repositories/InventoryRepository.php';
require_once __DIR__ . '/v1/repositories/GLRepository.php';
require_once __DIR__ . '/v1/repositories/ReportRepository.php';

// Load v1 Services
require_once __DIR__ . '/v1/services/CustomerService.php';
require_once __DIR__ . '/v1/services/SupplierService.php';
require_once __DIR__ . '/v1/services/InventoryService.php';
require_once __DIR__ . '/v1/services/GLService.php';
require_once __DIR__ . '/v1/services/SalesService.php';
require_once __DIR__ . '/v1/services/ReportService.php';

// Load v1 Controllers
require_once __DIR__ . '/v1/controllers/SystemController.php';
require_once __DIR__ . '/v1/controllers/CustomerController.php';
require_once __DIR__ . '/v1/controllers/SupplierController.php';
require_once __DIR__ . '/v1/controllers/InventoryController.php';
require_once __DIR__ . '/v1/controllers/GLController.php';
require_once __DIR__ . '/v1/controllers/SalesController.php';
require_once __DIR__ . '/v1/controllers/ReportController.php';

// Load v1 Router
require_once __DIR__ . '/v1/routes.php';

// Parse Request URI & Dispatch Version Router
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

if (strpos($path, '/api/v1') === 0) {
    $route = substr($path, strlen('/api/v1'));
} else {
    $route = $path;
}

$method = $_SERVER['REQUEST_METHOD'];

// Read & Cache RAW Input Stream before routing
$GLOBALS['RAW_INPUT'] = file_get_contents('php://input');

// Dispatch to Version 1 Router
V1Router::dispatch($route, $method);
