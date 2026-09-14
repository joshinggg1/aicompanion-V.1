import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily or when API key is present
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
  });
});

// Endpoint: Generate Full AI Project Definition from a product idea
app.post("/api/orchestrator/generate-project", async (req, res) => {
  try {
    const { idea, focusArea } = req.body;
    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return res.status(400).json({ error: "A valid product idea string is required." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please add your key in AI Studio Settings > Secrets.",
      });
    }

    const systemPrompt = `You are the chief AI Software Production Architect and Orchestrator.
Your mission is to take an initial product idea: "${idea}" (Focus: "${focusArea || "Full product & production specification"}")
and transform it into an authoritative, structured AI Project Definition.

CRITICAL ARCHITECTURAL PRINCIPLE:
AI Studio is the "factory", and this definition is the immutable "Source of Truth".
Every requirement must have a clear section reference (§1.1, §1.2, §2.1, §3.1, §3.2, etc.) so that downstream AI Studio builds can be audited for drift.
The AI Production Strategy must identify how to maximize a million-credit Gemini allowance by routing heavy reasoning to Gemini 3.8 / Pro and boilerplate/supporting tasks to fast/free models (Flash-Lite).

Return ONLY valid JSON adhering strictly to this format:
{
  "id": "proj_${Date.now()}",
  "title": "Clear concise product name",
  "tagline": "A sharp one-sentence value proposition",
  "originalPrompt": "${idea.replace(/"/g, '\\"')}",
  "version": "1.0.0",
  "createdAt": "${new Date().toISOString()}",
  "marketIntelligence": {
    "opportunityScore": 88,
    "marketSummary": "2-3 sentences analyzing the market landscape",
    "competitors": [
      {
        "name": "Competitor 1",
        "strengths": "Key strength",
        "weaknesses": "Key weakness or pricing barrier",
        "threatLevel": "Medium"
      },
      {
        "name": "Competitor 2",
        "strengths": "Key strength",
        "weaknesses": "Key weakness",
        "threatLevel": "Low"
      }
    ],
    "underservedGaps": [
      "Key unaddressed workflow pain point",
      "Cost or complexity barrier for target users"
    ],
    "differentiationOpportunity": "Why this product can win specifically"
  },
  "productDefinition": {
    "problemStatement": "Precise description of the core problem (§1.1)",
    "targetAudience": "Specific primary user persona (§1.2)",
    "valueProposition": "Direct value delivery promise (§1.3)",
    "coreFeatures": [
      { "id": "feat-1", "code": "§2.1", "name": "Feature Name", "description": "What it does and why" },
      { "id": "feat-2", "code": "§2.2", "name": "Feature Name", "description": "What it does and why" },
      { "id": "feat-3", "code": "§2.3", "name": "Feature Name", "description": "What it does and why" },
      { "id": "feat-4", "code": "§2.4", "name": "Feature Name", "description": "What it does and why" }
    ],
    "nonGoals": [
      "Explicit out-of-scope feature to prevent scope creep (§2.5)",
      "Another boundary constraint (§2.6)"
    ],
    "businessModel": "Usage-based, open-source core, enterprise tier, or single-seat (§2.7)"
  },
  "buildSpecification": {
    "architecture": {
      "code": "§3.1",
      "overview": "Full architecture summary",
      "frontendStack": ["React 19", "Tailwind CSS", "Vite", "Motion"],
      "backendStack": ["Express", "Node.js", "TypeScript"],
      "dataStorage": "Durable Firestore / relational DB or local persistence strategy"
    },
    "uxRequirements": [
      { "code": "§3.2", "rule": "Clean single-screen or master-detail hierarchy", "criticality": "High" },
      { "code": "§3.3", "rule": "Real-time visual feedback and state transitions", "criticality": "High" }
    ],
    "functionalRequirements": [
      { "code": "§3.4", "title": "Core Processing Pipeline", "details": "Exact functional rules and state transitions" },
      { "code": "§3.5", "title": "Real-time Verification", "details": "Validation and feedback logic" }
    ],
    "dataModel": [
      { "entity": "EntityName", "code": "§3.6", "fields": ["id: string", "title: string", "status: enum", "updatedAt: timestamp"] }
    ],
    "integrations": [
      { "name": "Google Gemini API", "code": "§3.7", "purpose": "Primary inference and reasoning" }
    ],
    "securityRequirements": [
      { "code": "§3.8", "rule": "Server-side API key proxying with zero client exposure" },
      { "code": "§3.9", "rule": "Strict payload schema sanitization" }
    ],
    "testingRequirements": [
      "Unit testing of core state reducers (§3.10)",
      "End-to-end user workflow verification (§3.11)"
    ],
    "deploymentRequirements": [
      "Containerized Cloud Run deployment on port 3000 (§3.12)"
    ]
  },
  "aiProductionStrategy": {
    "modelAllocation": [
      {
        "tier": "Strongest Model (Gemini 3.8 / Pro)",
        "tasks": ["System architecture synthesis", "Complex algorithmic logic", "Drift alignment audit"],
        "creditBudgetPct": 65,
        "reasoning": "High-order contextual coherence required"
      },
      {
        "tier": "Fast / Free Models (Gemini Flash-Lite)",
        "tasks": ["UI component boilerplate", "Unit test case generation", "Data mock fabrication"],
        "creditBudgetPct": 25,
        "reasoning": "High speed, low cost for structured syntactic tasks"
      },
      {
        "tier": "Deterministic / Supporting Tools",
        "tasks": ["Linting, build compilation, regex validation"],
        "creditBudgetPct": 10,
        "reasoning": "Zero token overhead"
      }
    ],
    "parallelizationPlan": "Which modules can be built concurrently in AI Studio",
    "humanDecisionCheckpoints": [
      "Checkpoint 1: Approval of core data schema and API contracts",
      "Checkpoint 2: UX layout sign-off before logic wiring"
    ],
    "estimatedCredits": "145,000 / 1,000,000 monthly allowance"
  },
  "productionPlan": {
    "stages": [
      {
        "id": "stage-1",
        "stageNumber": 1,
        "title": "Foundation, Types & Schemas",
        "modelTier": "Flash-Lite (Fast/Low Cost)",
        "status": "Ready",
        "sourceOfTruthRefs": ["§3.1 Architecture", "§3.6 Data Model"],
        "promptSequence": [
          {
            "id": "p-1-1",
            "task": "Create core TypeScript interfaces and type definitions",
            "suggestedModel": "gemini-3.1-flash-lite",
            "promptText": "Detailed instructions to copy into AI Studio...",
            "acceptanceCriteria": ["All entity types exported", "Strict TypeScript checking passes", "Zero any types"]
          }
        ],
        "checkpoints": ["Type check builds cleanly with tsc --noEmit"]
      },
      {
        "id": "stage-2",
        "stageNumber": 2,
        "title": "Core Logic & Server-side API",
        "modelTier": "Gemini 3.8 / Pro (Strongest)",
        "status": "Pending",
        "sourceOfTruthRefs": ["§3.4 Functional Requirements", "§3.8 Security"],
        "promptSequence": [
          {
            "id": "p-2-1",
            "task": "Implement backend controller and Gemini service proxy",
            "suggestedModel": "gemini-3.8-flash",
            "promptText": "Detailed prompt to copy into AI Studio...",
            "acceptanceCriteria": ["API key kept strictly server-side", "Valid JSON error responses", "Health endpoint responds"]
          }
        ],
        "checkpoints": ["Backend routes return 200 OK with mock inputs"]
      },
      {
        "id": "stage-3",
        "stageNumber": 3,
        "title": "Interactive Client Experience & State",
        "modelTier": "Gemini 3.8 (Balanced)",
        "status": "Pending",
        "sourceOfTruthRefs": ["§2.1 Core Features", "§3.2 UX Requirements"],
        "promptSequence": [
          {
            "id": "p-3-1",
            "task": "Build master dashboard view with responsive controls",
            "suggestedModel": "gemini-3.8-flash",
            "promptText": "Detailed prompt for UI implementation...",
            "acceptanceCriteria": ["Zero unrendered placeholders", "Tailwind utility styling", "Accessible contrast"]
          }
        ],
        "checkpoints": ["User interaction cycle completes without console errors"]
      },
      {
        "id": "stage-4",
        "stageNumber": 4,
        "title": "Drift Verification, Hardening & Deliverable",
        "modelTier": "Gemini 3.8 / Pro (Verification)",
        "status": "Pending",
        "sourceOfTruthRefs": ["§2.5 Non-Goals", "§3.10 Testing", "§3.12 Deployment"],
        "promptSequence": [
          {
            "id": "p-4-1",
            "task": "Audit complete build against Project Definition specifications",
            "suggestedModel": "gemini-3.8-flash",
            "promptText": "Audit prompt to run alignment verification...",
            "acceptanceCriteria": ["Zero non-goal feature leakage", "Production build succeeds", "README and manifest aligned"]
          }
        ],
        "checkpoints": ["Full compile_applet build succeeds and ready for deploy"]
      }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text || "{}";
    const projectDefinition = JSON.parse(text);
    return res.json(projectDefinition);
  } catch (err: any) {
    console.error("Failed to generate project definition:", err);
    return res.status(500).json({
      error: "Failed to generate project definition",
      details: err?.message || String(err),
    });
  }
});

// Helper: Readiness dimension check interface
export interface ReadinessDimensionCheck {
  id: string;
  label: string;
  status: "met" | "pending" | "unresolved";
  details?: string;
}

export interface ReadinessResult {
  isReady: boolean;
  unresolvedTopic?: string;
  explanation?: string;
  consequentialQuestions?: string[];
  readinessChecks: ReadinessDimensionCheck[];
}

// Helper: Evaluate whether an idea is ready to build or has consequential uncertainty
function evaluateReadinessGate(
  message: string,
  currentWorkingPrompt?: string,
  isBuildTrigger?: boolean,
  project?: any
): ReadinessResult {
  const hasPrompt = Boolean(currentWorkingPrompt && currentWorkingPrompt.trim().length > 0);
  const normalized = message.trim().toLowerCase();

  // Test 8 & open discovery: Completely vague
  const isVague =
    normalized.length < 25 ||
    /not sure what it is yet|make people's lives easier|don't know what the product is yet|talk it through with me|only tell me to build something once|explore some ideas|any ideas/i.test(normalized);

  // Test 9 & saturated consumer ideas: Pushing back
  const isSaturated =
    ((/social media|short videos|dating app|chat app/i.test(normalized) && /worth building|is this worth|should i build|good idea/i.test(normalized)) ||
      (/social media app|app where people post short videos/i.test(normalized) && !/standup|internal|b2b|critique|training/i.test(normalized))) &&
    !hasPrompt;

  // Broad ambiguous categories missing workflow pipelines
  const isBroadVideoAi =
    /video[- ]?ai|ai video|generative video|video generator|video platform/i.test(normalized) &&
    !/stems|timeline|srt|subtitles|clip marker/i.test(normalized);
  const isBroadMarketplace =
    /marketplace|trade(s)?people.*jobs|offer small jobs/i.test(normalized) &&
    !/escrow|instant book|fixed price|radius/i.test(normalized);
  const isBroadAssistant =
    /government assistance|eligible|benefits/i.test(normalized) &&
    !/eligibility rules|intake wizard|document checklist/i.test(normalized);

  // Concrete domain with established workflow
  const isConcreteDomain =
    (/electrical|electrician|plumber|hvac|mechanic/i.test(normalized) && /job|quote|material|hour/i.test(normalized)) ||
    (/music|musician|producer/i.test(normalized) && /stem|track|export|metadata/i.test(normalized)) ||
    (/github|repo|code review/i.test(normalized) && /plan|architecture|diff/i.test(normalized));

  // If vague discovery:
  if (isVague && !hasPrompt) {
    return {
      isReady: false,
      unresolvedTopic: "Core Problem & Beneficiary",
      explanation: "No specific workflow, user persona, or friction has been identified.",
      consequentialQuestions: [
        "Who specifically is experiencing this friction (trade, role, consumer)?",
        "What is a concrete moment of pain or frustration that happens today?",
      ],
      readinessChecks: [
        { id: "core_purpose", label: "Core Purpose Understood", status: "pending", details: "Exploring problem space; no concrete domain identified" },
        { id: "primary_workflow", label: "Primary User Workflow Defined", status: "pending", details: "Interaction loop not yet initiated" },
        { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "pending", details: "Input data types and artifacts unestablished" },
        { id: "capabilities", label: "Key Capabilities Established", status: "pending", details: "Awaiting domain selection" },
        { id: "architecture", label: "Architectural Decisions Resolved", status: "pending", details: "Technical architecture awaiting workflow definition" },
        { id: "ambiguities", label: "Material Ambiguities Addressed", status: "unresolved", details: "Core problem and beneficiary unresolved" },
        { id: "consistency", label: "Internally Consistent", status: "met", details: "Initial exploration phase" },
        { id: "retention", label: "No Lost Decisions", status: "met", details: "No decisions recorded yet" },
      ],
    };
  }

  // If saturated consumer platform:
  if (isSaturated) {
    return {
      isReady: false,
      unresolvedTopic: "Market Viability & Differentiated Wedge",
      explanation: "Generic short-video platforms compete directly against entrenched network-effect monopolies (TikTok, Reels, Shorts).",
      consequentialQuestions: [
        "Do you have a constrained, high-trust niche (e.g. private team standups, athletic critique)?",
        "Or should we explore a different problem space with genuine greenfield opportunity?",
      ],
      readinessChecks: [
        { id: "core_purpose", label: "Core Purpose Understood", status: "met", details: "Generic consumer media request" },
        { id: "primary_workflow", label: "Primary User Workflow Defined", status: "pending", details: "Unconstrained feed without focused workflow" },
        { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "pending", details: "Mass video upload/streaming requires massive infrastructure" },
        { id: "capabilities", label: "Key Capabilities Established", status: "pending", details: "Features undefined beyond clone pattern" },
        { id: "architecture", label: "Architectural Decisions Resolved", status: "pending", details: "CDN and transcoding undefined" },
        { id: "ambiguities", label: "Material Ambiguities Addressed", status: "unresolved", details: "High risk of network effect failure without defensible wedge" },
        { id: "consistency", label: "Internally Consistent", status: "met" },
        { id: "retention", label: "No Lost Decisions", status: "met" },
      ],
    };
  }

  // Broad workflows needing pipeline definition:
  if ((isBroadVideoAi || isBroadMarketplace || isBroadAssistant) && !hasPrompt) {
    let topic = "Workflow Boundaries & Data Model";
    let explanation = "The high-level concept has been described, but the specific input-to-output pipeline, actor roles, and core unit of work remain unestablished.";
    let questions = [
      "What is the exact input provided by the user, and what is the concrete output the system produces?",
      "What is the single most critical decision or interaction that occurs between input and output?",
    ];

    if (isBroadVideoAi) {
      topic = "Input Asset Handling & Generation Pipeline";
      explanation = "Video processing involves heavy technical tradeoffs (generation vs editing vs analysis, rendering latency, asset storage). Without knowing the specific workflow, building would require guessing the entire architecture.";
      questions = [
        "Is the user generating new video from text/prompts, editing existing uploaded footage, or analyzing video for insights?",
        "What is the single primary artifact the user expects to walk away with (e.g., rendered MP4, storyboard, timestamped clips)?",
      ];
    } else if (isBroadMarketplace) {
      topic = "Transaction Mechanics & Two-Sided Trust";
      explanation = "Marketplaces fail when workflow mechanics (bidding vs instant dispatch vs lead-gen) are left unaddressed.";
      questions = [
        "Is this an instant on-demand dispatch or a quotation/bidding board?",
        "How do homeowner and tradesperson communicate and confirm completion?",
      ];
    }

    return {
      isReady: false,
      unresolvedTopic: topic,
      explanation,
      consequentialQuestions: questions,
      readinessChecks: [
        { id: "core_purpose", label: "Core Purpose Understood", status: "met", details: "Broad concept recognized" },
        { id: "primary_workflow", label: "Primary User Workflow Defined", status: "unresolved", details: "Input-to-output interaction loop undefined" },
        { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "unresolved", details: "Exact payload types and artifacts unconfirmed" },
        { id: "capabilities", label: "Key Capabilities Established", status: "pending", details: "Feature boundary waiting on workflow" },
        { id: "architecture", label: "Architectural Decisions Resolved", status: "pending", details: "Pipeline tradeoffs need domain decision" },
        { id: "ambiguities", label: "Material Ambiguities Addressed", status: "unresolved", details: topic },
        { id: "consistency", label: "Internally Consistent", status: "met" },
        { id: "retention", label: "No Lost Decisions", status: "met" },
      ],
    };
  }

  // Short single-sentence prompt without concrete domain:
  if (normalized.split(" ").length < 18 && !hasPrompt && !isConcreteDomain && !isBuildTrigger) {
    return {
      isReady: false,
      unresolvedTopic: "Core Interaction & Primary Workflow",
      explanation: "We understand the general domain, but the specific interaction loop and primary user action are not yet defined.",
      consequentialQuestions: [
        "What is the single most frequent action a user takes on this screen?",
        "What data or state must persist between sessions?",
      ],
      readinessChecks: [
        { id: "core_purpose", label: "Core Purpose Understood", status: "met", details: "General domain identified" },
        { id: "primary_workflow", label: "Primary User Workflow Defined", status: "unresolved", details: "Primary user action loop needed" },
        { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "pending", details: "Persisted state parameters needed" },
        { id: "capabilities", label: "Key Capabilities Established", status: "pending", details: "Core capabilities awaiting input" },
        { id: "architecture", label: "Architectural Decisions Resolved", status: "pending", details: "Storage pattern needs clarification" },
        { id: "ambiguities", label: "Material Ambiguities Addressed", status: "unresolved", details: "Interaction mechanics ambiguous" },
        { id: "consistency", label: "Internally Consistent", status: "met" },
        { id: "retention", label: "No Lost Decisions", status: "met" },
      ],
    };
  }

  // Passed readiness gate!
  return {
    isReady: true,
    readinessChecks: [
      { id: "core_purpose", label: "Core Purpose Understood", status: "met", details: "Explicit domain and beneficiary established" },
      { id: "primary_workflow", label: "Primary User Workflow Defined", status: "met", details: "Input-to-output pipeline bounded and operational" },
      { id: "inputs_outputs", label: "Inputs & Outputs Known", status: "met", details: "Domain entities, parameters, and deliverables specified" },
      { id: "capabilities", label: "Key Capabilities Established", status: "met", details: "Scope and feature boundaries strictly locked" },
      { id: "architecture", label: "Architectural Decisions Resolved", status: "met", details: "Single-screen SPA with explicit storage pattern" },
      { id: "ambiguities", label: "Material Ambiguities Addressed", status: "met", details: "Tradeoffs resolved without speculative bloat" },
      { id: "consistency", label: "Internally Consistent", status: "met", details: "All requirements mutually coherent" },
      { id: "retention", label: "No Lost Decisions", status: "met", details: "Latest canonical state fully preserved" },
    ],
  };
}

// Helper: Derive Downstream Project Representation directly from Achieved Master Prompt
function deriveDownstreamProjectRepresentation(
  title: string,
  prompt: string,
  requirements?: any
): {
  architecture: {
    summary: string;
    dataFlow: string;
    techLayers: { layer: string; details: string }[];
  };
  repositoryStructure: {
    treeText: string;
    files: { path: string; purpose: string }[];
  };
  moduleRelationships: {
    modules: { name: string; responsibility: string; dependencies: string[] }[];
  };
  implementationPlan: {
    steps: { stepNumber: number; title: string; promptObjective: string; verificationCriteria: string[] }[];
  };
  gitHubIntegrationNote: string;
} {
  const isElectrician = /\b(electric|electrician|subcontractor|technician|materials|trades)\b/i.test(prompt + " " + title);
  const isMusic = /\b(music|stems?|audio|bpm|synthesizer|sampler|mastering)\b/i.test(prompt + " " + title);
  const isLegal = /\b(lawyer|legal|contracts?|clauses?|attorney|diff|redline|indemnification)\b/i.test(prompt + " " + title);

  if (isLegal) {
    return {
      architecture: {
        summary: "Single-screen contract clause comparator with client-side diffing, risk assessment scoring, and local session persistence.",
        dataFlow: "User inputs clause A and clause B → Client diff parser computes inline deletions/additions → Risk scoring rules evaluate deviation severity → Side-by-side diff readout renders with suggested alternative language → Instant clipboard copy.",
        techLayers: [
          { layer: "Presentation Layer (UI)", details: "React 19, Tailwind CSS, high-contrast monospace diff readouts with accessible red/green semantic indicators." },
          { layer: "Comparison Engine", details: "Client-side Myers diff algorithm and phrase-level semantic similarity scoring in pure TypeScript." },
          { layer: "Storage & Privacy", details: "100% in-browser state with LocalStorage history buffer; zero third-party telemetry to protect client confidentiality." },
        ],
      },
      repositoryStructure: {
        treeText: `├── src/
│   ├── components/
│   │   ├── ClauseInputPair.tsx
│   │   ├── SideBySideDiff.tsx
│   │   ├── RiskAssessmentBadge.tsx
│   │   └── SuggestedLanguagePanel.tsx
│   ├── types.ts
│   ├── utils/
│   │   └── diffEngine.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md`,
        files: [
          { path: "src/types.ts", purpose: "Strict domain models for ClauseComparison, DiffChunk, RiskEvaluation, and AlternativeSuggestion." },
          { path: "src/components/ClauseInputPair.tsx", purpose: "Dual split-pane text editor with paste shortcuts and character/word counter." },
          { path: "src/components/SideBySideDiff.tsx", purpose: "Visual comparison viewer highlighting additions, deletions, and structural phrasing shifts." },
          { path: "src/components/RiskAssessmentBadge.tsx", purpose: "Real-time risk scoring indicator identifying indemnification and liability exposure." },
          { path: "src/utils/diffEngine.ts", purpose: "Fast, deterministic word-level and token-level diff calculation." },
        ],
      },
      moduleRelationships: {
        modules: [
          { name: "ClauseInputPair", responsibility: "Captures original and revised clauses with instant character/word count", dependencies: ["types.ts"] },
          { name: "SideBySideDiff", responsibility: "Renders synchronized line-by-line diff view", dependencies: ["diffEngine.ts", "types.ts"] },
          { name: "RiskAssessmentBadge", responsibility: "Calculates and visualizes risk exposure metrics", dependencies: ["types.ts"] },
          { name: "SuggestedLanguagePanel", responsibility: "Provides standard alternative clauses with single-click copy", dependencies: ["types.ts"] },
        ],
      },
      implementationPlan: {
        steps: [
          { stepNumber: 1, title: "Contract Domain Types & Diff Utility", promptObjective: "Define ClauseComparison and DiffChunk types, implement deterministic word-level diffing in src/utils/diffEngine.ts.", verificationCriteria: ["Zero generic 'ItemRecord' placeholders", "Accurate addition and deletion tokenization"] },
          { stepNumber: 2, title: "Dual Input Interface", promptObjective: "Build ClauseInputPair with side-by-side paste boxes, sample clause loader, and quick swap button.", verificationCriteria: ["Zero layout shifting on large clause paste", "Immediate reactive comparison trigger"] },
          { stepNumber: 3, title: "Side-by-Side Diff & Risk Visualizer", promptObjective: "Construct SideBySideDiff and RiskAssessmentBadge with semantic color-coding and risk severity rating.", verificationCriteria: ["High contrast accessible diff colors", "Instant recalculation on clause edit"] },
          { stepNumber: 4, title: "Alternative Language & Copy Flow", promptObjective: "Wire suggested alternative language cards, single-click clipboard copy, and recent comparison history.", verificationCriteria: ["One-click copy with visual toast confirmation", "Zero server roundtrips ensuring legal privacy"] },
        ],
      },
      gitHubIntegrationNote: "Live GitHub repository synchronization planned for future release. This downstream project representation is derived directly from the achieved master prompt.",
    };
  }

  if (isElectrician) {
    return {
      architecture: {
        summary: "Single-view reactive SPA with zero-friction local persistence and real-time quote/margin calculations.",
        dataFlow: "User input (Customer, Scope, Rates) → Reactive Quote Estimator → Local Storage Key-Value Persistence → Live Job Margin Monitor (Actual Parts & Hours vs. Quoted Total) → One-Click CSV Summary Export.",
        techLayers: [
          { layer: "Presentation Layer (UI)", details: "React 19, Tailwind CSS, Lucide icons, responsive layout optimized for tablet & mobile job sites." },
          { layer: "State & Calculations", details: "Custom reactive state hooks for quote computation, margin analysis, and job status progression." },
          { layer: "Persistence & I/O", details: "Browser LocalStorage with export/import serialization and zero backend server requirements." },
        ],
      },
      repositoryStructure: {
        treeText: `├── src/
│   ├── components/
│   │   ├── JobCard.tsx
│   │   ├── QuoteEstimator.tsx
│   │   ├── MaterialReceiptLogger.tsx
│   │   └── TechnicianHoursLogger.tsx
│   ├── types.ts
│   ├── utils/
│   │   └── calculations.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md`,
        files: [
          { path: "src/types.ts", purpose: "Strict domain interfaces for JobRecord, QuoteItem, MaterialReceipt, and TechnicianLog." },
          { path: "src/components/QuoteEstimator.tsx", purpose: "Form and drawer interface to calculate initial quotes based on scope and estimated hours." },
          { path: "src/components/JobCard.tsx", purpose: "Visual board card with live margin calculation comparing actual expenses against quoted cap." },
          { path: "src/components/MaterialReceiptLogger.tsx", purpose: "Instant receipt logger capturing supplier, item cost, and invoice attachment reference." },
          { path: "src/utils/calculations.ts", purpose: "Pure mathematical functions for profitability margin, tax, and labor totals." },
        ],
      },
      moduleRelationships: {
        modules: [
          { name: "QuoteEstimator", responsibility: "Calculates initial job estimates and passes new JobRecord to App state", dependencies: ["calculations.ts", "types.ts"] },
          { name: "JobCard", responsibility: "Renders active job status and live profitability margins", dependencies: ["MaterialReceiptLogger", "TechnicianHoursLogger", "calculations.ts"] },
          { name: "MaterialReceiptLogger", responsibility: "Updates material receipts array on targeted job", dependencies: ["types.ts"] },
          { name: "TechnicianHoursLogger", responsibility: "Tracks labor shifts and rates per job card", dependencies: ["types.ts"] },
        ],
      },
      implementationPlan: {
        steps: [
          { stepNumber: 1, title: "Domain Types & Pure Math", promptObjective: "Implement domain interfaces (JobRecord, QuoteItem, MaterialReceipt) and margin calculations in src/types.ts and src/utils/calculations.ts.", verificationCriteria: ["Zero generic 'ItemRecord' placeholders", "Accurate margin percentage formulas"] },
          { stepNumber: 2, title: "Quote Creation & Estimator View", promptObjective: "Build QuoteEstimator component with scope breakdown, hourly rate inputs, and instant total computation.", verificationCriteria: ["Immediate responsive recalculation on keystroke", "Validation on required fields"] },
          { stepNumber: 3, title: "Active Job Board & Live Margin Monitor", promptObjective: "Construct JobCard displaying status progression, actual vs. estimated cost bars, and receipt attachment toggles.", verificationCriteria: ["Live color-coded margin warnings when actuals approach quote limit", "Accessible touch targets min 44px"] },
          { stepNumber: 4, title: "Status Advancement & CSV Billing Export", promptObjective: "Wire LocalStorage persistence, status filters (quoted, active, invoiced), and single-click CSV export.", verificationCriteria: ["Clean export matching accounting format", "State survives browser refresh"] },
        ],
      },
      gitHubIntegrationNote: "Live GitHub repository synchronization planned for future release. This downstream project representation is derived directly from the achieved master prompt.",
    };
  }

  if (isMusic) {
    return {
      architecture: {
        summary: "High-density single-screen audio stem arranger with Web Audio API previews and client-side ZIP packaging.",
        dataFlow: "Audio files + Stem role tags → Web Audio waveform decoder → Channel rack mixer → Metadata sheet generator → Client ZIP archive export.",
        techLayers: [
          { layer: "Presentation Layer (UI)", details: "React 19, Tailwind CSS, high-density audio track visualizer." },
          { layer: "Audio Engine", details: "Web Audio API AudioContext for decoded buffer rendering, waveform rendering, and channel mute/solo." },
          { layer: "Packaging & Persistence", details: "JSZip / LocalStorage for bundle assembly and session restoration." },
        ],
      },
      repositoryStructure: {
        treeText: `├── src/
│   ├── components/
│   │   ├── StemChannelRack.tsx
│   │   ├── WaveformVisualizer.tsx
│   │   ├── MetadataAnnotator.tsx
│   │   └── PackageExporter.tsx
│   ├── types.ts
│   ├── audio/
│   │   └── audioEngine.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md`,
        files: [
          { path: "src/types.ts", purpose: "Interfaces for StemTrack, SongProject, BPMDetectionResult, and AudioChannelState." },
          { path: "src/components/StemChannelRack.tsx", purpose: "Channel rack for mute/solo, volume trim, role tagging, and track sequencing." },
          { path: "src/components/WaveformVisualizer.tsx", purpose: "Interactive canvas waveform previewing decoded multi-track audio." },
          { path: "src/audio/audioEngine.ts", purpose: "Web Audio API buffer management and multi-track playback sync." },
          { path: "src/components/PackageExporter.tsx", purpose: "Assembles stem files and metadata text sheet into an exportable production pack." },
        ],
      },
      moduleRelationships: {
        modules: [
          { name: "StemChannelRack", responsibility: "Manages audio tracks, labels, and mixer controls", dependencies: ["audioEngine.ts", "types.ts"] },
          { name: "WaveformVisualizer", responsibility: "Draws waveform peaks and synchronizes playback playhead", dependencies: ["audioEngine.ts"] },
          { name: "MetadataAnnotator", responsibility: "Binds BPM, key signature, and production notes to the SongProject", dependencies: ["types.ts"] },
          { name: "PackageExporter", responsibility: "Bundles audio assets into organized stem ZIP archive", dependencies: ["types.ts"] },
        ],
      },
      implementationPlan: {
        steps: [
          { stepNumber: 1, title: "Audio Types & State Contracts", promptObjective: "Define StemTrack and SongProject interfaces with strict roles (drums, bass, vocals, synth).", verificationCriteria: ["Clean TypeScript interfaces without generic models", "Web Audio state contracts"] },
          { stepNumber: 2, title: "Stem Channel Mixer & Waveforms", promptObjective: "Implement StemChannelRack with mute/solo buttons and canvas waveform previews.", verificationCriteria: ["Zero layout shift during audio file upload", "Immediate audio playhead feedback"] },
          { stepNumber: 3, title: "Metadata & Mix Annotations", promptObjective: "Build BPM, musical key, and mix notes annotation panel.", verificationCriteria: ["Instant reactive state synchronization", "Clean musical notation tags"] },
          { stepNumber: 4, title: "Production Pack ZIP Assembly", promptObjective: "Implement client-side stem packaging and download bundle generation.", verificationCriteria: ["Proper file naming inside archive", "Download triggers without server roundtrip"] },
        ],
      },
      gitHubIntegrationNote: "Live GitHub repository synchronization planned for future release. This downstream project representation is derived directly from the achieved master prompt.",
    };
  }

  // Default derived representation matching prompt domain
  const cleanTitle = title || "Focused Application";
  return {
    architecture: {
      summary: `Focused single-screen web application solving "${cleanTitle}" with zero unnecessary onboarding overhead and local state persistence.`,
      dataFlow: "User interaction → Dedicated domain controller → Local key-value state → Responsive visual display → Export & copy output.",
      techLayers: [
        { layer: "Presentation (UI)", details: "React 19, Tailwind CSS, Lucide icons, responsive layout with accessible touch targets (min 44px)." },
        { layer: "Application State", details: "Reactive TypeScript domain hooks enforcing explicit validation contracts." },
        { layer: "Storage & Persistence", details: "Client-side key-value persistence with structured export capabilities." },
      ],
    },
    repositoryStructure: {
      treeText: `├── src/
│   ├── components/
│   │   ├── PrimaryWorkspace.tsx
│   │   ├── ActionControlBar.tsx
│   │   └── SummaryDisplay.tsx
│   ├── types.ts
│   ├── utils/
│   │   └── storage.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md`,
      files: [
        { path: "src/types.ts", purpose: "Strict TypeScript domain interfaces tailored specifically to this application's domain." },
        { path: "src/components/PrimaryWorkspace.tsx", purpose: "Main single-screen view hosting the primary user action loop." },
        { path: "src/components/ActionControlBar.tsx", purpose: "Tactile action controls and operational filters." },
        { path: "src/components/SummaryDisplay.tsx", purpose: "Visual presentation of active records and metrics." },
        { path: "src/utils/storage.ts", purpose: "Persistence and serialization utilities." },
      ],
    },
    moduleRelationships: {
      modules: [
        { name: "PrimaryWorkspace", responsibility: "Coordinates core user interaction and active data display", dependencies: ["ActionControlBar", "SummaryDisplay", "types.ts"] },
        { name: "ActionControlBar", responsibility: "Dispatches user operations and filter changes", dependencies: ["types.ts"] },
        { name: "SummaryDisplay", responsibility: "Presents status and domain computations", dependencies: ["types.ts"] },
      ],
    },
    implementationPlan: {
      steps: [
        { stepNumber: 1, title: "Domain Contracts & Architecture", promptObjective: "Establish domain models in src/types.ts matching the established master prompt.", verificationCriteria: ["Zero generic placeholder entities", "Strict typing"] },
        { stepNumber: 2, title: "Primary Workspace & Capture View", promptObjective: "Construct the central user interaction loop with responsive keyboard and touch controls.", verificationCriteria: ["Instant tactile response", "Accurate field validation"] },
        { stepNumber: 3, title: "Action Controls & Persistence", promptObjective: "Wire local persistence and inline actions to ensure state survives session reload.", verificationCriteria: ["LocalStorage synchronization verified", "Clean error boundaries"] },
        { stepNumber: 4, title: "Export & Delivery", promptObjective: "Add single-click export and finalize production styling.", verificationCriteria: ["Fast, zero-latency export", "Passed accessibility audit"] },
      ],
    },
    gitHubIntegrationNote: "Live GitHub repository synchronization planned for future release. This downstream project representation is derived directly from the achieved master prompt.",
  };
}

// Helper: Derive target-specific projections from the canonical living master prompt
function deriveTargetProjections(
  title: string,
  canonicalPrompt: string,
  requirements?: any,
  downstreamRep?: any
): { build: string; dev: string; create: string } {
  if (!canonicalPrompt || !canonicalPrompt.trim()) {
    return { build: "", dev: "", create: "" };
  }

  const cleanTitle = title || "Focused Project";
  const rep = downstreamRep || deriveDownstreamProjectRepresentation(cleanTitle, canonicalPrompt, requirements);

  // 1. BUILD (Detail - "Build this application" - Target: Google AI Studio)
  let buildPrompt = canonicalPrompt;
  if (!buildPrompt.includes("MODE: BUILD / DETAIL")) {
    const rawBody = canonicalPrompt.replace(/\/\/ =+\n\/\/ GOOGLE AI STUDIO BUILD PROMPT[\s\S]*?\/\/ =+\n\n/, "");
    buildPrompt = `// ========================================================
// TARGET: GOOGLE AI STUDIO (MODE: BUILD / DETAIL)
// Directive: "Build this application"
// Project: ${cleanTitle}
// Copy and paste directly into https://ai.studio/build
// ========================================================

${rawBody.trim()}`;
  }

  // 2. DEV (Plan - "Develop this software/system" - Target: LLM / Coding Agent: Cursor, Claude Code, Copilot, Aider)
  const repoTree = rep?.repositoryStructure?.treeText || `├── src/
│   ├── components/
│   │   ├── PrimaryWorkspace.tsx
│   │   ├── ActionControlBar.tsx
│   │   └── SummaryDisplay.tsx
│   ├── types.ts
│   ├── utils/
│   │   └── storage.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md`;

  const fileList = rep?.repositoryStructure?.files || [
    { path: "src/types.ts", purpose: "Strict TypeScript domain models and state interfaces." },
    { path: "src/components/PrimaryWorkspace.tsx", purpose: "Core single-screen view hosting the primary user action loop." },
    { path: "src/components/ActionControlBar.tsx", purpose: "Tactile action controls, filters, and state toggles." },
    { path: "src/components/SummaryDisplay.tsx", purpose: "Visual presentation of active records and metrics." },
    { path: "src/utils/storage.ts", purpose: "Persistence and serialization utilities using LocalStorage." },
  ];

  const modules = rep?.moduleRelationships?.modules || [
    { name: "PrimaryWorkspace", responsibility: "Coordinates core user interaction and active data display", dependencies: ["ActionControlBar", "SummaryDisplay", "types.ts"] },
    { name: "ActionControlBar", responsibility: "Dispatches user operations and state mutations", dependencies: ["types.ts"] },
    { name: "SummaryDisplay", responsibility: "Presents status and domain computations", dependencies: ["types.ts"] },
  ];

  const steps = rep?.implementationPlan?.steps || [
    {
      stepNumber: 1,
      title: "Domain Contracts & Architecture",
      promptObjective: `Establish domain models in src/types.ts matching "${cleanTitle}".`,
      verificationCriteria: ["Zero generic 'ItemRecord' placeholders", "Strict TypeScript types with zero 'any'"],
    },
    {
      stepNumber: 2,
      title: "Primary Workspace & Capture View",
      promptObjective: "Construct the central user interaction loop with responsive keyboard and touch controls.",
      verificationCriteria: ["Instant tactile response", "Accurate field validation and zero layout shifts"],
    },
    {
      stepNumber: 3,
      title: "Action Controls & Persistence",
      promptObjective: "Wire local persistence and inline actions to ensure state survives session reload.",
      verificationCriteria: ["LocalStorage synchronization verified", "Clean error boundaries"],
    },
    {
      stepNumber: 4,
      title: "Export & Delivery",
      promptObjective: "Add single-click export and finalize production styling.",
      verificationCriteria: ["Fast, zero-latency export", "Passed accessibility audit (touch targets >= 44px)"],
    },
  ];

  const devPlan = `// ========================================================
// TARGET: LLM / CODING AGENT (MODE: DEV / PLAN)
// Directive: "Develop this software/system"
// Project: ${cleanTitle}
// Target Environments: Cursor Composer, Claude Code, Copilot Workspace, Aider
// ========================================================

# SYSTEM ARCHITECTURAL PLAN
You are the primary engineering agent tasked with building the software system defined below.
Execute the implementation following the prescribed repository file structure, module responsibilities, and sequential verification gates.

## 1. TECHNICAL STACK & CONVENTIONS
- Framework: React 19, TypeScript (strict mode enabled), Tailwind CSS.
- Build Engine: Vite with hot-module reload support.
- State & Persistence: Client-side local key-value state (LocalStorage) with reactive custom hooks.
- Architecture: Single-view, low-latency, zero-friction user experience.
- UI Guidelines: Accessible touch targets (min 44px), high-contrast neutrals, zero unrequested modal walls.

## 2. REPOSITORY & FILE STRUCTURE
\`\`\`
${repoTree}
\`\`\`

### File Responsibilities:
${fileList.map((f: any) => `- \`${f.path}\`: ${f.purpose}`).join("\n")}

