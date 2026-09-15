export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
  threatLevel: "High" | "Medium" | "Low";
}

export interface MarketIntelligence {
  opportunityScore: number;
  marketSummary: string;
  competitors: Competitor[];
  underservedGaps: string[];
  differentiationOpportunity: string;
}

export interface CoreFeature {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface ProductDefinition {
  problemStatement: string;
  targetAudience: string;
  valueProposition: string;
  coreFeatures: CoreFeature[];
  nonGoals: string[];
  businessModel: string;
}

export interface UxRequirement {
  code: string;
  rule: string;
  criticality: "High" | "Medium" | "Low";
}

export interface FunctionalRequirement {
  code: string;
  title: string;
  details: string;
}

export interface DataModelEntity {
  entity: string;
  code: string;
  fields: string[];
}

export interface IntegrationSpec {
  name: string;
  code: string;
  purpose: string;
}

export interface SecurityRequirement {
  code: string;
  rule: string;
}

export interface BuildSpecification {
  architecture: {
    code: string;
    overview: string;
    frontendStack: string[];
    backendStack: string[];
    dataStorage: string;
  };
  uxRequirements: UxRequirement[];
  functionalRequirements: FunctionalRequirement[];
  dataModel: DataModelEntity[];
  integrations: IntegrationSpec[];
  securityRequirements: SecurityRequirement[];
  testingRequirements: string[];
  deploymentRequirements: string[];
}

export interface ModelTierAllocation {
  tier: string;
  tasks: string[];
  creditBudgetPct: number;
  reasoning: string;
}

export interface AIProductionStrategy {
  modelAllocation: ModelTierAllocation[];
  parallelizationPlan: string;
  humanDecisionCheckpoints: string[];
  estimatedCredits: string;
}

export interface PromptTask {
  id: string;
  task: string;
  suggestedModel: string;
  promptText: string;
  acceptanceCriteria: string[];
  completedCriteria?: boolean[];
  status?: "pending" | "in_progress" | "passed" | "failed";
}

export interface ProductionStage {
  id: string;
  stageNumber: number;
  title: string;
  modelTier: string;
  status: "Pending" | "Ready" | "In Factory" | "Completed" | "Blocked";
  sourceOfTruthRefs: string[];
  promptSequence: PromptTask[];
  checkpoints: string[];
}

export interface ProductionPlan {
  stages: ProductionStage[];
}

export interface ProjectDefinition {
  id: string;
  title: string;
  tagline: string;
  originalPrompt: string;
  version: string;
  createdAt: string;
  marketIntelligence: MarketIntelligence;
  productDefinition: ProductDefinition;
  buildSpecification: BuildSpecification;
  aiProductionStrategy: AIProductionStrategy;
  productionPlan: ProductionPlan;
}

export interface DriftIssue {
  severity: "CRITICAL" | "WARNING" | "INFO";
  sectionRef: string;
  issue: string;
  remedy: string;
}

export interface DriftCheckResult {
  isAligned: boolean;
  driftScore: number;
  verdict: string;
  affectedSections: string[];
  summary: string;
  driftItems: DriftIssue[];
  correctivePrompt: string;
}

export interface MarketHoleData {
  unmetNeed: string;
  incumbentBlindspot: string;
  targetPersona: string;
  unfairAdvantage: string;
  viabilityScore: number;
}

export interface MillionCreditPhase {
  phaseNumber: number;
  title: string;
  creditBudget: number;
  modelTier: string;
  focus: string;
  deliverables: string[];
}

export interface MillionCreditPlan {
  totalBudget: number;
  strategyTitle: string;
  phases: MillionCreditPhase[];
  rationale: string;
}

export interface AiStudioPromptControl {
  title: string;
  description: string;
  promptText: string;
  targetModel: string;
  estimatedCredits: number;
  type: "rapid_1k_app" | "deep_market_hole" | "drift_guardrail";
}

export interface DatabaseTabItem {
  id: "research" | "ideas" | "projects" | "tests" | "results";
  label: string;
}

export interface CompetitorComparison {
  name: string;
  category: string;
  whatExists: string;
  theGap: string;
}

export interface WorkspaceTestItem {
  id: string;
  name: string;
  type: "schema" | "drift" | "security" | "ux";
  passed: boolean;
  details: string;
}

export interface IdeaHistoryItem {
  id: string;
  title: string;
  gapSummary: string;
  timestamp: string;
  status: "exploring" | "refined" | "building" | "completed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  realWorldApplications?: string[];
  marketHole?: MarketHoleData;
  promptControl?: AiStudioPromptControl;
  millionCreditPlan?: MillionCreditPlan;
  workingPrompt?: string;
  competitors?: CompetitorComparison[];
  tests?: WorkspaceTestItem[];
}

export interface ProjectIdentity {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: "exploring" | "in_development" | "iterating_in_studio" | "complete";
}

export interface EstablishedRequirements {
  purpose: string;
  targetAudience?: string;
  architecture: {
    stack: string[];
    storage: string;
    pattern: string;
  };
  coreCapabilities: string[];
  constraintsAndNonGoals: string[];
  importantDecisions: string[];
}

export interface FeedbackIteration {
  id: string;
  timestamp: string;
  source: "ai_studio_feedback" | "user_requirement" | "architectural_pivot";
  reportedObservation: string;
  targetedChanges: string[];
}

export interface ReadinessDimensionCheck {
  id: string;
  label: string;
  status: "met" | "pending" | "unresolved";
  details?: string;
}

export interface DownstreamArchitectureLayer {
  layer: string;
  details: string;
}

export interface DownstreamFileNode {
  path: string;
  purpose: string;
}

export interface DownstreamModule {
  name: string;
  responsibility: string;
  dependencies: string[];
}

export interface DownstreamImplementationStep {
  stepNumber: number;
  title: string;
  promptObjective: string;
  verificationCriteria: string[];
}

export interface DownstreamProjectRepresentation {
  architecture: {
    summary: string;
    dataFlow: string;
    techLayers: DownstreamArchitectureLayer[];
  };
  repositoryStructure: {
    treeText: string;
    files: DownstreamFileNode[];
  };
  moduleRelationships: {
    modules: DownstreamModule[];
  };
  implementationPlan: {
    steps: DownstreamImplementationStep[];
  };
  gitHubIntegrationNote?: string;
}

export interface CanonicalProjectDefinition {
  corePurpose: string;
  primaryWorkflow: string;
  inputsAndOutputs: {
    inputs: string[];
    outputs: string[];
  };
  capabilities: string[];
  architecture: {
    stack: string[];
    storage: string;
    pattern: string;
  };
  constraintsAndNonGoals: string[];
  acceptedDecisions: string[];
  supersededDecisions: string[];
}

export type TargetOutputMode = "build" | "dev" | "create";

export type ReadinessStatus = "ready" | "pending" | "blocked";

export interface RepositoryModule {
  id: string;
  path: string;           // e.g., "src/core/state-engine.ts"
  status: ReadinessStatus;
  description: string;    // Brief note on what needs doing
}

export interface DevPanelState {
  targetRepoUrl: string;
  instructions: string;
  modules: RepositoryModule[];
  rawFileTree: string;
}

export interface TargetModeMeta {
  id: TargetOutputMode;
  name: string;
  targetLabel: string;
  internalDistinction: "Detail" | "Plan" | "Brief";
  tagline: string;
  description: string;
  primaryActionLabel: string;
  destinationUrl?: string;
}

export interface TargetProjections {
  build: string; // BUILD (Detail): Google AI Studio / AI app builders
  dev: string;   // DEV (Plan): LLM / coding agent (Cursor, Claude Code, Copilot, Aider)
  create: string; // CREATE (Brief): Creative AI tools (Suno, Midjourney, ElevenLabs, Runway)
}

export interface ProjectState {
  identity: ProjectIdentity;
  understanding: string;
  messages: ChatMessage[];
  requirements: EstablishedRequirements;
  canonicalDefinition?: CanonicalProjectDefinition;
  buildPrompt: string; // The canonical Master Prompt / active projected prompt
  activeTargetMode?: TargetOutputMode;
  targetProjections?: TargetProjections;
  isPromptAchieved: boolean;
  masterPromptStatus: "discovering" | "defining" | "readiness_withheld" | "prompt_achieved" | "refining_change";
  readinessChecks?: ReadinessDimensionCheck[];
  downstreamRepresentation?: DownstreamProjectRepresentation;
  devPanelState?: DevPanelState;
  feedbackHistory: FeedbackIteration[];
}

export type ActiveTab = 
  | "chat"
  | "orchestrator"
  | "market"
  | "product"
  | "specification"
  | "strategy"
  | "factory"
  | "drift-monitor";


