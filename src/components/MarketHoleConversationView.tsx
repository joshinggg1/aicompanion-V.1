import React, { useState, useRef, useEffect } from "react";
import { 
  ChatMessage, 
  MarketHoleData, 
  MillionCreditPlan, 
  AiStudioPromptControl, 
  ProjectDefinition 
} from "../types";
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Compass, 
  Target, 
  Coins, 
  Cpu, 
  Sliders, 
  ArrowRight, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  FileCode2, 
  CheckCircle2, 
  Info, 
  Lightbulb,
  Workflow,
  AlertCircle
} from "lucide-react";

interface MarketHoleConversationViewProps {
  onPromoteToProject: (project: ProjectDefinition) => void;
  hasApiKey: boolean;
  onRunPromptSimulation: (promptText: string, model: string, context: string) => Promise<string>;
}

export const MarketHoleConversationView: React.FC<MarketHoleConversationViewProps> = ({
  onPromoteToProject,
  hasApiKey,
  onRunPromptSimulation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      role: "assistant",
      content: `Hello! You don't need to worry about complex build pipelines, schemas, or technical workflows right now—just talk to me about your idea. 

Tell me what problem you want to solve, what frustrates you about current tools, or what application you're imagining. 

I'll help you explore **real-world applications** in actual business workflows, find the **true hole in the market** that incumbents are missing, and configure **prompt controls** to interact with Google AI Studio—including a plan to spend your **1,000,000 monthly credits** to perfect your solution.

What idea is on your mind?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [activePlanExpanded, setActivePlanExpanded] = useState<boolean>(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Live simulation execution state
  const [simulatingPromptId, setSimulatingPromptId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<{ id: string; output: string } | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // State to track if we're promoting to a full project
  const [isSynthesizingProject, setIsSynthesizingProject] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, simulationResult]);

  const starterPrompts = [
    "I want to build a tool that solves context switching for field engineers",
    "Where is the market hole for AI calendar and meeting assistants?",
    "How would a small dental clinic use an autonomous invoice triage agent?",
    "I want to replace bulky $50k/yr ERP suites with a focused 1,000 credit micro-app",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt("");
    setIsThinking(true);
    setSimulationError(null);

    try {
      const response = await fetch("/api/orchestrator/market-hole-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from strategist");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        realWorldApplications: data.realWorldApplications,
        marketHole: data.marketHole,
        promptControl: data.promptControl,
        millionCreditPlan: data.millionCreditPlan,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Conversation error:", err);
      // Local graceful fallback if network fails
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `I've analyzed "${text}". The real-world application here is immense:

In actual practice, teams struggle with fragmented workflows and high tool overhead. Incumbents build bulky enterprise software that requires weeks of training, while generic chat interfaces lack structured schema validation.

The **hole in the market** is a focused micro-app with strict type guarantees that solves this without enterprise bloat. Use the prompt controls below to build a 1,000-credit prototype in AI Studio or explore the 1,000,000-credit perfection plan!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        realWorldApplications: [
          "Operational dispatch: Instant auto-categorization and schema extraction from incoming requests.",
          "Field staff mobile entry: Error-proof offline-first logging with auto-validation.",
          "Management dashboard: Real-time drift surveillance preventing unauthorized workflow mutations."
        ],
        marketHole: {
          unmetNeed: "Lightweight, deterministic workflow execution without enterprise licensing costs.",
          incumbentBlindspot: "Legacy incumbents build monolithic suites that require certified admins; generic LLMs produce unstructured text.",
          targetPersona: "Operations leads and solo operators needing immediate, auditable automation.",
          unfairAdvantage: "Tight schema-constrained generation with zero client-side credential exposure.",
          viabilityScore: 91,
        },
        promptControl: {
          title: "Build 1,000-Credit Rapid Prototype in AI Studio",
          description: "Calibrated prompt targeting Gemini 3.1 Flash-Lite to rapidly scaffold the MVP solving this exact market hole.",
          promptText: `// TASK: Build a 1,000-Credit Rapid Prototype for: ${text}
// FOCUS: Address the Market Hole - solve zero-setup workflow automation with deterministic schema validation.
// CONSTRAINTS:
// - Single-screen master view in React 19 + Tailwind CSS.
// - Clean typed data structures for action items and validation states.
// - All Gemini API interactions proxied through /api/service endpoints (no client-side API keys).
// - Zero unsolicited scope or mock placeholders.

Implement the complete standalone component with realistic state handling and responsive Tailwind styling.`,
          targetModel: "gemini-3.1-flash-lite",
          estimatedCredits: 1000,
          type: "rapid_1k_app"
        },
        millionCreditPlan: {
          totalBudget: 1000000,
          strategyTitle: "1,000,000 AI Studio Credit Plan to Perfect the Market Hole",
          rationale: "Maximizes credit efficiency by routing high-reasoning market edge cases to Gemini 3.8 / Pro while offloading repetitive UI boilerplate to Flash-Lite.",
          phases: [
            {
              phaseNumber: 1,
              title: "Market Gap Persona Grounding & Edge Case Extraction",
              creditBudget: 50000,
              modelTier: "Gemini 3.8 Flash",
              focus: "Synthesizing 50+ adversarial user personas and validating real-world corner cases.",
              deliverables: ["Persona matrix", "Workflow friction maps", "Acceptance contract"]
            },
            {
              phaseNumber: 2,
              title: "Schema Blueprint & Architectural Contracts",
              creditBudget: 100000,
              modelTier: "Gemini 3.1 Pro Preview",
              focus: "Formalizing strict TypeScript interfaces, API schemas, and security guardrails.",
              deliverables: ["Data models (§3.6)", "API proxy routes", "State machine definition"]
            },
            {
              phaseNumber: 3,
              title: "High-Order Market Hole Logic Engine",
              creditBudget: 400000,
              modelTier: "Gemini 3.8 Flash & Pro",
              focus: "Developing the core reasoning engine that delivers the unfair competitive advantage.",
              deliverables: ["Autonomous resolution pipeline", "Structured output parser", "Fallback mechanisms"]
            },
            {
              phaseNumber: 4,
              title: "Full-Stack Component Scaffolding & Responsive UI",
              creditBudget: 200000,
              modelTier: "Gemini 3.1 Flash-Lite (Fast/Low Cost)",
              focus: "Generating responsive Tailwind UI components, accessible tables, and interaction states.",
              deliverables: ["Client dashboard", "Control panel", "Export modals"]
            },
            {
              phaseNumber: 5,
              title: "Adversarial Drift Testing & Final Production Hardening",
              creditBudget: 250000,
              modelTier: "Gemini 3.8 Flash",
              focus: "Auditing against Non-Goals (§2.5), running stress tests, and eliminating all hallucinated scope.",
              deliverables: ["Zero-drift audit certification", "End-to-end tests", "Deployment artifact"]
            }
          ]
        }
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleSimulateInAiStudio = async (promptControl: AiStudioPromptControl, msgId: string) => {
    setSimulatingPromptId(msgId);
    setSimulationResult(null);
    setSimulationError(null);

    try {
      const output = await onRunPromptSimulation(
        promptControl.promptText,
        promptControl.targetModel,
        promptControl.title
      );
      setSimulationResult({ id: msgId, output });
    } catch (err: any) {
      setSimulationError(err.message || "Failed to execute simulated AI Studio prompt");
    } finally {
      setSimulatingPromptId(null);
    }
  };

  // Convert the conversation & market hole findings into a complete formal Project Definition
  const handlePromoteToSpecification = async (msg: ChatMessage) => {
    setIsSynthesizingProject(true);
    try {
      const promptIdea = msg.content || "Market Hole Application";
      const res = await fetch("/api/orchestrator/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: msg.marketHole 
            ? `Application solving: ${msg.marketHole.unmetNeed} targeting ${msg.marketHole.targetPersona}. Unfair advantage: ${msg.marketHole.unfairAdvantage}`
            : promptIdea,
          focusArea: "Market Hole Micro-App with 1M Credit Production Plan",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to synthesize full project specification");
      }

      const newProject: ProjectDefinition = await res.json();
      onPromoteToProject(newProject);
    } catch (err: any) {
      console.error("Failed to promote to specification:", err);
      // Fallback construction using the message's market hole and plan
      const syntheticProject: ProjectDefinition = {
        id: `proj_${Date.now()}`,
        title: msg.marketHole?.targetPersona 
          ? `${msg.marketHole.targetPersona.split(" ")[0]} Micro-Workspace` 
          : "Market-Hole Specialized Application",
        tagline: msg.marketHole?.unfairAdvantage || "Targeted solution addressing incumbent market blindspots",
        originalPrompt: msg.content,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        marketIntelligence: {
          opportunityScore: msg.marketHole?.viabilityScore || 90,
          marketSummary: msg.marketHole?.incumbentBlindspot || "Unserved niche overlooked by monolithic legacy suites.",
          competitors: [
            { name: "Legacy Enterprise Suite", strengths: "Broad features, deep pockets", weaknesses: "Excessive complexity, high pricing, slow setup", threatLevel: "Medium" },
            { name: "Generic AI Wrapper", strengths: "Cheap, fast to launch", weaknesses: "Unstructured output, high error rate, no auditability", threatLevel: "Low" }
          ],
          underservedGaps: [
            msg.marketHole?.unmetNeed || "Fast, zero-setup workflow execution with guaranteed schema compliance.",
            "Eliminating manual data transfer between disconnected teams."
          ],
          differentiationOpportunity: msg.marketHole?.unfairAdvantage || "Autonomous precision micro-workflows with built-in drift control."
        },
        productDefinition: {
          problemStatement: msg.marketHole?.unmetNeed || "Users lack a direct, focused tool for this workflow.",
          targetAudience: msg.marketHole?.targetPersona || "Specialized practitioners and operations leads.",
          valueProposition: msg.marketHole?.unfairAdvantage || "Zero-setup execution with deterministic auditability.",
          coreFeatures: [
            { id: "feat-1", code: "§2.1", name: "Market-Hole Core Execution Engine", description: "Directly solves the primary unaddressed pain point." },
            { id: "feat-2", code: "§2.2", name: "Deterministic Schema Validator", description: "Enforces strict type safety and data integrity." },
            { id: "feat-3", code: "§2.3", name: "Interactive Prompt Controls Panel", description: "Enables rapid dispatch and model tier selection." },
            { id: "feat-4", code: "§2.4", name: "Credit & Budget Telemetry Tracker", description: "Monitors consumption against the 1,000,000 credit ceiling." }
          ],
          nonGoals: [
            "No bloated enterprise user management or multi-tenant billing tiers (§2.5)",
            "No unrequested collaborative social channels or team chat widgets (§2.6)",
            "No client-side API key instantiation (§2.7)"
          ],
          businessModel: "High-margin specialized utility or usage-based seat model (§2.8)"
        },
        buildSpecification: {
          architecture: {
            code: "§3.1",
            overview: "Full-stack React 19 + Tailwind client with Express TypeScript backend proxy.",
            frontendStack: ["React 19", "Tailwind CSS", "Vite", "Motion"],
            backendStack: ["Express", "Node.js", "TypeScript"],
            dataStorage: "Local state with optional Firestore synchronization"
          },
          uxRequirements: [
            { code: "§3.2", rule: "Single-view high-contrast console without nested unnecessary tabs", criticality: "High" },
            { code: "§3.3", rule: "Instant tactile feedback for all prompt actions", criticality: "High" }
          ],
          functionalRequirements: [
            { code: "§3.4", title: "Autonomous Resolution Pipeline", details: "Executes targeted actions against verified schemas." },
            { code: "§3.5", title: "Drift Audit Interceptor", details: "Audits output against defined section clauses." }
          ],
          dataModel: [
            { entity: "MarketSolutionRecord", code: "§3.6", fields: ["id: string", "persona: string", "status: enum", "timestamp: string"] }
          ],
          integrations: [
            { name: "Google Gemini 3.8 Flash & Pro", code: "§3.7", purpose: "Core high-reasoning inference and validation" }
          ],
          securityRequirements: [
            { code: "§3.8", rule: "Strict server-side proxying for all LLM calls; zero browser key leakage." }
          ],
          testingRequirements: [
            "Zero console error regressions (§3.9)",
            "Passes strict TypeScript compilation with tsc --noEmit (§3.10)"
          ],
          deploymentRequirements: [
            "Containerized Cloud Run on port 3000 (§3.11)"
          ]
        },
        aiProductionStrategy: {
          modelAllocation: [
            { tier: "Gemini 3.8 / Pro (Reasoning)", tasks: ["Market hole logic", "Drift audit", "Schema verification"], creditBudgetPct: 65, reasoning: "High context retention required" },
            { tier: "Gemini Flash-Lite (Fast)", tasks: ["UI scaffolding", "Boilerplate", "Test mocks"], creditBudgetPct: 25, reasoning: "Low cost, rapid code generation" },
            { tier: "Deterministic Tools", tasks: ["Linters", "Typecheckers", "Regex"], creditBudgetPct: 10, reasoning: "Zero token consumption" }
          ],
          parallelizationPlan: "Parallelize backend proxy routes with frontend Tailwind layout.",
          humanDecisionCheckpoints: ["Sign-off on market hole definition", "Verify 1,000-credit prototype output"],
          estimatedCredits: "1,000,000 Monthly AI Studio Budget"
        },
        productionPlan: {
          stages: (msg.millionCreditPlan?.phases || []).map((ph, idx) => ({
            id: `stg-${idx + 1}`,
            stageNumber: ph.phaseNumber,
            title: ph.title,
            modelTier: ph.modelTier,
            status: idx === 0 ? "Ready" : "Pending",
            sourceOfTruthRefs: [`§2.${idx + 1}`, `§3.${idx + 1}`],
            promptSequence: [
              {
                id: `p-${idx + 1}-1`,
                task: `Execute ${ph.title}`,
                suggestedModel: ph.modelTier.includes("Flash-Lite") ? "gemini-3.1-flash-lite" : "gemini-3.8-flash",
                promptText: `Implement ${ph.title} in accordance with Project Definition clauses. Focus: ${ph.focus}`,
                acceptanceCriteria: ph.deliverables,
                completedCriteria: ph.deliverables.map(() => false)
              }
            ],
            checkpoints: [`Verified deliverables: ${ph.deliverables.join(", ")}`]
          }))
        }
      };
      onPromoteToProject(syntheticProject);
    } finally {
      setIsSynthesizingProject(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-800">
              Conversational Market Hole Explorer & Prompt Commander
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Talk to the LLM: Uncover the Market Hole & Direct AI Studio
          </h2>
          <p className="text-xs text-stone-600 max-w-3xl mt-1">
            No complex workflows to learn. Simply chat about your idea. The LLM seeks to understand your request, discusses concrete real-world applications, uncovers the underserved market hole, and activates prompt controls to spend your 1,000,000 credits in Google AI Studio.
          </p>
        </div>

        {/* 1,000,000 Credit Budget Pill */}
        <div className="bg-stone-900 text-stone-100 rounded-xl p-3.5 flex items-center gap-3 shrink-0 border border-stone-800">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
              AI Studio Budget
            </div>
            <div className="text-sm font-bold font-mono text-amber-300">
              1,000,000 Credits
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col overflow-hidden min-h-[600px]">
        
        {/* Messages Thread */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[700px]">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-3xl space-y-4 ${isUser ? "text-right" : "text-left"}`}>
                  {/* Bubble */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-stone-900 text-stone-100 rounded-br-xs inline-block"
                        : "bg-stone-50 border border-stone-200 text-stone-900 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        isUser ? "text-stone-400" : "text-stone-400"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Real-World Applications Box (if provided by strategist) */}
                  {!isUser && msg.realWorldApplications && msg.realWorldApplications.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 font-mono">
                        <Compass className="w-3.5 h-3.5 text-amber-700" />
                        Real-World Practical Applications
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {msg.realWorldApplications.map((app, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-stone-800 space-y-1"
                          >
                            <div className="font-bold text-amber-900 font-mono text-[11px]">
                              Application #{idx + 1}
                            </div>
                            <p className="text-stone-700 leading-normal">{app}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discovered Market Hole Card */}
                  {!isUser && msg.marketHole && (
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-950 font-mono">
                          <Target className="w-4 h-4 text-emerald-700" />
                          Discovered Market Hole
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-500 font-medium">Viability:</span>
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950">
                            {msg.marketHole.viabilityScore}/100
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-stone-500 block font-mono">
                            Unmet Need
                          </span>
                          <p className="text-stone-800 font-medium">{msg.marketHole.unmetNeed}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-stone-500 block font-mono">
                            Incumbent Blindspot
                          </span>
                          <p className="text-rose-900 font-medium">{msg.marketHole.incumbentBlindspot}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-stone-500 block font-mono">
                            Target Persona
                          </span>
                          <p className="text-stone-800">{msg.marketHole.targetPersona}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block font-mono">
                            Unfair Advantage
                          </span>
                          <p className="text-emerald-950 font-semibold">{msg.marketHole.unfairAdvantage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive AI Studio Prompt Controls Toolbar */}
                  {!isUser && msg.promptControl && (
                    <div className="bg-stone-900 text-stone-100 rounded-xl p-4 space-y-3.5 border border-stone-800 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-200">
                            AI Studio Prompt Controls
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            ~{msg.promptControl.estimatedCredits} Credits
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                          <span>Target:</span>
                          <span className="text-stone-200 font-semibold">{msg.promptControl.targetModel}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-300">
                          {msg.promptControl.title}
                        </div>
                        <p className="text-[11px] text-stone-400">
                          {msg.promptControl.description}
                        </p>
                      </div>

                      {/* Code / Prompt snippet */}
                      <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto whitespace-pre-wrap max-h-36 leading-relaxed">
                        {msg.promptControl.promptText}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                        <div className="flex items-center gap-2">
                          {/* Run in AI Studio */}
                          <button
                            onClick={() => handleSimulateInAiStudio(msg.promptControl!, msg.id)}
                            disabled={simulatingPromptId === msg.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                          >
                            <Play className={`w-3.5 h-3.5 fill-current ${simulatingPromptId === msg.id ? "animate-pulse" : ""}`} />
                            <span>
                              {simulatingPromptId === msg.id 
                                ? "Executing in AI Studio..." 
                                : "Dispatch 1,000-Credit App to AI Studio"}
                            </span>
                          </button>

                          {/* Copy prompt */}
                          <button
                            onClick={() => handleCopyPrompt(msg.promptControl!.promptText, msg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors"
                          >
                            {copiedPromptId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Promote to Full Project Definition */}
                        <button
                          onClick={() => handlePromoteToSpecification(msg)}
                          disabled={isSynthesizingProject}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium rounded-lg border border-amber-400/30 transition-colors"
                        >
                          <Workflow className="w-3.5 h-3.5" />
                          <span>
                            {isSynthesizingProject ? "Synthesizing Spec..." : "Promote to Authoritative PRD (§)"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Simulation Execution Output Drawer (if executed) */}
                  {simulationResult && simulationResult.id === msg.id && (
                    <div className="bg-stone-950 border border-amber-400/40 rounded-xl p-4 text-xs font-mono space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-amber-400">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-4 h-4" />
                          <span className="font-bold uppercase tracking-wider">
                            AI Studio Factory Execution Output
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          1,000-Credit Rapid Prototype Build Complete
                        </span>
                      </div>
                      <div className="p-3 bg-stone-900 rounded-lg text-stone-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed border border-stone-800">
                        {simulationResult.output}
                      </div>
                    </div>
                  )}

                  {/* 1,000,000-Credit AI Studio Production Plan Card */}
                  {!isUser && msg.millionCreditPlan && (
                    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setActivePlanExpanded(!activePlanExpanded)}>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                            {msg.millionCreditPlan.strategyTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            1,000,000 Credits Allocated
                          </span>
                          {activePlanExpanded ? (
                            <ChevronUp className="w-4 h-4 text-stone-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-stone-600">
                        {msg.millionCreditPlan.rationale}
                      </p>

                      {/* Phase breakdown */}
                      <div className="space-y-2 pt-1">
                        {msg.millionCreditPlan.phases.map((phase) => (
                          <div
                            key={phase.phaseNumber}
                            className="bg-stone-50 border border-stone-200 p-3 rounded-lg text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="font-bold text-stone-900 font-mono">
                                Phase {phase.phaseNumber}: {phase.title}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-stone-500">
                                  {phase.modelTier}
                                </span>
                                <span className="font-mono font-bold text-[11px] bg-stone-200/80 px-2 py-0.5 rounded text-stone-800">
                                  {phase.creditBudget.toLocaleString()} credits
                                </span>
                              </div>
                            </div>
                            <p className="text-stone-700 text-[11px]">
                              {phase.focus}
                            </p>
                            {activePlanExpanded && (
                              <div className="pt-1 flex flex-wrap gap-1">
                                {phase.deliverables.map((del, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="text-[10px] font-mono bg-white text-stone-700 px-1.5 py-0.5 rounded border border-stone-200"
                                  >
                                    ✓ {del}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-1 font-semibold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl rounded-bl-xs text-xs text-stone-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Thinking: Exploring real-world applications & locating the market hole...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
          
          {/* Starter Idea Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono font-semibold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Try asking:
            </span>
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isThinking}
                className="text-xs bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg px-2.5 py-1 whitespace-nowrap transition-colors shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                id="market-hole-chat-input"
                rows={2}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Talk to the LLM about your idea or request... (e.g. 'I want to build a tool that solves X in real-world workflows')"
                className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-colors resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isThinking}
              className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 shrink-0 mb-0.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span>
              {hasApiKey ? "Powered by Gemini 3.8 Flash" : "Operating in local simulation mode"}
            </span>
            <span>
              Talk freely — the LLM handles the workflow translation.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
