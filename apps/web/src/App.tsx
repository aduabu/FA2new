import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SalesInvoiceEditor } from './components/sales/SalesInvoiceEditor';
import { JournalEntryGrid } from './components/gl/JournalEntryGrid';
import { CommandPalette } from './components/common/CommandPalette';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  const getWorkspaceTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Executive Control Center';
      case 'sales-invoice': return 'Sales Invoice Editor';
      case 'gl-journal': return 'Manual Journal Entry Studio';
      case 'sales': return 'Sales & Accounts Receivable';
      case 'purchasing': return 'Purchasing & Accounts Payable';
      case 'inventory': return 'Inventory & Stock Management';
      case 'manufacturing': return 'Manufacturing & Work Orders';
      case 'banking': return 'Banking & Cash Management';
      case 'gl': return 'General Ledger & Chart of Accounts';
      case 'reporting': return 'Financial Reports & Analytics';
      case 'setup': return 'System Administration & Setup';
      default: return 'Executive Control Center';
    }
  };

  const renderActiveWorkspace = () => {
    switch (currentTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'sales-invoice':
      case 'sales':
        return <SalesInvoiceEditor />;
      case 'gl-journal':
      case 'gl':
        return <JournalEntryGrid />;
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