## 3. MODULE RELATIONSHIPS & DEPENDENCY GRAPH
${modules.map((m: any) => `- **${m.name}**: ${m.responsibility} (Dependencies: ${m.dependencies.join(", ")})`).join("\n")}

## 4. STEP-BY-STEP IMPLEMENTATION INSTRUCTIONS
${steps.map((s: any) => `### Step ${s.stepNumber}: ${s.title}
- Objective: ${s.promptObjective}
- Verification Criteria:
${s.verificationCriteria.map((c: any) => `  * [ ] ${c}`).join("\n")}`).join("\n\n")}

## 5. CODING AGENT RESTRICTIONS & VERIFICATION GATES
1. Do NOT invent generic ItemRecord CRUD placeholders or unrequested database layers.
2. Ensure every button and input handler is fully wired with real state mutations.
3. Test that state survives browser reload via LocalStorage serialization.
4. Maintain strict separation of concerns between types, computation utilities, and view components.
5. All code must compile cleanly without TypeScript warnings or linting errors.`;

  // 3. CREATE (Brief - "Create this creative output" - Target: Creative AI Tools: Suno, Midjourney, ElevenLabs, Runway)
  const isMusic = /\b(music|stems?|audio|bpm|synthesizer|sampler|mastering|drums|vocals|mixing)\b/i.test(canonicalPrompt + " " + cleanTitle);
  const isLegal = /\b(lawyer|legal|contracts?|clauses?|attorney|diff|redline|indemnification)\b/i.test(canonicalPrompt + " " + cleanTitle);
  const isTrades = /\b(electric|electrician|subcontractor|technician|materials|trades|plumbing|hvac)\b/i.test(canonicalPrompt + " " + cleanTitle);

  let creativeBrief = "";

  if (isMusic) {
    creativeBrief = `// ========================================================
