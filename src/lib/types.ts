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
