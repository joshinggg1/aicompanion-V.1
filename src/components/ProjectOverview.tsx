import React from "react";
import { 
  ProjectDefinition, 
  ActiveTab 
} from "../types";
import { 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  Layers, 
  Sliders, 
  FileCode2, 
  TrendingUp, 
  CheckCircle2, 
  Coins,
  Cpu,
  TerminalSquare
} from "lucide-react";

interface ProjectOverviewProps {
  project: ProjectDefinition;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDriftModal: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  setActiveTab,
  onOpenDriftModal,
}) => {
  const completedStages = project.productionPlan.stages.filter(
    (s) => s.status === "Completed"
  ).length;
  const totalStages = project.productionPlan.stages.length;
  const progressPct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Banner: Product Intent and Source of Truth Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300">
              IMMUTABLE SOURCE OF TRUTH v{project.version}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-2">
            {project.title}
          </h1>
          <p className="text-base text-stone-600 max-w-3xl mb-6">
            {project.tagline}
          </p>

          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Original Product Request
              </span>
              <p className="text-sm font-medium text-stone-800 italic">
                "{project.originalPrompt}"
              </p>
            </div>
            <button
              onClick={() => setActiveTab("product")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 shadow-2xs transition-colors shrink-0"
            >
              <span>Explore § Clauses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action: Talk to LLM & Discover Market Hole */}
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl p-4 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono">
                  Conversational Discovery & 1,000,000-Credit Allocation
                </span>
              </div>
              <p className="text-xs text-stone-700">
                Don't want to navigate manual pipelines? Just talk to the LLM. It discovers real-world applications, isolates the hole in the market, and provides calibrated prompt controls to build your application with 1,000,000 AI Studio credits.
              </p>
            </div>
            <button
              id="talk-to-llm-banner-btn"
              onClick={() => setActiveTab("chat")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <span>Talk to LLM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* The Central Factory Architecture Diagram */}
      <div className="bg-stone-950 text-stone-100 rounded-2xl p-6 lg:p-8 border border-stone-800 shadow-sm">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">
            Operational Topology
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            "AI Studio is the Factory — This is the Production Manager"
          </h2>
          <p className="text-sm text-stone-400 mt-1.5">
            The AI Studio conversation is not the source of truth. The Production Manager supervises Gemini, guarantees clause alignment (§), and prevents costly token waste.
          </p>
        </div>

        {/* Pipeline Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Node 1: AI Project Definition */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
                <span>01. SOURCE OF TRUTH</span>
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">AI Project Definition</h3>
              <p className="text-xs text-stone-400 mt-1">
                Market analysis, §-numbered specs, non-goals, and data models.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span>{project.productDefinition.coreFeatures.length} Core Features</span>
              <span className="text-amber-300">{project.productDefinition.nonGoals.length} Non-Goals</span>
            </div>
          </div>

          {/* Node 2: AI Production Manager */}
          <div className="bg-stone-900/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between ring-1 ring-amber-500/20">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
                <span>02. SUPERVISOR</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">AI Production Manager</h3>
              <p className="text-xs text-stone-400 mt-1">
                Prompt dispatching, semantic drift detection, model routing, credit optimization.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-amber-300">
              <span>Continuous Audit</span>
              <button 
                onClick={onOpenDriftModal}
                className="underline hover:text-amber-200"
              >
                Inspect Drift
              </button>
            </div>
          </div>

          {/* Node 3: Google AI Studio Factory */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-sky-400 font-mono mb-2">
                <span>03. THE FACTORY</span>
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Google AI Studio</h3>
              <p className="text-xs text-stone-400 mt-1">
                Gemini execution engine, code generation, reactive preview, agent chat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-sky-300">
              <span>Stage {completedStages + 1} of {totalStages}</span>
              <span>1M Allowance</span>
            </div>
          </div>

          {/* Node 4: Target Deliverable */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
                <span>04. DELIVERABLE</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Verified Product</h3>
              <p className="text-xs text-stone-400 mt-1">
                Strictly aligns with §-clauses. Zero hallucinations or scope creep. Ready for GitHub.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-emerald-400">
              <span>Status: {progressPct}% Complete</span>
              <span>Verified</span>
            </div>
          </div>

        </div>
      </div>

      {/* Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Factory Production Plan */}
        <div 
          onClick={() => setActiveTab("factory")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center font-bold text-xs">
                <FileCode2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-stone-500">
                {totalStages} Stages Defined
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
              AI Studio Factory Plan
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Step-by-step development pipeline with calibrated prompts, section bindings, and acceptance criteria checklists.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700">
              {completedStages} / {totalStages} Stages Cleared
            </span>
            <span className="text-xs font-semibold text-stone-900 inline-flex items-center gap-1">
              Open Factory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Drift Supervisor */}
        <div 
          onClick={() => setActiveTab("drift-monitor")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                Guard Active
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
              Semantic Drift Supervisor
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Paste AI Studio responses or generated code to audit against §3.2 and Non-Goals. Injects instant corrective prompts.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Zero Unsolicited Features</span>
            <span className="text-xs font-semibold text-rose-700 inline-flex items-center gap-1">
              Audit Output <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Model Routing & Credits */}
        <div 
          onClick={() => setActiveTab("strategy")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Coins className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-stone-500">
                Allowance Strategy
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
              Model Routing & 1M Credits
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Route complex architecture to Gemini 3.8/Pro while saving budget by offloading boilerplate to Flash-Lite.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">{project.aiProductionStrategy.estimatedCredits}</span>
            <span className="text-xs font-semibold text-amber-800 inline-flex items-center gap-1">
              View Allocation <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Market Intelligence */}
        <div 
          onClick={() => setActiveTab("market")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                Opportunity: {project.marketIntelligence.opportunityScore}/100
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
              Market Intelligence
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Competitive landscape, underserved user gaps, and product differentiation thesis.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">{project.marketIntelligence.competitors.length} Competitors Tracked</span>
            <span className="text-xs font-semibold text-stone-900 inline-flex items-center gap-1">
              Analyze Gaps <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 5: Product Definition */}
        <div 
          onClick={() => setActiveTab("product")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-stone-500">
                §1.1 - §2.8
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
              Product Definition
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Problem statement, target user personas, core feature sets, and strictly forbidden non-goals.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">{project.productDefinition.coreFeatures.length} Core Features</span>
            <span className="text-xs font-semibold text-stone-900 inline-flex items-center gap-1">
              View Clauses <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 6: Build Specification */}
        <div 
          onClick={() => setActiveTab("specification")}
          className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs">
                <TerminalSquare className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-stone-500">
                §3.1 - §3.18
              </span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
              Build Specification
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Architecture stacks, UX requirements, functional rules, data model schemas, and deployment security.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">{project.buildSpecification.dataModel.length} Data Entities</span>
            <span className="text-xs font-semibold text-stone-900 inline-flex items-center gap-1">
              View Schemas <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