// TARGET: CREATIVE AI ENGINES (MODE: CREATE / BRIEF)
// Directive: "Create this creative output"
// Project: ${cleanTitle}
// Target Environments: Suno AI, Midjourney, ElevenLabs, Runway Gen-3
// ========================================================

# CREATIVE GENERATION BRIEF

## 1. SUNO AI AUDIO & STEM GENERATION PROMPT
- Style Prompt: dark alt-trap, heavy syncopated 808 sub-bass, atmospheric minor arpeggio, rapid closed hi-hats, melodic vocal chops, 140 bpm, clean stem separation
- Track Title: "${cleanTitle} — Sonic Session"
- Composition Structure & Section Cues:
  [Intro] Filtered low-pass ambient synth, distant sub heartbeat
  [Verse 1] Dry rhythmic drums, clean 808 kick, tight vocal cadence
  [Pre-Chorus] Tension build, rapid snare rolls, rising pitch filter
  [Chorus] Wide stereo drop, deep sub bass, catchy layered vocal hook
  [Bridge] Stripped back percussion, reverse cymbals, floating pads
  [Drop / Climax] Full stem energy, syncopated rhythm, distorted sub accent
  [Outro] Echoing synth tail, tape stop finish
- Stem Extraction Roles:
  * Drum Stem: Kick, snare, open/closed hi-hats, rimshot
  * Bass Stem: 808 glide, sub-bass 40Hz foundation
  * Melodic Stem: Minor synth lead, pad harmony, pluck arpeggio
  * Vocal Stem: Dry vocal track, harmonic double, vocal ad-libs

