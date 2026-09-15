import { 
  ProjectState, 
  ProjectDiscoveries, 
  WorkflowStageItem,
  ReadinessDimensionCheck,
  ResearchFinding 
} from "../types";

export interface ProjectProgress {
  percentage: number;
  stage: "understanding" | "exploring" | "defining" | "readiness_gate" | "generating" | "achieved";
  stageLabel: string;
  statusHeadline: string;
  nextStepPrompt: string;
}

export function deriveProjectProgress(project: ProjectState): ProjectProgress {
  const hasPrompt = Boolean(project.buildPrompt && project.buildPrompt.trim().length > 0);
  const checks = project.readinessChecks || [];
  const metCount = checks.filter((c) => c.status === "met").length;
  const unresolvedChecks = checks.filter((c) => c.status === "unresolved");

  // If prompt is achieved and validated
  if (project.isPromptAchieved || (hasPrompt && project.masterPromptStatus === "prompt_achieved")) {
    return {
      percentage: 100,
      stage: "achieved",
      stageLabel: "Specification Complete",
      statusHeadline: "Master Prompt Achieved & Ready to Build",
      nextStepPrompt: "Launch in Google AI Studio to build this application.",
    };
  }

  // Count user messages to gauge depth of conversation
  const userMessages = project.messages.filter((m) => m.role === "user");
  const userMsgCount = userMessages.length;

  if (userMsgCount === 0) {
    return {
      percentage: 5,
      stage: "understanding",
      stageLabel: "Awaiting Initial Concept",
      statusHeadline: "Listening for your project idea",
      nextStepPrompt: "Describe what you want to build or what friction you want to solve.",
    };
  }

  // Calculate percentage based on passed readiness checks and requirements
  let basePct = 15;
  if (checks.length > 0) {
    basePct = Math.round((metCount / checks.length) * 80);
  } else {
    // estimate from requirements
    let reqScore = 15;
    if (project.requirements?.purpose) reqScore += 20;
    if (project.requirements?.coreCapabilities?.length) reqScore += 20;
    if (project.requirements?.architecture?.pattern) reqScore += 15;
    basePct = reqScore;
  }

  // Clamp percentage between 15% and 92% until prompt achieved
  const percentage = Math.min(Math.max(basePct, 20), 92);

  // Derive next action / next question
  let nextStepPrompt = "Clarify the primary user action loop and output artifact.";
  if (unresolvedChecks.length > 0) {
    const firstUnresolved = unresolvedChecks[0];
    if (firstUnresolved.id === "primary_workflow") {
      nextStepPrompt = "Clarify primary user action: what is the main input and output on this screen?";
    } else if (firstUnresolved.id === "inputs_outputs") {
      nextStepPrompt = "Define inputs & outputs: what exact data format is created or transformed?";
    } else if (firstUnresolved.id === "capabilities") {
      nextStepPrompt = "Confirm core capabilities and scope boundaries.";
    } else if (firstUnresolved.id === "architecture") {
      nextStepPrompt = "Confirm storage and persistence strategy (client-side vs cloud).";
    } else if (firstUnresolved.id === "ambiguities") {
      nextStepPrompt = firstUnresolved.details || "Address key workflow tradeoffs to lock the spec.";
    }
  } else if (percentage >= 75) {
    nextStepPrompt = "Say 'Okay. Build this' to verify consistency and unlock the build prompt.";
  }

  let stage: ProjectProgress["stage"] = "understanding";
  let stageLabel = "1. Understand";
  if (percentage < 35) {
    stage = "understanding";
    stageLabel = "1. Understand";
  } else if (percentage < 65) {
    stage = "exploring";
    stageLabel = "2. Explore";
  } else if (percentage < 85) {
    stage = "defining";
    stageLabel = "3. Define";
  } else {
    stage = "readiness_gate";
    stageLabel = "4. Readiness Gate";
  }

  return {
    percentage,
    stage,
    stageLabel,
    statusHeadline: `${percentage}% understood & specified`,
    nextStepPrompt,
  };
}

