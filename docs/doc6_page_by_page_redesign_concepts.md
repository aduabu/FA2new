# Document 6: Page-by-Page Redesign Concepts

## FrontAccounting ERP v2.4.20 — Complete Modernization Study

---

# Executive Summary

This document provides detailed redesign concepts for every major workspace across FrontAccounting ERP. The redesign replaces outdated table-based layouts with responsive, accessible, keyboard-driven React components while maintaining 100% functional parity with underlying business routines.

---

# 1. Executive Dashboard Concept

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [Logo]  [Workspace: Executive Dashboard ▾]  [ Cmd+K Search ]  [🔔 3]  [👤 Admin]│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ FINANCIAL KPI CARDS                                                                     │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Total Revenue    │ │ Total Expenses   │ │ Net Profit Margin│ │ Cash Balance     │ │
│ │ $1,428,950.00    │ │ $912,400.00      │ │ 36.1%            │ │ $514,280.00      │ │
│ │ ↑ 12.4% vs last mo│ │ ↓ 2.1% vs last mo│ │ ↑ 4.2% vs last mo│ │ ↑ $45,000 this wk│ │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ │
├───────────────────────────────────────────┬─────────────────────────────────────────────┤
│ CASH FLOW & REVENUE (Recharts Chart)      │ PENDING APPROVALS QUEUE                     │
│ [ Bar/Line Chart: Inflows vs Outflows ]   │ ⚠️ PO-2026-0089 ($14,500)  [Approve] [Reject]│
│                                           │ ⚠️ JV-2026-0012 ($60,000)  [Review]         │
│                                           │ ℹ️ Credit Override: Acme   [Approve]         │
├───────────────────────────────────────────┼─────────────────────────────────────────────┤
│ INVENTORY ALERT WIDGET                    │ QUICK ACTIONS LAUNCHPAD                     │
│ 🛑 Item A001 (Out of stock) [Create PO]   │ [ + Sales Order ]   [ + Supplier Invoice ]  │
│ ⚠️ Item B042 (Low: 3 remaining)          │ [ + Journal Entry]  [ 📊 Financial Reports] │
└───────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

# 2. Sales Module Redesign

## 2.1 Sales Invoice Editor (`sales/customer_invoice.php`)

### ASCII Wireframe: Modern Split-Screen Invoice Workspace

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Sales / Invoices / New Invoice                    [ Draft Auto-Saved 14:02 ] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ HEADER INPUTS                                                                           │
│ Customer: [ Search Customer (e.g. Acme Corp) ▾ ]  Branch: [ Main Branch ▾ ]             │
│ Date: [ 2026-07-27 📅 ]   Due Date: [ 2026-08-27 📅 ]   Ref: [ INV-2026-0042 ]          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ DYNAMIC LINE ITEMS GRID (<EditableDocLineGrid>)                                         │
│ ┌───┬──────────────┬────────────────────────┬──────┬────────────┬───────┬─────────────┐ │
│ │ # │ Item Code    │ Description            │ Qty  │ Unit Price │ Disc% │ Total ($)   │ │
│ ├───┼──────────────┼────────────────────────┼──────┼────────────┼───────┼─────────────┤ │
│ │ 1 │ ITEM-A100    │ Industrial Widget A    │   10 │     150.00 │    0% │    1,500.00 │ │
│ │ 2 │ ITEM-B200    │ Service Assembly B     │    2 │     450.00 │    5% │      855.00 │ │
│ └───┴──────────────┴────────────────────────┴──────┴────────────┴───────┴─────────────┘ │
│ [ + Add Item (F2) ]   [ 📷 Scan Barcode ]                                                │
├───────────────────────────────────────────┬─────────────────────────────────────────────┤
│ MEMO & PAYMENT DETAILS                    │ FINANCIAL SUMMARY                           │
│ Payment Terms: [ Net 30 Days ▾ ]          │ Subtotal:                          2,355.00 │
│ Comments:                                 │ Shipping / Freight:                   50.00 │
│ [ Invoice for Q3 deliverables           ] │ Sales Tax (10% GST):                 240.50 │
│                                           │ ─────────────────────────────────────────── │
│                                           │ GRAND TOTAL ($):                   2,645.50 │
├───────────────────────────────────────────┴─────────────────────────────────────────────┤
│ FOOTER ACTIONS                                                                          │
│ [ Cancel (Esc) ]                  [ 📄 Live Preview ]   [ 💾 Process & Post (Ctrl+S) ]  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Improvements & Key Features
- **Split-Screen Live Preview**: Toggle live PDF rendering panel alongside form input.
- **Fast Item Addition**: Press `F2` or type in autocomplete row to add products in under 2 seconds.
- **Instant Tax Calculation**: Client-side calculation mirrors server `tax_calc.inc` logic in real-time.

