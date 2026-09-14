import React from "react";
import { 
  Workflow, 
  Plus, 
  ShieldAlert, 
  Download, 
  Sparkles, 
  Cpu,
  Layers,
  FileCode2,
  TrendingUp,
  Sliders
} from "lucide-react";
import { ProjectDefinition, ActiveTab } from "../types";

interface HeaderProps {
  currentProject: ProjectDefinition;
  projects: ProjectDefinition[];
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenDriftAuditModal: () => void;
  onOpenExportModal: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasApiKey: boolean;
  driftWarningCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenDriftAuditModal,
  onOpenExportModal,
  activeTab,
  setActiveTab,
  hasApiKey,
  driftWarningCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Market Hole Chat & 1M Credits", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: "orchestrator", label: "Pipeline Overview", icon: <Workflow className="w-4 h-4" /> },
    { id: "factory", label: "AI Studio Factory Plan", icon: <FileCode2 className="w-4 h-4" /> },
    { id: "drift-monitor", label: "Drift Supervisor", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "market", label: "Market Intel", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "product", label: "Product Definition", icon: <Layers className="w-4 h-4" /> },
    { id: "specification", label: "Build Spec (§)", icon: <FileCode2 className="w-4 h-4" /> },
    { id: "strategy", label: "Model Routing & Credits", icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <Workflow className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-base tracking-tight truncate">
                  AI Production Orchestrator
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  Supervisor Mode
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate hidden sm:block">
                Immutable Source of Truth & AI Studio Factory Supervisor
              </p>
            </div>
          </div>

          {/* Project Switcher & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Active Project Dropdown */}
            <div className="relative">
              <select
                id="project-selector"
                value={currentProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-300 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-colors cursor-pointer max-w-[160px] sm:max-w-[240px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* New Project Idea Button */}
            <button
              id="new-project-btn"
              onClick={onOpenNewProjectModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* Quick Drift Audit trigger */}
            <button
              id="header-drift-audit-btn"
              onClick={onOpenDriftAuditModal}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                driftWarningCount > 0
                  ? "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                  : "bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Audit Drift</span>
              {driftWarningCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Export specs */}
            <button
              id="header-export-btn"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
              title="Export Full Project Definition & AGENTS.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Export</span>
            </button>

            {/* AI Engine Status */}
            <div 
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                hasApiKey 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
              title={hasApiKey ? "Gemini 3.8 Flash Engine Connected" : "Running in fallback mode (Add GEMINI_API_KEY in Secrets)"}
            >
              <Cpu className="w-3 h-3" />
              <span>{hasApiKey ? "Gemini 3.8" : "Mock Ready"}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-stone-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "drift-monitor" && driftWarningCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