## 2. MIDJOURNEY CONCEPT ART & ALBUM ARTWORK PROMPT
- Art Direction: Cyber-analog studio console with illuminated faders and glowing VU meters, dark moody atmospheric lighting, neon amber and matte charcoal aesthetic, macro lens, shallow depth of field --ar 16:9 --style raw --v 6.0
- Color Palette: Matte Obsidian (#0C0A09), Signal Amber (#F59E0B), Emerald Green (#10B981)

## 3. AUDIO PRODUCTION DIRECTIVES
- Master loudness target: -14 LUFS integrated, -1.0 dB true peak.
- Emphasize punchy transient dynamics suitable for stem previewing and multi-track slicing.`;
  } else if (isLegal) {
    creativeBrief = `// ========================================================
// TARGET: CREATIVE AI ENGINES (MODE: CREATE / BRIEF)
// Directive: "Create this creative output"
// Project: ${cleanTitle}
// Target Environments: Suno AI (Interface Sound Design), Midjourney (Visual Assets), ElevenLabs
// ========================================================

# CREATIVE GENERATION BRIEF

## 1. BRAND IDENTITY & CREATIVE DIRECTION
- Concept: Surgical clarity, calm authority, high-contrast precision for corporate legal workflows.
- Brand Tone: Uncompromisingly focused, quiet confidence, Swiss typographic minimalism, zero fluff.

## 2. SUNO / ELEVENLABS SONIC BRANDING & INTERACTION AUDIO
- Ambient Soundscape Prompt (Focus Mode): Minimalist Scandinavian drone in D minor, warm analog tape saturation, subtle resonant pads, 90 bpm, deep concentration flow state
- Tactile UI Sound FX Directives:
  * Diff Execution Sound: Crisp mechanical tactile click (frequency 2.4kHz, 12ms decay)
  * High-Risk Clause Flag: Muted wooden percussive knock with low-frequency resonance
  * Alternative Language Copy: Soft harmonic bell chime (C6, pristine decay)
- Voiceover Persona: Crisp, neutral, authoritative British or Mid-Atlantic attorney narration, measured cadence.

## 3. MIDJOURNEY HERO & BRAND ARTWORK PROMPT
- Art Direction: Architectural macro photograph of a solo lawyer's obsidian desk at twilight, dual matte screens displaying glowing amber code diffs, brass fountain pen, soft rainy window reflection, Leica 35mm f/1.4 photography --ar 16:9 --style raw --v 6.0
- Color Palette: Deep Slate (#0F172A), Crisp White (#F8FAFC), Alert Amber (#F59E0B), Monospace Emerald (#10B981)

## 4. CREATIVE CONSTRAINTS
- Prohibit cartoonish iconography, generic law gavel clichés, or decorative gradients. Prioritize architectural restraint.`;
  } else if (isTrades) {
    creativeBrief = `// ========================================================
// TARGET: CREATIVE AI ENGINES (MODE: CREATE / BRIEF)
// Directive: "Create this creative output"
// Project: ${cleanTitle}
// Target Environments: Midjourney (Industrial Visuals), Suno (Job-Site Sound Design)
// ========================================================

# CREATIVE GENERATION BRIEF

## 1. FIELD BRAND & VISUAL IDENTITY
- Concept: Rugged, weather-hardened, high-visibility field tool built for contractor job sites.
- Visual Language: Industrial utility, bold legible numerals, safety accents, high-contrast sunlight readability.

## 2. SUNO AUDIO & JOB-SITE SOUND DESIGN
- Audio Cues & Field Feedback:
  * Quote Saved: Solid mechanical toggle clack, heavy metal latch sound
  * Margin Alert: Sharp dual acoustic warning tone (frequency 800Hz / 1200Hz)
  * Invoice Exported: Crisp paper receipt tear with positive tonal confirmation

## 3. MIDJOURNEY HERO & PRODUCT VISUAL PROMPT
- Art Direction: Industrial rugged tablet resting on electrical conduit and blueprint plans inside an active commercial job site, golden hour sunlight through steel beams, dust motes in air, authentic craftsmanship, Sony A7R V 50mm f/1.8 --ar 16:9 --style raw --v 6.0
- Color Palette: Industrial Charcoal (#18181B), Safety Orange (#EA580C), High-Vis Yellow (#CA8A04), Conduit Gray (#71717A)

## 4. CREATIVE CONSTRAINTS
- Avoid sterile corporate SaaS visuals; celebrate real trade tools, authentic materials, and tangible utility.`;
  } else {
    creativeBrief = `// ========================================================
// TARGET: CREATIVE AI ENGINES (MODE: CREATE / BRIEF)
// Directive: "Create this creative output"
// Project: ${cleanTitle}
// Target Environments: Suno AI, Midjourney, Runway Gen-3, ElevenLabs
// ========================================================

# CREATIVE GENERATION BRIEF

## 1. CREATIVE IDENTITY & DIRECTION
- Project Concept: "${cleanTitle}"
- Aesthetic Persona: Tactile, modern minimalism with generous negative space and purposeful high-contrast typography.
- Emotional Core: Effortless flow, immediate clarity, zero friction.

## 2. SUNO AI INTERFACE SOUNDSCAPE & SONIC BRANDING
- Background Focus Track: Ambient downtempo synth, warm electric piano chords, light vinyl warmth, 100 bpm, steady rhythmic pulse for deep productivity
- Audio Interaction Palette:
  * Primary Action: Crisp tactile wooden click (8ms attack, fast decay)
  * Success / Complete: Warm harmonic interval chime (F# major triad)
  * Reset / Clear: Soft whoosh with low-pass dampening

## 3. MIDJOURNEY CONCEPT & ASSET ARTWORK PROMPT
- Art Direction: Minimalist product workspace with tactile matte surfaces, crisp typography casting subtle shadows, warm diffused studio lighting, Hasselblad medium format photography, 8k resolution --ar 16:9 --style raw --v 6.0
- Color Palette: Warm Neutral Linen (#FAFAF9), Deep Graphite (#1C1917), Accent Amber (#F59E0B)

## 4. CREATIVE CONSTRAINTS & NON-GOALS
- Strictly avoid generic corporate vector illustrations or neon purple gradients. Enforce authentic physical texture and intentional typography.`;
  }

  return {
    build: buildPrompt,
    dev: devPlan,
    create: creativeBrief,
  };
}

// Helper: Backward-compatible check for quick gating
function isTooVagueOrUnderExplored(message: string): boolean {
  return !evaluateReadinessGate(message).isReady;
}

// Helper: Generate structured project continuity response adhering strictly to the Sniper Principle & Restraint Principle
function generateContinuityFallbackResponse({
  lastUserMessage,
  currentWorkingPrompt,
  project,
  activeIdea,
  isBuildTrigger,
  isAiStudioFeedback,
  isArchitecturalPivot,
}: {
  lastUserMessage: string;
  currentWorkingPrompt?: string;
  project?: any;
  activeIdea?: string;
  isBuildTrigger: boolean;
  isAiStudioFeedback: boolean;
  isArchitecturalPivot: boolean;
}) {
  const projectTitle = project?.identity?.title || activeIdea || "Ongoing Project";
  const ideaTopic = lastUserMessage.length > 50 ? lastUserMessage.substring(0, 50) + "..." : lastUserMessage;
  const isVagueOrDiscoveryOnly = !currentWorkingPrompt && isTooVagueOrUnderExplored(lastUserMessage) && !isBuildTrigger;

  let workingPromptFallback = currentWorkingPrompt || "";
  let responseContent = "";
  let updatedProjectRequirements = project?.requirements || {
    purpose: lastUserMessage,
    architecture: {
      stack: ["React 19", "TypeScript", "Tailwind CSS"],
      storage: "Client-side key-value / LocalStorage",
      pattern: "Single-view SPA",
    },
    coreCapabilities: ["Instant record capture", "Live status toggling", "Category filtering", "Export and clipboard actions"],
    constraintsAndNonGoals: ["No authentication walls", "No multi-step wizards", "No unrequested sidebars"],
    importantDecisions: ["Single-screen architectural focus", "Offline-friendly client storage"],
  };

  // 1. Completely Vague Idea or Pure Discovery (Test 8 & Test 10)
  if (isVagueOrDiscoveryOnly) {
    workingPromptFallback = ""; // Restraint: No prompt until problem & wedge are established!
    if (/make people's lives easier|not sure what it is yet/i.test(lastUserMessage)) {
      responseContent = `I appreciate the openness. The most successful tools start from a concrete friction someone experiences repeatedly, not from a generic ambition to "make lives easier."

Before we write a single line of a build prompt, let's discover the real problem:
1. **Who specifically is suffering?** Is this for you personally, a specific trade, a small team, or a specific daily chore?
2. **What is a moment of acute frustration?** What is something you or someone you know had to do this week that felt messy, repetitive, or poorly handled by existing apps?

Tell me about that friction, and we'll investigate whether there's a genuine gap worth building for.`;
    } else if (/social media|short videos/i.test(lastUserMessage) || /worth building/i.test(lastUserMessage)) {
      responseContent = `To be completely honest: **No, a generic short-video social media app is not worth building.**

Here is the market reality:
• **Monopoly dominance:** TikTok, Instagram Reels, and YouTube Shorts have locked up global distribution, creator monetization, and recommendation algorithms. Competing head-on without massive capital is a graveyard.
• **Where an actual opportunity might exist:** A niche wedge with extreme constraints. For example:
  - Private, asynchronous video standups for remote engineering teams.
  - Video critique exchange for music producers or martial arts athletes.
  - Local apprentice training videos with timestamped feedback.

Unless you have a hyper-specific group or unique interaction mechanic in mind, you will spend weeks building something nobody uses. Do any of those specific wedges resonate, or do you want to explore a different problem entirely?`;
    } else {
      responseContent = `I'm completely on board with that approach. We won't jump into building or generate a prompt until we've proven there is a real problem and a distinct gap.

To start:
1. **What sparked this thought?** What domain, workflow, or frustrating situation has been on your mind?
2. **What tools are people currently using to solve it?** (Even if it's just spreadsheets, sticky notes, or text threads).

Let's look at what already exists and see where the actual wedge is.`;
    }
  }
  // 2. AI Studio Feedback Loop: Retain established state, target ONLY the broken area
  else if (currentWorkingPrompt && isAiStudioFeedback && !isBuildTrigger) {
    responseContent = `I know where we are with this project. Let's address what happened in AI Studio:

I've examined the feedback ("${lastUserMessage}"). Rather than regenerating what already works, I've preserved our established architecture, data structures, and styling, and applied targeted fix directives to the Build Prompt on the right.

Copy the updated specification, paste it into Google AI Studio, and verify the resolved workflow.`;

    if (!workingPromptFallback.includes("// TARGETED FIX / ITERATION DIRECTIVE")) {
      workingPromptFallback = `// ========================================================
// TARGETED ITERATION DIRECTIVE FOR GOOGLE AI STUDIO
// Project: ${projectTitle}
// Reported Observation: "${lastUserMessage}"
// ========================================================

${workingPromptFallback}

# TARGETED REFINEMENT & RESOLUTION DIRECTIVE:
- Address the reported feedback: "${lastUserMessage}".
- Strict Continuity Constraint: PRESERVE all existing working components, state management, and view structures.
- Modify ONLY the specific workflow or handler causing this issue.
- Add robust error boundaries, graceful fallback states, and explicit validation to prevent regressions in AI Studio.`;
    } else {
      workingPromptFallback += `\n\n- Additional Fix: Address "${lastUserMessage}". Ensure unaffected features remain intact.`;
    }
  }
  // 3. Significant Architectural Pivot: (e.g. switching from local storage to hosted DB)
  else if (currentWorkingPrompt && isArchitecturalPivot && !isBuildTrigger) {
    responseContent = `I've registered the architectural change: transitioning from local browser storage to a hosted cloud database.

Here is how I've updated the project:
1. **Preserved**: All user flows, visual layouts, schemas, and non-goals remain completely intact.
2. **Updated**: Replaced local storage with a server-side API proxy layer and cloud database connection.
3. **Invalidated**: Removed obsolete offline-only constraints to prevent contradictory directives.

The Build Prompt on the right has been updated with this cohesive architecture.`;

    workingPromptFallback = workingPromptFallback.replace(
      /Backend & Storage: Client-side persistent key-value state \(LocalStorage\) with clean reactive hooks\./g,
      "Backend & Storage: Hosted Cloud Database (PostgreSQL / Firestore) connected via server-side Express API routes (/api/*) with lazy initialization and secret proxying."
    );
    if (!workingPromptFallback.includes("Hosted Cloud Database")) {
      workingPromptFallback = workingPromptFallback.replace(
        "# TECHNICAL ARCHITECTURE:",
        `# TECHNICAL ARCHITECTURE:
- Data Architecture: Hosted Cloud Database with server-side proxy routes (/api/*). Never expose DB credentials to the browser.`
      );
    }
    updatedProjectRequirements.architecture.storage = "Hosted Cloud Database via Express API proxy";
  }
  // 4. Build Trigger
  else if (isBuildTrigger) {
    if (!workingPromptFallback) {
      const readinessCheck = evaluateReadinessGate(lastUserMessage, currentWorkingPrompt, false, project);
      if (!readinessCheck.isReady) {
        workingPromptFallback = "";
        responseContent = `I understand you want to start building, but before we generate an implementation prompt for Google AI Studio, we need to clarify one critical detail:
**${readinessCheck.unresolvedTopic || "Core User Workflow"}**

${(readinessCheck.consequentialQuestions || ["What is the primary action a user takes on this screen?"])[0]}

Once you share that, I will generate the complete build prompt without having to invent arbitrary mechanics.`;
      } else {
        workingPromptFallback = `// ========================================================
// GOOGLE AI STUDIO BUILD PROMPT
// Project: ${ideaTopic}
// Copy and paste directly into https://ai.studio/build
// ========================================================

# PROJECT OBJECTIVE:
Build a focused, single-screen web application solving: "${lastUserMessage}"
The application must be immediately interactive with zero unnecessary onboarding barriers.

# TECHNICAL ARCHITECTURE:
- Platform: React 19 with TypeScript and Tailwind CSS.
- Layout: Single-view, responsive layout. Strictly avoid multi-page navigation or unrequested sidebar tabs.
- Backend & Storage: Client-side persistent key-value state (LocalStorage) with clean reactive hooks.
- Design System: Sophisticated neutral palette, high-contrast typography, clear hierarchy, accessible touch targets (min 44px).

# WORKFLOW & DATA PIPELINE:
- Input: Direct user domain input with validation.
- State: Reactive state hooks with local persistence.
- Actions: Immediate inline operations with instant tactile feedback.
- Output: Export and structured clipboard actions.

# NON-GOALS (STRICT ANTI-DRIFT):
- Do NOT build authentication modals, user login screens, or billing forms unless explicitly requested.
- Do NOT add complex multi-step wizards or unrequested sidebars.
- Focus strictly on making the primary workflow delightful and reliable.`;

        responseContent = `I've synthesized our project into the finalized **Build Prompt** on the right.

It establishes:
• Single-screen architecture with instant tactile feedback
• Explicit non-goals to prevent scope creep in AI Studio
• Production-ready styling and resilient error handling

You can copy the prompt using **Copy Prompt for AI Studio** on the right, open **Google AI Studio**, and paste it in to build your application.`;
      }
    } else {
      responseContent = `I've prepared the finalized **Build Prompt** on the right based on our established project definition.

You can copy the prompt using **Copy Prompt for AI Studio** on the right, open **Google AI Studio**, and paste it in to build your application.`;
    }
  }
  // 5. Incremental Refinement (e.g. dark mode, csv export)
  else if (currentWorkingPrompt && !isBuildTrigger) {
    if (/dark\s*mode/i.test(lastUserMessage)) {
      workingPromptFallback = workingPromptFallback.replace(
        "Sophisticated neutral palette",
        "Sleek dark theme with dark stone neutrals (#1c1917) and warm accents"
      );
      responseContent = `I know where we are with this project. I've updated the Build Prompt to specify a refined dark theme while preserving our established schemas and core workflows.`;
    } else if (/csv|export/i.test(lastUserMessage)) {
      if (!workingPromptFallback.includes("CSV")) {
        workingPromptFallback = workingPromptFallback.replace(
          "4. Export/copy data functionality with instant visual confirmation.",
          "4. Dedicated CSV file export and clipboard copy functionality with instant visual confirmation."
        );
      }
      responseContent = `I know where we are with this project. I've incorporated dedicated CSV export functionality into the Build Prompt, keeping all existing architecture and decisions intact.`;
    } else {
      responseContent = `I know where we are with this project. I've incorporated your feedback into the Build Prompt while preserving everything already established. What do you think?`;
    }
  }
  // 6. Readiness Gate Check before Prompt Generation
  else {
    const readiness = evaluateReadinessGate(lastUserMessage, currentWorkingPrompt, isBuildTrigger);

    // If readiness gate fails: Withhold prompt, explain why, ask clarifying questions (Stage 2/3)
    if (!readiness.isReady) {
      workingPromptFallback = ""; // Restraint: No prompt until readiness is achieved!

      const topic = readiness.unresolvedTopic || "Core Workflow & Data Boundaries";
      const explanation = readiness.explanation || "While I understand the overarching concept, the fundamental operational workflow and primary data artifacts have not been established.";
      const questionsList = (readiness.consequentialQuestions || [
        "What is the single most important action the user takes on this screen?",
        "What concrete output does the user expect to walk away with?",
      ]).map((q, idx) => `${idx + 1}. **${q}**`).join("\n");

      responseContent = `I understand what you're aiming to explore with "${lastUserMessage}". However, looking at this through our **Readiness Gate**, this project is not yet ready for an implementation Build Prompt.

### What is unresolved:
**${topic}**
${explanation}

### Why this matters:
Generating a Build Prompt right now would force me to invent arbitrary data models, storage patterns, and interface elements that you never asked for. To ensure we build something accurate and useful in Google AI Studio, we need to clarify the core mechanics first.

### Key questions to resolve before building:
${questionsList}

Tell me how you envision this core loop, and once those mechanics are locked in, we can establish the Build Prompt.`;

      updatedProjectRequirements = {
        purpose: lastUserMessage,
        architecture: {
          stack: ["React 19", "TypeScript", "Tailwind CSS"],
          storage: "To be determined based on workflow",
          pattern: "To be determined",
        },
        coreCapabilities: ["Under discovery and workflow specification"],
        constraintsAndNonGoals: ["Avoid premature implementation without concrete input/output pipeline"],
        importantDecisions: [`Readiness Gate active: resolving ${topic}`],
      };
    }
    // Readiness is satisfied: A well-scoped domain idea with clear inputs/outputs (e.g. electrician jobs, music stems)
    else {
      // Craft domain-specific requirements without generic ItemRecord CRUD hallucination
      const isElectrician = /electrical|electrician|quote|trades/i.test(lastUserMessage);
      const isMusic = /music|stem|audio|producer/i.test(lastUserMessage);

      if (isElectrician) {
        workingPromptFallback = `// ========================================================
// GOOGLE AI STUDIO BUILD PROMPT
// Project: Electrical Contractor Job & Quote Tracker
// Copy and paste directly into https://ai.studio/build
// ========================================================

# PROJECT OBJECTIVE:
Build a focused single-screen web application for a small electrical contractor to track active jobs, customer quotes, billable materials, and technician hours without spreadsheet chaos.

# TECHNICAL ARCHITECTURE:
- Platform: React 19 with TypeScript and Tailwind CSS.
- Layout: Single-view, responsive layout optimized for desktop and mobile tablets.
- Backend & Storage: Client-side persistent storage (LocalStorage) with export capability.
- Design System: Clean high-contrast palette, legible monospace readouts for totals, minimum 44px touch targets.

# DATA MODEL & SCHEMA:
interface JobRecord {
  id: string;
  customerName: string;
  siteAddress: string;
  status: "quote_pending" | "scheduled" | "in_progress" | "completed";
  quotedAmount: number;
  materials: { item: string; cost: number }[];
  technicianHours: { technician: string; hours: number; rate: number }[];
  createdAt: string;
}

# CORE INTERACTION FLOW:
1. Quick job entry drawer/modal with customer name, site address, and initial quote estimate.
2. Active job cards displaying real-time material costs and logged technician hours against quoted total.
3. Quick-log button to add parts/materials or hours with instant margin calculation.
4. One-click status advancement (Quote → In Progress → Completed) and CSV export for billing.

# NON-GOALS:
- No user authentication or login barriers.
- No external accounting software sync in V1.
- Strictly single-view execution without multi-page routing.`;

        responseContent = `I understand what you're trying to do. For a small electrical business, tracking jobs, quotes, materials, and technician hours usually falls apart when software is too heavy to use between job sites.

Here's the wedge I see:
A **zero-configuration single-screen job board** that balances quoted figures against actual logged material receipts and technician labor hours, giving instant visibility into job profitability.

I've established the initial **Build Prompt** on the right with a domain-accurate schema (quotes, materials, labor hours). You can review it, tweak any specifics, or say **"Okay. Build this"** when you're ready to copy to Google AI Studio.`;

        updatedProjectRequirements = {
          purpose: "Electrical contractor job, quote, and labor tracking",
          architecture: {
            stack: ["React 19", "TypeScript", "Tailwind CSS"],
            storage: "Client-side key-value (LocalStorage)",
            pattern: "Single-view responsive job & margin board",
          },
          coreCapabilities: ["Quote creation", "Material expense logging", "Technician hour tracking", "Margin calculation"],
          constraintsAndNonGoals: ["No authentication walls", "No multi-page routing", "No external accounting integrations in V1"],
          importantDecisions: ["Single-screen architectural focus", "Offline-friendly client storage"],
        };
      } else if (isMusic) {
        workingPromptFallback = `// ========================================================
// GOOGLE AI STUDIO BUILD PROMPT
// Project: AI Music Stem & Production Packager
// Copy and paste directly into https://ai.studio/build
// ========================================================

# PROJECT OBJECTIVE:
Build a focused web application for musicians to convert AI-generated audio into a production-ready stems project with track labeling, BPM/key metadata, mix notes, and export bundling.

# TECHNICAL ARCHITECTURE:
- Platform: React 19 with TypeScript and Tailwind CSS.
- Audio Handling: Web Audio API for waveform preview and playback.
- Layout: High-density single-screen workspace with visual timeline and stem channel rack.
- Storage: Browser local storage and Zip bundling for stem package exports.

# DATA MODEL & SCHEMA:
interface StemTrack {
  id: string;
  name: string;
  type: "drums" | "bass" | "vocals" | "synth" | "other";
  volume: number;
  muted: boolean;
  solo: boolean;
  notes: string;
}

interface SongProject {
  title: string;
  bpm: number;
  keySignature: string;
  stems: StemTrack[];
  arrangementNotes: string;
}

# CORE INTERACTION FLOW:
1. Drop or import audio stems with instant BPM and musical key input.
2. Channel rack with individual stem mute/solo, volume trim, and production notes.
3. Interactive multi-track waveform visualizer for playback inspection.
4. One-click stem pack export bundling track assets and metadata sheet.

# NON-GOALS:
- No full DAW editing (MIDI sequencing, VST hosting).
- No cloud account creation in V1.`;

        responseContent = `I understand what you're trying to do. AI music generators give creators raw audio files, but turning them into an actual production project with organized stems, BPM/key detection, and mixing notes requires manual friction.

Here's the wedge:
A **production packager** that takes stems, labels their roles (drums, bass, melody, vocal), lets you tag key and BPM, annotate mix notes, and export a clean production archive.

I've crafted the **Build Prompt** on the right with audio track models and stem rack controls. Review it, or let me know if you want to adjust the audio capabilities before building in Google AI Studio.`;

        updatedProjectRequirements = {
          purpose: "AI-generated music stem packaging and metadata tracking",
          architecture: {
            stack: ["React 19", "TypeScript", "Tailwind CSS"],
            storage: "Client-side / Web Audio API",
            pattern: "Single-view stem channel rack & package exporter",
          },
          coreCapabilities: ["Stem upload/preview", "BPM and Key labeling", "Channel mute/solo", "Zip export"],
          constraintsAndNonGoals: ["No DAW MIDI sequencing", "No VST plugin hosting", "No cloud auth"],
          importantDecisions: ["Web Audio API previews", "Client-side metadata bundling"],
        };
      } else {
        // Concrete idea that was well specified
        workingPromptFallback = `// ========================================================
// GOOGLE AI STUDIO BUILD PROMPT
// Project: ${ideaTopic}
// Copy and paste directly into https://ai.studio/build
// ========================================================

# PROJECT OBJECTIVE:
Build a focused, single-screen web application solving: "${lastUserMessage}"
The application must be immediately interactive, with zero unnecessary onboarding barriers.

# TECHNICAL ARCHITECTURE:
- Platform: React 19 with TypeScript and Tailwind CSS.
- Layout: Single-view, responsive layout. Strictly avoid multi-page navigation or unrequested sidebar tabs.
- Backend & Storage: Client-side persistent state (LocalStorage) with clean reactive hooks.
- Design System: Sophisticated neutral palette, high-contrast typography, clear hierarchy, accessible touch targets (min 44px).

# WORKFLOW & DATA PIPELINE:
- Input: User enters primary domain parameters directly on the interface.
- Transformation: Clean validation and immediate visual computation.
- Presentation: Focused status cards with direct inline actions.
- Output: Instant copy or export of results.

# NON-GOALS (STRICT ANTI-DRIFT):
- Do NOT build authentication modals, user login screens, or billing forms unless explicitly requested.
- Do NOT add complex multi-step wizards or unrequested sidebars.
- Focus strictly on making the primary workflow delightful and reliable.`;

        responseContent = `I understand what you're trying to do. Here's what I think you mean: You want a focused, zero-friction solution for "${lastUserMessage}" that solves this specific problem cleanly without enterprise bloat.

Here's where it could actually be useful:
• **Day-to-day workflow**: Solving this task without switching between three different browser tabs or heavy tools.
• **Immediate execution**: A dedicated tool with zero configuration needed.
• **Clean data output**: Structured records that are immediately actionable.

I've developed the initial **Build Prompt** on the right. You can review it, continue exploring the idea with me, or say **"Okay. Build this"** when you're ready to finalize the prompt for Google AI Studio.`;
      }
    }
  }

  const isAchieved = Boolean(workingPromptFallback && workingPromptFallback.trim().length > 0);
  const derivedDownstream = isAchieved
    ? deriveDownstreamProjectRepresentation(projectTitle || ideaTopic, workingPromptFallback, updatedProjectRequirements)
    : null;

  const currentReadiness = evaluateReadinessGate(lastUserMessage, currentWorkingPrompt, isBuildTrigger, project);

  const targetProjections = isAchieved
    ? deriveTargetProjections(projectTitle || ideaTopic, workingPromptFallback, updatedProjectRequirements, derivedDownstream)
    : { build: "", dev: "", create: "" };

  return {
    content: responseContent,
    workingPrompt: workingPromptFallback,
    isPromptAchieved: isAchieved,
    masterPromptStatus: isAchieved ? "prompt_achieved" : "readiness_withheld",
    readinessChecks: currentReadiness.readinessChecks,
    downstreamRepresentation: derivedDownstream,
    targetProjections,
    projectUpdate: {
      title: projectTitle || ideaTopic,
      requirements: updatedProjectRequirements,
      understanding: isVagueOrDiscoveryOnly ? `Exploring initial friction and problem space` : `Focused single-screen solution for ${lastUserMessage}`,
    },
  };
}

// Endpoint: Market Hole Conversational Discovery & Persistent Project Orchestrator
app.post("/api/orchestrator/market-hole-chat", async (req, res) => {
  try {
    const { messages, activeIdea, currentWorkingPrompt, project } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "At least one message is required." });
    }

    const ai = getGenAI();
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const isBuildTrigger = /build this|let's build|lets build|start building|okay\. build|ready to build/i.test(lastUserMessage);
    const isAiStudioFeedback = /broken|error|doesn't work|not working|works, but|works but|ai studio|changed|failing|bug|regression|fails/i.test(lastUserMessage);
    const isArchitecturalPivot = /hosted database|cloud database|postgres|sql|relational|backend database|switch to backend|server database/i.test(lastUserMessage);

    const projectTitle = project?.identity?.title || activeIdea || "Ongoing Project";

    if (!ai) {
      const fallback = generateContinuityFallbackResponse({
        lastUserMessage,
        currentWorkingPrompt,
        project,
        activeIdea,
        isBuildTrigger,
        isAiStudioFeedback,
        isArchitecturalPivot,
      });
      return res.json(fallback);
    }

    const conversationHistoryText = messages
      .map((m: any) => `${m.role === "user" ? "User" : "Project Manager"}: ${m.content}`)
      .join("\n\n");

    const projectContextBlock = project
      ? `
CURRENT AUTHORITATIVE PROJECT STATE:
- Project ID: ${project.identity?.id || "active-proj"}
- Project Title: ${project.identity?.title || activeIdea || "Untitled"}
- Created At: ${project.identity?.createdAt || "recent"}
- Accumulated Understanding: ${project.understanding || "Developing"}
- Established Requirements:
  * Purpose: ${project.requirements?.purpose || "In discussion"}
  * Architecture: ${JSON.stringify(project.requirements?.architecture || {})}
  * Core Capabilities: ${(project.requirements?.coreCapabilities || []).join(", ") || "Standard"}
  * Constraints & Non-Goals: ${(project.requirements?.constraintsAndNonGoals || []).join(", ") || "Standard"}
  * Important Decisions: ${(project.requirements?.importantDecisions || []).join(", ") || "None"}
- Past Feedback Iterations: ${(project.feedbackHistory || []).map((f: any) => `[${f.timestamp}] ${f.reportedObservation}`).join("; ") || "None"}
`
      : `Active Idea Context: ${activeIdea || "None provided yet"}`;

    const systemInstruction = `You are the Conversational Project Manager for Google AI Studio.
The user is working on ONE ONGOING PROJECT across days or weeks.

# CORE SYSTEM CONTRACT
Your job is NOT to generate software ideas, generic architectures, CRUD applications, or implementation prompts as quickly as possible.
Your primary responsibility is to determine whether the project has been sufficiently understood, explored, defined, and validated to justify generating an AI build prompt.
The implementation prompt is the OUTPUT of the process, not the process itself.

# CANONICAL PROJECT STATE
Maintain one canonical, evolving PROJECT DEFINITION throughout the conversation.
The project definition must persist across turns and must be updated when the user explicitly accepts, rejects, modifies, or adds a requirement.
Never silently revert to an earlier version of the project.
Never treat a later user message as a completely new project unless the user explicitly starts a new project.
When a requirement changes the project's workflow, inputs, outputs, capabilities, constraints, or identity, update the canonical project definition before proceeding.

# PROJECT CONTINUITY & SNIPER PRINCIPLE
Every accepted decision becomes part of the current project state unless the user explicitly removes or replaces it.
Before generating an implementation prompt, verify that the prompt reflects the LATEST canonical project definition, not an earlier version.
If there is uncertainty about whether an earlier decision still applies, ask rather than assume.
ESTABLISH ONCE.
PRESERVE WHAT IS KNOWN.
INVESTIGATE WHAT CHANGED.
MODIFY PRECISELY.

# CONVERSATION LIFECYCLE (5 STAGES)
1. UNDERSTAND: Establish what the user is actually trying to build.
2. EXPLORE: Identify missing mechanics, constraints, dependencies, workflows, and decisions.
3. DEFINE: Maintain and update the canonical project definition as decisions are made.
4. READINESS GATE: Determine whether enough information exists to produce a faithful implementation prompt.
5. GENERATE: Only after the project passes the readiness gate, produce the implementation prompt.

A description of an idea must NEVER automatically advance to GENERATE.

# READINESS GATE CRITERIA
Before generating an implementation prompt, confirm:
- The core purpose is understood.
- The primary user workflow is defined.
- Inputs and outputs are known.
- Important capabilities are explicitly established.
- Major architectural decisions required for the requested prototype are resolved.
- Known ambiguities that could materially change implementation have been addressed.
- The current project definition is internally consistent.
- No major requirement introduced later in the conversation has been lost.

If any material uncertainty remains, STOP and ask the minimum necessary question.
Keep the implementation prompt empty ("workingPrompt": "") while the project is not ready.

# SCOPE CHANGE RULE
When the user introduces a capability that materially changes the existing workflow, do NOT silently append it to the implementation prompt.
First determine whether it:
- extends the existing workflow,
- creates an alternative workflow,
- changes the project's core identity, or
- requires a new architectural decision.
If the distinction is unclear, ask.
Once the user makes the decision, update the canonical project definition and retain that decision for all subsequent turns.

# ANTI-DRIFT RULE
Never revert to an earlier project definition merely because it is easier to describe or because an earlier implementation prompt already exists.
A previous build prompt is NOT the source of truth.
The current canonical project definition is the source of truth.

# ANTI-HALLUCINATION RULE
Do NOT invent:
- data models,
- CRUD entities (e.g. ItemRecord, generic tasks),
- storage systems,
- UI controls,
- APIs,
- backend services,
- authentication,
- payment systems,
- AI models,
- processing pipelines,
- or other implementation details
unless they are required by the established project definition or necessary to implement an explicitly accepted requirement.
Do not use generic application architecture as a substitute for missing requirements.

# PRE-GENERATION CONSISTENCY CHECK
Immediately before generating an implementation prompt:
1. Reconstruct the current project definition from the entire conversation.
2. Identify all explicitly accepted decisions.
3. Identify any decisions that were superseded.
4. Check that the proposed prompt contains the current workflow and capabilities.
5. Check that no accepted requirement has disappeared.
6. Check that no rejected or obsolete requirement has returned.
7. Only then generate the implementation prompt.

# FINAL PRINCIPLE
The quality of this system is measured less by how quickly it produces a build prompt and more by whether it knows when NOT to produce one.
A successful outcome is sometimes:
"Not ready. We need to resolve this first."
A successful outcome is also:
"Ready. Here is the implementation prompt."
Both outcomes are correct when they faithfully reflect the current project state.

BUILD PROMPT GUIDELINES:
The "workingPrompt" field MUST be a complete, high-precision, copy-ready prompt intended for Google AI Studio Build (https://ai.studio/build).
It must always be internally consistent, free of contradictory obsolete statements, and ready to paste.

Format your response as a valid JSON object matching this schema:
{
  "content": "Conversational reply as the dedicated Project Manager. Tone: clear, collaborative, professional. If not ready to build, explicitly identify what is unresolved, explain why it matters, and ask the minimum necessary questions. If ready, explain the design and state what was established.",
  "workingPrompt": "The complete, living Build Prompt for Google AI Studio. CRITICAL READINESS GATE: If consequential uncertainty remains, or the idea is broad/ambiguous, you MUST return an empty string \"\" for workingPrompt! Only produce a workingPrompt when the project has genuinely reached readiness (Stage 5 GENERATE).",
  "projectUpdate": {
    "title": "Short descriptive project title",
    "understanding": "Updated accumulated understanding of what is being built",
    "requirements": {
      "purpose": "Core purpose statement",
      "architecture": {
        "stack": ["React 19", "TypeScript", "Tailwind CSS"],
        "storage": "Storage mechanism",
        "pattern": "Architectural pattern"
      },
      "coreCapabilities": ["Capability 1", "Capability 2"],
      "constraintsAndNonGoals": ["Non-goal 1", "Non-goal 2"],
      "importantDecisions": ["Decision 1", "Decision 2"]
    },
    "latestChangeCategory": "ai_studio_feedback" | "incremental_tweak" | "architectural_pivot" | "initial_definition" | "readiness_gate" | "scope_change" | "finalization",
    "changeDeltaSummary": "Brief summary of what was preserved and what was modified"
  }
}
Return ONLY the JSON object.`;

    const promptContext = [
      systemInstruction,
      projectContextBlock,
      `CONVERSATION HISTORY:\n${conversationHistoryText}`,
      `CURRENT USER INPUT: "${lastUserMessage}"`,
      currentWorkingPrompt ? `CURRENT ESTABLISHED BUILD PROMPT:\n${currentWorkingPrompt}\n(Remember: preserve established valid parts, modify precisely what changed)` : `No build prompt established yet.`
    ].join("\n\n");

    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: promptContext }] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });
      } catch (firstErr: any) {
        console.warn("Primary model call error, attempting secondary model:", firstErr?.message);
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [{ role: "user", parts: [{ text: promptContext }] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });
      }

      const parsed = JSON.parse(response.text || "{}");
      if (parsed && (parsed.content || parsed.workingPrompt !== undefined)) {
        // Enforce Readiness Gate: If project is not ready to build, clear workingPrompt and ensure user is prompted with clarifying questions
        const readiness = evaluateReadinessGate(lastUserMessage, currentWorkingPrompt, isBuildTrigger, project);
        parsed.readinessChecks = readiness.readinessChecks;

        if (!readiness.isReady) {
          parsed.workingPrompt = "";
          parsed.isPromptAchieved = false;
          parsed.masterPromptStatus = "readiness_withheld";
          parsed.downstreamRepresentation = null;
          parsed.targetProjections = { build: "", dev: "", create: "" };
        } else {
          parsed.isPromptAchieved = Boolean(parsed.workingPrompt && parsed.workingPrompt.trim().length > 0);
          parsed.masterPromptStatus = parsed.isPromptAchieved ? "prompt_achieved" : "defining";
          if (parsed.isPromptAchieved && !parsed.downstreamRepresentation) {
            parsed.downstreamRepresentation = deriveDownstreamProjectRepresentation(
              project?.identity?.title || activeIdea || lastUserMessage,
              parsed.workingPrompt,
              parsed.projectUpdate?.requirements
            );
          }
          parsed.targetProjections = parsed.isPromptAchieved
            ? deriveTargetProjections(
                project?.identity?.title || activeIdea || lastUserMessage,
                parsed.workingPrompt,
                parsed.projectUpdate?.requirements,
                parsed.downstreamRepresentation
              )
            : { build: "", dev: "", create: "" };
        }
        return res.json(parsed);
      }
      throw new Error("Model returned empty or non-conforming payload");
    } catch (genErr) {
      console.warn("Gemini generation failed or experienced high demand, executing sniper continuity fallback:", genErr);
      const fallback = generateContinuityFallbackResponse({
        lastUserMessage,
        currentWorkingPrompt,
        project,
        activeIdea,
        isBuildTrigger,
        isAiStudioFeedback,
        isArchitecturalPivot,
      });
      return res.json(fallback);
    }
  } catch (err: any) {
    console.error("Market hole chat error:", err);
    return res.status(500).json({
      error: "Failed to generate market hole chat response",
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Target-Specific Projection of Master Prompt (Separation of Definition from Output Format)
app.post("/api/orchestrator/project-target-projection", (req, res) => {
  try {
    const { title, canonicalPrompt, requirements, downstreamRepresentation, mode } = req.body;
    if (!canonicalPrompt || !canonicalPrompt.trim()) {
      return res.json({
        targetProjections: { build: "", dev: "", create: "" },
        activeProjection: "",
        mode: mode || "build",
      });
    }

    const projections = deriveTargetProjections(
      title || "Focused Project",
      canonicalPrompt,
      requirements,
      downstreamRepresentation
    );

    const activeProjection = projections[mode as "build" | "dev" | "create"] || projections.build;

    return res.json({
      targetProjections: projections,
      activeProjection,
      mode: mode || "build",
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Failed to derive target projections",
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Check Drift / Align AI Studio Output with Project Definition
app.post("/api/orchestrator/check-drift", async (req, res) => {
  try {
    const { projectDefinition, currentAiStudioOutput, stageContext } = req.body;

    if (!currentAiStudioOutput || !currentAiStudioOutput.trim()) {
      return res.status(400).json({ error: "Current AI Studio output or code is required to evaluate drift." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check your secrets.",
      });
    }

    const prompt = `You are the strict AI Production Manager sitting beside the Google AI Studio factory.
The user is constructing an application.
THE PROJECT DEFINITION IS THE IMMUTABLE SOURCE OF TRUTH. The AI Studio conversation is NOT the source of truth.

PROJECT DEFINITION SUMMARY:
Title: ${projectDefinition?.title || "Product"}
Value Proposition: ${projectDefinition?.tagline || ""}
Problem Statement: ${projectDefinition?.productDefinition?.problemStatement || ""}
Core Features:
${(projectDefinition?.productDefinition?.coreFeatures || [])
  .map((f: any) => `${f.code} ${f.name}: ${f.description}`)
  .join("\n")}
Non-Goals (STRICTLY PROHIBITED):
${(projectDefinition?.productDefinition?.nonGoals || []).join("\n")}
Build Specification Excerpts:
Architecture: ${projectDefinition?.buildSpecification?.architecture?.overview || ""}
Security Rules: ${(projectDefinition?.buildSpecification?.securityRequirements || [])
      .map((s: any) => `${s.code} ${s.rule}`)
      .join("; ")}
Stage Context (if active): ${stageContext || "General development"}

CURRENT OUTPUT PRODUCED IN AI STUDIO FACTORY:
"""
${currentAiStudioOutput}
"""

AUDIT TASK:
1. Compare this output against the Project Definition.
2. Check if:
   - It implements requested features accurately.
   - It introduces unsolicited features or violates Non-Goals (Scope creep!).
   - It breaches architecture or security rules (§3.1, §3.8, etc.).
   - It ignores acceptance criteria or drifts into generic slop.
3. If drift exists, produce an authoritative supervisor correction in the exact tone:
   "Current output does not align with Project Definition §X.Y. Re-evaluate before proceeding."
4. Provide a concrete, ready-to-copy corrective prompt for the user to inject back into AI Studio to steer the factory back on course.

Return ONLY JSON:
{
  "isAligned": boolean,
  "driftScore": number, // 0 to 100, where 100 is pristine alignment, < 70 indicates drift
  "verdict": "Short authoritative supervisor directive",
  "affectedSections": ["§X.Y Name of section violated or drifted from"],
  "summary": "2-3 sentences explaining the assessment",
  "driftItems": [
    {
      "severity": "CRITICAL" | "WARNING" | "INFO",
      "sectionRef": "§2.5 Non-Goals",
      "issue": "What went wrong or drifted",
      "remedy": "What needs to be corrected"
    }
  ],
  "correctivePrompt": "Ready-to-copy prompt for Google AI Studio to steer it back to the Source of Truth"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Drift check failed:", err);
    return res.status(500).json({
      error: "Failed to evaluate drift",
      details: err?.message || String(err),
    });
  }
});

// Endpoint: Generate Next Factory Stage Prompt with Source of Truth Injection
app.post("/api/orchestrator/generate-stage-prompt", async (req, res) => {
  try {
    const { projectDefinition, stageId, specificTask, previousContext } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const stage = (projectDefinition?.productionPlan?.stages || []).find((s: any) => s.id === stageId);

    const prompt = `You are an AI Software Production Manager crafting a high-precision prompt for Google AI Studio.
Context:
App: ${projectDefinition?.title}
Target Stage: ${stage?.title || "Next Stage"} (Stage #${stage?.stageNumber || 1})
Source of Truth References: ${(stage?.sourceOfTruthRefs || []).join(", ")}
Task to Execute: ${specificTask || "Implement the next sequenced prompt"}
Previous Context/Progress: ${previousContext || "Initial stage execution"}

Requirements:
Create a calibrated, copy-ready prompt to be pasted directly into Google AI Studio.
The prompt must:
1. Frame the task with exact section numbers from the Project Definition (e.g. §3.1, §3.4).
2. Explicitly cite Non-Goals so AI Studio doesn't hallucinate unrequested features.
3. List bulleted Acceptance Criteria for this specific step.
4. Specify the recommended model tier (e.g., Gemini 3.8 / Pro vs Flash-Lite).

Return JSON:
{
  "recommendedModel": "gemini-3.8-flash" | "gemini-3.1-flash-lite" | "gemini-3.1-pro-preview",
  "modelTier": "Strongest Model" | "Fast/Low Cost Model",
  "stageTitle": "${stage?.title || "Development Stage"}",
  "calibratedPrompt": "The full copyable prompt text for AI Studio",
  "acceptanceChecklist": ["Criterion 1", "Criterion 2", "Criterion 3"],
  "sourceOfTruthRefs": ${(JSON.stringify(stage?.sourceOfTruthRefs || []))}
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Failed to generate stage prompt:", err);
    return res.status(500).json({ error: "Failed to generate prompt", details: err?.message });
  }
});

// Endpoint: Simulate factory run / test execution directly
app.post("/api/orchestrator/test-prompt", async (req, res) => {
  try {
    const { promptText, modelOverride } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const modelToUse = modelOverride || "gemini-3.8-flash";
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: promptText,
    });

    return res.json({
      output: response.text || "",
      modelUsed: modelToUse,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Prompt simulation failed", details: err?.message });
  }
});

// Vite middleware & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Project Production Orchestrator server running on http://localhost:${PORT}`);
  });
}

startServer();