---

# 3. Purchasing Module Redesign

## 3.1 Purchase Order Entry (`purchasing/po_entry_items.php`)

### Redesign Specification
- **Supplier Price History Panel**: Displays past 5 PO prices for the selected item to prevent overpaying.
- **Multi-Location Shipping**: Easily split line items to different warehouse destinations.
- **1-Click Conversion**: Convert approved PO directly into Goods Received Note (GRN) or Supplier Invoice.

---

# 4. Inventory Module Redesign

## 4.1 Stock Master & Item Catalog (`inventory/manage/items.php`)

### Redesign Specification
- **Unified Item Card**: Replaces separate tabs with a single modern workspace showing item details, stock on hand per location, selling prices across currencies, and movement history.
- **Image Drag-and-Drop**: Upload product pictures with automatic preview thumbnail generation.
- **Reorder Point Highlights**: Visual indicators flagging items below minimum safety stock.

---

# 5. Manufacturing Module Redesign

## 5.1 Work Order Management (`manufacturing/work_order_entry.php`)

### Redesign Specification
- **Interactive BOM Explorer**: Tree-view hierarchy of assembly components with real-time stock availability check for every child component.
- **Production Status Pipeline**: Kanban board view (`Draft > Released > In Production > Completed`).

---

# 6. General Ledger & Banking Redesign

## 6.1 Manual Journal Entry Workspace (`gl/gl_journal.php`)

### ASCII Wireframe: Balanced Journal Workspace

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb: General Ledger / Journal Entry / New Entry                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ENTRY HEADER                                                                            │
│ Date: [ 2026-07-27 📅 ]   Reference: [ JRN-2026-0104 ]   Currency: [ USD ▾ ]          │
│ Document Memo: [ Quarter-end depreciation adjustment                                  ] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ BALANCED JOURNAL GRID (<JournalEntryGrid>)                                              │
│ ┌───┬──────────────┬────────────────────────────────┬──────────────┬──────────────┐   │
│ │ # │ Account Code │ Account Name                   │ Debit ($)    │ Credit ($)   │   │
│ ├───┼──────────────┼────────────────────────────────┼──────────────┼──────────────┤   │
│ │ 1 │ 6810         │ Depreciation Expense           │    12,450.00 │         0.00 │   │
│ │ 2 │ 1060         │ Accumulated Depr - Equipment   │         0.00 │    12,450.00 │   │
│ └───┴──────────────┴────────────────────────────────┴──────────────┴──────────────┘   │
│ [ + Add Line (F2) ]   [ ⚖️ Auto-Balance Line (Ctrl+B) ]                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ JOURNAL BALANCE SUMMARY                                                                 │
│ Total Debits: $12,450.00   |   Total Credits: $12,450.00   |   Difference: $0.00 ✅   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Cancel (Esc) ]                                            [ 💾 Post Journal (Ctrl+S) ]│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Bank Reconciliation Studio (`gl/bank_account_reconcile.php`)

### Redesign Specification
- **Drag-and-Drop Statement Matcher**: Upload OFX/CSV bank statements; system automatically matches deposits/payments against system records with confidence scores (100% match, partial match).

---

# 7. Interactive Reporting Workspace

## 7.1 Real-Time Trial Balance & Financial Statements

### ASCII Wireframe: Interactive Financial Statement Studio

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Reports / Financial Statements / Trial Balance                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ REPORT FILTERS BAR                                                                      │
│ Period: [ Q2 2026 ▾ ]  Start: [ 2026-04-01 ]  End: [ 2026-06-30 ]  Dim: [ All ▾ ]       │
│ [ 🔍 Apply Filters ]   [ 📄 Export PDF ]   [ 📊 Export Excel ]   [ 🖨️ Print ]          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ INTERACTIVE TRIAL BALANCE GRID                                                          │
│ ┌──────────────┬───────────────────────────────┬──────────────┬──────────────┐          │
│ │ Account Code │ Account Description           │ Debit ($)    │ Credit ($)   │          │
│ ├──────────────┼───────────────────────────────┼──────────────┼──────────────┤          │
│ │ ▶ 1000       │ ASSETS (Group)                │   450,100.00 │         0.00 │          │
│ │   1060       │   Current Bank Account        │   120,400.00 │         0.00 │ [Drill]  │
│ │   1200       │   Accounts Receivable         │   329,700.00 │         0.00 │ [Drill]  │
│ │ ▶ 2000       │ LIABILITIES (Group)           │         0.00 │   210,000.00 │          │
│ │ ▶ 4000       │ SALES REVENUE                 │         0.00 │   840,500.00 │          │
│ └──────────────┴───────────────────────────────┴──────────────┴──────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

*End of Document 6. Next: Document 7 — Migration Roadmap & Final Recommendations.*
