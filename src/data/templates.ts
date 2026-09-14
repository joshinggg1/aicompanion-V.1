import { ProjectDefinition } from "../types";

export const SAMPLE_PROJECTS: ProjectDefinition[] = [
  {
    id: "proj_orchestrator_prod",
    title: "DocuVerify — Autonomous Spec & Code Verification Engine",
    tagline: "Continuous specification alignment and regression guard for AI-generated codebases",
    originalPrompt: "I want to build an application that solves specification drift when AI models generate full-stack apps in AI Studio.",
    version: "1.2.0",
    createdAt: "2026-09-14T10:30:00.000Z",
    marketIntelligence: {
      opportunityScore: 92,
      marketSummary: "Development velocity in AI Studio is skyrocketing, but context degradation and conversational drift cause models to invent unwanted features or breach security constraints after 5-10 turns. Existing linters only catch syntax errors, not product-level semantic drift.",
      competitors: [
        {
          name: "Cursor Rules / Copilot Instructions",
          strengths: "Static file instructions loaded automatically",
          weaknesses: "Passive; does not continuously audit intermediate outputs or prevent prompt drift over long sessions",
          threatLevel: "Medium",
        },
        {
          name: "Linear / Jira AI Assistants",
          strengths: "Established workflow & ticketing integration",
          weaknesses: "Detached from the runtime code generation factory; no real-time alignment gate",
          threatLevel: "Low",
        },
        {
          name: "LangSmith / Braintrust",
          strengths: "Deep evaluation metrics for LLM apps",
          weaknesses: "Designed for prompt engineers evaluating apps, not developers managing AI Studio code production",
          threatLevel: "Medium",
        },
      ],
      underservedGaps: [
        "No dedicated 'production manager' to guide AI Studio through phased build plans",
        "Wasted million-credit allowances from sending trivial boilerplate to top-tier reasoning models",
        "Lack of formal §-numbered section references in AI code prompts to audit against",
      ],
      differentiationOpportunity: "Position as the external source of truth and supervisor sitting beside AI Studio, optimizing credit allocation while enforcing zero feature creep.",
    },
    productDefinition: {
      problemStatement: "During extended AI Studio build sessions, Gemini loses architectural grounding (§1.1), drifting from core requirements and introducing unsolicited UI bloat.",
      targetAudience: "Solo founders, rapid prototypers, and engineers with high AI Studio allowances building production-grade web applications (§1.2).",
      valueProposition: "Transform vague ideas into verifiable specifications, track AI Studio progress stage-by-stage, and catch drift before code reaches production (§1.3).",
      coreFeatures: [
        {
          id: "f-1",
          code: "§2.1",
          name: "Structured Project Spec Engine",
          description: "Transforms a single prompt into an authoritative 5-pillar project definition with numbered clauses.",
        },
        {
          id: "f-2",
          code: "§2.2",
          name: "AI Studio Calibrated Prompt Dispatcher",
          description: "Generates copy-ready prompts embedding exact clause references, acceptance criteria, and model routing.",
        },
        {
          id: "f-3",
          code: "§2.3",
          name: "Real-Time Semantic Drift Auditor",
          description: "Analyzes AI Studio code/output against the Project Definition, generating precise corrective injections.",
        },
        {
          id: "f-4",
          code: "§2.4",
          name: "Resource & Credit Routing Optimizer",
          description: "Maps project tasks across Gemini Pro, Flash, and deterministic tools to maximize monthly credit ROI.",
        },
      ],
      nonGoals: [
        "Will NOT execute code sandboxing internally; AI Studio remains the primary development factory (§2.5).",
        "Will NOT replace Git or CI/CD pipelines; acts as the orchestration layer prior to version control (§2.6).",
        "No unsolicited social collaboration or team chat channels (§2.7).",
      ],
      businessModel: "Freemium standalone orchestrator with cloud persistence and multi-project export (§2.8).",
    },
    buildSpecification: {
      architecture: {
        code: "§3.1",
        overview: "Full-stack client-server architecture with Express serving calibrated AI analysis endpoints and a React 19 single-page UI.",
        frontendStack: ["React 19", "Tailwind CSS v4", "Vite", "Lucide React", "Motion"],
        backendStack: ["Node.js", "Express 4", "TypeScript", "@google/genai SDK"],
        dataStorage: "Browser local state paired with exportable JSON/Markdown artifacts and server-side state hydration.",
      },
      uxRequirements: [
        {
          code: "§3.2",
          rule: "Single unified workspace with side-by-side spec explorer and drift detection console.",
          criticality: "High",
        },
        {
          code: "§3.3",
          rule: "One-click copy actions for all AI Studio prompts with visual feedback and criteria checklists.",
          criticality: "High",
        },
        {
          code: "§3.4",
          rule: "Clean high-contrast neutral visual theme passing WCAG AA accessibility standards.",
          criticality: "Medium",
        },
      ],
      functionalRequirements: [
        {
          code: "§3.5",
          title: "Prompt Clause Embedding",
          details: "Every dispatched prompt must prepend relevant §-clauses and explicit Non-Goals to constrain Gemini.",
        },
        {
          code: "§3.6",
          title: "Semantic Drift Diagnostic",
          details: "Evaluates input against source of truth and outputs authoritative warning: 'Current output does not align with §X.Y'.",
        },
        {
          code: "§3.7",
          title: "Stage Progress Synchronization",
          details: "Maintains checklist states for each development stage with manual and automated verification gates.",
        },
      ],
      dataModel: [
        {
          entity: "ProjectDefinition",
          code: "§3.8",
          fields: ["id: string", "title: string", "version: string", "marketIntel: Object", "spec: Object", "plan: Object"],
        },
        {
          entity: "ProductionStage",
          code: "§3.9",
          fields: ["stageNumber: number", "title: string", "status: StageStatus", "prompts: PromptTask[]", "checkpoints: string[]"],
        },
        {
          entity: "DriftAuditLog",
          code: "§3.10",
          fields: ["timestamp: string", "score: number", "verdict: string", "affectedSections: string[]", "correctivePrompt: string"],
        },
      ],
      integrations: [
        {
          name: "Google Gemini 3.8 Flash",
          code: "§3.11",
          purpose: "Powers market research, spec generation, and real-time semantic drift auditing.",
        },
      ],
      securityRequirements: [
        {
          code: "§3.12",
          rule: "GEMINI_API_KEY must remain strictly server-side inside server.ts with no client exposure.",
        },
        {
          code: "§3.13",
          rule: "Sanitize all user-pasted code snippets before evaluation to prevent injection.",
        },
      ],
      testingRequirements: [
        "Automated schema verification of generated project definitions (§3.14)",
        "Drift scoring boundary validation with test code snippets (§3.15)",
        "Production build verification with npm run build (§3.16)",
      ],
      deploymentRequirements: [
        "Cloud Run single container binding port 3000 (§3.17)",
        "Full static asset compilation via Vite to /dist (§3.18)",
      ],
    },
    aiProductionStrategy: {
      modelAllocation: [
        {
          tier: "Strongest Model (Gemini 3.8 / Pro)",
          tasks: [
            "Initial market gap & differentiation synthesis",
            "Complex architecture & schema generation",
            "High-stakes semantic drift auditing against clauses",
          ],
          creditBudgetPct: 60,
          reasoning: "Requires deep reasoning to identify subtle architectural discrepancies and avoid hallucinations.",
        },
        {
          tier: "Fast / Low Cost Model (Gemini Flash-Lite)",
          tasks: [
            "Tailwind UI component scaffolding",
            "Unit test boilerplates & mock fixtures",
            "Acceptance criteria expansion",
          ],
          creditBudgetPct: 30,
          reasoning: "High speed, low latency, and 5x cost reduction for structured, deterministic code outputs.",
        },
        {
          tier: "Deterministic Lint & Scripts",
          tasks: [
            "TypeScript typechecking (tsc --noEmit)",
            "Vite bundle asset analysis",
          ],
          creditBudgetPct: 10,
          reasoning: "Zero LLM tokens needed; instant validation.",
        },
      ],
      parallelizationPlan: "Stage 1 (Types & Schemas) and Stage 2 (Backend Controllers) can be scaffolded in parallel once §3.1 architecture is approved. UI components in Stage 3 can run concurrently across independent tabs.",
      humanDecisionCheckpoints: [
        "Checkpoint 1: Approval of core data entities (§3.8) prior to code generation.",
        "Checkpoint 2: UX layout validation (§3.2) before backend API wiring.",
        "Checkpoint 3: Final Non-Goal compliance audit (§2.5) before production deploy.",
      ],
      estimatedCredits: "185,000 / 1,000,000 monthly allowance (~81.5% buffer remaining)",
    },
    productionPlan: {
      stages: [
        {
          id: "stg-1",
          stageNumber: 1,
          title: "Foundation, Data Models & Architecture",
          modelTier: "Flash-Lite (Low Cost) + Pro (Review)",
          status: "Completed",
          sourceOfTruthRefs: ["§3.1 Architecture", "§3.8 Data Model", "§3.12 Security"],
          promptSequence: [
            {
              id: "p-1",
              task: "Create strictly typed data models and interface definitions",
              suggestedModel: "gemini-3.1-flash-lite",
              promptText: "TASK: Implement all TypeScript models adhering to Project Definition §3.8. Constraints: Do not use any types. Non-Goals: Do not create mock user databases yet (§2.5). Provide complete interfaces for ProjectDefinition, MarketIntelligence, BuildSpecification, and ProductionPlan.",
              acceptanceCriteria: [
                "Strict TypeScript interfaces created in /src/types.ts",
                "Zero 'any' escape hatches",
                "Exports all entity schemas with section tags",
              ],
              status: "passed",
            },
            {
              id: "p-2",
              task: "Configure Express server entry point and Gemini SDK client",
              suggestedModel: "gemini-3.8-flash",
              promptText: "TASK: Set up Express backend with lazy GoogleGenAI initialization per §3.12. Ensure User-Agent header is set to 'aistudio-build'. Implement POST /api/orchestrator/check-drift and POST /api/orchestrator/generate-project.",
              acceptanceCriteria: [
                "Server listens on port 3000 and 0.0.0.0",
                "API key kept strictly server-side",
                "Vite middleware enabled in dev mode",
              ],
              status: "passed",
            },
          ],
          checkpoints: ["Backend health check responds with 200 OK", "TypeScript compiles cleanly"],
        },
        {
          id: "stg-2",
          stageNumber: 2,
          title: "Drift Evaluation Engine & Alignment Supervisor",
          modelTier: "Gemini 3.8 (Strongest Reasoning)",
          status: "Ready",
          sourceOfTruthRefs: ["§2.3 Drift Auditor", "§3.6 Semantic Diagnostic", "§2.5 Non-Goals"],
          promptSequence: [
            {
              id: "p-3",
              task: "Build semantic comparison prompt with section citation rules",
              suggestedModel: "gemini-3.8-flash",
              promptText: "TASK: Implement the Drift Evaluation Engine per §3.6. Compare submitted AI Studio code against Project Definition clauses. If drift occurs, return the exact directive: 'Current output does not align with Project Definition §X.Y. Re-evaluate before proceeding.' and provide a copy-ready corrective prompt.",
              acceptanceCriteria: [
                "Drift score normalized from 0 to 100",
                "Pinpoints exact drifted section references",
                "Generates immediately actionable corrective prompts",
              ],
              status: "in_progress",
            },
          ],
          checkpoints: ["Evaluates sample drifted code and correctly triggers §2.5 non-goal warning"],
        },
        {
          id: "stg-3",
          stageNumber: 3,
          title: "Factory Execution Dashboard & Calibrated Prompts",
          modelTier: "Gemini 3.8 / Flash",
          status: "Pending",
          sourceOfTruthRefs: ["§2.2 Prompt Dispatcher", "§3.2 UX Requirements"],
          promptSequence: [
            {
              id: "p-4",
              task: "Develop Stage Kanban and one-click prompt injection cards",
              suggestedModel: "gemini-3.8-flash",
              promptText: "TASK: Build the factory stage visualizer per §3.2. Display stages, prompt cards, model tier badges, acceptance criteria checkboxes, and one-click copy buttons that format prompts specifically for AI Studio with clause references.",
              acceptanceCriteria: [
                "Interactive stage progress cards",
                "One-click copy with clipboard toast feedback",
                "Model recommendation badge on every prompt",
              ],
              status: "pending",
            },
          ],
          checkpoints: ["User can progress stage from Ready to In Factory to Completed"],
        },
        {
          id: "stg-4",
          stageNumber: 4,
          title: "Production Strategy & Million-Credit Budgeting",
          modelTier: "Flash-Lite (UI) + Deterministic",
          status: "Pending",
          sourceOfTruthRefs: ["§2.4 Resource Routing", "§3.16 Production Verification"],
          promptSequence: [
            {
              id: "p-5",
              task: "Implement Model Allocation Visualizer & Credit Burn Tracker",
              suggestedModel: "gemini-3.1-flash-lite",
              promptText: "TASK: Implement the resource routing dashboard per §2.4. Visualize the division between Strongest Model (Gemini Pro/3.8) and Fast/Free models (Flash-Lite), showing estimated credit consumption against the 1,000,000 monthly allowance.",
              acceptanceCriteria: [
                "Visual tier distribution breakdown",
                "Parallelization dependency graph summary",
                "Credit estimation formula displayed",
              ],
              status: "pending",
            },
          ],
          checkpoints: ["All Acceptance Criteria pass", "Compile applet succeeds without warnings"],
        },
      ],
    },
  },
  {
    id: "proj_health_companion",
    title: "MedSync — Local Medical Document Parser & Patient Advocate",
    tagline: "Private on-device lab report translator with clinical question generation",
    originalPrompt: "I want to build an application that helps patients understand complex blood test lab results and prepares specific questions for their next doctor appointment.",
    version: "1.0.0",
    createdAt: "2026-09-14T11:15:00.000Z",
    marketIntelligence: {
      opportunityScore: 86,
      marketSummary: "Patients frequently receive cryptic lab PDFs from Quest or Labcorp with zero plain-English guidance. Generic ChatGPT prompts lack medical safety bounds and hallucinate diagnoses.",
      competitors: [
        {
          name: "MyChart Lab View",
          strengths: "Direct hospital integration",
          weaknesses: "Only provides reference ranges without explanatory context or question guidance",
          threatLevel: "High",
        },
        {
          name: "Generic Health AI Chatbots",
          strengths: "Instant conversation",
          weaknesses: "High risk of prescriptive medical advice; non-compliant with HIPAA caution rules",
          threatLevel: "Medium",
        },
      ],
      underservedGaps: [
        "Generating structured doctor appointment agendas based on abnormal markers",
        "Clear distinction between informational analysis and diagnostic advice",
      ],
      differentiationOpportunity: "Focus exclusively on empowering doctor-patient conversations rather than replacing physicians.",
    },
    productDefinition: {
      problemStatement: "Patients feel anxious and disempowered when viewing lab markers (§1.1), leading to frantic web searches and misinterpretation.",
      targetAudience: "Patients managing chronic health checks, fertility tracking, or annual physicals (§1.2).",
      valueProposition: "Transform dense lab PDFs into plain-language summaries with a prioritized checklist of questions for your physician (§1.3).",
      coreFeatures: [
        { id: "f-1", code: "§2.1", name: "Marker Reference Explainer", description: "Explains standard vs out-of-range biomarkers." },
        { id: "f-2", code: "§2.2", name: "Physician Agenda Generator", description: "Generates 3-5 specific questions to ask the doctor." },
        { id: "f-3", code: "§2.3", name: "Privacy Shield Guard", description: "Strips personal identifiers prior to AI parsing." },
      ],
      nonGoals: [
        "Will NOT diagnose medical conditions or recommend medication dosages (§2.5).",
        "Will NOT prescribe treatment or replace clinical consultation (§2.6).",
      ],
      businessModel: "Privacy-first local utility with optional secure export (§2.7).",
    },
    buildSpecification: {
      architecture: {
        code: "§3.1",
        overview: "Client-side OCR processing with server-side sanitized Gemini 3.8 inference.",
        frontendStack: ["React 19", "Tailwind CSS", "Vite"],
        backendStack: ["Express", "Node.js"],
        dataStorage: "Local encrypted browser storage only.",
      },
      uxRequirements: [
        { code: "§3.2", rule: "Reassuring warm neutral visual palette with clear clinical disclaimers", criticality: "High" },
        { code: "§3.3", rule: "Print-ready summary view for bringing to appointments", criticality: "High" },
      ],
      functionalRequirements: [
        { code: "§3.4", title: "Marker Parsing Pipeline", details: "Extracts analyte names, numeric values, units, and reference ranges." },
        { code: "§3.5", title: "Safety Warning Enforcer", details: "Prepends medical advisory disclaimer on all generated summaries." },
      ],
      dataModel: [
        { entity: "LabMarker", code: "§3.6", fields: ["name: string", "value: number", "unit: string", "status: 'Normal' | 'High' | 'Low'"] },
      ],
      integrations: [{ name: "Gemini 3.8 Flash", code: "§3.7", purpose: "Plain language translation and agenda synthesis" }],
      securityRequirements: [{ code: "§3.8", rule: "Automatic redaction of SSN, MRN, and patient names" }],
      testingRequirements: ["Parsing accuracy verification against mock lab fixtures (§3.9)"],
      deploymentRequirements: ["Cloud Run container deployment (§3.10)"],
    },
    aiProductionStrategy: {
      modelAllocation: [
        {
          tier: "Strongest Model (Gemini 3.8 / Pro)",
          tasks: ["Medical disclaimer compliance guard", "Complex multivariable lab interpretation"],
          creditBudgetPct: 55,
          reasoning: "Strict medical safety and terminology nuance required.",
        },
        {
          tier: "Fast / Low Cost Model (Flash-Lite)",
          tasks: ["UI formatting", "PDF table regex cleanup", "Question layout"],
          creditBudgetPct: 45,
          reasoning: "Fast tabular structuring.",
        },
      ],
      parallelizationPlan: "Parser and UI layout can proceed concurrently.",
      humanDecisionCheckpoints: ["Clinical disclaimer approval by legal/compliance."],
      estimatedCredits: "120,000 / 1,000,000 monthly allowance",
    },
    productionPlan: {
      stages: [
        {
          id: "stg-m1",
          stageNumber: 1,
          title: "Data Models & Medical Safety Disclaimers",
          modelTier: "Gemini 3.8",
          status: "Ready",
          sourceOfTruthRefs: ["§3.1 Architecture", "§3.6 Data Model", "§2.5 Non-Goals"],
          promptSequence: [
            {
              id: "pm-1",
              task: "Create biomarker schema with strict safety enums",
              suggestedModel: "gemini-3.8-flash",
              promptText: "TASK: Define LabMarker data structures per §3.6. Non-Goals: Strictly enforce §2.5 (No diagnostic predictions). Ensure all outputs contain mandatory clinical advisory flags.",
              acceptanceCriteria: ["Biomarker schemas exported", "Disclaimers hardcoded in types"],
              status: "pending",
            },
          ],
          checkpoints: ["Safety disclaimers render in all views"],
        },
      ],
    },
  },
];
