import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SalesInvoiceEditor } from './components/sales/SalesInvoiceEditor';
import { JournalEntryGrid } from './components/gl/JournalEntryGrid';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DeveloperDiagnosticsBar } from './components/common/DeveloperDiagnosticsBar';
import { useAppRouter } from './hooks/useAppRouter';

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

// Workspaces
import { SalesInvoiceWorkspace } from './components/sales/SalesInvoiceWorkspace';
import { SupplierBillWorkspace } from './components/transactions/SupplierBillWorkspace';
import { CustomerPaymentWorkspace } from './components/transactions/CustomerPaymentWorkspace';
import { BankingWorkspace } from './components/transactions/BankingWorkspace';


// Phase 4 Reporting & Integrity Views
import { TrialBalanceStudio } from './components/reporting/TrialBalanceStudio';
import { AuditTrailStudio } from './components/reporting/AuditTrailStudio';
import { AccountingIntegrityTestRunner } from './components/reporting/AccountingIntegrityTestRunner';

// Phase 5 Enterprise Operations Studios
import { WorkOrderStudio } from './components/enterprise/WorkOrderStudio';
import { FixedAssetStudio } from './components/enterprise/FixedAssetStudio';
import { BankReconciliationStudio } from './components/enterprise/BankReconciliationStudio';
import { ApprovalInboxStudio } from './components/enterprise/ApprovalInboxStudio';
import { SchedulerWorkerStudio } from './components/enterprise/SchedulerWorkerStudio';

// Phase 6 Enterprise Intelligence & QA Studios
import { AIAssistantStudio } from './components/intelligence/AIAssistantStudio';
import { IntegrationConnectorsStudio } from './components/intelligence/IntegrationConnectorsStudio';
import { FullQASuiteStudio } from './components/intelligence/FullQASuiteStudio';

// Phase 7 & 8 Developer Platform & Production Release Studios
import { PluginSDKPortal } from './components/platform/PluginSDKPortal';
import { TenantManagementStudio } from './components/platform/TenantManagementStudio';
import { ProductionReleaseStudio } from './components/platform/ProductionReleaseStudio';

// Local Developer Status Dashboard
import { LocalDevDashboardStudio } from './components/platform/LocalDevDashboardStudio';

