import {
  createUser,
  createSession,
  updateSessionStatus,
  createProblems,
  getSession,
  getSessionProblems,
  selectProblem,
  getProblemWithDetails,
} from "./store";
import type { AIProblem, ResearchSessionData, ProblemWithDetails } from "./types";

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
