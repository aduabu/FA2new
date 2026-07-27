# Document 5: Design System & Component Library Specification

## FrontAccounting ERP v2.4.20 — Complete Modernization Study

---

# Part 1: Design System & Token Foundation

The modernized interface uses a unified Design Token System inspired by leading enterprise design systems (Stripe, Linear, SAP Fiori, Tailwind CSS):

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ DESIGN SYSTEM TOKENS                                                                    │
├───────────────────┬─────────────────────────────────────────────────────────────────────┤
│ Token Category    │ Specification                                                       │
├───────────────────┼─────────────────────────────────────────────────────────────────────┤
│ Typography        │ Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif      │
│ Type Scale        │ xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px) │
│ Spacing Grid      │ 4px baseline grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)          │
│ Border Radius     │ sm (4px), md (6px), lg (8px), xl (12px), full (9999px)              │
│ Elevation / Shadow│ sm (subtle card), md (dropdowns), lg (modals), xl (command palette)│
└───────────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

# Part 2: Enterprise HSL Color Palettes (Light & Dark Mode)

The color system avoids default browser primaries in favor of harmonious, high-contrast HSL values optimized for dense financial accounting work:

```css
/* Light Mode Theme Variables */
:root {
  --background: 210 20% 98%;        /* Slate 50 (#F8FAFC) */
  --foreground: 222 47% 11%;        /* Slate 900 (#0F172A) */
  --card: 0 0% 100%;                /* Pure White (#FFFFFF) */
  --card-foreground: 222 47% 11%;
  --primary: 221 83% 53%;           /* Royal Blue (#2563EB) */
  --primary-foreground: 210 40% 98%;
  --secondary: 215 16% 47%;         /* Slate 600 (#475569) */
  --accent: 142 71% 45%;            /* Emerald Green (#16A34A) */
  --destructive: 0 84% 60%;         /* Coral Red (#EF4444) */
  --warning: 38 92% 50%;             /* Amber Gold (#F59E0B) */
  --border: 214 32% 91%;            /* Slate 200 (#E2E8F0) */
}

/* Dark Mode Theme Variables */
.dark {
  --background: 224 71% 4%;         /* Dark Navy (#020617) */
  --foreground: 210 40% 98%;        /* Bright Slate (#F8FAFC) */
  --card: 222 47% 7%;               /* Card Surface (#0B1329) */
  --card-foreground: 210 40% 98%;
  --primary: 217 91% 60%;           /* Vivid Blue (#3B82F6) */
  --primary-foreground: 222 47% 11%;
  --secondary: 215 20% 65%;
  --accent: 142 70% 50%;            /* Emerald (#22C55E) */
  --destructive: 0 72% 51%;
  --warning: 38 92% 50%;
  --border: 217 33% 17%;            /* Dark Border (#1E293B) */
}
```

---

# Part 3: Reusable Component Library (40+ Components)

Components are split into 5 operational tiers to guarantee modularity and reusability:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ COMPONENT ARCHITECTURE TIERS                                                            │
├───────────────────┬─────────────────────────────────────────────────────────────────────┤
│ Tier              │ Components Included                                                 │
├───────────────────┼─────────────────────────────────────────────────────────────────────┤
│ 1. Core UI        │ Button, Input, Checkbox, Switch, Tooltip, Badge, Avatar, Separator  │
│ 2. Layout         │ Sidebar, Topbar, WorkspaceHeader, TabContainer, Breadcrumbs, Drawer │
│ 3. Form & Input   │ DatePicker, DateRangePicker, Select, Combobox, CurrencyInput        │
│ 4. ERP-Specific   │ AccountSelector, ItemLookup, JournalEntryGrid, EditableDocLineGrid  │
│ 5. Data Display   │ DataTable, Pagination, AuditTrailTimeline, ReportViewer, Charts     │
└───────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### Specialized ERP Component Specifications

#### 1. `<JournalEntryGrid>`
- **Purpose**: High-speed debit/credit entry editor.
- **Features**: Auto-calculates totals, validates `Debit == Credit` in real time, keyboard arrow navigation between cells, `Ctrl+B` auto-balances line.

#### 2. `<AccountSelector>`
- **Purpose**: Searchable combobox for GL Chart of Accounts.
- **Features**: Displays account code + name, filters by account class, flags inactive or subledger accounts.

#### 3. `<CurrencyInput>`
- **Purpose**: Precise monetary input.
- **Features**: Automatically formats input based on user locale preferences (thousands separator, decimal precision), handles multi-currency rates.

#### 4. `<EditableDocLineGrid>`
- **Purpose**: Line item table for Invoices, POs, and Sales Orders.
- **Features**: Drag-and-drop row reordering, dynamic tax calculation updates, discount percentage inputs, stock status indicator pills.

---

# Part 4: Modern Dashboard Specification & Widget Catalog

The modern executive dashboard provides customizable widgets tailored by user role:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ DASHBOARD WIDGET CATALOG                                                                │
├───────────────────┬─────────────────────────────┬───────────────────────────────────────┤
│ Widget Name       │ Primary Visual Element      │ Role Target                           │
├───────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ 1. Cash Flow Trend│ Line Chart (Inflows/Outflows)│ CFO, Senior Accountant                │
│ 2. Sales Summary  │ Area Chart (Revenue growth) │ Sales Manager, CEO                    │
│ 3. Overdue Rec.   │ Bar Chart (Aged Receivables)│ AR Clerk, Credit Manager              │
│ 4. Stock Alerts   │ Warning Table (Low stock)   │ Warehouse Manager, Purchasing         │
│ 5. Pending Approvals│ Interactive Action List    │ Department Manager, Admin             │
│ 6. Bank Balances  │ Balance Cards with FX       │ Cashier, Treasurer                    │
│ 7. Tax Liability  │ Summary Metric Cards        │ Tax Accountant                        │
│ 8. Quick Launch   │ Command Buttons             │ All Users                             │
└───────────────────┴─────────────────────────────┴───────────────────────────────────────┘
```

---

# Part 5: Smart ERP UX & Command Center Features

### 5.1 Keyboard Shortcuts Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL KEYBOARD SHORTCUTS                                                               │
├───────────────────┬─────────────────────────────────────────────────────────────────────┤
│ Shortcut          │ Action Trigger                                                      │
├───────────────────┼─────────────────────────────────────────────────────────────────────┤
│ Cmd + K / Ctrl + K│ Open Universal Command Palette & Search                             │
│ Alt + N           │ Quick Create (Sales Order / Invoice / Journal)                      │
│ Ctrl + S          │ Save / Submit active transaction document                           │
│ Ctrl + B          │ Auto-balance Debit/Credit line in Journal Entry                     │
│ Esc               │ Close Modal, Drawer, or Command Palette                             │
│ Alt + 1 ... 9     │ Switch active Workspace Tab                                         │
└───────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Multi-Tab Workspace Management
The application header includes a Chrome-style Tab Bar allowing accountants to keep multiple screens open simultaneously (e.g., Tab 1: `Sales Order SO-104`, Tab 2: `Customer Master: Acme Corp`, Tab 3: `Trial Balance`):

```
┌─── Tab 1: Sales Order #1042 [x] ├─── Tab 2: Customer: Acme Corp [x] ├─── + New Tab ────────┐
│                                                                                           │
│ [ Active Workspace Viewport Content ]                                                     │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

*End of Document 5. Next: Document 6 — Page-by-Page Redesign Concepts.*
