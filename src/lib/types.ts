export interface EvidenceItem {
  content: string;
  source: string;
  sourceUrl: string | null;
  strength: "low" | "medium" | "high";
}

export interface InferenceItem {
  content: string;
}

export interface AssumptionItem {
  content: string;
}

export interface AIProblem {
  title: string;
  description: string;
  affectedUsers: string;
  whyItMatters: string;
  confidence: "low" | "medium" | "high";
  evidence: EvidenceItem[];
  inferences: InferenceItem[];
  assumptions: AssumptionItem[];
}

export interface ProblemWithDetails {
  id: string;
  createdAt: Date;
  sessionId: string;
  title: string;
  description: string;
  affectedUsers: string;
  whyItMatters: string;
  confidence: string;
  isSelected: boolean;
  evidences: EvidenceItem[];
  inferences: InferenceItem[];
  assumptions: AssumptionItem[];
}

export interface ResearchSessionData {
  id: string;
  createdAt: Date;
  topic: string;
  status: string;
  error: string | null;
  problems: ProblemWithDetails[];
}

export type DiscoveryStatus = "idle" | "researching" | "completed" | "failed";

// Phase 2: Evaluation

export type EvaluationDimension =
  | "problemSeverity"
  | "frequency"
  | "userPain"
  | "existingAlternatives"
  | "marketPotential"
  | "competition"
  | "evidenceStrength"
  | "opportunityPotential";

export interface DimensionResult {
  dimension: EvaluationDimension;
  score: number;
  label: string;
  explanation: string;
  supportingEvidence: string;
  evidenceType: "evidence" | "inference" | "assumption";
}

export interface EvaluationResult {
  dimensions: DimensionResult[];
  strengths: string[];
  weaknesses: string[];
  uncertainties: string[];
  needsValidation: string[];
  overallLabel: string;
  overallExplanation: string;
}

export interface EvaluationWithDetails {
  id: string;
  createdAt: Date;
  problemId: string;
  sessionId: string;
  overallScore: number;
  overallLabel: string;
  overallExplanation: string;
  dimensions: DimensionResult[];
  strengths: string[];
  weaknesses: string[];
  uncertainties: string[];
  needsValidation: string[];
}

// Phase 2: Product Concept

export interface ProductConcept {
  name: string;
  oneLiner: string;
  problem: string;
  targetUsers: string;
  userNeeds: string[];
  proposedSolution: string;
  valueProposition: string;
  coreFeatures: string[];
  mvpFeatures: string[];
  excludedFromMvp: string[];
  userJourney: string[];
  businessModel: string;
  keyAssumptions: string[];
  validationQuestions: string[];
  majorRisks: string[];
}

export interface ProductConceptWithDetails {
  id: string;
  createdAt: Date;
  problemId: string;
  sessionId: string;
  evaluationId: string;
  concept: ProductConcept;
}

// Scoring framework weights (defined by the application)
export const DIMENSION_WEIGHTS: Record<EvaluationDimension, number> = {
  problemSeverity: 0.15,
  frequency: 0.12,
  userPain: 0.15,
  existingAlternatives: 0.12,
  marketPotential: 0.15,
  competition: 0.10,
  evidenceStrength: 0.10,
  opportunityPotential: 0.11,
};

export const DIMENSION_LABELS: Record<EvaluationDimension, string> = {
  problemSeverity: "Problem Severity",
  frequency: "Frequency",
  userPain: "User Pain",
  existingAlternatives: "Existing Alternatives",
  marketPotential: "Market Potential",
  competition: "Competition",
  evidenceStrength: "Evidence Strength",
  opportunityPotential: "Opportunity Potential",
};

export const DIMENSION_DESCRIPTIONS: Record<EvaluationDimension, string> = {
  problemSeverity:
    "How severe or impactful is this problem for those who experience it?",
  frequency:
    "How often do users encounter or experience this problem?",
  userPain:
    "How much pain, frustration, or cost does this problem cause users?",
  existingAlternatives:
    "How well do existing solutions address this problem? (higher = bigger gap)",
  marketPotential:
    "How large is the potential market or number of affected users?",
  competition:
    "How open is the competitive landscape? (higher = less competition, more opportunity)",
  evidenceStrength:
    "How strong and reliable is the evidence supporting this problem?",
  opportunityPotential:
    "Overall potential for a viable product opportunity in this space?",
};
