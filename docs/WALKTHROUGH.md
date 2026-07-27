# FrontAccounting Enterprise Platform — Complete Technical Walkthrough

> **Platform Version**: `v1.0.0-RC1` (Release Candidate 1)  
> **Repository**: [https://github.com/aduabu/FA2new](https://github.com/aduabu/FA2new)  
> **Core Principle**: Decouple the React 19 presentation layer & REST API Gateway while preserving FrontAccounting's immutable C-style double-entry accounting engine.

---

## 1. Welcome

FrontAccounting Enterprise is a modern, enterprise-grade ERP platform built by wrapping FrontAccounting's battle-tested double-entry accounting core in a decoupled, multi-tenant React 19 SPA and PHP REST API Gateway architecture.

```
┌─────────────────────────────────────────────────────────┐
│              React 19 SPA (Vite + TS)                   │
│   TailwindCSS + HSL Design Tokens + Shared Engine       │
└────────────────────────────┬────────────────────────────┘
                             │ REST API (JSON / JWT)
┌────────────────────────────▼────────────────────────────┐
│               REST API Gateway Router                   │
│       (apps/api/index.php + OpenAPI 3.0 Specs)          │
└────────────────────────────┬────────────────────────────┘
                             │ C-Style Function Wrappers
┌────────────────────────────▼────────────────────────────┐
│      FrontAccounting Core Posting Engine (PHP)          │
│   (sales_invoice_db.inc, gl_db_trans.inc, gl_journal)   │
└────────────────────────────┬────────────────────────────┘
                             │ SQL Transactions
┌────────────────────────────▼────────────────────────────┐
│              MySQL 8.0 InnoDB Database                  │
│       Multi-Tenant Table Isolation (0_, 1_, 2_)         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Repository Tour

```
FA2new/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD pipeline
├── apps/
│   ├── api/
│   │   ├── index.php            # REST API Gateway entry point & route matrix
│   │   └── .htaccess            # Apache rewrite rules for /api/v1/*
│   └── web/
│       ├── package.json         # React 19 SPA dependencies
│       ├── vite.config.ts       # Vite build configuration
│       ├── src/
│       │   ├── App.tsx          # Workspace router & layout container
│       │   ├── index.css        # HSL design tokens & dark/light theme classes
│       │   ├── components/
│       │   │   ├── layout/      # Sidebar.tsx, Topbar.tsx navigation shell
│       │   │   ├── masterdata/  # 7 Master Data management views
│       │   │   ├── transactions/# Shared Engine (<DocHeader>, <DocStatusBar>, <PartySelector>, <GLPostingPreviewModal>) + 5 Transaction Studios
│       │   │   ├── reporting/   # Trial Balance, Audit Vault, Accounting Test Runner
│       │   │   ├── enterprise/  # Manufacturing WO, Fixed Assets, Bank Rec, Approvals, Scheduler
│       │   │   ├── intelligence/# AI Assistant, Webhooks Engine, Full QA Suite
│       │   │   └── platform/    # Plugin SDK, Tenant Management, Release Studio
│       │   └── tests/
│       │       └── accounting_integrity.test.ts # 5 Double-Entry Invariant Tests
├── docker/
│   ├── api.Dockerfile           # PHP 8.2 + Apache container build
│   ├── web.Dockerfile           # Node 20 + Vite static container build
│   └── apache.conf              # Apache vhost rewrite rules
├── docker-compose.yml           # Multi-container stack (MySQL 8, Redis 7, API, Web)
├── docs/                        # Architecture Blueprints 1–8 + WALKTHROUGH.md
└── FA-Source/                   # Preserved FrontAccounting v2.4.20 core codebase
```

---

## 3. Developer Boot Process

```
Developer Shell
  ↓
docker-compose up -d
  │
  ├── 1. Starts MySQL 8.0 Container (Port 3306) -> Loads 0_ schema
  ├── 2. Starts Redis 7 Container (Port 6379) -> Initializes Queue Workers
  ├── 3. Starts PHP API Container (Port 8080) -> Serves /api/v1/
  └── 4. Starts Vite Web Container (Port 3000) -> Serves React 19 SPA
  ↓
Browser opens http://localhost:3000 -> Connected & Ready!
```

---

## 4. Request Lifecycle

```
[User Action in React SPA]
  │ (e.g. Clicks "Post Sales Invoice")
  ▼
[React Component state update]
  │ Invokes API client fetch('/api/v1/sales/invoices', { method: 'POST', body })
  ▼
[Apache .htaccess Rewrite Router]
  │ Passes request to apps/api/index.php
  ▼
[API Gateway Controller Handler]
  │ Validates JWT, parses JSON body, initiates begin_transaction()
  ▼
[FrontAccounting Core Posting Function]
  │ Calls write_sales_invoice() in sales_invoice_db.inc
  │ Calculates GST taxes, updates customer balance, creates GL journal
  ▼
[MySQL InnoDB Database Commit]
  │ Commits SQL transaction & updates audit trail log (0_audit_trail)
  ▼
[Standardized API Response JSON]
  │ Returns HTTP 200 { status: "success", execution_ms: 12.4, data: {...} }
  ▼
[React UI Re-renders with Success Toast & Updated Ledger Balance]
```

---

## 5. Transaction Processing Flow

```
1. Quotation Draft  ──►  2. Sales Order  ──►  3. GL Posting Preview Modal
                                                      │
                                                      ▼
5. Receivables Update ◄── 4. Accounting Core Posting Engine 
                                                      │
                                                      ▼
6. Outgoing HMAC Webhook Event  ──►  7. Audit Vault Log Timeline
```

---

## 6. Event Bus & Outgoing Webhooks

When business transactions complete (e.g. `InvoicePosted`, `PaymentAllocated`, `StockAdjusted`):

```
Transaction Event Trigger
  │
  ├── 1. System Audit Trail Log -> Records user, timestamp, transaction ID
  ├── 2. Redis Event Queue -> Enqueues background jobs
  └── 3. HMAC Webhook Dispatcher -> Sends SHA-256 signed JSON payload to external subscribers:
         ├── Stripe Payment Gateway
         ├── Plaid Open Banking API
         ├── ZATCA / PEPPOL E-Invoicing Tax Authority
         └── Salesforce CRM Account Sync
```

---

## 7. Workflow Approval State Machine

```
[Draft Order] ──► [Submitted] ──► [Manager Review] ──► [Finance Approval] ──► [Posted to GL]
                                        │
                                        └──► [Rejected] (Returns to Submitter with comments)
```

---

## 8. Shared Transaction Component Framework

All transaction views in `apps/web/src/components/transactions/` share a common UI contract:

- `<DocHeader>`: Document reference, doc/due dates, currency badge, status pill.
- `<DocStatusBar>`: Visual 5-step workflow pipeline state machine.
- `<PartySelector>`: Shared customer/supplier selector with live credit limit and payment terms.
- `<GLPostingPreviewModal>`: Interactive verification modal displaying exact GL debit/credit entries before transaction execution.

---

## 9. AI Assistant Advisory Rules

The AI Assistant ([AIAssistantStudio.tsx](file:///d:/VibeCode/FA%202%20new/apps/web/src/components/intelligence/AIAssistantStudio.tsx)) operates under strict enterprise governance rules:

### ✅ What AI CAN Do:
- Natural Language Search (`"Show unpaid invoices over $1,000"`)
- Explain financial statements and GL journal entries
- Draft narrative summaries for management reports
- OCR parse supplier bill PDFs and images into draft fields

### ❌ What AI CANNOT Do:
- **Never automatically posts GL journal entries**
- **Never approves financial transactions or purchase orders**
- **Never modifies Chart of Accounts balances directly**
- *All financial postings require explicit human user confirmation.*

---

## 10. Plugin SDK Specification

Plugins define extension points using a standard `plugin.json` manifest:

```json
{
  "plugin_id": "com.company.custom_report",
  "name": "Custom Executive Dashboard Widget",
  "version": "1.0.0",
  "min_fa_version": "2.4.20",
  "extension_points": [
    "dashboard_widget",
    "sidebar_menu",
    "post_gl_event_hook"
  ],
  "permissions": ["SA_SALESORDER"],
  "author": "Enterprise Dev Team"
}
```

---

## 11. REST API Architecture & OpenAPI 3.0

- **Endpoint Namespace**: `/api/v1/*`
- **Authentication**: JWT Bearer token via `Authorization: Bearer <token>`
- **Response Format**: Standardized Envelope (`status`, `code`, `timestamp`, `execution_ms`, `data`, `pagination`)
- **Specification Endpoint**: Live OpenAPI 3.0 JSON available at `/api/v1/system/openapi.json`.

---

## 12. Background Workers & Redis Scheduler

Redis Queue Workers process asynchronous jobs across 4 active worker queues:
1. `Daily_Exchange_Rate_Update` (Daily foreign currency rate sync)
2. `PDF_Report_Pre-Render_Queue` (Batch PDF generation)
3. `Database_Nightly_Backup_Snapshot` (Automated database snapshots)
4. `Email_Notification_Batch_Dispatcher` (Outbound email queue)

---

## 13. Multi-Tenant Architecture

Multi-tenancy uses database table prefix isolation (`0_`, `1_`, `2_`):
- Tenant #0: `0_` prefix (Default Demo Company)
- Tenant #1: `1_` prefix (Acme Enterprise Subsidiary)
- Isolated table space prevents cross-tenant data leakage while sharing single codebase.

---

## 14. Testing Strategy & Quality Assurance

Run the test suites using npm:

```bash
# 1. Run Accounting Integrity Test Suite
cd apps/web && npm run test

# 2. Run React Production Build Check
cd apps/web && npm run build
```

### Verified Test Invariants:
1. **Double-Entry Balance Constraint**: `Debits == Credits` on all journal entries.
2. **Sales Invoice GL Balance**: `DR Receivables = CR Sales + Freight + Tax`.
3. **Customer Payment Allocation**: Receivables update accuracy.
4. **Inventory Valuation**: Stock move write-off impact on asset valuation.
5. **3-Way GRN Match**: 100% price & quantity match verification.

---

## 15. Mandatory Git Commit & Restore Point Workflow

Every code change MUST follow the standard commit message format before pushing:

```
<Title>

Prompt:
<The exact prompt or implementation request that produced this change>

Summary:
- What was implemented
- What files changed
- What architecture changed

Reason:
Why this change was made.

Impact:
Affected modules.

Testing:
How the implementation was verified.

Restore Point:
This commit represents a stable snapshot and can be safely restored.
```

Push to GitHub:
```bash
git add .
git commit -F commit_msg.txt
git push origin main
```

---

## 16. Release Process

```
Development Phase (Completed) 
  ──► Release Candidate 1 (v1.0.0-RC1 - Current) 
  ──► Pilot UAT & Accountant Validation 
  ──► v1.0.0 GA General Availability 
  ──► Maintenance (v1.0.x / v1.1)
```

---

## 17. Debugging & Troubleshooting Guide

- **API Request Logs**: Inspect `/tmp/api_requests.log` inside `FA-Source/tmp/`
- **React Build Errors**: Run `npm run build` inside `apps/web/`
- **Database Connection**: Ensure MySQL container is running on port 3306 with credentials `fa_user` / `fa_pass`
- **CORS Errors**: Handled automatically by preflight handler in `apps/api/index.php`.

---

## 18. Deployment Guide

### Local Development:
```bash
docker-compose up -d
```

### Production Docker/Kubernetes Deployment:
- Build static web bundle: `cd apps/web && npm run build`
- Deploy `docker/api.Dockerfile` container to Kubernetes cluster with environment variables `DB_HOST`, `DB_USER`, `DB_PASS`, `REDIS_HOST`.

---

## 19. Backup & Disaster Recovery (PITR)

- **Point-In-Time Recovery (PITR)**: MySQL binary logging enabled (`log-bin=mysql-bin`).
- **Nightly Snapshot**: Scheduled worker dumps database schema & tables to compressed tarball at 02:00 daily.

---

## 20. Product Roadmap

- **`v1.0.x`**: Maintenance releases for bug fixes, performance tuning, and stability patches.
- **`v1.1`**: Additional business features, localized tax extensions, and CRM integrations.
- **`v1.2`**: Mobile companion apps and advanced predictive analytics.
- **`v2.0`**: Next-generation architectural enhancements.
