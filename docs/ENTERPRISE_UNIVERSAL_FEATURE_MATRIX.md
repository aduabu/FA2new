# REF ERP Enterprise Platform â€” Universal Feature Matrix (Frozen Framework Catalog)

## Purpose

This document defines the **master catalog of enterprise capabilities** that every resource, screen, and workflow in the **REF ERP Enterprise Platform** automatically evaluates and supports where applicable.

---

## Master Capability Catalog (10 Functional Domains)

### 1. Module Lifecycle & CRUD Governance
- [ ] **View Catalog**: Master-detail data grid / card view.
- [ ] **Create Record**: Single-page or modal creation form with live validation.
- [ ] **Edit Record**: Complete record mutation capability with original value preservation.
- [ ] **Duplicate Record**: Clone existing record into a new pre-filled draft.
- [ ] **Archive Record (Soft Delete)**: Set `inactive = 1` while preserving statutory financial records.
- [ ] **Restore Record**: Re-activate archived records (`inactive = 0`).
- [ ] **Hard Delete (Admin Only)**: Permanent delete with DB foreign key dependency checks.
- [ ] **Bulk Archive**: Multi-select soft-delete for multiple records.
- [ ] **Bulk Restore**: Multi-select restoration for archived records.
- [ ] **Version History & Audit Log**: Mutation tracking (`created_by`, `modified_by`, `stamp`, `0_audit_trail`).

### 2. Search, Navigation & Discoverability
- [ ] **Instant Search**: Partial text and fuzzy matching on primary fields.
- [ ] **Command Palette (`Ctrl+K`)**: Direct jump navigation and action execution.
- [ ] **Keyboard Shortcut (`Ctrl+F`)**: Focus search bar immediately.
- [ ] **Saved Filters & Presets**: Save custom filter criteria for reuse.
- [ ] **Multi-Column Filtering**: Filter by status, date range, department, currency, dimension, tag.

### 3. Data Grid & UI Excellence
- [ ] **Column Sorting**: Ascending, descending, and natural sorting on all columns.
- [ ] **Pagination & Virtualization**: Handle large datasets gracefully.
- [ ] **Sticky Headers**: Fixed table headers during vertical scroll.
- [ ] **Multi-Select Checkboxes**: Multi-record selection toolbar.
- [ ] **Loading Skeletons & Empty States**: Polished loading and empty visual states.

### 4. Enterprise Printing & PDF System
- [ ] **Print Preview Modal**: Interactive pre-print layout.
- [ ] **Dataset Printing**: Print filtered dataset table.
- [ ] **Selected Item Printing**: Print selected single record statement.
- [ ] **Browser PDF Export**: Generate clean PDF layout via browser print engine.
- [ ] **Letterhead & Branding**: Company logo, address, and legal header.
- [ ] **@media print Optimization**: Hide navigation chrome, sidebars, and developer drawers.

### 5. Data Import & Export Engine
- [ ] **CSV / Excel Export**: Download data grid in tabular format.
- [ ] **PDF Export**: Generate branded PDF documents.
- [ ] **JSON / XML Export**: Export structured data payloads.
- [ ] **CSV / JSON Import**: File upload with pre-validation and duplicate detection.

### 6. AI Intelligence & Capability Router
- [ ] **Explain Data**: Natural language explanation of record status or anomalies.
- [ ] **Predict / Forecast**: Predict payment timing, cash flow, or stock demand.
- [ ] **Detect Anomalies**: Identify duplicate entries or suspicious GL postings.
- [ ] **Auto-Description**: Generate smart descriptions for transactions or items.
- [ ] **Gemini Capability Router**: Zero hardcoded models (use `FAST`, `REASONING`, `FINANCIAL_ANALYSIS`).

### 7. Executive Dashboard & KPI Analytics
- [ ] **Summary Cards**: Active count, archived count, totals, and primary metrics.
- [ ] **Trend Widgets**: Graphical trend display over time.
- [ ] **Alert Badges**: Low stock, overdue receivables, or pending approval alerts.
- [ ] **Quick Action Buttons**: Direct action triggers from dashboard widgets.

### 8. Security, RBAC & Extensibility
- [ ] **Field & Record RBAC**: Enforce permissions by user role (`ADMIN`, `ACCOUNTANT`, `VIEWER`).
- [ ] **Audit Trail Integration**: Log user ID, timestamp, request ID (`req_...`), and description.
- [ ] **Configurable Parameters**: Admin parameters editable without source code changes.
- [ ] **Custom Numbering Sequences**: Configurable document prefixes (`INV-{YYYY}-{0000}`).

### 9. Business Workflow & Approval Engine
- [ ] **Draft State**: Unposted temporary state.
- [ ] **Submitted State**: Pending supervisor approval.
- [ ] **Approved / Posted State**: Immutable financial posting.
- [ ] **Reversal / Cancellation**: Reversal journal generation.

### 10. Quality, Verification & Compliance
- [ ] **Pre-Save Live Validation**: Validate fields while typing before submission.
- [ ] **Standard Response Envelope**: Unified JSON envelope with `request_id` correlation.
- [ ] **TypeScript Type Safety**: 0 compilation errors (`npm run typecheck`).
- [ ] **Clean Production Build**: Build succeeds without errors (`npm run build`).
- [ ] **Automated QA Verification**: Scripted REST API tests returning HTTP 200/201.