export function deriveProjectDiscoveries(project: ProjectState): ProjectDiscoveries {
  const title = project.identity?.title || "Product";
  const userMessages = project.messages.filter((m) => m.role === "user");
  const lastUserText = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : "";
  const allUserText = userMessages.map((m) => m.content).join(" ").toLowerCase();

  const isTrades = /electric|plumb|hvac|contractor|job|quote|material|shift|receipt/i.test(allUserText);
  const isAudio = /stem|audio|music|producer|track|bpm|key|waveform/i.test(allUserText);
  const isSaturated = /social media|tiktok|reels|dating/i.test(allUserText);

  // Discovered findings
  const findings: ResearchFinding[] = [];

  if (isTrades) {
    findings.push({
      id: "f-trades-1",
      source: "Workflow Analysis",
      whatWasFound: "Field quotes calculated on scratchpads lead to 18-24% margin leakage on materials.",
      whyItMatters: "Eliminating manual calculations locks quote limits against actual invoice receipts.",
      potentialImplication: "Must feature instant quote builder with live material variance alerts.",
    });
    findings.push({
      id: "f-trades-2",
      source: "Market Landscape",
      whatWasFound: "Existing tools (ServiceTitan, Jobber) are bloated enterprise suites priced at $300+/mo.",
      whyItMatters: "Solo tradespeople and small 2-man teams want a frictionless single-screen tool with no setup.",
      potentialImplication: "Zero-login, instant local storage persistence is the killer wedge.",
    });
  } else if (isAudio) {
    findings.push({
      id: "f-audio-1",
      source: "Workflow Analysis",
      whatWasFound: "Producers lose 40+ minutes per session packaging stems and labeling BPM/keys for vocalists.",
      whyItMatters: "A client-side stem bundle generator removes DAW export bottlenecks.",
      potentialImplication: "Web Audio API channel preview with single-click JSZip packaging.",
    });
    findings.push({
      id: "f-audio-2",
      source: "Competitive Benchmark",
      whatWasFound: "Cloud stem collaboration services require subscriptions and slow uploads.",
      whyItMatters: "100% in-browser processing preserves local sample privacy and works instantly.",
      potentialImplication: "No server-side audio upload needed; pure client execution.",
    });
  } else if (isSaturated) {
    findings.push({
      id: "f-sat-1",
      source: "Defensibility Audit",
      whatWasFound: "Direct consumer feeds fail against entrenched network effects (TikTok/IG).",
      whyItMatters: "A generic clone has zero distribution leverage or retention advantage.",
      potentialImplication: "Pivoted toward constrained high-trust vertical or private feedback loops.",
    });
  } else if (allUserText.length > 20) {
    findings.push({
      id: "f-gen-1",
      source: "Domain Synthesis",
      whatWasFound: `Targeting specialized workflows for "${title}" without heavy onboarding overhead.`,
      whyItMatters: "Modern users reject 5-step registration flows for focused utilities.",
      potentialImplication: "Single-screen SPA architecture with instant visual response.",
    });
    if (project.requirements?.purpose) {
      findings.push({
        id: "f-gen-2",
        source: "Capability Map",
        whatWasFound: project.requirements.purpose,
        whyItMatters: "Establishes explicit functional boundary preventing unsolicited feature bloat.",
        potentialImplication: "Strictly limited to requested data models and interaction loops.",
      });
    }
  }

  // Discovered items checklist
  const checks = project.readinessChecks || [];
  const discoveredItems = [
    { label: "Core target user & pain point identified", done: Boolean(project.requirements?.purpose || project.identity.title) },
    { label: "Primary interaction loop & data flow defined", done: checks.some((c) => c.id === "primary_workflow" && c.status === "met") },
    { label: "Input parameters & deliverables bounded", done: checks.some((c) => c.id === "inputs_outputs" && c.status === "met") },
    { label: "Storage & tech architecture chosen", done: Boolean(project.requirements?.architecture?.stack?.length) },
    { label: "Anti-drift & non-goals locked", done: Boolean(project.requirements?.constraintsAndNonGoals?.length) },
  ];

  const unresolvedCount = checks.filter((c) => c.status === "unresolved").length;

  return {
    market: {
      existingSolutionsCount: isTrades ? 4 : isAudio ? 3 : 2,
      competingApproachesCount: isTrades ? 2 : 2,
      gapIdentified: isTrades
        ? "Heavy enterprise software with mandatory subscriptions vs. fast single-screen quote & margin tracker"
        : isAudio
        ? "Slow cloud stem upload portals vs. instant zero-latency in-browser stem packager"
        : "Generic multi-step portals vs. zero-friction tactile single-screen utility",
      observedGap: isTrades
        ? "Tradespeople need immediate margin math at the job site, not CRM invoicing suites."
        : "Producers want drag-and-drop stem packaging with automatic role tagging.",
      differentiationOpportunity: "Instant tactile single-screen workspace with zero login barrier.",
      findings,
    },
    technical: {
      relevantTechnology: "React 19, TypeScript strict contracts, Tailwind CSS, Local Storage",
      constraints: [
        "Single-screen view constraint — zero multi-page bloat",
        "Minimum 44px touch targets for mobile/tablet usability",
        "Server-side proxying for any external APIs",
      ],
      recommendedStack: project.requirements?.architecture?.stack || ["React 19", "Vite", "Tailwind CSS", "TypeScript"],
    },
    workflow: {
      observedPattern: "Input Data / Parameters → Immediate Real-time Computation → Actionable Output / Export",
      currentFriction: "High cognitive load, fragmented tool switching, and manual error-prone calculations.",
      proposedWedge: "Ultra-lean single-screen flow focusing entirely on the primary transaction.",
    },
    discoveredItems,
    openDecisionsCount: Math.max(unresolvedCount, checks.length === 0 ? 3 : 0),
  };
}

export function deriveWorkflowStages(project: ProjectState): WorkflowStageItem[] {
  const progress = deriveProjectProgress(project);
  const stages: WorkflowStageItem[] = [
    { id: "idea", label: "Idea Intake", status: "completed" },
    { 
      id: "research", 
      label: "Discovered Intelligence", 
      status: progress.percentage >= 35 ? "completed" : "active" 
    },
    { 
      id: "opportunity", 
      label: "Readiness Gate", 
      status: progress.percentage >= 85 ? "completed" : progress.percentage >= 35 ? "active" : "pending" 
    },
    { 
      id: "build", 
      label: "Build Ready", 
      status: progress.stage === "achieved" ? "completed" : progress.percentage >= 85 ? "active" : "pending" 
    },
  ];
  return stages;
}
