import { 
  TargetModeMeta, 
  TargetOutputMode, 
  TargetProjections, 
  DownstreamProjectRepresentation, 
  DevPanelState, 
  RepositoryModule,
  ReadinessDimensionCheck
} from "../types";

export const TARGET_MODES: TargetModeMeta[] = [
  {
    id: "build",
    name: "BUILD",
    internalDistinction: "Detail",
    tagline: "Build this application",
    targetLabel: "Google AI Studio / AI Builders",
    description: "Detailed implementation prompt: single-prompt architecture, UI, behavior, data, and constraints.",
    primaryActionLabel: "Copy Build Prompt",
    destinationUrl: "https://ai.studio/build",
  },
  {
    id: "dev",
    name: "DEV",
    internalDistinction: "Plan",
    tagline: "Develop this software/system",
    targetLabel: "LLM / Coding Agent (Cursor, Claude, Copilot)",
    description: "Developer-oriented specification: technical plan, file structure, module contracts, testing, and verification.",
    primaryActionLabel: "Copy Dev Plan",
  },
  {
    id: "create",
    name: "CREATE",
    internalDistinction: "Brief",
    tagline: "Create this creative output",
    targetLabel: "Creative AI (Suno, Midjourney, ElevenLabs)",
    description: "Creative-generation brief: style, parameters, sonic/visual direction, structure, and prompt syntax.",
    primaryActionLabel: "Copy Creative Brief",
    destinationUrl: "https://suno.com",
  },
];

