import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Compass, 
  ArrowRight, 
  Lightbulb, 
  FileCode, 
  ChevronRight,
  Database,
  Search,
  Zap,
  TrendingUp,
  FolderTree
} from "lucide-react";
import { ProjectState, TargetOutputMode } from "../types";
import { deriveProjectProgress, deriveProjectDiscoveries, deriveWorkflowStages } from "../utils/projectStatusEngine";
import { deriveDevPanelState } from "../utils/targetProjections";
import { RepoHealthList } from "./GitHubDevPanel";

interface ProjectStatusPaneProps {
  project: ProjectState;
  onSelectTargetMode?: (mode: TargetOutputMode) => void;
  onTriggerBuild?: () => void;
  onUpdatePrompt?: (newPrompt: string) => void;
}

export const ProjectStatusPane: React.FC<ProjectStatusPaneProps> = ({
  project,
  onSelectTargetMode,
  onTriggerBuild,
  onUpdatePrompt,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "readiness" | "architecture" | "prompt">("overview");
  const [isCopied, setIsCopied] = useState(false);

  const progress = deriveProjectProgress(project);
  const discoveries = deriveProjectDiscoveries(project);
  const workflowStages = deriveWorkflowStages(project);
  const hasPrompt = Boolean(project.buildPrompt && project.buildPrompt.trim().length > 0);
  const isReady = project.isPromptAchieved || (hasPrompt && project.masterPromptStatus === "prompt_achieved");

  const handleCopyPrompt = () => {
    if (!project.buildPrompt) return;
    navigator.clipboard.writeText(project.buildPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const devPanelState = deriveDevPanelState(
    project.identity?.title || "App",
    project.buildPrompt,
    project.downstreamRepresentation,
    project.readinessChecks
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* 1. PROJECT IDENTITY HEADER */}
      <div className="p-4 sm:p-5 bg-stone-50/90 border-b border-stone-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono bg-stone-200/80 text-stone-700">
                <span className={`w-2 h-2 rounded-full ${isReady ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                {progress.stageLabel}
              </span>
              <span className="text-xs font-mono text-stone-600">
                ID: {project.identity?.id?.slice(0, 12) || "proj-live"}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {project.identity?.title || "Intelligent Project Specification"}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
              {project.understanding || "Developing high-precision specification through natural dialogue and rigorous readiness gating."}
            </p>
          </div>

          {/* Progress Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-stone-900">
                {progress.percentage}%
              </span>
              <span className="text-xs font-mono text-stone-600">specified</span>
            </div>
            <span className={`text-[11px] font-medium font-mono ${isReady ? "text-emerald-800" : "text-amber-800"}`}>
              {isReady ? "Readiness Gate Passed" : "Gate Evaluating"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isReady 
                  ? "bg-emerald-500 shadow-sm" 
                  : "bg-stone-800"
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* 2. PROJECT EVOLUTION / WORKFLOW STAGES (Idea → Research → Opportunity → Build) */}
        <div className="mt-4 pt-3.5 border-t border-stone-200/70">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-600 gap-1 overflow-x-auto pb-1">
            {workflowStages.map((stage, idx) => {
              const isDone = stage.status === "completed";
              const isActive = stage.status === "active";
              return (
                <div key={stage.id} className="flex items-center gap-1.5 shrink-0">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] ${
                    isDone 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold" 
                      : isActive 
                      ? "bg-amber-50 text-amber-800 border border-amber-200 font-semibold"
                      : "text-stone-400 bg-stone-100/70"
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    )}
                    <span>{stage.label}</span>
                  </div>
                  {idx < workflowStages.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between gap-2 text-xs font-medium">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "overview"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Discovered Intelligence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("readiness")}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "readiness"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>8-Dimension Gate</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
              isReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {(project.readinessChecks || []).filter((c) => c.status === "met").length}/8
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "architecture"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Implementation Map
          </button>
          {hasPrompt && (
            <button
              type="button"
              onClick={() => setActiveTab("prompt")}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 font-mono text-[11px] ${
                activeTab === "prompt"
                  ? "bg-white text-stone-900 shadow-xs font-bold text-amber-700"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <FileCode className="w-3 h-3 text-amber-600" />
              <span>Prompt Artifact</span>
            </button>
          )}
        </div>

        {/* Action button in tab bar if prompt is ready */}
        {isReady && (
          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-700 hover:text-stone-900 px-2 py-0.5 rounded border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
            <span>{isCopied ? "Copied" : "Copy Spec"}</span>
          </button>
        )}
      </div>

      {/* 3. MAIN CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-stone-800 text-xs">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* NEXT MOVE / PAYOFF CARD */}
            <div className={`p-4 rounded-xl border transition-all ${
              isReady 
                ? "bg-emerald-50/80 border-emerald-200 shadow-xs" 
                : "bg-amber-50/70 border-amber-200/90 shadow-xs"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider">
                    {isReady ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Specification Ready for Production
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" />
                        Next Recommended Move
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                    {progress.nextStepPrompt}
                  </p>
                </div>

                {isReady ? (
                  <a
                    href="https://ai.studio/build"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg shadow-sm transition-all shrink-0 active:scale-95"
                  >
                    <span>Build this →</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                ) : (
                  <button
                    onClick={onTriggerBuild}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-lg shadow-2xs transition-colors shrink-0"
                  >
                    <span>Validate Gate</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}
              </div>
            </div>

            {/* DISCOVERED INTELLIGENCE: RESEARCH & MARKET GAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Market Opportunity */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <Search className="w-3.5 h-3.5 text-stone-500" />
                    <span>Market Differentiation</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
                    Validated
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-stone-900 leading-snug">
                    {discoveries.market.gapIdentified}
                  </p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {discoveries.market.observedGap || discoveries.market.differentiationOpportunity}
                  </p>
                </div>
              </div>

              {/* Workflow Pattern */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Workflow Mechanics</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
                    Architecture
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-stone-900 leading-snug">
                    {discoveries.workflow.observedPattern}
                  </p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    <strong>Friction solved:</strong> {discoveries.workflow.currentFriction}
                  </p>
                </div>
              </div>
            </div>

            {/* Research Findings Feed */}
            <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-stone-600" />
                  <span className="font-semibold text-stone-900 text-xs">
                    Discovered Insights & Constraints
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-600">
                  {discoveries.market.findings.length} findings recorded
                </span>
              </div>

              <div className="space-y-2.5">
                {discoveries.market.findings.map((finding) => (
                  <div 
                    key={finding.id} 
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-800 font-semibold uppercase tracking-wider">
                        {finding.source}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      {finding.whatWasFound}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      <strong>Impact:</strong> {finding.whyItMatters}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specification Items Checklist */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2.5">
              <span className="font-mono text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Specification Completeness Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {discoveries.discoveredItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 p-1.5 bg-white rounded border border-stone-200/60"
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    )}
                    <span className={item.done ? "text-stone-800 font-medium" : "text-stone-500"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 8-DIMENSION READINESS GATE */}
        {activeTab === "readiness" && (
          <div className="space-y-4">
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-stone-900 uppercase">
                  8-Dimension Quality Gate
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  isReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {isReady ? "GATE PASSED" : "EVALUATING SPECIFICATION"}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Before generating an implementation prompt, the system verifies all 8 canonical dimensions. Incomplete dimensions prevent hallucinations by intentionally withholding output until resolved.
              </p>
            </div>

            <div className="space-y-2">
              {(project.readinessChecks || [
                { id: "core_purpose", label: "Core Purpose Understood", status: "met", details: "Specific problem and user established." },
                { id: "primary_workflow", label: "Primary User Workflow Defined", status: "unresolved", details: "Input-to-output interaction loop requires confirmation." },
                { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "pending", details: "Exact payload types and generated assets." },
                { id: "capabilities", label: "Key Capabilities Established", status: "pending", details: "Functional boundaries locked without scope creep." },
                { id: "architecture", label: "Architectural Decisions Resolved", status: "pending", details: "Explicit stack and storage patterns." },
                { id: "ambiguities", label: "Material Ambiguities Addressed", status: "unresolved", details: "Core tradeoffs explicitly decided." },
                { id: "consistency", label: "Internally Consistent", status: "met", details: "No contradictory decisions." },
                { id: "retention", label: "No Lost Decisions / Anti-Drift", status: "met", details: "Continuous canonical state preserved." },
              ]).map((check) => {
                const isMet = check.status === "met";
                const isUnresolved = check.status === "unresolved";
                return (
                  <div
                    key={check.id}
                    className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                      isMet
                        ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-950"
                        : isUnresolved
                        ? "bg-amber-50/60 border-amber-200 text-amber-950"
                        : "bg-stone-50 border-stone-200 text-stone-600"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          isMet ? "bg-emerald-500" : isUnresolved ? "bg-amber-500 animate-pulse" : "bg-stone-400"
                        }`} />
                        <span className="font-semibold text-xs">{check.label}</span>
                      </div>
                      {check.details && (
                        <p className="text-[11px] text-stone-600 pl-4 leading-normal">
                          {check.details}
                        </p>
                      )}
                    </div>

                    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                      isMet 
                        ? "bg-emerald-100 text-emerald-800" 
                        : isUnresolved 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-stone-200 text-stone-700"
                    }`}>
                      {isMet ? "Passed" : isUnresolved ? "Unresolved" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: IMPLEMENTATION MAP & PROPOSED FILES */}
        {activeTab === "architecture" && (
          <div className="space-y-4">
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-lg">
              <span className="font-mono text-xs font-bold text-stone-900 uppercase block mb-1">
                Implementation Map & Architecture
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Deterministic projection of module contracts derived directly from the canonical master prompt. Modules are only declared ready when their specification contracts are fully resolved.
              </p>
            </div>

            <RepoHealthList modules={devPanelState.modules} />

            {/* Proposed File Tree */}
            <div className="bg-stone-900 text-stone-200 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Proposed File Tree (Future Architecture)</span>
                <span className="text-amber-400 text-[10px]">Deterministic Projection</span>
              </div>
              <pre className="text-stone-300 leading-relaxed text-[11px]">
                {devPanelState.rawFileTree}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: PROMPT ARTIFACT (ONLY VISIBLE WHEN PROMPT EXISTS) */}
        {activeTab === "prompt" && hasPrompt && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div>
                <span className="font-mono text-xs font-bold text-stone-900 uppercase">
                  Canonical AI Studio Implementation Prompt
                </span>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Copy and paste directly into Google AI Studio Build.
                </p>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-lg shadow-2xs transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Copied" : "Copy Prompt"}</span>
              </button>
            </div>

            <div className="flex-1 min-h-[300px] bg-stone-950 text-stone-200 rounded-lg border border-stone-800 p-3.5 font-mono text-xs overflow-hidden flex flex-col">
              <textarea
                value={project.buildPrompt}
                onChange={(e) => onUpdatePrompt?.(e.target.value)}
                className="w-full h-full bg-transparent text-stone-200 resize-none focus:outline-none leading-relaxed selection:bg-amber-500/30"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER BAR WITH DIRECT PAYOFF */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sniper Continuity Engine: State Preserved</span>
        </div>

        <div className="flex items-center gap-2">
          {isReady ? (
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
            >
              <span>Launch AI Studio Build →</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          ) : (
            <button
              onClick={onTriggerBuild}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs rounded-lg transition-colors"
            >
              <span>Trigger Readiness Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
