# REF ERP Enterprise Platform â€” Feature Dependency Matrix (Frozen Framework Rules)

## Purpose

This document defines the **implementation prerequisites, architectural constraints, and execution dependencies** between capabilities in the **REF ERP Enterprise Platform**.

It prevents execution anti-patterns (such as building UI views before REST endpoints exist or adding AI drawers before audit logging is configured).

---

## Architectural Dependency Rules

```text
Database Schema & Migrations
           â”‚
           â–¼
ACL Domain Adapters & Audit Trail
           â”‚
           â–¼
REST API Gateway & Route Dispatcher
           â”‚
           â–¼
React Component View & State
           â”‚
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â–¼         â–¼         â–¼         â–¼
Print     Import    Export    Dashboard
 â”‚         â”‚         â”‚         â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â–¼
             AI Capability Router
                     â”‚
                     â–¼
          Keyboard & Command Palette
                     â”‚
                     â–¼
         Automated QA Verification
```

---

## Feature Prerequisites Table

| Feature Domain | Feature Name | Prerequisites Required | Rationale |
| -------------- | ------------ | ---------------------- | --------- |
| **Backend ACL** | Edit / Update Record | DB Primary Key & `0_audit_trail` table | Edits must update MySQL and generate an audit log entry. |
| **Backend ACL** | Soft Delete / Archive | `inactive TINYINT(1)` column in DB table | Soft delete flags records as inactive without breaking foreign keys. |
| **API Gateway** | REST Endpoints | ACL Domain Adapter & Controller methods | Routes must invoke verified ACL or Service domain logic. |
| **API Gateway** | Payload Decoding | `$GLOBALS['RAW_INPUT']` stream caching | Guarantees raw JSON payloads decode properly in PHP. |
| **Frontend UI** | React Data Grid | Centralized `apiClient.ts` & `apiEndpoints.ts` | Prohibits ad-hoc `fetch()` calls in components. |
| **Frontend UI** | Active / Archived Tabs | Backend support for `inactive = 0/1` filtering | UI tabs require backend filter parameters. |
| **Printing** | Print Preview & PDF | Printable HTML template & `@media print` CSS | PDF generator requires clean DOM element and CSS reset. |
| **AI Router** | AI Assistant Drawer | `GeminiCapabilityRouter` & `POST /api/v1/ai/query` | AI features must use capability router (zero hardcoded model strings). |
| **Dashboard** | KPI Executive Cards | Backend aggregation queries | KPI cards display live counts from DB. |
| **Keyboard** | Shortcuts (`Ctrl+N`, etc.) | UI Modal Handlers & Form State | Key bindings trigger modal visibility state setters. |
| **QA** | Certification | Typecheck, Build, & REST Test Suite | Certification requires 0 TypeScript errors & clean Vite build. |

