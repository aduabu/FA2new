-- FrontAccounting Enterprise Platform — Initial Database Schema & Demo Seed Data Script (v1.0.0-RC1)

CREATE DATABASE IF NOT EXISTS `frontacct` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `frontacct`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `0_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `real_name` varchar(60) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT '1',
  `email` varchar(100) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_users` (`id`, `user_id`, `password`, `real_name`, `role_id`, `email`, `active`) VALUES
(1, 'admin', '$2y$10$abcdefghijklmnopqrstuu', 'System Administrator', 1, 'admin@enterprise.local', 1),
(2, 'demouser', '$2y$10$abcdefghijklmnopqrstuu', 'Demo Financial Controller', 2, 'controller@enterprise.local', 1)
ON DUPLICATE KEY UPDATE `user_id`=`user_id`;

-- 2. CHART OF ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS `0_chart_master` (
  `account_code` varchar(15) NOT NULL,
  `account_name` varchar(60) NOT NULL,
  `account_type` varchar(10) NOT NULL,
  `inactive` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`account_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_chart_master` (`account_code`, `account_name`, `account_type`, `inactive`) VALUES
('1060', 'Current Bank Account', 'ASSET', 0),
('1065', 'Petty Cash Account', 'ASSET', 0),
('1200', 'Accounts Receivable', 'ASSET', 0),
('1510', 'Inventory Asset', 'ASSET', 0),
('2100', 'Accounts Payable', 'LIABILITY', 0),
('2150', 'Sales Tax (GST) Payable', 'LIABILITY', 0),
('3010', 'Retained Earnings', 'EQUITY', 0),
('4010', 'Sales Revenue', 'INCOME', 0),
('5010', 'Cost of Goods Sold (COGS)', 'EXPENSE', 0),
('6810', 'Depreciation Expense', 'EXPENSE', 0)
ON DUPLICATE KEY UPDATE `account_code`=`account_code`;

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS `0_debtors_master` (
  `debtor_no` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` text,
  `tax_id` varchar(55) DEFAULT NULL,
  `curr_code` varchar(3) NOT NULL DEFAULT 'USD',
  `credit_limit` double NOT NULL DEFAULT '10000',
  `payment_terms` varchar(20) DEFAULT 'Net 30',
  PRIMARY KEY (`debtor_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_debtors_master` (`debtor_no`, `name`, `address`, `tax_id`, `curr_code`, `credit_limit`, `payment_terms`) VALUES
(1, 'Acme Global Logistics', '100 Enterprise Way, Suite 400', 'US-9920141', 'USD', 50000.00, 'Net 30'),
(2, 'Global Retailers Ltd', '55 Market Square', 'US-8810294', 'USD', 25000.00, 'Net 15')
ON DUPLICATE KEY UPDATE `debtor_no`=`debtor_no`;

-- 4. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS `0_suppliers` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `supp_name` varchar(100) NOT NULL,
  `address` text,
  `curr_code` varchar(3) NOT NULL DEFAULT 'USD',
  `payment_terms` varchar(20) DEFAULT 'Net 30',
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_suppliers` (`supplier_id`, `supp_name`, `address`, `curr_code`, `payment_terms`) VALUES
(1, 'Industrial Components Co', '700 Industrial Parkway', 'USD', 'Net 30'),
(2, 'Raw Materials Supplier Corp', '12 Logistics Blvd', 'USD', 'Net 30')
ON DUPLICATE KEY UPDATE `supplier_id`=`supplier_id`;

-- 5. INVENTORY CATALOG TABLE
CREATE TABLE IF NOT EXISTS `0_item_codes` (
  `item_code` varchar(20) NOT NULL,
  `stock_id` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `category` varchar(30) NOT NULL,
  `material_cost` double NOT NULL DEFAULT '0',
  `qty_on_hand` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`item_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_item_codes` (`item_code`, `stock_id`, `description`, `category`, `material_cost`, `qty_on_hand`) VALUES
('ITEM-A100', 'ITEM-A100', 'Industrial Widget A', 'Finished Goods', 85.00, 150),
('ITEM-B200', 'ITEM-B200', 'Service Assembly B', 'Assemblies', 220.00, 45),
('RAW-C010', 'RAW-C010', 'Steel Fastener Ring', 'Raw Materials', 12.50, 500)
ON DUPLICATE KEY UPDATE `item_code`=`item_code`;

-- 6. AUDIT TRAIL LOG
CREATE TABLE IF NOT EXISTS `0_audit_trail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `trans_no` int(11) NOT NULL,
  `user` varchar(60) NOT NULL,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `0_audit_trail` (`id`, `type`, `trans_no`, `user`, `stamp`, `description`) VALUES
(1, 10, 1042, 'admin', '2026-07-27 18:24:15', 'Invoice INV-2026-0042 posted to GL & Customer Receivables'),
(2, 12, 31, 'admin', '2026-07-27 18:20:00', 'Payment REM-2026-0031 allocated to INV-1042 ($2,645.50)')
ON DUPLICATE KEY UPDATE `id`=`id`;
