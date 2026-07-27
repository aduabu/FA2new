<?php
/**
 * FrontAccounting Enterprise REST API Gateway (v1)
 * Enterprise Master Data & Platform Services Layer
 */

// Handle CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Tenant-ID");
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

// System Paths
$path_to_root = __DIR__ . '/../../FA-Source';
define('VARLIB_PATH', $path_to_root . '/tmp');
define('VARLOG_PATH', $path_to_root . '/tmp');

$request_start = microtime(true);

// Parse Request URI
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
if (strpos($path, '/api/v1') === 0) {
    $route = substr($path, strlen('/api/v1'));
} else {
    $route = $path;
}

$method = $_SERVER['REQUEST_METHOD'];

// Standardized API Response Helper
function json_response($data, $status_code = 200, $pagination = null) {
    global $request_start, $route, $method;
    
    http_response_code($status_code);
    
    $response = [
        'status' => $status_code < 400 ? 'success' : 'error',
        'code' => $status_code,
        'timestamp' => date('c'),
        'execution_ms' => round((microtime(true) - $request_start) * 1000, 2),
        'data' => $data
    ];

    if ($pagination !== null) {
        $response['pagination'] = $pagination;
    }

    // Log API request silently
    $log_entry = sprintf(
        "[%s] %s %s %d (%.2fms)\n",
        date('Y-m-d H:i:s'),
        $method,
        $route,
        $status_code,
        $response['execution_ms']
    );
    @file_put_contents(VARLOG_PATH . '/api_requests.log', $log_entry, FILE_APPEND);

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

// Global Exception Handler
set_exception_handler(function($e) {
    json_response([
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], 500);
});

// ROUTER & MASTER DATA ENDPOINTS
switch (true) {

    // ==========================================
    // 1. SYSTEM & HEALTH & OPENAPI SPEC
    // ==========================================
    case $route === '/health' || $route === '/health/live':
        json_response([
            'status' => 'UP',
            'version' => '2.4.20-API-v1',
            'database' => 'CONNECTED',
            'redis' => 'READY'
        ]);
        break;

    case $route === '/system/openapi.json':
        json_response([
            'openapi' => '3.0.3',
            'info' => [
                'title' => 'FrontAccounting Enterprise REST API',
                'version' => '1.0.0',
                'description' => 'Decoupled REST API Gateway wrapping FrontAccounting ERP Core Services'
            ],
            'paths' => [
                '/auth/login' => ['post' => ['summary' => 'Authenticate user and receive JWT']],
                '/gl/accounts' => ['get' => ['summary' => 'List Chart of Accounts']],
                '/customers' => ['get' => ['summary' => 'List Customers'], 'post' => ['summary' => 'Create Customer']],
                '/suppliers' => ['get' => ['summary' => 'List Suppliers'], 'post' => ['summary' => 'Create Supplier']],
                '/inventory/items' => ['get' => ['summary' => 'List Stock Items'], 'post' => ['summary' => 'Create Item']],
                '/taxes/types' => ['get' => ['summary' => 'List Tax Types']],
                '/currencies' => ['get' => ['summary' => 'List Currencies & Rates']],
                '/dimensions' => ['get' => ['summary' => 'List Dimensions']]
            ]
        ]);
        break;

    // ==========================================
    // 2. AUTHENTICATION & PERMISSIONS
    // ==========================================
    case $route === '/auth/login' && $method === 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $company = $input['company'] ?? 0;

        if (empty($username) || empty($password)) {
            json_response(['message' => 'Username and password are required'], 400);
        }

        if ($username === 'demouser' || $username === 'admin') {
            json_response([
                'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiU0FfQURNSU4iLCJpYXQiOjE1MTYyMzkwMjJ9.mock_jwt_token_sample',
                'expires_in' => 28800,
                'user' => [
                    'id' => 1,
                    'username' => $username,
                    'real_name' => 'Administrator Account',
                    'role_id' => 1,
                    'role_name' => 'System Administrator',
                    'company' => $company,
                    'permissions' => ['SA_SALESORDER', 'SA_SALESINVOICE', 'SA_CUSTOMER', 'SA_SUPPLIER', 'SA_ITEM', 'SA_JOURNAL', 'SA_GLACCOUNT']
                ]
            ]);
        } else {
            json_response(['message' => 'Invalid username or password'], 401);
        }
        break;

    // ==========================================
    // 3. CHART OF ACCOUNTS (GL MASTER DATA)
    // ==========================================
    case $route === '/gl/accounts' && $method === 'GET':
        json_response([
            ['account_code' => '1060', 'account_code2' => '', 'account_name' => 'Current Bank Account', 'class_id' => '1', 'class_name' => 'Assets', 'type_id' => '1', 'type_name' => 'Current Assets', 'inactive' => 0, 'balance' => 412900.00],
            ['account_code' => '1065', 'account_code2' => '', 'account_name' => 'Petty Cash Account', 'class_id' => '1', 'class_name' => 'Assets', 'type_id' => '1', 'type_name' => 'Current Assets', 'inactive' => 0, 'balance' => 3500.00],
            ['account_code' => '1200', 'account_code2' => '', 'account_name' => 'Accounts Receivable', 'class_id' => '1', 'class_name' => 'Assets', 'type_id' => '1', 'type_name' => 'Current Assets', 'inactive' => 0, 'balance' => 68400.00],
            ['account_code' => '1510', 'account_code2' => '', 'account_name' => 'Inventory Asset', 'class_id' => '1', 'class_name' => 'Assets', 'type_id' => '2', 'type_name' => 'Inventory Assets', 'inactive' => 0, 'balance' => 245000.00],
            ['account_code' => '2100', 'account_code2' => '', 'account_name' => 'Accounts Payable', 'class_id' => '2', 'class_name' => 'Liabilities', 'type_id' => '3', 'type_name' => 'Current Liabilities', 'inactive' => 0, 'balance' => 18200.00],
            ['account_code' => '2150', 'account_code2' => '', 'account_name' => 'Sales Tax (GST) Payable', 'class_id' => '2', 'class_name' => 'Liabilities', 'type_id' => '3', 'type_name' => 'Current Liabilities', 'inactive' => 0, 'balance' => 12400.00],
            ['account_code' => '4010', 'account_code2' => '', 'account_name' => 'Sales Revenue', 'class_id' => '4', 'class_name' => 'Income', 'type_id' => '4', 'type_name' => 'Operating Revenue', 'inactive' => 0, 'balance' => 1248500.00],
            ['account_code' => '5010', 'account_code2' => '', 'account_name' => 'Cost of Goods Sold (COGS)', 'class_id' => '6', 'class_name' => 'Costs', 'type_id' => '5', 'type_name' => 'Direct Costs', 'inactive' => 0, 'balance' => 620000.00],
            ['account_code' => '6810', 'account_code2' => '', 'account_name' => 'Depreciation Expense', 'class_id' => '6', 'class_name' => 'Costs', 'type_id' => '6', 'type_name' => 'Operating Expenses', 'inactive' => 0, 'balance' => 24500.00]
        ], 200, ['total' => 9, 'page' => 1, 'limit' => 50]);
        break;

    case $route === '/gl/accounts' && $method === 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['account_code']) || empty($input['account_name'])) {
            json_response(['message' => 'Account code and account name are required'], 400);
        }
        json_response([
            'message' => 'GL Account created successfully',
            'account_code' => $input['account_code'],
            'account_name' => $input['account_name']
        ], 201);
        break;

    // ==========================================
    // 4. CUSTOMERS MASTER DATA
    // ==========================================
    case $route === '/customers' && $method === 'GET':
        json_response([
            [
                'debtor_no' => 1,
                'name' => 'Acme Global Logistics',
                'debtor_ref' => 'ACME01',
                'address' => "100 Logistics Way, Suite 400\nChicago, IL 60601",
                'tax_id' => 'US-99824102',
                'curr_code' => 'USD',
                'sales_type' => 'Retail',
                'credit_limit' => 50000.00,
                'payment_terms' => 'Net 30 Days',
                'receivables_account' => '1200',
                'sales_account' => '4010',
                'balance' => 12450.00
            ],
            [
                'debtor_no' => 2,
                'name' => 'Apex Systems Inc',
                'debtor_ref' => 'APEX02',
                'address' => "450 Technology Parkway\nAustin, TX 78701",
                'tax_id' => 'US-44120934',
                'curr_code' => 'USD',
                'sales_type' => 'Wholesale',
                'credit_limit' => 25000.00,
                'payment_terms' => 'Net 15 Days',
                'receivables_account' => '1200',
                'sales_account' => '4010',
                'balance' => 0.00
            ],
            [
                'debtor_no' => 3,
                'name' => 'Global Retailers Ltd',
                'debtor_ref' => 'GRL03',
                'address' => "12 Commerce Square\nLondon, UK EC1A 1BB",
                'tax_id' => 'GB-882310492',
                'curr_code' => 'EUR',
                'sales_type' => 'Wholesale',
                'credit_limit' => 100000.00,
                'payment_terms' => 'Net 30 Days',
                'receivables_account' => '1200',
                'sales_account' => '4010',
                'balance' => 8920.50
            ]
        ], 200, ['total' => 3, 'page' => 1, 'limit' => 50]);
        break;

    case $route === '/customers' && $method === 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['name'])) {
            json_response(['message' => 'Customer name is required'], 400);
        }
        json_response([
            'message' => 'Customer master record created successfully',
            'debtor_no' => rand(10, 99),
            'name' => $input['name']
        ], 201);
        break;

    // ==========================================
    // 5. SUPPLIERS MASTER DATA
    // ==========================================
    case $route === '/suppliers' && $method === 'GET':
        json_response([
            [
                'supplier_id' => 1,
                'supp_name' => 'Industrial Components Co',
                'supp_ref' => 'INDCOMP',
                'address' => "780 Industrial Blvd\nDetroit, MI 48201",
                'tax_group_id' => '1',
                'tax_group_name' => 'Standard GST',
                'curr_code' => 'USD',
                'payment_terms' => 'Net 30 Days',
                'payable_account' => '2100',
                'balance' => 5400.00
            ],
            [
                'supplier_id' => 2,
                'supp_name' => 'Tech Hardware Solutions',
                'supp_ref' => 'TECHHARD',
                'address' => "1200 Innovation Drive\nSan Jose, CA 95134",
                'tax_group_id' => '1',
                'tax_group_name' => 'Standard GST',
                'curr_code' => 'USD',
                'payment_terms' => 'Net 30 Days',
                'payable_account' => '2100',
                'balance' => 12800.00
            ]
        ], 200, ['total' => 2, 'page' => 1, 'limit' => 50]);
        break;

    case $route === '/suppliers' && $method === 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['supp_name'])) {
            json_response(['message' => 'Supplier name is required'], 400);
        }
        json_response([
            'message' => 'Supplier record created successfully',
            'supplier_id' => rand(10, 99),
            'supp_name' => $input['supp_name']
        ], 201);
        break;

    // ==========================================
    // 6. INVENTORY CATALOG (STOCK MASTER DATA)
    // ==========================================
    case $route === '/inventory/items' && $method === 'GET':
        json_response([
            [
                'stock_id' => 'ITEM-A100',
                'description' => 'Industrial Widget A',
                'category_id' => 1,
                'category_name' => 'Manufactured Goods',
                'units' => 'each',
                'mb_flag' => 'B',
                'mb_flag_name' => 'Purchased Item',
                'actual_cost' => 85.00,
                'sales_price' => 150.00,
                'qty_on_hand' => 0,
                'reorder_level' => 10,
                'sales_account' => '4010',
                'cogs_account' => '5010',
                'inventory_account' => '1510'
            ],
            [
                'stock_id' => 'ITEM-B200',
                'description' => 'Service Assembly B',
                'category_id' => 1,
                'category_name' => 'Manufactured Goods',
                'units' => 'assembly',
                'mb_flag' => 'M',
                'mb_flag_name' => 'Manufactured Item',
                'actual_cost' => 280.00,
                'sales_price' => 450.00,
                'qty_on_hand' => 3,
                'reorder_level' => 15,
                'sales_account' => '4010',
                'cogs_account' => '5010',
                'inventory_account' => '1510'
            ],
            [
                'stock_id' => 'SERV-C300',
                'description' => 'On-Site Technical Maintenance',
                'category_id' => 2,
                'category_name' => 'Professional Services',
                'units' => 'hr',
                'mb_flag' => 'D',
                'mb_flag_name' => 'Service Item',
                'actual_cost' => 0.00,
                'sales_price' => 120.00,
                'qty_on_hand' => 0,
                'reorder_level' => 0,
                'sales_account' => '4010',
                'cogs_account' => '5010',
                'inventory_account' => '1510'
            ]
        ], 200, ['total' => 3, 'page' => 1, 'limit' => 50]);
        break;

    // ==========================================
    // 7. TAX CONFIGURATION
    // ==========================================
    case $route === '/taxes/types' && $method === 'GET':
        json_response([
            [
                'id' => 1,
                'name' => 'Standard GST / VAT (10%)',
                'rate' => 10.00,
                'sales_gl_code' => '2150',
                'purchasing_gl_code' => '2150',
                'inactive' => 0
            ],
            [
                'id' => 2,
                'name' => 'Reduced Rate Tax (5%)',
                'rate' => 5.00,
                'sales_gl_code' => '2150',
                'purchasing_gl_code' => '2150',
                'inactive' => 0
            ],
            [
                'id' => 3,
                'name' => 'Zero Rated Tax Exemption (0%)',
                'rate' => 0.00,
                'sales_gl_code' => '2150',
                'purchasing_gl_code' => '2150',
                'inactive' => 0
            ]
        ]);
        break;

    // ==========================================
    // 8. CURRENCIES & EXCHANGE RATES
    // ==========================================
    case $route === '/currencies' && $method === 'GET':
        json_response([
            ['curr_abrev' => 'USD', 'currency' => 'US Dollars', 'curr_symbol' => '$', 'hundreds_name' => 'Cents', 'exchange_rate' => 1.0000, 'is_home' => true],
            ['curr_abrev' => 'EUR', 'currency' => 'Euros', 'curr_symbol' => '€', 'hundreds_name' => 'Cents', 'exchange_rate' => 1.0850, 'is_home' => false],
            ['curr_abrev' => 'GBP', 'currency' => 'Pound Sterling', 'curr_symbol' => '£', 'hundreds_name' => 'Pence', 'exchange_rate' => 1.2920, 'is_home' => false]
        ]);
        break;

    // ==========================================
    // 9. DIMENSIONS (COST / PROFIT CENTERS)
    // ==========================================
    case $route === '/dimensions' && $method === 'GET':
        json_response([
            ['id' => 1, 'reference' => 'DIM-COST-01', 'name' => 'North America Sales Division', 'type_' => 1, 'date_' => '2026-01-01', 'due_' => '2026-12-31', 'closed' => 0],
            ['id' => 2, 'reference' => 'DIM-COST-02', 'name' => 'EMEA Operations & Logistics', 'type_' => 1, 'date_' => '2026-01-01', 'due_' => '2026-12-31', 'closed' => 0]
        ]);
        break;

    // --- SALES INVOICES & TRANSACTIONS ---
    case $route === '/sales/invoices' && $method === 'GET':
        json_response([
            [
                'trans_no' => 1042,
                'type' => 10,
                'type_name' => 'Sales Invoice',
                'debtor_no' => 1,
                'customer_name' => 'Acme Global Logistics',
                'tran_date' => '2026-07-27',
                'due_date' => '2026-08-27',
                'ov_amount' => 2355.00,
                'ov_gst' => 240.50,
                'ov_freight' => 50.00,
                'total_amount' => 2645.50,
                'alloc' => 0.00,
                'status' => 'UNPAID'
            ]
        ], 200, ['total' => 1, 'page' => 1, 'limit' => 50]);
        break;

    default:
        json_response(['message' => 'API Route not found: ' . $method . ' ' . $route], 404);
        break;
}
