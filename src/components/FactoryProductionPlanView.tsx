import React, { useState } from "react";
import { 
  ProjectDefinition, 
  ProductionStage, 
  PromptTask 
} from "../types";
import { 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Clock,
  Code
} from "lucide-react";

interface FactoryProductionPlanViewProps {
  project: ProjectDefinition;
  onUpdateStageStatus: (stageId: string, status: ProductionStage["status"]) => void;
  onToggleCriteria: (stageId: string, promptId: string, criteriaIndex: number) => void;
  onRunPromptSimulation: (promptText: string, suggestedModel: string, stageTitle: string) => Promise<string>;
  onAuditOutputInDrift: (output: string, stageContext: string) => void;
}

export const FactoryProductionPlanView: React.FC<FactoryProductionPlanViewProps> = ({
  project,
  onUpdateStageStatus,
  onToggleCriteria,
  onRunPromptSimulation,
  onAuditOutputInDrift,
}) => {
  const [expandedStageId, setExpandedStageId] = useState<string>(
    project.productionPlan.stages[0]?.id || ""
  );
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [simulatingPromptId, setSimulatingPromptId] = useState<string | null>(null);
  const [simulationOutputs, setSimulationOutputs] = useState<Record<string, string>>({});
  const [errorPromptId, setErrorPromptId] = useState<string | null>(null);

  const handleCopyPrompt = (prompt: PromptTask, stage: ProductionStage) => {
    // Generate authoritative, self-contained AI Studio prompt with Source of Truth context
    const fullPrompt = `[GOOGLE AI STUDIO PRODUCTION DIRECTIVE]
APP: ${project.title}
STAGE: Stage #${stage.stageNumber} — ${stage.title}
IMMUTABLE SOURCE OF TRUTH REFS: ${stage.sourceOfTruthRefs.join(", ")}
MODEL ALLOCATION: ${stage.modelTier} (Recommended: ${prompt.suggestedModel})

TASK:
${prompt.task}

DETAILED EXECUTION INSTRUCTIONS:
${prompt.promptText}

MANDATORY CONSTRAINTS:
- Do NOT introduce any unsolicited features or secondary services.
- Strictly respect Non-Goals:
${project.productDefinition.nonGoals.map((ng) => `  * ${ng}`).join("\n")}

ACCEPTANCE CRITERIA FOR THIS STEP:
${prompt.acceptanceCriteria.map((ac) => `[ ] ${ac}`).join("\n")}

Verify your output against the acceptance criteria before presenting the result.`;

    navigator.clipboard.writeText(fullPrompt);
    setCopiedPromptId(prompt.id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleRunSimulation = async (prompt: PromptTask, stage: ProductionStage) => {
    setSimulatingPromptId(prompt.id);
    setErrorPromptId(null);
    try {
      const output = await onRunPromptSimulation(prompt.promptText, prompt.suggestedModel, stage.title);
      setSimulationOutputs((prev) => ({
        ...prev,
        [prompt.id]: output,
      }));
    } catch (err) {
      setErrorPromptId(prompt.id);
    } finally {
      setSimulatingPromptId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-800">
              AI Studio Factory Orchestration
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Sequenced Production Plan & Calibrated Prompts
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1">
            Copy calibrated prompts directly into Google AI Studio. Each prompt binds Gemini to specific §-clauses and injects explicit Non-Goals to avoid drift.
          </p>
        </div>

        {/* AI Studio Link Indicator */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-900">Factory Destination</div>
            <div className="text-[11px] text-stone-500">Google AI Studio Build & Preview</div>
          </div>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {project.productionPlan.stages.map((stage) => {
          const isExpanded = expandedStageId === stage.id;
          const isCompleted = stage.status === "Completed";
          const isInFactory = stage.status === "In Factory";

          return (
            <div
              key={stage.id}
              className={`bg-white rounded-xl border transition-all duration-200 ${
                isExpanded ? "border-stone-400 shadow-sm ring-1 ring-stone-300" : "border-stone-200 hover:border-stone-300"
              }`}
            >
              {/* Stage Header Accordion */}
              <div
                onClick={() => setExpandedStageId(isExpanded ? "" : stage.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : isInFactory
                        ? "bg-sky-100 text-sky-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : `0${stage.stageNumber}`}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-stone-900 text-sm sm:text-base truncate">
                        {stage.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-stone-100 text-stone-700 border border-stone-200">
                        {stage.modelTier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 flex-wrap">
                      <span>Source of Truth:</span>
                      {stage.sourceOfTruthRefs.map((ref, idx) => (
                        <span key={idx} className="text-amber-800 font-mono text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={stage.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateStageStatus(stage.id, e.target.value as ProductionStage["status"]);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer ${
                      stage.status === "Completed"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : stage.status === "In Factory"
                        ? "bg-sky-50 text-sky-800 border-sky-300"
                        : stage.status === "Blocked"
                        ? "bg-rose-50 text-rose-800 border-rose-300"
                        : "bg-stone-100 text-stone-700 border-stone-300"
                    }`}
                  >
                    <option value="Ready">Status: Ready</option>
                    <option value="In Factory">Status: In Factory</option>
                    <option value="Completed">Status: Completed</option>
                    <option value="Blocked">Status: Blocked</option>
                  </select>

                  <button className="text-stone-400 hover:text-stone-600 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Stage Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-5">
                  
                  {/* Checkpoints Bar */}
                  {stage.checkpoints && stage.checkpoints.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        Stage Gate Checkpoints (Approval Required)
                      </div>
                      <ul className="text-xs text-amber-950 space-y-1 pl-5 list-disc">
                        {stage.checkpoints.map((cp, idx) => (
                          <li key={idx}>{cp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prompts in this Stage */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Sequenced Prompts for AI Studio
                    </div>

                    {stage.promptSequence.map((prompt, promptIdx) => {
                      const isSimulating = simulatingPromptId === prompt.id;
                      const hasOutput = Boolean(simulationOutputs[prompt.id]);

                      return (
                        <div
                          key={prompt.id}
                          className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3"
                        >
                          {/* Prompt Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-mono font-bold">
                                {promptIdx + 1}
                              </span>
                              <h4 className="text-sm font-semibold text-stone-900">
                                {prompt.task}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                                Model: {prompt.suggestedModel}
                              </span>
                            </div>
                          </div>

                          {/* Raw Prompt Text Box */}
                          <div className="bg-white border border-stone-200 rounded-lg p-3 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                            {prompt.promptText}
                          </div>

                          {/* Acceptance Criteria Checklist */}
                          <div>
                            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                              Acceptance Criteria (Check before marking complete)
                            </span>
                            <div className="mt-1.5 space-y-1.5">
                              {prompt.acceptanceCriteria.map((crit, cIdx) => {
                                const isChecked = prompt.completedCriteria?.[cIdx] || false;
                                return (
                                  <label
                                    key={cIdx}
                                    className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-stone-900 select-none"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => onToggleCriteria(stage.id, prompt.id, cIdx)}
                                      className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                                    />
                                    <span className={isChecked ? "line-through text-stone-400" : ""}>
                                      {crit}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Action Buttons: Copy for AI Studio & Run Simulation */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyPrompt(prompt, stage)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                  copiedPromptId === prompt.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-stone-900 text-white hover:bg-stone-800"
                                }`}
                              >
                                {copiedPromptId === prompt.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Copied for AI Studio!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Prompt for AI Studio</span>
                                  </>
                                )}
                              </button>

                              {/* Simulate prompt run with Gemini backend */}
                              <button
                                onClick={() => handleRunSimulation(prompt, stage)}
                                disabled={isSimulating}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 disabled:opacity-50 transition-colors"
                                title="Run this prompt through the connected Gemini model to test output before AI Studio"
                              >
                                {isSimulating ? (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                                    <span>Simulating in Factory...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 text-stone-600" />
                                    <span>Test Run with Gemini</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Audit Output trigger if simulated */}
                            {hasOutput && (
                              <button
                                onClick={() => onAuditOutputInDrift(simulationOutputs[prompt.id], stage.title)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Audit Output for Drift</span>
                              </button>
                            )}
                          </div>

                          {/* Simulation Output Drawer */}
                          {hasOutput && (
                            <div className="mt-3 bg-stone-950 text-stone-100 rounded-lg p-3 border border-stone-800 space-y-2">
                              <div className="flex items-center justify-between text-xs text-stone-400">
                                <span className="font-mono text-amber-400">
                                  SIMULATION OUTPUT (Generated by {prompt.suggestedModel})
                                </span>
                                <span>{new Date().toLocaleTimeString()}</span>
                              </div>
                              <pre className="text-xs font-mono text-stone-200 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                                {simulationOutputs[prompt.id]}
                              </pre>
                            </div>
                          )}

                          {errorPromptId === prompt.id && (
                            <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                              Simulation request failed. Check server logs or verify your GEMINI_API_KEY.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
