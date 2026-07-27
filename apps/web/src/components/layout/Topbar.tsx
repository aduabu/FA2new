import React from 'react';
import { Search, Bell, Command, User, HelpCircle, Layers } from 'lucide-react';

interface TopbarProps {
  onOpenCmdPalette: () => void;
  activeWorkspaceTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenCmdPalette, activeWorkspaceTitle }) => {
  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between flex-shrink-0">
      {/* Workspace Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
          <Layers className="w-4 h-4" />
        </div>
        <span className="text-xs text-muted-foreground">Workspace /</span>
        <span className="text-sm font-semibold text-foreground">{activeWorkspaceTitle}</span>
      </div>

      {/* Global Search & Command Center Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCmdPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/60 border border-border text-xs text-muted-foreground hover:bg-muted hover:border-primary/50 transition-all w-72 justify-between group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            <span>Search invoices, GL, customers...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono font-medium text-foreground">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </button>
          
          <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Dropdown Placeholder */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              AD
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium leading-none text-foreground">Administrator</div>
              <div className="text-[10px] text-muted-foreground">System Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
