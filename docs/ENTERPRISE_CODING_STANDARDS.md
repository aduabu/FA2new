# REF ERP Enterprise Platform â€” Enterprise Coding Standards & Design System Guide (Frozen)

## Purpose

This document defines the **coding conventions, architectural rules, design system tokens, and QA code review guidelines** for all software engineering and AI agent development across the **REF ERP Enterprise Platform**.

---

## 1. Code Architecture & Layering Rules

```text
React SPA UI â”€â”€â–º apiClient.ts â”€â”€â–º V1Router â”€â”€â–º Controller â”€â”€â–º Validator â”€â”€â–º Service â”€â”€â–º Repository â”€â”€â–º ACL Adapter â”€â”€â–º MySQL DB
```

### A. Backend PHP Rules
- **Controllers**: Handle HTTP input parsing, invoke Service layer, and call `Response::json()`. Zero SQL or direct database calls in Controllers.
- **Validators**: Perform DTO property validation before processing. Throw `ValidationException` or return validation error arrays with HTTP 422.
- **Services**: Execute domain business logic and manage transaction safety via `Database::transaction()`.
- **Repositories**: Execute domain query logic and encapsulate ACL adapters.
- **ACL Adapters (Anti-Corruption Layer)**: Interface directly with FrontAccounting tables or custom `0_*` tables. Handle `CREATE TABLE IF NOT EXISTS` initialization gracefully.
- **Response Handling**: Always return via `Response::json($data, $code, $message, $errors, $meta)`. Never echo raw strings or exit directly.

### B. Frontend React Rules
- **HTTP Requests**: Prohibit direct `fetch()` calls. Always use `apiClient.get()`, `apiClient.post()`, `apiClient.put()`, `apiClient.delete()`.
- **API Routes**: Register all endpoints in `src/config/apiEndpoints.ts`. No hardcoded endpoint strings in components.
- **Component State**: Keep local component state scoped. Use loading skeletons, empty states, and pre-save live validation.
- **Keyboard Shortcuts**: Bind global shortcuts (`Ctrl+N`, `Ctrl+S`, `Ctrl+P`, `Ctrl+F`, `Ctrl+K`, `Esc`) and display visual key tags in tooltips.
- **Print Layout**: Include `@media print` CSS hiding navigation, topbars, and developer drawers.

---

## 2. Naming Conventions

| Language / Asset | Target Asset | Format | Example |
| ---------------- | ------------ | ------ | ------- |
| **PHP** | Class Names | `PascalCase` | `CustomerService`, `CurrencyAcl` |
| **PHP** | Methods & Variables | `camelCase` | `getCurrencies()`, `$userContext` |
| **PHP** | Constants & Enums | `UPPER_SNAKE_CASE` | `REQUEST_ID`, `FATAL_PHP_ERROR` |
| **TypeScript** | Components & Interfaces | `PascalCase` | `CurrencyExchangeView`, `Customer` |
| **TypeScript** | Hooks & Functions | `camelCase` | `fetchSuppliers()`, `useDebounce` |
| **SQL** | Tables | `0_snake_case` | `0_currencies`, `0_audit_trail` |
| **SQL** | Columns | `snake_case` | `curr_abrev`, `exchange_rate` |
| **Git** | Commit Messages | Conventional Commit | `feat(currencies): add edit and archive modal` |

---

## 3. Git Commit Message Format

Every commit must follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short summary in present tense>

[optional body describing technical motivation and implementation details]

[optional footer referencing issue/task IDs]
```

### Allowed Types:
- `feat`: New business feature or module enhancement
- `fix`: Bug fix in API, database, or UI
- `docs`: Documentation, methodology, ADR, or spec updates
- `refactor`: Code restructuring without functional behavior changes
- `test`: Automated verification script or test case addition
- `chore`: Build configuration, Docker, or dependency updates

---

## 4. UI/UX Design System Tokens

- **Color Palette**:
  - Primary Brand: HSL Tailored Corporate Blue (`#0f172a` / `#1e293b` / `#3b82f6`)
  - Backgrounds: Modern Slate Dark & Light Mode Support (`bg-background`, `bg-card`, `bg-slate-900`)
  - Success: Emerald (`#10b981` / `text-emerald-400`)
  - Warning: Amber (`#f59e0b` / `text-amber-400`)
  - Error/Rose: Rose (`#f43f5e` / `text-rose-400`)
- **Typography**: Inter / Outfit Google Fonts via CSS variables.
- **Interactive Controls**: Micro-animations, smooth hover states, responsive layouts.

---

## 5. QA Code Review & Quality Checklist

Before submitting code for review:
- [ ] No direct `fetch()` calls exist in component views.
- [ ] Endpoint is registered in `apiEndpoints.ts`.
- [ ] Pre-save live validation works.
- [ ] Mutation generates a structured entry in `0_audit_trail`.
- [ ] HTTP 500 error popups are eliminated; friendly error with request ID is displayed.
- [ ] `@media print` CSS hides sidebar and topbar.
- [ ] Keyboard shortcuts (`Ctrl+N`, `Ctrl+S`, `Ctrl+P`, `Ctrl+F`, `Ctrl+K`) are bound.
- [ ] Zero hardcoded Gemini model strings exist.
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npm run build` transforms modules cleanly.

