import React, { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileCode, 
  FileJson 
} from "lucide-react";
import { ProjectDefinition } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDefinition;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [activeFormat, setActiveFormat] = useState<"markdown" | "agents_md" | "json">("markdown");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Generate complete Markdown PRD
  const generateMarkdown = (): string => {
    return `# ${project.title}
> ${project.tagline}

**Original Request:** "${project.originalPrompt}"  
**Version:** ${project.version} (Authoritative Source of Truth)  
**Created:** ${new Date(project.createdAt).toLocaleDateString()}  

---

## 1. Market Intelligence
- **Opportunity Score:** ${project.marketIntelligence.opportunityScore}/100
- **Market Summary:** ${project.marketIntelligence.marketSummary}
- **Differentiation Thesis:** ${project.marketIntelligence.differentiationOpportunity}

### Competitor Landscape
${project.marketIntelligence.competitors
  .map(
    (c) => `- **${c.name}** (${c.threatLevel} Threat)
  - Strength: ${c.strengths}
  - Weakness: ${c.weaknesses}`
  )
  .join("\n")}

### Underserved Gaps
${project.marketIntelligence.underservedGaps.map((g) => `- ${g}`).join("\n")}

---

## 2. Product Definition
- **§1.1 Problem Statement:** ${project.productDefinition.problemStatement}
- **§1.2 Target User:** ${project.productDefinition.targetAudience}
- **§1.3 Value Proposition:** ${project.productDefinition.valueProposition}
- **§2.7 Business Model:** ${project.productDefinition.businessModel}

### §2.1 - §2.4 Core Features
${project.productDefinition.coreFeatures
  .map((f) => `- **${f.code} ${f.name}:** ${f.description}`)
  .join("\n")}

### §2.5+ Non-Goals (STRICTLY PROHIBITED SCOPE)
${project.productDefinition.nonGoals.map((ng) => `- ❌ ${ng}`).join("\n")}

---

## 3. Build Specification
- **§3.1 Architecture Overview:** ${project.buildSpecification.architecture.overview}
  - Frontend: ${project.buildSpecification.architecture.frontendStack.join(", ")}
  - Backend: ${project.buildSpecification.architecture.backendStack.join(", ")}
  - Storage: ${project.buildSpecification.architecture.dataStorage}

### UX Requirements
${project.buildSpecification.uxRequirements
  .map((u) => `- [${u.criticality}] **${u.code}:** ${u.rule}`)
  .join("\n")}

### Functional Requirements
${project.buildSpecification.functionalRequirements
  .map((fn) => `- **${fn.code} ${fn.title}:** ${fn.details}`)
  .join("\n")}

### Data Model Entities
${project.buildSpecification.dataModel
  .map((d) => `- **${d.entity} (${d.code}):** ${d.fields.join(", ")}`)
  .join("\n")}

### Security & Deployment
${project.buildSpecification.securityRequirements
  .map((s) => `- **${s.code}:** ${s.rule}`)
  .join("\n")}
${project.buildSpecification.deploymentRequirements
  .map((dp) => `- **Deployment Rule:** ${dp}`)
  .join("\n")}

---

## 4. AI Production Strategy
- **Estimated Credits:** ${project.aiProductionStrategy.estimatedCredits}
- **Parallelization Plan:** ${project.aiProductionStrategy.parallelizationPlan}

### Model Allocations
${project.aiProductionStrategy.modelAllocation
  .map((m) => `- **${m.tier} (${m.creditBudgetPct}%):** ${m.tasks.join("; ")}`)
  .join("\n")}

---

## 5. AI Studio Factory Production Stages
${project.productionPlan.stages
  .map(
    (stg) => `### Stage ${stg.stageNumber}: ${stg.title} (${stg.modelTier})
- **Refs:** ${stg.sourceOfTruthRefs.join(", ")}
- **Checkpoints:** ${stg.checkpoints.join("; ")}
- **Prompts:**
${stg.promptSequence
  .map(
    (p) => `  * **Task:** ${p.task} (${p.suggestedModel})
    - Acceptance: ${p.acceptanceCriteria.join("; ")}`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`;
  };

  // Generate AGENTS.md system instruction format
  const generateAgentsMd = (): string => {
    return `# System Instructions for Google AI Studio Agent
# TARGET APPLICATION: ${project.title}
# SOURCE OF TRUTH VERSION: ${project.version}

You are constructing "${project.title}" inside Google AI Studio.
The AI Studio conversation is NOT the source of truth.
This document is the IMMUTABLE SOURCE OF TRUTH. Any output that departs from this specification will be rejected by the external Production Manager with:
"Current output does not align with Project Definition §X.Y. Re-evaluate before proceeding."

## 1. STRICT NON-GOALS (PROHIBITED SCOPE)
Under no circumstances are you permitted to introduce:
${project.productDefinition.nonGoals.map((ng) => `- ❌ ${ng}`).join("\n")}

## 2. APPROVED CORE FEATURES
${project.productDefinition.coreFeatures.map((f) => `- ${f.code} ${f.name}: ${f.description}`).join("\n")}

## 3. ARCHITECTURAL & SECURITY RULES
- Architecture: ${project.buildSpecification.architecture.overview}
- Security (§3.12): All Gemini API keys must remain server-side. No client-side exposure.
- Storage: ${project.buildSpecification.architecture.dataStorage}

## 4. ACCEPTANCE CRITERIA
Before declaring any task complete, verify that:
1. Zero unsolicited features exist in the code.
2. The code compiles cleanly.
3. Every component directly references a numbered clause in this specification.
`;
  };

  const currentContent = 
    activeFormat === "markdown" 
      ? generateMarkdown() 
      : activeFormat === "agents_md" 
      ? generateAgentsMd() 
      : JSON.stringify(project, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = 
      activeFormat === "markdown" 
        ? `${project.id}_spec.md` 
        : activeFormat === "agents_md" 
        ? "AGENTS.md" 
        : `${project.id}_definition.json`;

    const blob = new Blob([currentContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-3xl w-full p-6 sm:p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-600">
              Export Authoritative Artifacts
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Export Project Definition & AI Studio Directives
          </h2>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-3">
          <button
            onClick={() => setActiveFormat("markdown")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFormat === "markdown"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Markdown PRD</span>
          </button>

          <button
            onClick={() => setActiveFormat("agents_md")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFormat === "agents_md"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>AI Studio AGENTS.md</span>
          </button>

          <button
            onClick={() => setActiveFormat("json")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFormat === "json"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Spec</span>
          </button>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 min-h-0 bg-stone-950 text-stone-200 rounded-xl p-4 font-mono text-xs overflow-y-auto leading-relaxed border border-stone-800">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {activeFormat === "agents_md" 
              ? "Paste into AI Studio Project Settings or GEMINI.md" 
              : "Complete authoritative source of truth specification"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-800 hover:bg-stone-200"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
