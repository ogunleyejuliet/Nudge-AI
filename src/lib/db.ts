import {
  createUser,
  createSession,
  updateSessionStatus,
  createProblems,
  getSession,
  getSessionProblems,
  selectProblem,
  getProblemWithDetails,
  createEvaluation,
  getEvaluationForProblem,
  getSessionEvaluations,
  createProductConcept,
  getProductConcept,
  getSessionProductConcepts,
  createOpportunity,
  getOpportunitiesForUser,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "./store";
import type {
  AIProblem,
  ResearchSessionData,
  ProblemWithDetails,
  EvaluationWithDetails,
  DimensionResult,
  ProductConcept,
  OpportunityStatus,
} from "./types";

let userId = "anonymous-user";

export async function ensureUser(): Promise<string> {
  return userId;
}

export async function startResearch(topic: string): Promise<string> {
  const user = createUser();
  userId = user.id;
  const session = createSession(user.id, topic);
  return session.id;
}

export async function completeResearch(sessionId: string): Promise<void> {
  updateSessionStatus(sessionId, "completed");
}

export async function failResearch(
  sessionId: string,
  error: string
): Promise<void> {
  updateSessionStatus(sessionId, "failed", error);
}

export async function saveAIProblems(
  sessionId: string,
  aiProblems: AIProblem[]
): Promise<void> {
  createProblems(sessionId, aiProblems);
}

export async function getSessionData(
  sessionId: string
): Promise<ResearchSessionData | null> {
  const session = getSession(sessionId);
  if (!session) return null;

  const problems = getSessionProblems(sessionId);

  return {
    id: session.id,
    createdAt: new Date(session.createdAt),
    topic: session.topic,
    status: session.status,
    error: session.error,
    problems: problems.map((p) => ({
      id: p.id,
      createdAt: new Date(p.createdAt),
      sessionId: p.sessionId,
      title: p.title,
      description: p.description,
      affectedUsers: p.affectedUsers,
      whyItMatters: p.whyItMatters,
      confidence: p.confidence,
      isSelected: p.isSelected,
      evidences: p.evidences.map((e) => ({
        content: e.content,
        source: e.source,
        sourceUrl: e.sourceUrl,
        strength: e.strength,
      })),
      inferences: p.inferences.map((i) => ({ content: i.content })),
      assumptions: p.assumptions.map((a) => ({ content: a.content })),
    })),
  };
}

export async function selectProblemById(
  problemId: string,
  sessionId: string
): Promise<void> {
  selectProblem(problemId, sessionId);
}

export async function getProblemDetails(
  problemId: string
): Promise<ProblemWithDetails | null> {
  const data = getProblemWithDetails(problemId);
  if (!data) return null;

  return {
    id: data.id,
    createdAt: new Date(data.createdAt),
    sessionId: data.sessionId,
    title: data.title,
    description: data.description,
    affectedUsers: data.affectedUsers,
    whyItMatters: data.whyItMatters,
    confidence: data.confidence,
    isSelected: data.isSelected,
    evidences: data.evidences.map((e) => ({
      content: e.content,
      source: e.source,
      sourceUrl: e.sourceUrl,
      strength: e.strength,
    })),
    inferences: data.inferences.map((i) => ({ content: i.content })),
    assumptions: data.assumptions.map((a) => ({ content: a.content })),
  };
}

// ── Phase 2: Evaluations ──

export async function saveEvaluation(
  problemId: string,
  sessionId: string,
  overallScore: number,
  overallLabel: string,
  overallExplanation: string,
  dimensions: DimensionResult[],
  strengths: string[],
  weaknesses: string[],
  uncertainties: string[],
  needsValidation: string[]
): Promise<string> {
  return createEvaluation(
    problemId,
    sessionId,
    overallScore,
    overallLabel,
    overallExplanation,
    dimensions,
    strengths,
    weaknesses,
    uncertainties,
    needsValidation
  );
}

export async function getEvaluation(
  problemId: string
): Promise<EvaluationWithDetails | null> {
  const data = getEvaluationForProblem(problemId);
  if (!data) return null;

  return {
    id: data.id,
    createdAt: new Date(data.createdAt),
    problemId: data.problemId,
    sessionId: data.sessionId,
    overallScore: data.overallScore,
    overallLabel: data.overallLabel,
    overallExplanation: data.overallExplanation,
    dimensions: data.dimensions.map((d) => ({
      dimension: d.dimension as EvaluationWithDetails["dimensions"][0]["dimension"],
      score: d.score,
      label: d.label,
      explanation: d.explanation,
      supportingEvidence: d.supportingEvidence,
      evidenceType: d.evidenceType as "evidence" | "inference" | "assumption",
    })),
    strengths: data.strengths,
    weaknesses: data.weaknesses,
    uncertainties: data.uncertainties,
    needsValidation: data.needsValidation,
  };
}

export async function getSessionEvaluationsData(sessionId: string) {
  return getSessionEvaluations(sessionId);
}

// ── Phase 2: Product Concepts ──

export async function saveProductConcept(
  problemId: string,
  sessionId: string,
  evaluationId: string,
  concept: ProductConcept
): Promise<string> {
  return createProductConcept(problemId, sessionId, evaluationId, concept);
}

export async function getProductConceptForProblem(problemId: string) {
  return getProductConcept(problemId);
}

export async function getSessionProductConceptsList(sessionId: string) {
  return getSessionProductConcepts(sessionId);
}

// ── Phase 3: Opportunities ──

export async function saveOpportunity(
  userId: string,
  sessionId: string,
  topic: string,
  problem: {
    id: string;
    title: string;
    description: string;
    affectedUsers: string;
    whyItMatters: string;
    confidence: string;
  },
  evidences: Array<{ content: string; source: string; strength: string }>,
  inferences: Array<{ content: string }>,
  assumptions: Array<{ content: string }>,
  evaluation: EvaluationWithDetails,
  concept: ProductConcept
) {
  const row = createOpportunity(userId, {
    userId,
    sessionId,
    topic,
    status: "defined",
    problem,
    evidence: evidences,
    inferences,
    assumptions,
    evaluation: {
      id: evaluation.id,
      createdAt: evaluation.createdAt.getTime(),
      problemId: evaluation.problemId,
      sessionId: evaluation.sessionId,
      overallScore: evaluation.overallScore,
      overallLabel: evaluation.overallLabel,
      overallExplanation: evaluation.overallExplanation,
      dimensions: evaluation.dimensions.map((d) => ({
        id: "",
        evaluationId: evaluation.id,
        dimension: d.dimension,
        score: d.score,
        label: d.label,
        explanation: d.explanation,
        supportingEvidence: d.supportingEvidence,
        evidenceType: d.evidenceType,
      })),
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      uncertainties: evaluation.uncertainties,
      needsValidation: evaluation.needsValidation,
    },
    concept,
  });

  return {
    id: row.id,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    topic: row.topic,
    status: row.status,
    conceptName: row.concept.name,
    conceptOneLiner: row.concept.oneLiner,
    problemTitle: row.problem.title,
    overallScore: row.evaluation.overallScore,
    overallLabel: row.evaluation.overallLabel,
  };
}

export async function getOpportunity(userId: string, opportunityId: string) {
  const row = getOpportunityById(opportunityId);
  if (!row || row.userId !== userId) return null;
  return {
    id: row.id,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    sessionId: row.sessionId,
    topic: row.topic,
    status: row.status,
    problem: row.problem,
    evidence: row.evidence,
    inferences: row.inferences,
    assumptions: row.assumptions,
    evaluation: {
      id: row.evaluation.id,
      createdAt: new Date(row.evaluation.createdAt),
      problemId: row.evaluation.problemId,
      sessionId: row.evaluation.sessionId,
      overallScore: row.evaluation.overallScore,
      overallLabel: row.evaluation.overallLabel,
      overallExplanation: row.evaluation.overallExplanation,
      dimensions: row.evaluation.dimensions,
      strengths: row.evaluation.strengths,
      weaknesses: row.evaluation.weaknesses,
      uncertainties: row.evaluation.uncertainties,
      needsValidation: row.evaluation.needsValidation,
    },
    concept: row.concept,
  };
}

export async function listOpportunities(userId: string) {
  const rows = getOpportunitiesForUser(userId);
  return rows.map((row) => ({
    id: row.id,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    topic: row.topic,
    status: row.status,
    conceptName: row.concept.name,
    conceptOneLiner: row.concept.oneLiner,
    problemTitle: row.problem.title,
    overallScore: row.evaluation.overallScore,
    overallLabel: row.evaluation.overallLabel,
  }));
}

export async function updateOpportunityConcept(
  userId: string,
  opportunityId: string,
  concept: ProductConcept,
  status?: OpportunityStatus
) {
  const row = updateOpportunity(userId, opportunityId, { concept, status });
  if (!row) return null;
  return {
    id: row.id,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    sessionId: row.sessionId,
    topic: row.topic,
    status: row.status,
    problem: row.problem,
    evidence: row.evidence,
    inferences: row.inferences,
    assumptions: row.assumptions,
    evaluation: {
      id: row.evaluation.id,
      createdAt: new Date(row.evaluation.createdAt),
      problemId: row.evaluation.problemId,
      sessionId: row.evaluation.sessionId,
      overallScore: row.evaluation.overallScore,
      overallLabel: row.evaluation.overallLabel,
      overallExplanation: row.evaluation.overallExplanation,
      dimensions: row.evaluation.dimensions,
      strengths: row.evaluation.strengths,
      weaknesses: row.evaluation.weaknesses,
      uncertainties: row.evaluation.uncertainties,
      needsValidation: row.evaluation.needsValidation,
    },
    concept: row.concept,
  };
}

export async function removeOpportunity(userId: string, opportunityId: string) {
  return deleteOpportunity(userId, opportunityId);
}
