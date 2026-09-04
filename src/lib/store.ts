import { randomUUID } from "crypto";
import type {
  EvaluationDimension,
  DimensionResult,
  ProductConcept,
  OpportunityStatus,
} from "./types";

export interface User {
  id: string;
  createdAt: number;
}

export interface ResearchSession {
  id: string;
  createdAt: number;
  topic: string;
  status: "pending" | "researching" | "completed" | "failed";
  error: string | null;
  userId: string;
}

export interface Problem {
  id: string;
  createdAt: number;
  sessionId: string;
  title: string;
  description: string;
  affectedUsers: string;
  whyItMatters: string;
  confidence: "low" | "medium" | "high";
  isSelected: boolean;
}

export interface Evidence {
  id: string;
  problemId: string;
  content: string;
  source: string;
  sourceUrl: string | null;
  strength: "low" | "medium" | "high";
}

export interface Inference {
  id: string;
  problemId: string;
  content: string;
}

export interface Assumption {
  id: string;
  problemId: string;
  content: string;
}

export interface Evaluation {
  id: string;
  createdAt: number;
  problemId: string;
  sessionId: string;
  overallScore: number;
  overallLabel: string;
  overallExplanation: string;
}

export interface EvaluationDimensionRow {
  id: string;
  evaluationId: string;
  dimension: EvaluationDimension;
  score: number;
  label: string;
  explanation: string;
  supportingEvidence: string;
  evidenceType: "evidence" | "inference" | "assumption";
}

export interface EvaluationExtra {
  id: string;
  evaluationId: string;
  type: "strength" | "weakness" | "uncertainty" | "needsValidation";
  content: string;
}

export interface ProductConceptRow {
  id: string;
  createdAt: number;
  problemId: string;
  sessionId: string;
  evaluationId: string;
  concept: ProductConcept;
}

export interface OpportunityRow {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  sessionId: string;
  topic: string;
  status: OpportunityStatus;
  problem: {
    id: string;
    title: string;
    description: string;
    affectedUsers: string;
    whyItMatters: string;
    confidence: string;
  };
  evidence: Array<{ content: string; source: string; strength: string }>;
  inferences: Array<{ content: string }>;
  assumptions: Array<{ content: string }>;
  evaluation: EvaluationWithDetailsData;
  concept: ProductConcept;
}

export interface EvaluationWithDetailsData {
  id: string;
  createdAt: number;
  problemId: string;
  sessionId: string;
  overallScore: number;
  overallLabel: string;
  overallExplanation: string;
  dimensions: EvaluationDimensionRow[];
  strengths: string[];
  weaknesses: string[];
  uncertainties: string[];
  needsValidation: string[];
}

interface Database {
  users: User[];
  sessions: ResearchSession[];
  problems: Problem[];
  evidences: Evidence[];
  inferences: Inference[];
  assumptions: Assumption[];
  evaluations: Evaluation[];
  evaluationDimensions: EvaluationDimensionRow[];
  evaluationExtras: EvaluationExtra[];
  productConcepts: ProductConceptRow[];
  opportunities: OpportunityRow[];
}

const DB_FILE = "dev-db.json";

import { readFileSync, writeFileSync, existsSync } from "fs";

