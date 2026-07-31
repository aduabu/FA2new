# REF ERP Enterprise Platform â€” Enterprise Module Implementation Methodology (Frozen)

## Purpose

This document defines the **mandatory 15-phase process** that must be followed every time work begins on any ERP module, feature, screen, or workflow.

It translates the **Enterprise Module Specification** into a systematic, repeatable engineering playbook.

---

## The Mandatory 15-Phase Development Lifecycle

```text
Phase 1:  Discovery                   â”€â”€â–º Inspect DB, REST, UI, DTOs, Services, ACL & Reports
Phase 2:  Enterprise Gap Analysis      â”€â”€â–º Compare against 13 Pillars & 10 Non-Negotiable Directives
Phase 3:  Business Workflow Analysis   â”€â”€â–º Map accountant, inventory, & purchasing user journeys
Phase 4:  Architecture & Extensibility â”€â”€â–º Design DB schema, APIs, AI Router, Print & Dashboard
Phase 5:  Database Implementation      â”€â”€â–º Execute migrations, add indexes, FKs & triggers
Phase 6:  Backend REST API & ACL       â”€â”€â–º Update Repositories, Services, Validators & Audit Log
Phase 7:  Frontend UI & UX             â”€â”€â–º Implement Views, Dialogs, Tables, Filters & Shortcuts
Phase 8:  AI Capability Router         â”€â”€â–º Connect Gemini Capability Router for smart assistance
Phase 9:  Financial & Ops Reporting    â”€â”€â–º Build financial/operational reports + exports
Phase 10: Enterprise Printing System   â”€â”€â–º Implement @media print CSS, Print Preview & PDF export
Phase 11: Executive Dashboard          â”€â”€â–º Expose real-time KPI summary widgets
Phase 12: Performance & Optimization   â”€â”€â–º Measure & optimize execution latencies vs targets
Phase 13: Security & RBAC Enforcement  â”€â”€â–º Verify field-level, record-level & action-level RBAC
Phase 14: Automated QA & Verification  â”€â”€â–º Run automated REST API & accounting invariant tests
Phase 15: Module Certification         â”€â”€â–º QA sign-off & Module Certification Matrix update
```

---

## Mandatory Pre-Coding Governance Requirements

Before writing any source code for a module, the AI agent must produce two mandatory planning documents:

1. **Module Improvement Report (`MOD_XX_IMPROVEMENT_REPORT.md`)**:
   Analyzes current completeness %, missing CRUD operations, missing REST routes, DB schema changes, print templates, dashboard widgets, AI opportunities, performance risks, and security gaps.

2. **Module Implementation Plan (`MOD_XX_IMPLEMENTATION_PLAN.md`)**:
   Translates the analysis into an ordered **Work Breakdown Structure (WBS)** with Task 1 through Task N, estimated effort, dependencies, exact migration steps, backend REST tasks, frontend UI tasks, print templates, AI integration tasks, and acceptance criteria checklists.

Coding may **only** begin after both documents are compiled and approved.

---

## Phase 1 â€” Module Discovery
Before writing any code:
- Read MySQL database table schemas.
- Read existing REST API routes and controllers.
- Read React frontend views and components.
- Read Services, Repositories, DTOs, and Validators.
- Read ACL domain adapters and permissions.
- Read print templates, reports, and dashboard widgets.
- Read AI integrations (`AIConfig`, `GeminiCapabilityRouter`).
- Produce a **Module Analysis Report**.

---

## Phase 2 â€” Enterprise Gap Analysis
Compare the module against the **13 Pillars of Excellence** and **10 Non-Negotiable Directives**:
- **CRUD Matrix**: View (âœ”), Create (âœ”), Edit (âœ˜), Duplicate (âœ˜), Archive (âœ˜), Restore (âœ˜), Soft Delete (âœ˜), Permanent Delete (âœ˜).
- **Smart Search & Filters**: Instant search, date/status/dimension filters.
- **Printing & PDF**: `@media print` CSS, Print Preview, PDF export.
- **AI Integration**: AI Capability Router, anomaly detection, description generation.
- **Dashboard & KPIs**: Summary cards and trend widgets.
- **Audit Logging**: Structured mutation entries in `0_audit_trail`.
- Produce a **Gap Analysis Report**.

