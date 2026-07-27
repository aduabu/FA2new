import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SalesInvoiceEditor } from './components/sales/SalesInvoiceEditor';
import { JournalEntryGrid } from './components/gl/JournalEntryGrid';
import { CommandPalette } from './components/common/CommandPalette';

// Master Data Views
import { ChartOfAccountsView } from './components/masterdata/ChartOfAccountsView';
import { CustomerManagementView } from './components/masterdata/CustomerManagementView';
import { SupplierManagementView } from './components/masterdata/SupplierManagementView';
import { InventoryCatalogView } from './components/masterdata/InventoryCatalogView';
import { TaxConfigurationView } from './components/masterdata/TaxConfigurationView';
import { CurrencyExchangeView } from './components/masterdata/CurrencyExchangeView';
import { DimensionsView } from './components/masterdata/DimensionsView';

// Transaction Processing Studios
import { SalesOrderStudio } from './components/transactions/SalesOrderStudio';
import { CustomerPaymentStudio } from './components/transactions/CustomerPaymentStudio';
import { SupplierBillStudio } from './components/transactions/SupplierBillStudio';
import { BankTransactionStudio } from './components/transactions/BankTransactionStudio';
import { StockAdjustmentStudio } from './components/transactions/StockAdjustmentStudio';

// Phase 4 Reporting & Integrity Views
import { TrialBalanceStudio } from './components/reporting/TrialBalanceStudio';
import { AuditTrailStudio } from './components/reporting/AuditTrailStudio';
import { AccountingIntegrityTestRunner } from './components/reporting/AccountingIntegrityTestRunner';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  const getWorkspaceTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Executive Control Center';
      case 'trial-balance': return 'Interactive Trial Balance Studio';
      case 'audit-trail': return 'Enterprise Audit Trail & Timeline';
      case 'integrity-tests': return 'Accounting Integrity Automated Test Suite';
      case 'sales-order': return 'Sales Order & Quotation Studio';
      case 'sales-invoice': return 'Sales Invoice Editor';
      case 'customer-payment': return 'Customer Payment & Allocation Engine';
      case 'supplier-bill': return 'Supplier Bill & 3-Way Match Studio';
      case 'bank-trans': return 'Bank Payment & Inter-Bank Transfer';
      case 'stock-adj': return 'Stock Adjustment & Valuation Studio';
      case 'gl-journal': return 'Manual Journal Entry Studio';
      case 'chart-accounts': return 'Chart of Accounts (GL Master)';
      case 'customers': return 'Customer Accounts & Branches';
      case 'suppliers': return 'Supplier Accounts & Vendors';
      case 'inventory': return 'Inventory & Stock Catalog';
      case 'taxes': return 'Tax Types & Configurations';
      case 'currencies': return 'Currencies & Foreign Exchange Rates';
      case 'dimensions': return 'Cost & Profit Center Dimensions';
      default: return 'Executive Control Center';
    }
  };

  const renderActiveWorkspace = () => {
    switch (currentTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'trial-balance':
      case 'reporting':
        return <TrialBalanceStudio />;
      case 'audit-trail':
        return <AuditTrailStudio />;
      case 'integrity-tests':
        return <AccountingIntegrityTestRunner />;
      case 'sales-order':
        return <SalesOrderStudio />;
      case 'sales-invoice':
      case 'sales':
        return <SalesInvoiceEditor />;
      case 'customer-payment':
        return <CustomerPaymentStudio />;
      case 'supplier-bill':
      case 'purchasing':
        return <SupplierBillStudio />;
      case 'bank-trans':
      case 'banking':
        return <BankTransactionStudio />;
      case 'stock-adj':
      case 'manufacturing':
        return <StockAdjustmentStudio />;
      case 'gl-journal':
        return <JournalEntryGrid />;
      case 'chart-accounts':
      case 'gl':
        return <ChartOfAccountsView />;
      case 'customers':
        return <CustomerManagementView />;
      case 'suppliers':
        return <SupplierManagementView />;
      case 'inventory':
        return <InventoryCatalogView />;
      case 'taxes':
        return <TaxConfigurationView />;
      case 'currencies':
        return <CurrencyExchangeView />;
      case 'dimensions':
        return <DimensionsView />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <Topbar 
          onOpenCmdPalette={() => setIsCmdPaletteOpen(true)} 
          activeWorkspaceTitle={getWorkspaceTitle()} 
        />

        {/* ACTIVE WORKSPACE VIEWPORT */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {renderActiveWorkspace()}
        </main>
      </div>

      {/* UNIVERSAL COMMAND PALETTE (CMD+K) */}
      <CommandPalette 
        isOpen={isCmdPaletteOpen} 
        onClose={() => setIsCmdPaletteOpen(false)}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
}

export default App;
