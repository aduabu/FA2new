/**
 * REF ERP Enterprise Platform — Centralized API Endpoint Registry
 * Standardized routes for all API Gateway endpoints across v1 services.
 */

export const API_ENDPOINTS = {
  SYSTEM: {
    HEALTH: '/api/v1/system/health',
    PLATFORM_HEALTH: '/api/v1/admin/platform-health',
    OPENAPI: '/api/v1/system/openapi.json',
  },
  AI: {
    CAPABILITIES: '/api/v1/ai/capabilities',
    QUERY: '/api/v1/ai/query',
    CONFIG: '/api/v1/ai/config',
  },
  GL: {
    ACCOUNTS: '/api/v1/gl/accounts',
    JOURNALS: '/api/v1/gl/journals',
    SINGLE_JOURNAL: (transNo: string | number) => `/api/v1/gl/journals/${transNo}`,
    JOURNAL_RELATED: (transNo: string | number) => `/api/v1/gl/journals/${transNo}/related`,
    LEDGER: (code: string) => `/api/v1/gl/accounts/${code}/ledger`,
    SINGLE_ACCOUNT: (code: string) => `/api/v1/gl/accounts/${code}`,
    RELATED: (code: string) => `/api/v1/gl/accounts/${code}/related`,
    HISTORY: (code: string) => `/api/v1/gl/accounts/${code}/history`,
  },
  SALES: {
    INVOICES: '/api/v1/sales/invoices',
    SINGLE_INVOICE: (transNo: string | number) => `/api/v1/sales/invoices/${transNo}`,
    INVOICE_RELATED: (transNo: string | number) => `/api/v1/sales/invoices/${transNo}/related`,
    SINGLE_PAYMENT: (transNo: string | number) => `/api/v1/sales/payments/${transNo}`,
    PAYMENT_RELATED: (transNo: string | number) => `/api/v1/sales/payments/${transNo}/related`,
    CUSTOMERS: '/api/v1/customers',
    SINGLE_CUSTOMER: (id: string | number) => `/api/v1/customers/${id}`,
    CUSTOMER_RELATED: (id: string | number) => `/api/v1/customers/${id}/related`,
  },
  PURCHASES: {
    SUPPLIERS: '/api/v1/suppliers',
    SINGLE_SUPPLIER: (id: string | number) => `/api/v1/suppliers/${id}`,
    SUPPLIER_RELATED: (id: string | number) => `/api/v1/suppliers/${id}/related`,
  },
  PURCHASING: {
    SUPPLIERS: '/api/v1/suppliers',
    SINGLE_SUPPLIER: (id: string | number) => `/api/v1/suppliers/${id}`,
    SUPPLIER_RELATED: (id: string | number) => `/api/v1/suppliers/${id}/related`,
    SINGLE_BILL: (transNo: string | number) => `/api/v1/purchasing/bills/${transNo}`,
    BILL_RELATED: (transNo: string | number) => `/api/v1/purchasing/bills/${transNo}/related`,
  },

  INVENTORY: {
    ITEMS: '/api/v1/items',
    SINGLE_ITEM: (code: string) => `/api/v1/items/${code}`,
    ITEM_RELATED: (code: string) => `/api/v1/items/${code}/related`,
  },
  MASTER_DATA: {
    CURRENCIES: '/api/v1/currencies',
    CURRENCY_DETAIL: (code: string) => `/api/v1/currencies/${code}`,
    CURRENCY_ARCHIVE: (code: string) => `/api/v1/currencies/${code}/archive`,
    CURRENCY_RESTORE: (code: string) => `/api/v1/currencies/${code}/restore`,
    CURRENCY_SET_DEFAULT: (code: string) => `/api/v1/currencies/${code}/set-default`,
    CURRENCY_HISTORY: (code: string) => `/api/v1/currencies/${code}/history`,
    TAXES: '/api/v1/taxes',
    TAX_DETAIL: (id: number | string) => `/api/v1/taxes/${id}`,
    TAX_ARCHIVE: (id: number | string) => `/api/v1/taxes/${id}/archive`,
    TAX_RESTORE: (id: number | string) => `/api/v1/taxes/${id}/restore`,
    DIMENSIONS: '/api/v1/dimensions',
    DIMENSION_DETAIL: (id: number | string) => `/api/v1/dimensions/${id}`,
    DIMENSION_ARCHIVE: (id: number | string) => `/api/v1/dimensions/${id}/archive`,
    DIMENSION_RESTORE: (id: number | string) => `/api/v1/dimensions/${id}/restore`,
  },
  REPORTS: {
    TRIAL_BALANCE: '/api/v1/reports/trial-balance',
  },
} as const;