export function App() {
  const { currentTab, tabPayload, navigate } = useAppRouter();
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const handleNavigate = (tab: string, payload?: any) => {
    navigate(tab, payload);
  };

  const getWorkspaceTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Executive Control Center';
      case 'dev-status': return 'Local Developer Status & Environment Dashboard';
      case 'plugin-sdk': return 'Public Developer Platform & Plugin SDK';
      case 'tenant-mgmt': return 'Multi-Tenant Operations & Tenant Provisioning';
      case 'v1-release': return 'Production Release Candidate 1 (v1.0.0-RC1)';
      case 'ai-assistant': return 'Enterprise AI Assistant & Intelligent Search';
      case 'ai-config': return 'AI Router Configuration & Gemini API Setup';
      case 'integrations': return 'Enterprise Integration Connectors & Webhooks';
      case 'qa-suite': return 'Full QA, E2E & Load Benchmark Suite';
      case 'work-orders': return 'Manufacturing & Work Order Studio';
      case 'fixed-assets': return 'Fixed Assets Register & Depreciation';
      case 'bank-rec': return 'Bank Statement Reconciliation Studio';
      case 'approvals': return 'Workflow & Approval Task Inbox';
      case 'scheduler': return 'Redis Background Queue Workers & Scheduler';
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
        return <ExecutiveDashboard onNavigate={handleNavigate} />;
      case 'dev-status':
        return <LocalDevDashboardStudio />;
      case 'plugin-sdk':
        return <PluginSDKPortal />;
      case 'tenant-mgmt':
        return <TenantManagementStudio />;
      case 'v1-release':
        return <ProductionReleaseStudio />;
      case 'ai-assistant':
        return <AIAssistantStudio initialTab="ASSISTANT" />;
      case 'ai-config':
        return <AIAssistantStudio initialTab="CONFIG" />;
      case 'integrations':
        return <IntegrationConnectorsStudio />;
      case 'qa-suite':
        return <FullQASuiteStudio />;
      case 'work-orders':
      case 'manufacturing':
        return <WorkOrderStudio />;
      case 'fixed-assets':
        return <FixedAssetStudio />;
      case 'bank-rec':
        return <BankReconciliationStudio initialAccountCode={tabPayload?.accountCode} />;
      case 'approvals':
        return <ApprovalInboxStudio />;
      case 'scheduler':
        return <SchedulerWorkerStudio />;
      case 'trial-balance':
      case 'reporting':
        return <TrialBalanceStudio onNavigate={handleNavigate} />;
      case 'audit-trail':
        return <AuditTrailStudio />;
      case 'integrity-tests':
        return <AccountingIntegrityTestRunner />;
      case 'sales-order':
        return <SalesOrderStudio />;
      case 'sales-invoice':
      case 'sales':
        if (tabPayload?.transNo) {
          return <SalesInvoiceWorkspace transNo={tabPayload.transNo} onNavigate={handleNavigate} onBack={() => handleNavigate('sales-invoice')} />;
        }
        return <SalesInvoiceEditor initialCustomer={tabPayload?.customer} onNavigate={handleNavigate} />;
      case 'customer-payment':
        if (tabPayload?.transNo) {
          return <CustomerPaymentWorkspace transNo={tabPayload.transNo} onNavigate={handleNavigate} onBack={() => handleNavigate('customer-payment')} />;
        }
        return <CustomerPaymentStudio initialCustomer={tabPayload?.customer} onNavigate={handleNavigate} />;
      case 'supplier-bill':
      case 'purchasing':
        if (tabPayload?.transNo) {
          return <SupplierBillWorkspace transNo={tabPayload.transNo} onNavigate={handleNavigate} onBack={() => handleNavigate('supplier-bill')} />;
        }
        return <SupplierBillStudio initialSupplier={tabPayload?.supplier} initialItemCode={tabPayload?.itemCode} onNavigate={handleNavigate} />;
      case 'bank-trans':
      case 'banking':
        if (tabPayload?.accountCode) {
          return <BankingWorkspace accountCode={tabPayload.accountCode} onNavigate={handleNavigate} onBack={() => handleNavigate('banking')} />;
        }
        return <BankTransactionStudio initialAccountCode={tabPayload?.accountCode} onNavigate={handleNavigate} />;

      case 'stock-adj':
        return <StockAdjustmentStudio initialItemCode={tabPayload?.itemCode} onNavigate={handleNavigate} />;
      case 'gl-journal':
        return <JournalEntryGrid initialAccountCode={tabPayload?.accountCode} initialTransNo={tabPayload?.transNo} onNavigate={handleNavigate} />;
      case 'chart-accounts':
      case 'gl':
        return <ChartOfAccountsView initialAccountCode={tabPayload?.accountCode} onNavigate={handleNavigate} />;
      case 'customers':
        return <CustomerManagementView initialCustomerId={tabPayload?.customerId} onNavigate={handleNavigate} />;
      case 'suppliers':
        return <SupplierManagementView initialSupplierId={tabPayload?.supplierId} onNavigate={handleNavigate} />;
      case 'inventory':
        return <InventoryCatalogView initialItemCode={tabPayload?.itemCode} onNavigate={handleNavigate} />;
      case 'taxes':
        return <TaxConfigurationView />;
      case 'currencies':
        return <CurrencyExchangeView />;
      case 'dimensions':
        return <DimensionsView />;
      default:
        return <ExecutiveDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar currentTab={currentTab} onTabChange={(t) => handleNavigate(t)} />

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <Topbar 
          onOpenCmdPalette={() => setIsCmdPaletteOpen(true)} 
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
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
        onSelectTab={(t, p) => handleNavigate(t, p)}
      />

      {/* ENTERPRISE NOTIFICATION DRAWER */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigate={(t, p) => handleNavigate(t, p)}
      />

      {/* PROTECTED DEVELOPER DIAGNOSTICS & TELEMETRY BAR */}
      <DeveloperDiagnosticsBar userRole="ADMIN" />
    </div>
  );
}

export default App;