function loadDB(): Database {
  if (!existsSync(DB_FILE)) {
const empty: Database = {
    users: [],
    sessions: [],
    problems: [],
    evidences: [],
    inferences: [],
    assumptions: [],
    evaluations: [],
    evaluationDimensions: [],
    evaluationExtras: [],
    productConcepts: [],
    opportunities: [],
  };
    saveDB(empty);
    return empty;
  }
  const raw = readFileSync(DB_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  // Ensure new tables exist for backward compat
  if (!parsed.evaluations) parsed.evaluations = [];
  if (!parsed.evaluationDimensions) parsed.evaluationDimensions = [];
  if (!parsed.evaluationExtras) parsed.evaluationExtras = [];
  if (!parsed.productConcepts) parsed.productConcepts = [];
  if (!parsed.opportunities) parsed.opportunities = [];
  return parsed;
}

function saveDB(database: Database): void {
  writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
}

let db: Database | null = null;

function getDB(): Database {
  if (!db) {
    db = loadDB();
  }
  return db;
}

function flushDB(): void {
  if (db) {
    saveDB(db);
  }
}

export function resetDBCache(): void {
  db = null;
}

// ── Users ──

export function createUser(): User {
  const database = getDB();
  const user: User = {
    id: randomUUID(),
    createdAt: Date.now(),
  };
  database.users.push(user);
  flushDB();
  return user;
}

// ── Sessions ──

export function createSession(userId: string, topic: string): ResearchSession {
  const database = getDB();
  const session: ResearchSession = {
    id: randomUUID(),
    createdAt: Date.now(),
    topic,
    status: "researching",
    error: null,
    userId,
  };
  database.sessions.push(session);
  flushDB();
  return session;
}

export function updateSessionStatus(
  sessionId: string,
  status: ResearchSession["status"],
  error?: string
): void {
  const database = getDB();
  const session = database.sessions.find((s) => s.id === sessionId);
  if (session) {
    session.status = status;
    if (error !== undefined) {
      session.error = error;
    }
    flushDB();
  }
}

// ── Problems ──

export function createProblems(
  sessionId: string,
  aiProblems: Array<{
    title: string;
    description: string;
    affectedUsers: string;
    whyItMatters: string;
    confidence: "low" | "medium" | "high";
    evidence: Array<{
      content: string;
      source: string;
      sourceUrl: string | null;
      strength: "low" | "medium" | "high";
    }>;
    inferences: Array<{ content: string }>;
    assumptions: Array<{ content: string }>;
  }>
): Problem[] {
  const database = getDB();
  const createdProblems: Problem[] = [];

  for (const ai of aiProblems) {
    const problem: Problem = {
      id: randomUUID(),
      createdAt: Date.now(),
      sessionId,
      title: ai.title,
      description: ai.description,
      affectedUsers: ai.affectedUsers,
      whyItMatters: ai.whyItMatters,
      confidence: ai.confidence,
      isSelected: false,
    };
    database.problems.push(problem);
    createdProblems.push(problem);

    for (const ev of ai.evidence) {
      database.evidences.push({
        id: randomUUID(),
        problemId: problem.id,
        content: ev.content,
        source: ev.source,
        sourceUrl: ev.sourceUrl,
        strength: ev.strength,
      });
    }

    for (const inf of ai.inferences) {
      database.inferences.push({
        id: randomUUID(),
        problemId: problem.id,
        content: inf.content,
      });
    }

    for (const ass of ai.assumptions) {
      database.assumptions.push({
        id: randomUUID(),
        problemId: problem.id,
        content: ass.content,
      });
    }
  }

  flushDB();
  return createdProblems;
}

export function getSession(sessionId: string): ResearchSession | undefined {
  return getDB().sessions.find((s) => s.id === sessionId);
}

export function getSessionProblems(
  sessionId: string
): Array<
  Problem & {
    evidences: Evidence[];
    inferences: Inference[];
    assumptions: Assumption[];
  }
> {
  const database = getDB();
  return database.problems
    .filter((p) => p.sessionId === sessionId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({
      ...p,
      evidences: database.evidences.filter((e) => e.problemId === p.id),
      inferences: database.inferences.filter((i) => i.problemId === p.id),
      assumptions: database.assumptions.filter((a) => a.problemId === p.id),
    }));
}

export function selectProblem(
  problemId: string,
  sessionId: string
): void {
  const database = getDB();
  for (const p of database.problems) {
    if (p.sessionId === sessionId) {
      p.isSelected = p.id === problemId;
    }
  }
  flushDB();
}

export function getProblemWithDetails(problemId: string) {
  const database = getDB();
  const problem = database.problems.find((p) => p.id === problemId);
  if (!problem) return null;
  return {
    ...problem,
    evidences: database.evidences.filter((e) => e.problemId === problemId),
    inferences: database.inferences.filter((i) => i.problemId === problemId),
    assumptions: database.assumptions.filter((a) => a.problemId === problemId),
  };
}

// ── Evaluations ──

export function createEvaluation(
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
): string {
  const database = getDB();
  const evalId = randomUUID();

  database.evaluations.push({
    id: evalId,
    createdAt: Date.now(),
    problemId,
    sessionId,
    overallScore,
    overallLabel,
    overallExplanation,
  });

  for (const dim of dimensions) {
    database.evaluationDimensions.push({
      id: randomUUID(),
      evaluationId: evalId,
      dimension: dim.dimension,
      score: dim.score,
      label: dim.label,
      explanation: dim.explanation,
      supportingEvidence: dim.supportingEvidence,
      evidenceType: dim.evidenceType,
    });
  }

  for (const content of strengths) {
    database.evaluationExtras.push({
      id: randomUUID(),
      evaluationId: evalId,
      type: "strength",
      content,
    });
  }
  for (const content of weaknesses) {
    database.evaluationExtras.push({
      id: randomUUID(),
      evaluationId: evalId,
      type: "weakness",
      content,
    });
  }
  for (const content of uncertainties) {
    database.evaluationExtras.push({
      id: randomUUID(),
      evaluationId: evalId,
      type: "uncertainty",
      content,
    });
  }
  for (const content of needsValidation) {
    database.evaluationExtras.push({
      id: randomUUID(),
      evaluationId: evalId,
      type: "needsValidation",
      content,
    });
  }

  flushDB();
  return evalId;
}

export function getEvaluationForProblem(
  problemId: string
) {
  const database = getDB();
  const ev = database.evaluations.find((e) => e.problemId === problemId);
  if (!ev) return null;
  return {
    ...ev,
    dimensions: database.evaluationDimensions.filter(
      (d) => d.evaluationId === ev.id
    ),
    strengths: database.evaluationExtras
      .filter((e) => e.evaluationId === ev.id && e.type === "strength")
      .map((e) => e.content),
    weaknesses: database.evaluationExtras
      .filter((e) => e.evaluationId === ev.id && e.type === "weakness")
      .map((e) => e.content),
    uncertainties: database.evaluationExtras
      .filter((e) => e.evaluationId === ev.id && e.type === "uncertainty")
      .map((e) => e.content),
    needsValidation: database.evaluationExtras
      .filter((e) => e.evaluationId === ev.id && e.type === "needsValidation")
      .map((e) => e.content),
  };
}

export function getSessionEvaluations(sessionId: string) {
  const database = getDB();
  const evals = database.evaluations.filter(
    (e) => e.sessionId === sessionId
  );
  return evals.map((ev) => {
    const problem = database.problems.find((p) => p.id === ev.problemId);
    return {
      ...ev,
      problem: problem
        ? {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            affectedUsers: problem.affectedUsers,
            whyItMatters: problem.whyItMatters,
            confidence: problem.confidence,
          }
        : null,
      dimensions: database.evaluationDimensions.filter(
        (d) => d.evaluationId === ev.id
      ),
      strengths: database.evaluationExtras
        .filter((e) => e.evaluationId === ev.id && e.type === "strength")
        .map((e) => e.content),
      weaknesses: database.evaluationExtras
        .filter((e) => e.evaluationId === ev.id && e.type === "weakness")
        .map((e) => e.content),
      uncertainties: database.evaluationExtras
        .filter((e) => e.evaluationId === ev.id && e.type === "uncertainty")
        .map((e) => e.content),
      needsValidation: database.evaluationExtras
        .filter((e) => e.evaluationId === ev.id && e.type === "needsValidation")
        .map((e) => e.content),
    };
  });
}

// ── Product Concepts ──

export function createProductConcept(
  problemId: string,
  sessionId: string,
  evaluationId: string,
  concept: ProductConcept
): string {
  const database = getDB();
  const id = randomUUID();
  database.productConcepts.push({
    id,
    createdAt: Date.now(),
    problemId,
    sessionId,
    evaluationId,
    concept,
  });
  flushDB();
  return id;
}

export function getProductConcept(problemId: string) {
  const database = getDB();
  return database.productConcepts.find((c) => c.problemId === problemId) || null;
}

export function getSessionProductConcepts(sessionId: string) {
  const database = getDB();
  return database.productConcepts.filter((c) => c.sessionId === sessionId);
}

// ── Opportunities (Phase 3) ──

export function createOpportunity(
  userId: string,
  data: Omit<OpportunityRow, "id" | "createdAt" | "updatedAt">
): OpportunityRow {
  const database = getDB();
  const now = Date.now();

  // Prevent duplicate: same user + session + problem should not save twice
  const existing = database.opportunities.find(
    (o) =>
      o.userId === userId &&
      o.sessionId === data.sessionId &&
      o.problem.id === data.problem.id
  );
  if (existing) {
    existing.updatedAt = now;
    existing.concept = data.concept;
    existing.status = "defined";
    flushDB();
    return existing;
  }

  const row: OpportunityRow = {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  database.opportunities.push(row);
  flushDB();
  return row;
}

export function getOpportunitiesForUser(
  userId: string
): OpportunityRow[] {
  const database = getDB();
  return database.opportunities
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getOpportunityById(id: string): OpportunityRow | undefined {
  return getDB().opportunities.find((o) => o.id === id);
}

export function updateOpportunity(
  userId: string,
  id: string,
  updates: Partial<{
    concept: ProductConcept;
    status: OpportunityStatus;
    updatedAt: number;
  }>
): OpportunityRow | null {
  const database = getDB();
  const opportunity = database.opportunities.find(
    (o) => o.id === id && o.userId === userId
  );
  if (!opportunity) return null;

  if (updates.concept) opportunity.concept = updates.concept;
  if (updates.status) opportunity.status = updates.status;
  opportunity.updatedAt = Date.now();
  flushDB();
  return opportunity;
}

export function deleteOpportunity(
  userId: string,
  id: string
): boolean {
  const database = getDB();
  const index = database.opportunities.findIndex(
    (o) => o.id === id && o.userId === userId
  );
  if (index === -1) return false;
  database.opportunities.splice(index, 1);
  flushDB();
  return true;
}
