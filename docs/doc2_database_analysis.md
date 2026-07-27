# Document 2: Database Analysis & Schema Architecture

## FrontAccounting ERP v2.4.20 — Complete Modernization Study

---

# Part 1: Executive Database Overview

FrontAccounting ERP v2.4.20 utilizes a relational database architecture (MySQL / MariaDB with the InnoDB storage engine). The schema consists of **80 tables** using a table-prefix convention (e.g., `0_table_name` for Company #0, `1_table_name` for Company #1) to achieve lightweight multi-tenancy.

> [!IMPORTANT]
> **Key Database Finding:** FrontAccounting does **NOT** enforce foreign key constraints at the MySQL engine level (`FOREIGN KEY` clauses are absent in SQL definitions). Referential integrity is enforced **100% within the PHP application layer** inside atomic database transactions (`begin_transaction()` ... `commit_transaction()`). The modernization strategy maintains this application-level referential integrity pattern while adding database-level constraints for new API schemas.

---

# Part 2: Complete 80-Table Catalog

The table below documents every table in FrontAccounting v2.4.20 grouped by functional domain:

### 2.1 General Ledger & Core Accounting (12 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_gl_trans` | GL | `counter` (auto) | **Core Ledger Table** — every debited/credited transaction line in system | `type`, `type_no`, `tran_date`, `account`, `dimension_id`, `dimension2_id`, `amount`, `memo_`, `person_type_id`, `person_id` |
| `0_chart_master` | GL | `account_code` | Chart of accounts definitions | `account_code`, `account_code2`, `account_name`, `account_type`, `inactive` |
| `0_chart_types` | GL | `id` | Chart account type groupings | `id`, `name`, `class_id`, `parent`, `inactive` |
| `0_chart_class` | GL | `cid` | Top-level account classes (Assets, Liabilities, Income, Expense) | `cid`, `class_name`, `ctype`, `inactive` |
| `0_journal` | GL | `type`, `trans_no` | Header metadata for manual journal entries | `type`, `trans_no`, `amount`, `currency`, `rate`, `reference`, `event_date`, `doc_date` |
| `0_bank_accounts` | Banking | `id` | Company bank and cash accounts master | `account_code`, `account_type`, `bank_account_name`, `bank_account_number`, `bank_curr_code`, `bank_charge_act` |
| `0_bank_trans` | Banking | `id` | Bank transaction log (deposits, payments, transfers) | `type`, `trans_no`, `bank_act`, `ref`, `trans_date`, `amount`, `person_type_id`, `person_id`, `reconciled` |
| `0_budget_trans` | GL | `id` | General ledger account budgets | `tran_date`, `account`, `amount`, `dimension_id`, `dimension2_id` |
| `0_fiscal_year` | System | `id` | Fiscal year start/end dates and closed status | `begin`, `end`, `closed` |
| `0_currencies` | System | `curr_abrev` | Currency definitions and symbols | `currency`, `curr_abrev`, `curr_symbol`, `hundreds_name`, `inactive` |
| `0_exchange_rates` | System | `id` | Daily foreign currency exchange rates | `curr_code`, `rate_buy`, `date_` |
| `0_quick_entries` | GL | `id` | Quick journal entry templates | `type`, `description`, `base_amount`, `base_desc` |
| `0_quick_entry_lines` | GL | `id` | Lines for quick entry templates | `qid`, `action`, `dest_id`, `amount`, `dimension_id`, `dimension2_id` |

### 2.2 Sales & Customer Receivables (13 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_debtors_master` | Sales | `debtor_no` | Customer master account details | `debtor_no`, `name`, `debtor_ref`, `address`, `tax_id`, `curr_code`, `sales_type`, `credit_limit`, `payment_terms` |
| `0_cust_branch` | Sales | `branch_code`, `debtor_no` | Customer delivery branches and sales reps | `branch_code`, `debtor_no`, `br_name`, `br_address`, `salesman`, `area`, `sales_account`, `receivables_account` |
| `0_debtor_trans` | Sales | `type`, `trans_no` | Sales transaction headers (Invoices, Credit Notes, Payments, Deliveries) | `trans_no`, `type`, `debtor_no`, `branch_code`, `tran_date`, `due_date`, `ov_amount`, `ov_gst`, `ov_freight`, `alloc` |
| `0_debtor_trans_details` | Sales | `id` | Sales transaction line items | `debtor_trans_no`, `debtor_trans_type`, `stock_id`, `description`, `unit_price`, `quantity`, `discount_percent`, `standard_cost` |
| `0_cust_allocations` | Sales | `id` | Mapping of customer payments/credits to invoices | `amt`, `date_alloc`, `trans_type_from`, `trans_no_from`, `trans_type_to`, `trans_no_to` |
| `0_sales_orders` | Sales | `trans_type`, `order_no` | Sales Order and Quotation headers | `order_no`, `trans_type`, `debtor_no`, `branch_code`, `customer_ref`, `ord_date`, `order_type`, `ship_via`, `deliver_to` |
| `0_sales_order_details` | Sales | `id` | Sales Order line items | `order_no`, `trans_type`, `stk_code`, `description`, `qty_sent`, `unit_price`, `quantity`, `discount_percent` |
| `0_sales_types` | Sales | `id` | Price lists and sales categories | `sales_type`, `tax_included`, `factor`, `inactive` |
| `0_salesman` | Sales | `salesman_code` | Sales representative definitions | `salesman_code`, `salesman_name`, `salesman_phone`, `provision`, `breakpt` |
| `0_areas` | Sales | `area_code` | Geographic sales areas | `area_code`, `description`, `inactive` |
| `0_groups` | Sales | `id` | Customer groups | `description`, `inactive` |
| `0_recurrent_invoices` | Sales | `id` | Automated recurring billing definitions | `description`, `order_no`, `debtor_no`, `group_no`, `days`, `monthly`, `begin`, `end`, `last_sent` |
| `0_credit_status` | Sales | `id` | Customer credit approval statuses | `reason_description`, `dissallow_invoices`, `inactive` |

### 2.3 Purchasing & Supplier Payables (9 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_suppliers` | Purchasing | `supplier_id` | Supplier master records | `supplier_id`, `supp_name`, `supp_ref`, `address`, `curr_code`, `payment_terms`, `tax_group_id`, `payable_account` |
| `0_purch_orders` | Purchasing | `order_no` | Purchase Order headers | `order_no`, `supplier_id`, `comments`, `ord_date`, `reference`, `requisition_no`, `into_stock_location` |
| `0_purch_order_details` | Purchasing | `po_detail_item` | PO line items | `order_no`, `item_code`, `description`, `delivery_date`, `qty_invoiced`, `unit_price`, `act_price`, `quantity_ordered`, `quantity_received` |
| `0_grn_batch` | Purchasing | `id` | Goods Received Note batch header | `supplier_id`, `purch_order_no`, `delivery_date`, `loc_code` |
| `0_grn_items` | Purchasing | `id` | Goods Received Note line items | `grn_batch_id`, `po_detail_item`, `item_code`, `description`, `qty_recd`, `quantity_inv` |
| `0_supp_trans` | Purchasing | `type`, `trans_no` | Supplier transaction headers (Bills, Credits, Payments, GRNs) | `trans_no`, `type`, `supplier_id`, `tran_date`, `due_date`, `supp_reference`, `ov_amount`, `ov_gst`, `alloc` |
| `0_supp_invoice_items` | Purchasing | `id` | Supplier Invoice line item details | `supp_trans_no`, `supp_trans_type`, `gl_code`, `grn_item_id`, `po_detail_item_id`, `unit_price`, `quantity` |
| `0_supp_allocations` | Purchasing | `id` | Supplier payment allocation mapping | `amt`, `date_alloc`, `trans_type_from`, `trans_no_from`, `trans_type_to`, `trans_no_to` |
| `0_purch_data` | Purchasing | `supplier_id`, `stock_id` | Supplier purchasing prices and lead times | `supplier_id`, `stock_id`, `price`, `suppliers_uom`, `conversion_factor`, `supplier_description` |

### 2.4 Inventory & Stock Control (10 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_stock_master` | Inventory | `stock_id` | Master catalog of items and services | `stock_id`, `category_id`, `description`, `long_description`, `units`, `mb_flag`, `sales_account`, `cogs_account`, `inventory_account`, `actual_cost` |
| `0_stock_category` | Inventory | `category_id` | Inventory categories and default accounts | `category_id`, `description`, `dflt_tax_type`, `dflt_units`, `dflt_mb_flag`, `dflt_sales_act`, `dflt_cogs_act`, `dflt_inventory_act` |
| `0_stock_moves` | Inventory | `trans_id` | **Core Inventory Ledger** — all stock movements | `stock_id`, `type`, `trans_no`, `loc_code`, `tran_date`, `person_id`, `price`, `reference`, `qty`, `standard_cost` |
| `0_loc_stock` | Inventory | `loc_code`, `stock_id` | On-hand balance per location | `loc_code`, `stock_id`, `reorder_level` |
| `0_locations` | Inventory | `loc_code` | Warehouse and store locations | `loc_code`, `location_name`, `delivery_address`, `contact` |
| `0_item_codes` | Inventory | `id` | Barcodes, UPCs, and customer product codes | `item_code`, `stock_id`, `description`, `category_id`, `quantity`, `is_foreign` |
| `0_prices` | Inventory | `id` | Selling prices by currency and sales type | `stock_id`, `sales_type_id`, `curr_abrev`, `price` |
| `0_item_units` | Inventory | `abbr` | Units of Measure definitions | `abbr`, `name`, `decimals`, `inactive` |
| `0_item_tax_types` | Inventory | `id` | Tax classifications for items | `name`, `exempt`, `inactive` |
| `0_item_tax_type_exemptions` | Inventory | `item_tax_type_id`, `tax_type_id` | Tax exemptions per item class | `item_tax_type_id`, `tax_type_id` |

### 2.5 Manufacturing & Work Orders (9 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_workorders` | Manufacturing | `id` | Work Order headers | `wo_ref`, `loc_code`, `units_req`, `stock_id`, `type`, `required_by`, `released_date`, `closed`, `released`, `units_issued` |
| `0_wo_requirements` | Manufacturing | `id` | BOM components required per work order | `workorder_id`, `stock_id`, `workcentre`, `units_req`, `unit_quantity`, `units_issued` |
| `0_wo_issues` | Manufacturing | `issue_no` | Material issue transactions | `workorder_id`, `reference`, `issue_date`, `loc_code` |
| `0_wo_issue_items` | Manufacturing | `id` | Component lines issued to work order | `issue_id`, `stock_id`, `qty_issued`, `unit_cost` |
| `0_wo_manufacture` | Manufacturing | `id` | Finished product production receipts | `workorder_id`, `reference`, `quantity`, `date_` |
| `0_wo_costing` | Manufacturing | `id` | Labour and overhead cost allocations | `workorder_id`, `cost_type`, `value` |
| `0_bom` | Manufacturing | `parent`, `component`, `workcentre_added`, `loc_code` | Bill of Materials relationships | `parent`, `component`, `workcentre_added`, `loc_code`, `quantity` |
| `0_workcentres` | Manufacturing | `id` | Work Centre master definitions | `name`, `description`, `inactive` |
| `0_stock_fa_class` | Fixed Assets | `fa_class_id` | Fixed Asset classes & depreciation rules | `fa_class_id`, `parent_id`, `description`, `depreciation_rate` |

### 2.6 Taxation & System Administration (27 Tables)
| Table Name | Module | Primary Key | Business Purpose | Key Columns |
|---|---|---|---|---|
| `0_tax_types` | Taxes | `id` | Tax rate definitions & GL accounts | `rate`, `name`, `sales_gl_code`, `purchasing_gl_code`, `inactive` |
| `0_tax_groups` | Taxes | `id` | Tax group definitions | `name`, `tax_shipping`, `inactive` |
| `0_tax_group_items` | Taxes | `tax_group_id`, `tax_type_id` | Taxes within each group | `tax_group_id`, `tax_type_id`, `rate` |
| `0_trans_tax_details` | Taxes | `id` | Tax audit details per transaction | `trans_type`, `trans_no`, `tran_date`, `tax_type_id`, `rate`, `ex_rate`, `included_in_price`, `net_amount`, `amount` |
| `0_users` | Admin | `id` | User accounts and credentials | `user_id`, `password`, `real_name`, `role_id`, `language`, `email`, `active` |
| `0_security_roles` | Admin | `id` | Role permission matrices | `role`, `description`, `sections`, `areas`, `inactive` |
| `0_audit_trail` | Admin | `id` | **Audit Log** — transaction edit tracking | `type`, `trans_no`, `user`, `stamp`, `description`, `fiscal_year`, `gl_date`, `gl_seq` |
| `0_comments` | Admin | `type`, `id` | Transaction memos and notes | `type`, `id`, `date_`, `memo_` |
| `0_refs` | Admin | `id`, `type` | Document reference counters | `id`, `type`, `reference` |
| `0_reflines` | Admin | `id` | Reference prefix/number patterns | `trans_type`, `prefix`, `pattern`, `description`, `dflt` |
| `0_attachments` | Admin | `id` | Uploaded document attachments | `description`, `type_no`, `trans_no`, `unique_name`, `filename`, `filesize`, `filetype` |
| `0_dimensions` | Dimensions | `id` | Cost/Profit Center dimensions | `reference`, `name`, `type_`, `date_`, `due_`, `closed` |
| `0_shippers` | Admin | `shipper_id` | Shipping carriers | `shipper_id`, `shipper_name`, `contact`, `phone` |
| `0_sys_prefs` | Admin | `name` | Company preferences key-value store | `name`, `category`, `type`, `length`, `value` |
| `0_sql_trail` | Admin | `id` | Raw SQL query trail (optional debug) | `sql`, `result`, `msg` |
| `0_tags` | Admin | `id` | Record tagging system | `type`, `name`, `description` |
| `0_tag_associations` | Admin | `record_id`, `tag_id` | Links tags to GL accounts/dims | `record_id`, `tag_id` |
| `0_useronline` | Admin | `timestamp` | Track online active sessions | `timestamp`, `ip`, `file` |
| `0_voided` | Admin | `type`, `id` | Log of voided transactions | `type`, `id`, `date_`, `memo_` |
| `0_crm_categories` | CRM | `id` | Contact categories | `type`, `action`, `name`, `description` |
| `0_crm_contacts` | CRM | `id` | Links contacts to entities | `person_id`, `type`, `action`, `entity_id` |
| `0_crm_persons` | CRM | `id` | Individual contact details | `ref`, `name`, `name2`, `address`, `phone`, `email` |
| `0_print_profiles` | Printing | `id` | Print profile definitions | `profile`, `report`, `printer` |
| `0_printers` | Printing | `id` | Printer network definitions | `name`, `description`, `queue` |
| `0_sales_pos` | Sales | `id` | Point of Sale terminal profiles | `pos_name`, `cash_sale`, `credit_sale`, `pos_location`, `pos_account` |

---

# Part 3: Entity-Relationship Architecture Diagram

```mermaid
erDiagram
    0_chart_master ||--o{ 0_gl_trans : "posts to"
    0_debtors_master ||--o{ 0_cust_branch : "has branches"
    0_debtors_master ||--o{ 0_debtor_trans : "incurs transactions"
    0_cust_branch ||--o{ 0_debtor_trans : "receives deliveries"
    0_debtor_trans ||--o{ 0_debtor_trans_details : "contains lines"
    0_debtor_trans ||--o{ 0_cust_allocations : "allocated by"

    0_suppliers ||--o{ 0_purch_orders : "issues orders to"
    0_suppliers ||--o{ 0_supp_trans : "incurs transactions"
    0_purch_orders ||--o{ 0_purch_order_details : "contains lines"
    0_supp_trans ||--o{ 0_supp_invoice_items : "contains items"
    0_supp_trans ||--o{ 0_supp_allocations : "allocated by"

    0_stock_master ||--o{ 0_stock_moves : "moves"
    0_stock_master ||--o{ 0_loc_stock : "stored at"
    0_stock_master ||--o{ 0_prices : "priced in"
    0_stock_category ||--o{ 0_stock_master : "categorizes"
    0_locations ||--o{ 0_loc_stock : "holds inventory"

    0_gl_trans }|--|| 0_audit_trail : "recorded in"
    0_debtor_trans }|--|| 0_gl_trans : "posts GL impact"
    0_supp_trans }|--|| 0_gl_trans : "posts GL impact"
    0_stock_moves }|--|| 0_gl_trans : "posts valuation"

    0_workorders ||--o{ 0_wo_requirements : "requires"
    0_workorders ||--o{ 0_wo_issues : "issues"
    0_bom }|--|| 0_stock_master : "defines assembly"
```

---

# Part 4: Multi-Tenant Architecture & Table Prefixing

FrontAccounting handles multiple company entities within a single database through a **Table Prefix Architecture**:

```
Company 0 Tables:  0_debtors_master,  0_gl_trans,  0_stock_master ...
Company 1 Tables:  1_debtors_master,  1_gl_trans,  1_stock_master ...
Company N Tables:  N_debtors_master,  N_gl_trans,  N_stock_master ...
```

### Modernized Multi-Tenant Gateway
In the new React + REST architecture, tenant isolation is maintained dynamically via JWT claims and API Middleware:

```
1. Client sends HTTP Request: Header "Authorization: Bearer <JWT>"
2. Gateway extracts claim: "tenant_id": 1
3. Middleware dynamically sets PHP constant define('TB_PREF', '1_')
4. All repository queries automatically hit company 1's isolated tables
```

---

# Part 5: Database Performance & Indexing Analysis

### Missing Index Vulnerabilities Identified
Currently, several critical query paths lack composite indexes, leading to full table scans during large-scale reporting:

1. **`0_gl_trans`**: Needs composite index `(account, tran_date, amount)` for fast Trial Balance and Ledger generation.
2. **`0_stock_moves`**: Needs composite index `(stock_id, loc_code, tran_date)` for instantaneous stock valuation calculations.
3. **`0_debtor_trans`**: Needs composite index `(debtor_no, type, tran_date)` for fast Aged Receivables reports.
4. **`0_supp_trans`**: Needs composite index `(supplier_id, type, tran_date)` for fast Aged Payables reports.

---

# Part 6: Secure React-to-Database Data Access Architecture

React components will **NEVER** connect directly to MySQL. Data access flows strictly through a multi-tiered Repository Pattern:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ REACT PRESENTATION LAYER                                                                │
│ React Query Hook: `useCustomerInvoices(customerId)`                                    │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ HTTP GET /api/v1/customers/42/invoices
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│ REST API CONTROLLER LAYER                                                               │
│ `CustomerInvoiceController::index(Request $request)`                                   │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Invokes Typed Service Method
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│ REPOSITORY SERVICE LAYER (PHP Core Wrapper)                                             │
│ `CustomerRepository::getInvoices($id)` calls legacy `get_customer_trans()`              │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Executes Parameterized SQL Query
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│ MYSQL DATABASE (`0_debtor_trans`)                                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

*End of Document 2. Next: Document 3 — UI & Printing System Analysis.*
