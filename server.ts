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

// Helper: Generate structured project continuity response adhering strictly to the Sniper Principle
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
  
  // Preserve existing prompt if established, or generate initial draft
  let workingPromptFallback = currentWorkingPrompt && currentWorkingPrompt.trim().length > 0
    ? currentWorkingPrompt
    : `// ========================================================
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
- Backend & Storage: Client-side persistent key-value state (LocalStorage) with clean reactive hooks.
- Design System: Sophisticated neutral palette, high-contrast typography, clear hierarchy, accessible touch targets (min 44px).

# DATA MODEL & SCHEMA:
interface ItemRecord {
  id: string;
  title: string;
  category: string;
  status: "active" | "completed" | "archived";
  notes?: string;
  timestamp: string;
}

# CORE INTERACTION FLOW:
1. Instant capture input with responsive keyboard handling (Enter to submit).
2. Clean visual list/grid of items with status toggles and inline editing.
3. Search and quick filtering across active categories.
4. Export/copy data functionality with instant visual confirmation.

# NON-GOALS (STRICT ANTI-DRIFT):
- Do NOT build authentication modals, user login screens, or billing forms unless explicitly requested.
- Do NOT add complex multi-step wizards or unrequested sidebars.
- Focus strictly on making the primary workflow delightful and reliable.`;

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

  // 1. AI Studio Feedback Loop: Retain established state, target ONLY the broken area
  if (currentWorkingPrompt && isAiStudioFeedback && !isBuildTrigger) {
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
  // 2. Significant Architectural Pivot: (e.g. switching from local storage to hosted DB)
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
  // 3. Build Trigger
  else if (isBuildTrigger) {
    responseContent = `I've synthesized our project into the finalized **Build Prompt** on the right.

It establishes:
• Single-screen architecture with instant tactile feedback
• Strict TypeScript data models and validation contracts
• Explicit non-goals to prevent scope creep in AI Studio
• Production-ready styling and resilient error handling

You can copy the prompt using **Copy Prompt for AI Studio** on the right, open **Google AI Studio**, and paste it in to build your application.`;
  }
  // 4. Incremental Refinement (e.g. dark mode, csv export)
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
  // 5. Initial Idea Exploration
  else {
    responseContent = `I understand what you're trying to do. Here's what I think you mean: You want a focused, zero-friction solution for "${lastUserMessage}" that solves this specific problem cleanly without enterprise bloat.

Here's where it could actually be useful:
• **Day-to-day workflow**: Solving this task without switching between three different browser tabs or heavy tools.
• **Immediate execution**: A dedicated tool with zero configuration needed.
• **Clean data output**: Structured records that are immediately actionable.

Here's what already exists:
Most existing software in this space is either buried inside massive monolithic suites or left to generic text chatbots that produce unstructured, messy output.

Here's the gap I see:
A **lightweight, purposeful single-screen tool** built specifically for this exact workflow. 

I've developed the initial **Build Prompt** on the right. You can review it, continue exploring the idea with me, or say **"Okay. Build this"** when you're ready to finalize the prompt for Google AI Studio.

What do you think?`;
  }

  return {
    content: responseContent,
    workingPrompt: workingPromptFallback,
    projectUpdate: {
      title: projectTitle || ideaTopic,
      requirements: updatedProjectRequirements,
      understanding: `Focused single-screen solution for ${lastUserMessage}`,
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

INTERNAL PROJECT STRUCTURE:
PROJECT
  ├── project identity (title, id)
  ├── accumulated understanding
  ├── conversation / history
  ├── decisions and established requirements (architecture, tech stack, data models, non-goals)
  ├── current Build Prompt (the living implementation specification for Google AI Studio)
  └── latest feedback / change state (AI Studio iteration logs)

THE CRITICAL PRINCIPLE — CONTINUITY OVER REGENERATION:
Continuity is more important than prompt generation.
The system must NOT behave like:
User message → regenerate everything from scratch

It must behave like:
Existing project state + New information → Determine delta → Apply targeted change → Updated project state

This is the "sniper" principle:
ESTABLISH ONCE.
PRESERVE WHAT IS KNOWN.
INVESTIGATE WHAT CHANGED.
MODIFY PRECISELY.

Change the smallest valid set of project decisions necessary to keep the whole project coherent.

HANDLING DIFFERENT USER INTENTS:
1. AI Studio Feedback (e.g. "The auth works, but data import is broken", "AI Studio changed the dashboard and now export is failing"):
   - Recognize the SAME ongoing project.
   - Retain working components (e.g. auth, layout, schemas).
   - Isolate the failing component or regression.
   - Acknowledge established state ("I know where we are with this project. Let's address [the issue].")
   - Update only the affected section of the Build Prompt or provide targeted fix directives for AI Studio.
2. Significant Architectural Pivot (e.g. "I don't want this to use a local database anymore, use a hosted database"):
   - Identify which decisions depend on the old architecture.
   - Invalidate and remove obsolete requirements (prevent contradictory stacking!).
   - Preserve unaffected decisions (UX flow, entities, styling).
   - Revise affected architecture and data storage in the Build Prompt.
3. Incremental Requirement (e.g. "Add CSV export", "Use dark mode", "Add category filtering"):
   - Preserve all established decisions, splice the new requirement into the existing Build Prompt cleanly without resetting.
4. Build Trigger (e.g. "Okay. Build this", "Let's build"):
   - Finalize the complete, polished Build Prompt for AI Studio.
5. Initial Exploration:
   - Understand core intent, challenge weak assumptions, investigate what exists, identify the gap, and draft the initial specification.

BUILD PROMPT GUIDELINES:
The "workingPrompt" field MUST be a complete, high-precision, copy-ready prompt intended for Google AI Studio Build (https://ai.studio/build).
It must always be internally consistent, free of contradictory obsolete statements, and ready to paste.

Format your response as a valid JSON object matching this schema:
{
  "content": "Conversational reply as the dedicated Project Manager. Tone: clear, collaborative, professional. Acknowledge continuity ('I know where we are with this project...'), diagnose the change, explain what was updated.",
  "workingPrompt": "The complete, living, internally consistent Build Prompt for Google AI Studio.",
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
    "latestChangeCategory": "ai_studio_feedback" | "incremental_tweak" | "architectural_pivot" | "initial_definition" | "finalization",
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
      if (parsed && (parsed.content || parsed.workingPrompt)) {
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
