import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Network,
  ListOrdered,
  GitBranch,
  ShieldCheck,
  Hammer,
  Terminal,
  Palette,
  Info
} from "lucide-react";
import { 
  ReadinessDimensionCheck, 
  DownstreamProjectRepresentation,
  TargetOutputMode,
  TargetProjections,
  TargetModeMeta 
} from "../types";
import { TARGET_MODES, deriveTargetProjections, deriveDevPanelState } from "../utils/targetProjections";
import { GitHubDevPanel } from "./GitHubDevPanel";

interface PromptBuildPaneProps {
  workingPrompt: string;
  setWorkingPrompt: (val: string) => void;
  selectedModel: string;
  isPromptAchieved?: boolean;
  masterPromptStatus?: "discovering" | "defining" | "readiness_withheld" | "prompt_achieved" | "refining_change";
  readinessChecks?: ReadinessDimensionCheck[];
  downstreamRepresentation?: DownstreamProjectRepresentation | null;
  activeTargetMode?: TargetOutputMode;
  targetProjections?: TargetProjections;
  onSelectTargetMode?: (mode: TargetOutputMode) => void;
  onUpdateProjection?: (mode: TargetOutputMode, text: string) => void;
  projectTitle?: string;
  projectRequirements?: any;
}

export const PromptBuildPane: React.FC<PromptBuildPaneProps> = ({
  workingPrompt,
  setWorkingPrompt,
  selectedModel,
  isPromptAchieved = false,
  masterPromptStatus = "discovering",
  readinessChecks,
  downstreamRepresentation,
  activeTargetMode = "build",
  targetProjections,
  onSelectTargetMode,
  onUpdateProjection,
  projectTitle = "",
  projectRequirements,
}) => {
  const [internalMode, setInternalMode] = useState<TargetOutputMode>(activeTargetMode);
  const currentMode = onSelectTargetMode ? activeTargetMode : internalMode;

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"projection" | "canonical" | "downstream">("projection");
  const [devSubView, setDevSubView] = useState<"structured" | "raw">("structured");
  const [downstreamSection, setDownstreamSection] = useState<"arch" | "repo" | "modules" | "steps">("arch");
  const [showPrincipleInfo, setShowPrincipleInfo] = useState<boolean>(false);

  const hasPrompt = Boolean(workingPrompt && workingPrompt.trim().length > 0);

  // Derive target projections deterministically if not explicitly supplied
  const effectiveProjections = useMemo(() => {
    if (targetProjections && (targetProjections.build || targetProjections.dev || targetProjections.create)) {
      return targetProjections;
    }
    return deriveTargetProjections(
      projectTitle,
      workingPrompt,
      projectRequirements,
      downstreamRepresentation
    );
  }, [targetProjections, projectTitle, workingPrompt, projectRequirements, downstreamRepresentation]);

  const activeModeMeta = useMemo(() => {
    return TARGET_MODES.find((m) => m.id === currentMode) || TARGET_MODES[0];
  }, [currentMode]);

  // Current text to display and copy
  const activeDisplayText = useMemo(() => {
    if (activeView === "canonical") {
      return workingPrompt;
    }
    return effectiveProjections[currentMode] || workingPrompt;
  }, [activeView, effectiveProjections, currentMode, workingPrompt]);

  const devPanelState = useMemo(() => {
    return deriveDevPanelState(projectTitle, workingPrompt, downstreamRepresentation, readinessChecks);
  }, [projectTitle, workingPrompt, downstreamRepresentation, readinessChecks]);

  const handleModeChange = (mode: TargetOutputMode) => {
    if (onSelectTargetMode) {
      onSelectTargetMode(mode);
    } else {
      setInternalMode(mode);
    }
    if (activeView === "downstream") {
      setActiveView("projection");
    }
  };

  const handleCopy = () => {
    if (!activeDisplayText) return;
    navigator.clipboard.writeText(activeDisplayText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTextChange = (newVal: string) => {
    if (activeView === "canonical") {
      setWorkingPrompt(newVal);
    } else {
      if (onUpdateProjection) {
        onUpdateProjection(currentMode, newVal);
      } else {
        // If editing in projection mode directly, update canonical if build mode or pass through
        if (currentMode === "build") {
          setWorkingPrompt(newVal);
        }
      }
    }
  };

  const lineCount = activeDisplayText ? activeDisplayText.split("\n").length : 0;
  const wordCount = activeDisplayText ? activeDisplayText.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Pane Top Header */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-stone-700" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
              Living Master Prompt
            </span>
            {hasPrompt ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Prompt Achieved
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Readiness Gate Active
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
            <span>
              {hasPrompt
                ? "Canonical master specification projected for target AI environments"
                : "Withheld until the project passes all 8 readiness gate dimensions"}
            </span>
            <button
              type="button"
              onClick={() => setShowPrincipleInfo(!showPrincipleInfo)}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="Learn about Separation of Definition from Output"
            >
              <Info className="w-3.5 h-3.5 inline-block" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasPrompt}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
              hasPrompt
                ? "bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                : "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
            }`}
            title={hasPrompt ? activeModeMeta.primaryActionLabel : "Prompt is withheld until readiness gate passes"}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{hasPrompt ? activeModeMeta.primaryActionLabel : "Copy Prompt"}</span>
              </>
            )}
          </button>

          {/* Destination Link */}
          {activeModeMeta.destinationUrl && (
            <a
              href={activeModeMeta.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 font-medium text-xs transition-colors"
              title={`Open ${activeModeMeta.targetLabel} in a new tab`}
            >
              <span>{currentMode === "create" ? "Open Suno" : "Open AI Studio"}</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </a>
          )}
        </div>
      </div>

      {/* Target Output Modes Selector Bar */}
      <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-stone-200/90 p-1 rounded-lg">
          {TARGET_MODES.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all font-mono ${
                  isSelected
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900 font-medium"
                }`}
              >
                {mode.id === "build" && <Hammer className={`w-3.5 h-3.5 ${isSelected ? "text-amber-500" : "text-stone-500"}`} />}
                {mode.id === "dev" && <Terminal className={`w-3.5 h-3.5 ${isSelected ? "text-blue-500" : "text-stone-500"}`} />}
                {mode.id === "create" && <Palette className={`w-3.5 h-3.5 ${isSelected ? "text-purple-500" : "text-stone-500"}`} />}
                <span>{mode.name}</span>
                <span className="text-[10px] text-stone-400 font-normal">({mode.internalDistinction})</span>
              </button>
            );
          })}
        </div>

        {/* View toggles when prompt is achieved */}
        {hasPrompt && (
          <div className="flex items-center gap-2">
            {currentMode === "dev" && activeView === "projection" && (
              <div className="flex items-center bg-stone-200/90 p-0.5 rounded-lg text-[10px] font-mono border border-stone-300">
                <button
                  type="button"
                  onClick={() => setDevSubView("structured")}
                  className={`px-2 py-0.5 rounded transition-all ${
                    devSubView === "structured"
                      ? "bg-blue-600 text-white font-semibold shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Implementation Map
                </button>
                <button
                  type="button"
                  onClick={() => setDevSubView("raw")}
                  className={`px-2 py-0.5 rounded transition-all ${
                    devSubView === "raw"
                      ? "bg-blue-600 text-white font-semibold shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Raw Prompt
                </button>
              </div>
            )}
            <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setActiveView("projection")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeView === "projection"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {activeModeMeta.name} Projection
              </button>
              <button
                type="button"
                onClick={() => setActiveView("canonical")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeView === "canonical"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Canonical Prompt
              </button>
              {downstreamRepresentation && (
                <button
                  type="button"
                  onClick={() => setActiveView("downstream")}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    activeView === "downstream"
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <FolderTree className="w-3 h-3 text-stone-500" />
                  Downstream Plan
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Target Mode Context Strip */}
      <div className="px-4 py-2 bg-stone-900 text-stone-300 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-amber-400 font-bold uppercase">{activeModeMeta.tagline}</span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400">Target: {activeModeMeta.targetLabel}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-stone-400">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasPrompt ? "bg-emerald-400" : "bg-amber-400"}`} />
          <span>{hasPrompt ? "Validated" : "Gated"}</span>
        </div>
      </div>

      {/* Principle Banner (Toggleable) */}
      {showPrincipleInfo && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-sans flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Principle: Separation of Project Definition from Output Format</span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              The <strong>canonical master prompt</strong> describes what the user wants to create. <strong>Target-specific generation</strong> determines how that intent must be expressed for the selected creation environment (<strong>BUILD</strong> for AI Studio app builders, <strong>DEV</strong> for LLM coding agents, and <strong>CREATE</strong> for creative tools like Suno).
            </p>
          </div>
          <button
            onClick={() => setShowPrincipleInfo(false)}
            className="text-amber-700 hover:text-amber-950 font-bold text-xs shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 bg-stone-950 text-stone-200 font-mono text-xs overflow-y-auto leading-relaxed relative flex flex-col">
        {!hasPrompt ? (
          /* Readiness Gate View */
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="max-w-md mx-auto my-auto w-full">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-4 shadow-inner mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-stone-200 font-semibold text-base font-sans text-center mb-1">
                Output Withheld by Readiness Gate
              </div>
              <div className="text-stone-400 text-xs font-sans text-center mb-6 leading-normal">
                Implementation output for <strong>BUILD</strong>, <strong>DEV</strong>, and <strong>CREATE</strong> targets is withheld until the canonical project definition is sufficiently understood, explored, and validated.
              </div>

              {/* 8 Readiness Dimensions Breakdown */}
              <div className="bg-stone-900/90 rounded-lg border border-stone-800/80 p-4 font-sans text-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-3 flex items-center justify-between">
                  <span>Readiness Gate Criteria (8 Dimensions)</span>
                  <span className="text-amber-400 font-normal">Active Evaluation</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(readinessChecks || [
                    { id: "purpose", label: "Core Purpose Understood", status: "met" },
                    { id: "workflow", label: "Primary Workflow Defined", status: "unresolved" },
                    { id: "io", label: "Inputs & Outputs Specified", status: "pending" },
                    { id: "capabilities", label: "Important Capabilities Established", status: "pending" },
                    { id: "architecture", label: "Architecture Resolved (No Hallucination)", status: "pending" },
                    { id: "ambiguity", label: "Material Ambiguities Addressed", status: "unresolved" },
                    { id: "consistency", label: "Internally Consistent Definition", status: "pending" },
                    { id: "retention", label: "No Lost Decisions / Anti-Drift", status: "met" },
                  ]).map((check) => {
                    const isMet = check.status === "met";
                    const isUnresolved = check.status === "unresolved";
                    return (
                      <div
                        key={check.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-[11px] ${
                          isMet
                            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                            : isUnresolved
                            ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                            : "bg-stone-950/40 border-stone-800/60 text-stone-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isMet ? "bg-emerald-400" : isUnresolved ? "bg-amber-400 animate-pulse" : "bg-stone-600"
                            }`}
                          />
                          <span>{check.label}</span>
                        </div>
                        <span className="font-mono text-[10px] uppercase">
                          {isMet ? "PASSED" : isUnresolved ? "UNRESOLVED" : "PENDING"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Helpful hint for user */}
              <div className="mt-4 text-center text-[11px] text-stone-500 font-sans">
                Continue the conversation in the left pane to clarify workflows or say{" "}
                <span className="text-stone-300 font-mono">"Okay. Build this"</span> to finalize.
              </div>
            </div>
          </div>
        ) : activeView === "downstream" && downstreamRepresentation ? (
          /* Downstream Plan Representation View */
          <div className="flex-1 flex flex-col p-5 overflow-y-auto text-xs space-y-4">
            {/* Sub-nav for downstream view */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <button
                onClick={() => setDownstreamSection("arch")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  downstreamSection === "arch"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setDownstreamSection("repo")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  downstreamSection === "repo"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <FolderTree className="w-3 h-3" />
                Repository Tree
              </button>
              <button
                onClick={() => setDownstreamSection("modules")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  downstreamSection === "modules"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Network className="w-3 h-3" />
                Modules
              </button>
              <button
                onClick={() => setDownstreamSection("steps")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  downstreamSection === "steps"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <ListOrdered className="w-3 h-3" />
                Implementation Steps
              </button>
            </div>

            {/* Architecture Section */}
            {downstreamSection === "arch" && (
              <div className="space-y-3 font-sans">
                <div className="bg-stone-900/80 rounded-lg p-3.5 border border-stone-800">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
                    Core Technical Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {downstreamRepresentation.architecture.stack.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 text-xs font-mono border border-stone-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-stone-900/80 rounded-lg p-3.5 border border-stone-800">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
                      Storage Strategy
                    </div>
                    <p className="text-stone-300 text-xs">{downstreamRepresentation.architecture.storage}</p>
                  </div>
                  <div className="bg-stone-900/80 rounded-lg p-3.5 border border-stone-800">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
                      Layout Pattern
                    </div>
                    <p className="text-stone-300 text-xs">{downstreamRepresentation.architecture.pattern}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Repository Structure Section */}
            {downstreamSection === "repo" && (
              <div className="space-y-4">
                <pre className="p-3.5 bg-stone-900 rounded-lg border border-stone-800 text-amber-300/90 font-mono text-[11px] overflow-x-auto whitespace-pre leading-normal">
                  {downstreamRepresentation.repositoryStructure.treeText}
                </pre>
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">File Responsibilities:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {downstreamRepresentation.repositoryStructure.files.map((file, idx) => (
                      <div key={idx} className="bg-stone-900/70 p-2.5 rounded border border-stone-800/80 flex flex-col gap-1">
                        <span className="font-mono text-amber-400 text-[11px]">{file.path}</span>
                        <span className="text-stone-400 text-[11px] font-sans">{file.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Module Relationships Section */}
            {downstreamSection === "modules" && (
              <div className="space-y-3 font-sans">
                {downstreamRepresentation.moduleRelationships.modules.map((mod, idx) => (
                  <div key={idx} className="bg-stone-900/80 rounded-lg p-3 border border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold text-xs">{mod.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">Module</span>
                    </div>
                    <p className="text-stone-300 text-xs">{mod.responsibility}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-stone-400">
                      <span>Dependencies:</span>
                      <span className="text-stone-300">{mod.dependencies.join(", ") || "None"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Implementation Steps Section */}
            {downstreamSection === "steps" && (
              <div className="space-y-3 font-sans">
                {downstreamRepresentation.implementationPlan.steps.map((step) => (
                  <div key={step.stepNumber} className="bg-stone-900/80 rounded-lg p-3.5 border border-stone-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-mono font-bold text-[10px]">
                        {step.stepNumber}
                      </span>
                      <span className="font-semibold text-stone-200 text-xs">{step.title}</span>
                    </div>
                    <p className="text-stone-400 text-xs pl-7">{step.promptObjective}</p>
                    <div className="pl-7 space-y-1">
                      <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Verification Criteria:</div>
                      {step.verificationCriteria.map((crit, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GitHub Future Note */}
            <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-stone-600" />
              <span>{downstreamRepresentation.gitHubIntegrationNote || "Downstream project representation derived directly from achieved master prompt."}</span>
            </div>
          </div>
        ) : currentMode === "dev" && activeView === "projection" && devSubView === "structured" ? (
          /* Structured DEV Panel with Traffic Light Repository Health and Target Repo Controls */
          <GitHubDevPanel devState={devPanelState} />
        ) : (
          /* Editable Target Projection or Canonical Master Prompt */
          <textarea
            value={activeDisplayText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-full p-4 bg-transparent text-stone-200 resize-none focus:outline-none leading-relaxed font-mono selection:bg-amber-500/30"
            spellCheck={false}
          />
        )}
      </div>

      {/* Target-Specific Step-by-Step Footer */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-stone-600 text-[11px]">
          <span className="font-semibold text-stone-800">Target Workflow:</span>
          {currentMode === "build" && (
            <span className="flex items-center gap-2">
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">1. Copy Build Prompt</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">2. Open AI Studio Build</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">3. Paste & Build App</span>
            </span>
          )}
          {currentMode === "dev" && (
            <span className="flex items-center gap-2">
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">1. Copy Dev Plan</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">2. Feed to Coding Agent / Cursor</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">3. Execute File Steps</span>
            </span>
          )}
          {currentMode === "create" && (
            <span className="flex items-center gap-2">
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">1. Copy Creative Brief</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">2. Open Suno / Midjourney</span>
              <span className="text-stone-400">→</span>
              <span className="font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">3. Generate Audio/Assets</span>
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          disabled={!hasPrompt}
          className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
            hasPrompt
              ? "text-stone-800 hover:text-stone-950 underline underline-offset-2 cursor-pointer"
              : "text-stone-400 cursor-not-allowed"
          }`}
        >
          {isCopied ? "Copied to clipboard!" : hasPrompt ? `Click to ${activeModeMeta.primaryActionLabel.toLowerCase()}` : "Withheld until ready"}
        </button>
      </div>
    </div>
  );
};
