# REF ERP Enterprise Platform â€” Architecture Decision Records (ADR Log)

## Purpose

This document preserves the **architectural rationale and context** for key design decisions made across the **REF ERP Enterprise Platform**.

Each record documents the decision status, context, architectural rationale, alternatives considered, and consequences.

---

## ADR Index

| ADR ID | Decision Title | Status | Date | Primary Driver |
| ------ | -------------- | ------ | ---- | -------------- |
| **ADR-001** | Centralized Frontend REST Client (`apiClient.ts`) | Accepted | 2026-07-27 | Prohibit ad-hoc `fetch()` calls; enforce correlation IDs, telemetry, & retries |
| **ADR-002** | Soft Delete & Archival Governance | Accepted | 2026-07-27 | Preserve accounting audit trail & statutory compliance |
| **ADR-003** | Gemini AI Capability Router Abstraction | Accepted | 2026-07-27 | Prohibit hardcoded model strings; decouple application from specific model names |
| **ADR-004** | PHP Output Buffering & Fatal Error Shutdown Handler | Accepted | 2026-07-27 | Guarantee JSON error envelopes even on fatal PHP / PDO exceptions |
| **ADR-005** | Protected Developer Diagnostics Bar | Accepted | 2026-07-27 | Provide live HTTP request telemetry & payload inspection for ADMIN users |

---

## ADR Details

### ADR-001: Centralized Frontend REST Client (`apiClient.ts`)
- **Status**: Accepted
- **Date**: 2026-07-27
- **Context**: Component views were making direct `fetch()` calls, resulting in inconsistent error handling, missing request correlation IDs, and unhandled non-JSON HTML error pages.
- **Decision**: Prohibit direct `fetch()` calls across all React components. Route 100% of HTTP requests through a single `apiClient.ts` instance that injects `X-Request-ID`, checks HTTP status and `Content-Type`, parses text safely, executes transient retries for 502/503/504 errors, and emits telemetry events.
- **Alternatives Considered**:
  - *Axios per component*: Rejected due to code duplication and lack of centralized telemetry event emitter.
  - *Global fetch wrapper per module*: Rejected due to inconsistent maintenance across teams.
- **Consequences**: Single entry point for all HTTP communication; instant telemetry logging in Developer Diagnostics Bar; unified error message format.

---

### ADR-002: Soft Delete & Archival Governance
- **Status**: Accepted
- **Date**: 2026-07-27
- **Context**: Statutory accounting regulations prohibit hard-deleting transactions, customer master records, or GL accounts with posted history.
- **Decision**: Implement soft delete (`inactive = 1`) and archival mechanisms across all business master data. Permanent deletion is restricted exclusively to System Administrators and blocked if active financial dependencies exist.
- **Alternatives Considered**:
  - *Hard delete with CASCADE*: Rejected due to severe risk of orphan general ledger entries and audit trail corruption.
- **Consequences**: Restorable records; preserved statutory audit trails; compliant financial reporting.

---

### ADR-003: Gemini AI Capability Router Abstraction
- **Status**: Accepted
- **Date**: 2026-07-27
- **Context**: AI models change rapidly. Hardcoding model names (e.g. `gemini-2.5-pro`) creates brittle code that breaks when models are retired or updated.
- **Decision**: Prohibit hardcoded Gemini model names anywhere in the frontend or backend codebase. All AI features request capabilities (`FAST`, `REASONING`, `FINANCIAL_ANALYSIS`, `LONG_CONTEXT`), and `GeminiCapabilityRouter` dynamically resolves the request to the optimal model based on MySQL `0_ai_config` settings.
- **Alternatives Considered**:
  - *Hardcoded model constants*: Rejected due to high maintenance overhead when model IDs update.
- **Consequences**: Model replacements require zero application code changes; model settings are configurable by administrators via database.

---

### ADR-004: PHP Output Buffering & Fatal Error Shutdown Handler
- **Status**: Accepted
- **Date**: 2026-07-27
- **Context**: Uncaught PHP fatal errors (`E_ERROR`, `E_PARSE`) or database exceptions were returning HTML error pages or blank responses, breaking frontend JSON parsers.
- **Decision**: Wrap API Gateway execution in `ob_start()`, register a `register_shutdown_function()`, and position `set_exception_handler()` at the top of `index.php`. If a fatal error occurs, `ob_clean()` wipes stray output and outputs a structured JSON error envelope with `request_id`, `error_code`, and file/line details.
- **Alternatives Considered**:
  - *Default PHP error display*: Rejected because HTML error outputs break frontend JSON parsing.
- **Consequences**: 100% JSON output guarantee across all HTTP status codes (200, 400, 404, 500).

---

### ADR-005: Protected Developer Diagnostics Bar
- **Status**: Accepted
- **Date**: 2026-07-27
- **Context**: Developers and QA auditors needed a way to inspect real-time API call latencies, status codes, request correlation IDs, and raw request/response payloads directly inside the application.
- **Decision**: Build `<DeveloperDiagnosticsBar />`, an expandable bottom drawer component connected to `apiClient.ts` telemetry events, restricted to users with `ADMIN` role context.
- **Alternatives Considered**:
  - *Browser DevTools Network Tab alone*: Rejected because non-technical auditors and QA managers need an in-app telemetry stream linked to request correlation IDs.
- **Consequences**: Instant visibility into request latencies, status codes, payloads, and correlation IDs without leaving the UI.

