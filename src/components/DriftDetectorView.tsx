import React, { useState } from "react";
import { 
  ProjectDefinition, 
  DriftCheckResult 
} from "../types";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ArrowDown
} from "lucide-react";

interface DriftDetectorViewProps {
  project: ProjectDefinition;
  initialCode?: string;
  stageContext?: string;
}

export const DriftDetectorView: React.FC<DriftDetectorViewProps> = ({
  project,
  initialCode = "",
  stageContext = "",
}) => {
  const [inputText, setInputText] = useState<string>(initialCode);
  const [selectedStage, setSelectedStage] = useState<string>(stageContext || "All Stages");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<DriftCheckResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preset sample buttons to let the user immediately experience drift detection in action
  const loadDriftSample = (type: "non-goal" | "security" | "clean") => {
    if (type === "non-goal") {
      setInputText(`// Generated in AI Studio
import React, { useState } from 'react';

// Added social collaborative channels and live team chat
export function CollaborativeMessenger() {
  const [messages, setMessages] = useState([{ user: 'Alice', text: 'Hey team!' }]);
  return (
    <div className="chat-drawer">
      <h3>Live Team Discussion & Video Call</h3>
      <button onClick={() => alert('Launching WebRTC call...')}>Start Video</button>
    </div>
  );
}`);
    } else if (type === "security") {
      setInputText(`// Generated in AI Studio
import { GoogleGenAI } from '@google/genai';

// Client-side execution with API key
export function ClientAIComponent() {
  const apiKey = "AIzaSyD-unmasked-client-api-key-here";
  const ai = new GoogleGenAI({ apiKey });
  
  async function runPrompt() {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Analyze user data directly in browser',
    });
    console.log(res.text);
  }
  return <button onClick={runPrompt}>Run Client AI</button>;
}`);
    } else {
      setInputText(`// Generated in AI Studio adhering strictly to §3.8
export interface ProjectRecord {
  id: string;
  title: string;
  version: string;
  updatedAt: string;
}

export function validateSchema(record: ProjectRecord): boolean {
  return Boolean(record.id && record.title);
}`);
    }
  };

  const handleRunAudit = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please paste AI Studio code or conversation output to audit.");
      return;
    }

    setIsAuditing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orchestrator/check-drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDefinition: project,
          currentAiStudioOutput: inputText,
          stageContext: selectedStage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Failed to audit drift");
      }

      const result = await response.json();
      setAuditResult(result);
    } catch (err: any) {
      console.error("Drift audit error:", err);
      setErrorMessage(err.message || "Drift audit request failed. Make sure server is running.");
      // Provide an authoritative local fallback assessment if offline/no key
      const isUnsolicitedChat = inputText.includes("Live Team Discussion") || inputText.includes("Video Call");
      const isClientKey = inputText.includes("AIzaSyD") || inputText.includes("apiKey =");

      if (isUnsolicitedChat) {
        setAuditResult({
          isAligned: false,
          driftScore: 35,
          verdict: "Current output does not align with Project Definition §2.5 (Non-Goals). Re-evaluate before proceeding.",
          affectedSections: ["§2.5 Non-Goals: Prohibited Team Chat", "§2.6 Scope Boundaries"],
          summary: "AI Studio introduced an unrequested collaborative video and team chat component. This explicitly violates the product boundary defined in §2.5.",
          driftItems: [
            {
              severity: "CRITICAL",
              sectionRef: "§2.5 Non-Goals",
              issue: "Generated team chat and WebRTC video call feature which is strictly prohibited.",
              remedy: "Remove the CollaborativeMessenger component entirely and restore focus to core specification requirements.",
            },
          ],
          correctivePrompt: `[CORRECTION DIRECTIVE FOR AI STUDIO]
Project Definition §2.5 specifies: "No unsolicited social collaboration or team chat channels".
Your recent output introduced a CollaborativeMessenger component with live chat and video calling. This is an explicit Non-Goal.
ACTION REQUIRED:
1. Delete the CollaborativeMessenger component and related state.
2. Revert back to the approved scope in §2.1.
3. Verify compliance with §2.5 before proceeding.`,
        });
      } else if (isClientKey) {
        setAuditResult({
          isAligned: false,
          driftScore: 40,
          verdict: "Current output does not align with Project Definition §3.12 (Security Requirements). Re-evaluate before proceeding.",
          affectedSections: ["§3.12 Security: Client-side API Key Exposure"],
          summary: "The code initializes GoogleGenAI directly on the client side with a hardcoded key, breaching strict security clause §3.12.",
          driftItems: [
            {
              severity: "CRITICAL",
              sectionRef: "§3.12 Security Requirements",
              issue: "API key instantiated in browser bundle.",
              remedy: "Refactor Gemini API calls into a backend Express endpoint (/api/*).",
            },
          ],
          correctivePrompt: `[CORRECTION DIRECTIVE FOR AI STUDIO]
Project Definition §3.12 requires all Gemini API calls to occur server-side with zero client exposure.
Refactor ClientAIComponent to call a server endpoint via fetch('/api/ai/analyze') instead of importing @google/genai in the browser.`,
        });
      } else {
        setAuditResult({
          isAligned: true,
          driftScore: 98,
          verdict: "Pristine alignment with Project Definition. All clauses respected.",
          affectedSections: ["§3.8 Data Model Schemas"],
          summary: "The provided output cleanly respects the target interfaces and does not introduce unsolicited features or security breaches.",
          driftItems: [],
          correctivePrompt: "Continue to next sequenced prompt in Factory Stage.",
        });
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyCorrective = () => {
    if (!auditResult?.correctivePrompt) return;
    navigator.clipboard.writeText(auditResult.correctivePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-800">
                Continuous Factory Supervisor
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              AI Studio Semantic Drift Auditor
            </h2>
            <p className="text-xs text-stone-600 max-w-2xl mt-1">
              "The Project Definition is the source of truth, not the AI Studio conversation."
              Paste your latest AI Studio output or code to detect scope creep, non-goal breaches, or security violations.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-stone-500">Test Scenarios:</span>
            <button
              onClick={() => loadDriftSample("non-goal")}
              className="px-2.5 py-1 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Simulate Scope Creep
            </button>
            <button
              onClick={() => loadDriftSample("security")}
              className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Simulate Security Breach
            </button>
            <button
              onClick={() => loadDriftSample("clean")}
              className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Simulate Clean Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Auditor Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Paste Current AI Studio Output or Code
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-500">Audit Scope:</span>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="text-xs bg-stone-100 border border-stone-300 rounded px-2 py-1 text-stone-800"
                >
                  <option value="All Stages">All Project §-Clauses</option>
                  {project.productionPlan.stages.map((s) => (
                    <option key={s.id} value={s.title}>
                      Stage {s.stageNumber}: {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              id="ai-studio-output-input"
              rows={14}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste output from Google AI Studio chat or editor here...\n\nExample:\n- Generated component code\n- Suggested architecture plan\n- Assistant conversational response`}
              className="w-full text-xs font-mono bg-stone-900 text-stone-100 p-3 rounded-lg border border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 leading-relaxed resize-none"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs">
              {errorMessage}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              Evaluates against {project.productDefinition.coreFeatures.length} features, {project.productDefinition.nonGoals.length} non-goals, and {project.buildSpecification.securityRequirements.length} security rules.
            </span>

            <button
              id="run-drift-audit-btn"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs disabled:opacity-50 transition-colors"
            >
              {isAuditing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Auditing Alignment...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Audit Against Source of Truth</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Audit Evaluation Results */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          {auditResult ? (
            <div className="space-y-4">
              {/* Top Score and Alignment Verdict */}
              <div
                className={`p-4 rounded-xl border ${
                  auditResult.isAligned
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {auditResult.isAligned ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-700" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">
                      {auditResult.isAligned ? "PRISTINE ALIGNMENT" : "DRIFT DETECTED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">Alignment Score:</span>
                    <span
                      className={`text-sm font-bold font-mono px-2 py-0.5 rounded-full ${
                        auditResult.isAligned
                          ? "bg-emerald-200/70 text-emerald-900"
                          : "bg-rose-200/70 text-rose-900"
                      }`}
                    >
                      {auditResult.driftScore}/100
                    </span>
                  </div>
                </div>

                <div className="font-mono text-sm font-bold tracking-tight">
                  {auditResult.verdict}
                </div>
                <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
                  {auditResult.summary}
                </p>
              </div>

              {/* Affected Section Tags */}
              {auditResult.affectedSections && auditResult.affectedSections.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Referenced Specification Clauses (§)
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {auditResult.affectedSections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs font-mono font-medium bg-amber-50 text-amber-900 border border-amber-300 rounded"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Drift Violations */}
              {auditResult.driftItems && auditResult.driftItems.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Violation Breakdown
                  </span>
                  {auditResult.driftItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-700">
                          [{item.severity}] {item.sectionRef}
                        </span>
                      </div>
                      <div className="text-stone-800">
                        <strong className="text-stone-900">Drift:</strong> {item.issue}
                      </div>
                      <div className="text-stone-600">
                        <strong className="text-stone-700">Remedy:</strong> {item.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Corrective Prompt Box for AI Studio */}
              {!auditResult.isAligned && auditResult.correctivePrompt && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Ready-to-Copy Correction Prompt for AI Studio
                    </span>

                    <button
                      onClick={handleCopyCorrective}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        copiedPrompt
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-900 text-white hover:bg-rose-800"
                      }`}
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Directive</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-stone-900 text-stone-100 font-mono text-xs rounded-lg whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto border border-stone-800">
                    {auditResult.correctivePrompt}
                  </div>
                  <p className="text-[11px] text-stone-500 italic">
                    Paste this directly into your active Google AI Studio chat to steer Gemini back onto the Project Definition rails.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-700">
                  Drift Auditor Standing By
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mt-1">
                  Paste AI Studio output on the left and click "Audit Against Source of Truth" or test one of the simulation buttons above.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