---

## Phase 3 â€” Business Workflow Analysis
Map real-world user journeys for key stakeholders:
- Accountants & Financial Controllers (GL posting, trial balance, tax compliance).
- Inventory Managers & Warehouse Staff (stock receipt, stock count, valuation).
- Purchasing Officers & Procurement Agents (PO creation, 3-way match, AP balance).
- Sales Representatives & Billing Clerks (quotation, sales order, AR collection).
- Document how business roles interact with the module to optimize screen layout and action buttons before coding.

---

## Phase 4 â€” Architecture & Extensibility Design
Design all required structural changes:
- Database tables, columns, indexes, foreign keys, views.
- REST API routes (`GET`, `POST`, `PUT`, `DELETE`, `BULK`, `SEARCH`).
- Configurable parameters, field visibility rules, custom document sequences (`INV-{YYYY}-{0000}`).
- Keyboard shortcuts (`Ctrl+N`, `Ctrl+S`, `Ctrl+P`, `Ctrl+F`, `Ctrl+K`).
- AI capability selection (`FAST`, `REASONING`, `FINANCIAL_ANALYSIS`).
- Dashboard KPI widget layouts.

---

## Phase 5 â€” Database Migration & Schema Implementation
- Create or update MySQL tables with InnoDB engine and `utf8mb4` charset.
- Add performance indexes on search and foreign key columns.
- Ensure referential integrity and foreign key constraints.

---

## Phase 6 â€” Backend REST API & ACL Implementation
- Implement Repositories, Services, Validators, and DTOs.
- Implement REST API controller methods with `X-Request-ID` correlation.
- Log every mutation to `0_audit_trail` with user, timestamp, request ID, and snapshot.
- Enforce transactional safety (`Database::transaction()`) with automatic rollback on error.

---

## Phase 7 â€” Frontend UI & User Experience
- Build responsive React views using component library and design system.
- Implement master-detail tables, modal dialogs, search bars, and filter toolbars.
- Bind global keyboard shortcuts (`Ctrl+N`, `Ctrl+S`, `Ctrl+P`, `Ctrl+F`, `Ctrl+K`, `Esc`).
- Implement pre-save live validation and field-level inline guidance.

---

## Phase 8 â€” AI Integration via Capability Router
- Connect module workflows to `GeminiCapabilityRouter`.
- Provide AI assistant features: anomaly detection, smart descriptions, cash flow prediction, journal drafting, and data explanation.
- **Zero hardcoded Gemini model strings**.

---

## Phase 9 â€” Financial & Operational Reporting
- Implement dedicated report queries and financial calculation routines.
- Export to PDF, CSV, Excel, JSON, XML.
- Ensure report totals reconcile with source GL transactions.

---

## Phase 10 â€” Enterprise Printing & PDF System
- Implement `@media print` CSS rules hiding navigation, topbars, and UI chrome.
- Support Print Preview, Quick Print, Selected Print, Dataset Print.
- Generate clean PDF layouts with letterhead, company branding, and watermarks.

---

## Phase 11 â€” Executive Dashboard Integration
- Expose real-time KPI summary cards and trend widgets to the main dashboard.

---

## Phase 12 â€” Performance & Optimization
- Benchmark execution latencies against reference targets.
- Optimize SQL queries with proper indexes and pagination.
- Virtualize large data tables in the frontend.

---

## Phase 13 â€” Security & RBAC Enforcement
- Enforce granular field-level, record-level, and action-level permissions.
- Validate tenant isolation and authorization tokens.

---

## Phase 14 â€” Automated QA & Verification
- Run REST API tests using `apiClient.ts` and PowerShell test runners.
- Verify double-entry accounting invariants (`sum(debits) == sum(credits)`).
- Execute failure injection tests and verify PDO transaction rollback.

---

## Phase 15 â€” Module Certification & Sign-off
- Evaluate module readiness against the **Module Certification Matrix**.
- Mark module status as **CERTIFIED** only when all 13 pillars and 10 directives pass.
- Update `MODULE_IMPLEMENTATION_BACKLOG.md` and `RELEASE_CERTIFICATION_LEDGER.md`.