export function deriveTargetProjections(
  title: string,
  canonicalPrompt: string,
  requirements?: any,
  downstreamRep?: DownstreamProjectRepresentation | null
): TargetProjections {
  if (!canonicalPrompt || !canonicalPrompt.trim()) {
    return { build: "", dev: "", create: "" };
  }

  const cleanTitle = title || "Focused Project";

  // 1. BUILD (Detail: "Build this application" - Target: Google AI Studio)
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

  // 2. DEV (Plan: "Develop this software/system" - Target: LLM / Coding Agent: Cursor, Claude Code, Copilot, Aider)
  const repoTree = downstreamRep?.repositoryStructure?.treeText || `├── src/
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

  const fileList = downstreamRep?.repositoryStructure?.files || [
    { path: "src/types.ts", purpose: "Strict TypeScript domain models and state interfaces." },
    { path: "src/components/PrimaryWorkspace.tsx", purpose: "Core single-screen view hosting the primary user action loop." },
    { path: "src/components/ActionControlBar.tsx", purpose: "Tactile action controls, filters, and state toggles." },
    { path: "src/components/SummaryDisplay.tsx", purpose: "Visual presentation of active records and metrics." },
    { path: "src/utils/storage.ts", purpose: "Persistence and serialization utilities using LocalStorage." },
  ];

  const modules = downstreamRep?.moduleRelationships?.modules || [
    { name: "PrimaryWorkspace", responsibility: "Coordinates core user interaction and active data display", dependencies: ["ActionControlBar", "SummaryDisplay", "types.ts"] },
    { name: "ActionControlBar", responsibility: "Dispatches user operations and state mutations", dependencies: ["types.ts"] },
    { name: "SummaryDisplay", responsibility: "Presents status and domain computations", dependencies: ["types.ts"] },
  ];

  const steps = downstreamRep?.implementationPlan?.steps || [
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

  // 3. CREATE (Brief: "Create this creative output" - Target: Creative AI Tools: Suno, Midjourney, ElevenLabs, Runway)
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

export function deriveDevPanelState(
  title: string,
  canonicalPrompt: string,
  downstreamRep?: DownstreamProjectRepresentation | null,
  readinessChecks?: ReadinessDimensionCheck[]
): DevPanelState {
  const cleanTitle = title || "Focused Project";
  const repoSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const hasPrompt = Boolean(canonicalPrompt && canonicalPrompt.trim().length > 0);

  // If prompt is withheld or project is incomplete, DEV projection strictly reflects incompleteness
  if (!hasPrompt) {
    const unresolvedGates = (readinessChecks || []).filter((c) => c.status !== "met");
    const unresolvedNames = unresolvedGates.map((g) => g.label).join(", ") || "Project workflows, capabilities, and architecture";

    return {
      targetRepoUrl: `https://github.com/organization/${repoSlug || "pending-workspace"}`,
      instructions: `// SPECIFICATION WITHHELD BY 8-DIMENSION READINESS GATE
The canonical project definition for "${cleanTitle}" is currently incomplete or unresolved.
Implementation instructions are withheld until all readiness dimensions pass.

Unresolved Dimensions:
${unresolvedGates.length > 0 ? unresolvedGates.map((g) => `- [ ] ${g.label}: ${g.details || "Pending clarification in conversation"}`).join("\n") : "- [ ] Core specifications and architectural decisions pending definition."}

Directive for Developer/Agent:
Continue the conversation to resolve: ${unresolvedNames}.`,
      modules: [
        {
          id: "mod-1",
          path: "src/types.ts",
          status: "pending",
          description: "Specification pending: Domain models and state interfaces await resolved requirements.",
        },
        {
          id: "mod-2",
          path: "src/components/PrimaryWorkspace.tsx",
          status: "blocked",
          description: "Blocked: Primary user workflow and interaction loop not yet established.",
        },
        {
          id: "mod-3",
          path: "src/utils/storage.ts",
          status: "pending",
          description: "Specification pending: Storage strategy and persistence requirements undefined.",
        },
      ],
      rawFileTree: `└── [Proposed File Tree Withheld: Project definition incomplete (${unresolvedGates.length} gates pending)]`,
    };
  }

  const repoTree = downstreamRep?.repositoryStructure?.treeText || `├── src/
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

  const rawFiles = downstreamRep?.repositoryStructure?.files || [
    { path: "src/types.ts", purpose: "Strict TypeScript domain models and state interfaces." },
    { path: "src/components/PrimaryWorkspace.tsx", purpose: "Core single-screen view hosting the primary user action loop." },
    { path: "src/components/ActionControlBar.tsx", purpose: "Tactile action controls, filters, and state toggles." },
    { path: "src/components/SummaryDisplay.tsx", purpose: "Visual presentation of active records and metrics." },
    { path: "src/utils/storage.ts", purpose: "Persistence and serialization utilities using LocalStorage." },
  ];

  const modules: RepositoryModule[] = rawFiles.map((file: any, index: number) => {
    let status: "ready" | "pending" | "blocked" = "ready";
    const pathLower = file.path.toLowerCase();
    
    if (pathLower.includes("storage") || pathLower.includes("database") || pathLower.includes("api")) {
      status = "ready";
    } else if (pathLower.includes("action") || pathLower.includes("control")) {
      status = "ready";
    } else if (pathLower.includes("types")) {
      status = "ready";
    } else if (index === rawFiles.length - 1 && rawFiles.length > 4) {
      status = "pending";
    }

    return {
      id: `mod-${index + 1}`,
      path: file.path,
      status,
      description: file.purpose || "Core application component with responsive state.",
    };
  });

  const instructions = `Architectural Implementation Plan for ${cleanTitle}
- Stack: React 19, TypeScript strict mode, Tailwind CSS utility classes.
- Pattern: Single-screen low-latency workspace with real local key-value state persistence.
- Anti-drift rules: Zero generic ItemRecord CRUD stubs, zero unrequested login walls, minimum 44px touch targets.
- Order of execution:
  1. Define domain models in src/types.ts
  2. Implement local state synchronization in src/utils/storage.ts
  3. Build tactile interaction controls in src/components/
  4. Verify no compilation errors or broken event handlers.`;

  return {
    targetRepoUrl: `https://github.com/organization/${repoSlug || "app-workspace"}`,
    instructions,
    modules,
    rawFileTree: repoTree,
  };
}

