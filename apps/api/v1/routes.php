<?php
/**
 * FrontAccounting Enterprise REST API — Version 1 Router & Dependency Injector
 */

class V1Router {
    public static function dispatch($route, $method) {
        $userContext = AuthMiddleware::handle();

        // Instantiate ACL Adapters
        $customerAcl = new CustomerAcl();
        $supplierAcl = new SupplierAcl();
        $inventoryAcl = new InventoryAcl();
        $glAcl = new GLAcl();
        $salesAcl = new SalesAcl();
        $reportAcl = new ReportAcl();
        $currencyAcl = new CurrencyAcl();
        $taxAcl = new TaxAcl();
        $dimensionAcl = new DimensionAcl();

        // Instantiate Repositories
        $customerRepo = new CustomerRepository($customerAcl);
        $supplierRepo = new SupplierRepository($supplierAcl);
        $inventoryRepo = new InventoryRepository($inventoryAcl);
        $glRepo = new GLRepository($glAcl);
        $reportRepo = new ReportRepository($reportAcl);

        // Instantiate Services
        $customerService = new CustomerService($customerRepo);
        $supplierService = new SupplierService($supplierRepo);
        $inventoryService = new InventoryService($inventoryRepo);
        $glService = new GLService($glRepo);
        $salesService = new SalesService($salesAcl);
        $reportService = new ReportService($reportRepo);

        // Instantiate Controllers
        $systemCtrl = new SystemController();
        $customerCtrl = new CustomerController($customerService);
        $supplierCtrl = new SupplierController($supplierService);
        $inventoryCtrl = new InventoryController($inventoryService);
        $glCtrl = new GLController($glService);
        $salesCtrl = new SalesController($salesService);
        $reportCtrl = new ReportController($reportService);

        // Parse Request Payload safely
        $rawBody = $GLOBALS['RAW_INPUT'] ?? file_get_contents('php://input');
        $parsedInput = !empty($rawBody) ? json_decode($rawBody, true) : null;
        $inputData = is_array($parsedInput) ? $parsedInput : $_POST;

        // Dispatch Routes
        switch (true) {
            case ($route === '/health' || $route === '/system/health' || $route === '/health/live') && $method === 'GET':
                $systemCtrl->health();
                break;

            case $route === '/tenant/provisioning' && $method === 'GET':
                $systemCtrl->tenantProvisioning();
                break;

            case $route === '/admin/platform-health' && $method === 'GET':
                $systemCtrl->platformHealth();
                break;

            case $route === '/system/openapi.json' && $method === 'GET':
                $systemCtrl->openapi();
                break;

            case $route === '/ai/capabilities' && $method === 'GET':
                $systemCtrl->aiCapabilities();
                break;

            case $route === '/ai/query' && $method === 'POST':
                $systemCtrl->aiQuery();
                break;

            case $route === '/ai/config' && $method === 'GET':
                $systemCtrl->getAiConfig();
                break;

            case $route === '/ai/config' && $method === 'POST':
                $systemCtrl->saveAiConfig();
                break;

            case $route === '/currencies' && $method === 'GET':
                Response::json($currencyAcl->getCurrencies(true), 200, 'Currencies retrieved');
                break;

            case $route === '/currencies' && $method === 'POST':
                Response::json($currencyAcl->createCurrency($inputData), 201, 'Currency created');
                break;

            case preg_match('#^/currencies/([A-Za-z0-9_-]+)/archive$#', $route, $matches) && $method === 'POST':
                Response::json($currencyAcl->archiveCurrency($matches[1]), 200, 'Currency archived');
                break;

            case preg_match('#^/currencies/([A-Za-z0-9_-]+)/restore$#', $route, $matches) && $method === 'POST':
                Response::json($currencyAcl->restoreCurrency($matches[1]), 200, 'Currency restored');
                break;

            case preg_match('#^/currencies/([A-Za-z0-9_-]+)/set-default$#', $route, $matches) && $method === 'POST':
                Response::json($currencyAcl->setDefaultCurrency($matches[1]), 200, 'Default base currency set');
                break;

            case preg_match('#^/currencies/([A-Za-z0-9_-]+)/history$#', $route, $matches) && $method === 'GET':
                Response::json($currencyAcl->getRateHistory($matches[1]), 200, 'Rate history retrieved');
                break;

            case preg_match('#^/currencies/([A-Za-z0-9_-]+)$#', $route, $matches) && ($method === 'PUT' || $method === 'POST'):
                Response::json($currencyAcl->updateCurrency($matches[1], $inputData), 200, 'Currency updated');
                break;

            case $route === '/taxes' && $method === 'GET':
                Response::json($taxAcl->getTaxTypes(true), 200, 'Tax types retrieved');
                break;

            case $route === '/taxes' && $method === 'POST':
                Response::json($taxAcl->createTaxType($inputData), 201, 'Tax type created');
                break;

            case preg_match('#^/taxes/([0-9]+)/archive$#', $route, $matches) && $method === 'POST':
                Response::json($taxAcl->archiveTaxType($matches[1]), 200, 'Tax type archived');
                break;

            case preg_match('#^/taxes/([0-9]+)/restore$#', $route, $matches) && $method === 'POST':
                Response::json($taxAcl->restoreTaxType($matches[1]), 200, 'Tax type restored');
                break;

            case preg_match('#^/taxes/([0-9]+)$#', $route, $matches) && ($method === 'PUT' || $method === 'POST'):
                Response::json($taxAcl->updateTaxType($matches[1], $inputData), 200, 'Tax type updated');
                break;

            case $route === '/dimensions' && $method === 'GET':
                Response::json($dimensionAcl->getDimensions(true), 200, 'Dimensions retrieved');
                break;

            case $route === '/dimensions' && $method === 'POST':
                Response::json($dimensionAcl->createDimension($inputData), 201, 'Dimension created');
                break;

            case preg_match('#^/dimensions/([0-9]+)/archive$#', $route, $matches) && $method === 'POST':
                Response::json($dimensionAcl->archiveDimension($matches[1]), 200, 'Dimension archived');
                break;

            case preg_match('#^/dimensions/([0-9]+)/restore$#', $route, $matches) && $method === 'POST':
                Response::json($dimensionAcl->restoreDimension($matches[1]), 200, 'Dimension restored');
                break;

            case preg_match('#^/dimensions/([0-9]+)$#', $route, $matches) && ($method === 'PUT' || $method === 'POST'):
                Response::json($dimensionAcl->updateDimension($matches[1], $inputData), 200, 'Dimension updated');
                break;

            case $route === '/customers' && $method === 'GET':
                $customerCtrl->index();
                break;

            case $route === '/customers' && $method === 'POST':
                $customerCtrl->store();
                break;

            case preg_match('#^/customers/([0-9]+)/related$#', $route, $matches) && $method === 'GET':
                $customerCtrl->related($matches[1]);
                break;

            case preg_match('#^/customers/([0-9]+)/history$#', $route, $matches) && $method === 'GET':
                $customerCtrl->history($matches[1]);
                break;

            case preg_match('#^/customers/([0-9]+)$#', $route, $matches) && $method === 'GET':
                $customerCtrl->show($matches[1]);
                break;

            case $route === '/suppliers' && $method === 'GET':
                $supplierCtrl->index();
                break;

            case $route === '/suppliers' && $method === 'POST':
                $supplierCtrl->store();
                break;

            case preg_match('#^/suppliers/([0-9]+)/related$#', $route, $matches) && $method === 'GET':
                $supplierCtrl->related($matches[1]);
                break;

            case preg_match('#^/suppliers/([0-9]+)/history$#', $route, $matches) && $method === 'GET':
                $supplierCtrl->history($matches[1]);
                break;

            case preg_match('#^/suppliers/([0-9]+)$#', $route, $matches) && $method === 'GET':
                $supplierCtrl->show($matches[1]);
                break;

            case $route === '/items' && $method === 'GET':
                $inventoryCtrl->index();
                break;

            case $route === '/items' && $method === 'POST':
                $inventoryCtrl->store();
                break;

            case preg_match('#^/items/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $inventoryCtrl->related($matches[1]);
                break;

            case preg_match('#^/items/([A-Za-z0-9_-]+)/history$#', $route, $matches) && $method === 'GET':
                $inventoryCtrl->history($matches[1]);
                break;

            case preg_match('#^/items/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $inventoryCtrl->show($matches[1]);
                break;

            case $route === '/gl/accounts' && $method === 'GET':
                $glCtrl->index();
                break;

            case $route === '/gl/accounts' && $method === 'POST':
                $glCtrl->store();
                break;

            case preg_match('#^/gl/accounts/([A-Za-z0-9_-]+)/ledger$#', $route, $matches) && $method === 'GET':
                $glCtrl->ledger($matches[1]);
                break;

            case preg_match('#^/gl/accounts/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $glCtrl->related($matches[1]);
                break;

            case preg_match('#^/gl/accounts/([A-Za-z0-9_-]+)/history$#', $route, $matches) && $method === 'GET':
                $glCtrl->history($matches[1]);
                break;

            case preg_match('#^/gl/accounts/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $glCtrl->show($matches[1]);
                break;

            case preg_match('#^/gl/accounts/([A-Za-z0-9_-]+)$#', $route, $matches) && ($method === 'PUT' || $method === 'POST'):
                $glCtrl->update($matches[1]);
                break;

            case preg_match('#^/gl/journals/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $glCtrl->relatedJournal($matches[1]);
                break;

            case preg_match('#^/gl/journals/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $glCtrl->showJournal($matches[1]);
                break;

            case $route === '/gl/journals' && $method === 'POST':
                $glCtrl->postJournal();
                break;

            case preg_match('#^/sales/invoices/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $salesCtrl->relatedInvoice($matches[1]);
                break;

            case preg_match('#^/sales/invoices/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $salesCtrl->showInvoice($matches[1]);
                break;

            case $route === '/sales/invoices' && $method === 'POST':
                $salesCtrl->postInvoice();
                break;

            case preg_match('#^/sales/payments/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $salesCtrl->relatedPayment($matches[1]);
                break;

            case preg_match('#^/sales/payments/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $salesCtrl->showPayment($matches[1]);
                break;

            case preg_match('#^/purchasing/bills/([A-Za-z0-9_-]+)/related$#', $route, $matches) && $method === 'GET':
                $salesCtrl->relatedBill($matches[1]);
                break;

            case preg_match('#^/purchasing/bills/([A-Za-z0-9_-]+)$#', $route, $matches) && $method === 'GET':
                $salesCtrl->showBill($matches[1]);
                break;

            case $route === '/reports/trial-balance' && $method === 'GET':
                $reportCtrl->trialBalance();
                break;

            case $route === '/audit-history' && $method === 'GET':
                $entity = $_GET['entity'] ?? 'record';
                $id = $_GET['id'] ?? '1';
                Response::json(AuditService::getEntityHistory($entity, $id), 200, "Audit history for {$entity} #{$id} retrieved");
                break;

            default:
                Response::error("API Route not found: {$method} {$route}", 404);
                break;
        }
    }
}

