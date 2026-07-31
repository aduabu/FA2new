import React from 'react';
import { 
  ArrowLeft, Save, RotateCcw, Sparkles, Star, AlertTriangle, 
  CheckCircle2, Info, List, History, Landmark, Layers 
} from 'lucide-react';
import { toggleFavorite, isFavorite } from '../../utils/favoritesManager';

export interface WorkspaceTab {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: string | number;
}

interface UniversalRecordWorkspaceProps {
  entityType: string;
  recordId: string | number;
  title: string;
  subtitle?: string;
  statusBadge?: React.ReactNode;
  hasUnsavedChanges?: boolean;
  activeTab: string;
  tabs: WorkspaceTab[];
  onTabChange: (tabId: string) => void;
  onBack: () => void;
  onSave?: () => void;
  onRevert?: () => void;
  onAIAnalyze?: () => void;
  children: React.ReactNode;
  extraHeaderActions?: React.ReactNode;
}

export const UniversalRecordWorkspace: React.FC<UniversalRecordWorkspaceProps> = ({
  entityType,
  recordId,
  title,
  subtitle,
  statusBadge,
  hasUnsavedChanges = false,
  activeTab,
  tabs,
  onTabChange,
  onBack,
  onSave,
  onRevert,
  onAIAnalyze,
  children,
  extraHeaderActions
}) => {
  const [fav, setFav] = React.useState(() => isFavorite(entityType, recordId));

  const handleToggleFav = () => {
    const isNowFav = toggleFavorite({ entity: entityType, id: recordId, title });
    setFav(isNowFav);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* HEADER BAR */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={onBack}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground truncate">{title}</h2>
              <button 
                onClick={handleToggleFav}
                className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                title={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${fav ? 'fill-amber-400' : ''}`} />
              </button>
              {statusBadge}
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Unsaved Changes
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap">
          {extraHeaderActions}
          
          {onAIAnalyze && (
            <button
              onClick={onAIAnalyze}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Scoped AI Analysis
            </button>
          )}

          {onRevert && (
            <button
              onClick={onRevert}
              className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Revert Changes
            </button>
          )}

          {onSave && (
            <button
              onClick={onSave}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                hasUnsavedChanges 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              }`}
            >
              <Save className="w-3.5 h-3.5" /> Save Record
            </button>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-border flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon || Info;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* WORKSPACE TAB CONTENT VIEWPORT */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm min-h-[400px]">
        {children}
      </div>
    </div>
  );
};
