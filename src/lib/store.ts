import { randomUUID } from "crypto";

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

interface Database {
  users: User[];
  sessions: ResearchSession[];
  problems: Problem[];
  evidences: Evidence[];
  inferences: Inference[];
  assumptions: Assumption[];
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
    };
    saveDB(empty);
    return empty;
  }
  const raw = readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function saveDB(db: Database): void {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
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
