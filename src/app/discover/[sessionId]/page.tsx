"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResearchSessionData } from "@/lib/types";

function ConfidenceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[level] || colors.low}`}
    >
      {level} confidence
    </span>
  );
}

function ProblemCard({
  problem,
  sessionId,
  onSelect,
}: {
  problem: ResearchSessionData["problems"][0];
  sessionId: string;
  onSelect: (problemId: string) => void;
}) {
  const evidenceCount = problem.evidences?.length || 0;
  const inferenceCount = problem.inferences?.length || 0;
  const assumptionCount = problem.assumptions?.length || 0;

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 transition-all ${
        problem.isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-snug">
            {problem.title}
          </h3>
          <ConfidenceBadge level={problem.confidence} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {problem.description}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground font-medium shrink-0">
            Who:
          </span>
          <span className="text-muted-foreground">{problem.affectedUsers}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground font-medium shrink-0">
            Why:
          </span>
          <span className="text-muted-foreground line-clamp-1">
            {problem.whyItMatters}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          {evidenceCount} evidence
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          {inferenceCount} inference{inferenceCount !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          {assumptionCount} assumption{assumptionCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onSelect(problem.id)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            problem.isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {problem.isSelected ? "Selected" : "Select This Problem"}
        </button>
        <Link
          href={`/discover/${sessionId}/problem/${problem.id}`}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const [session, setSession] = useState<ResearchSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { sessionId } = await params;
      try {
        const res = await fetch(`/api/discover/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          if (data.status === "completed" || data.status === "failed") {
            setPolling(false);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [params]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const { sessionId } = await params;
      try {
        const res = await fetch(`/api/discover/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          if (data.status === "completed" || data.status === "failed") {
            setPolling(false);
          }
        }
      } catch {
        // ignore
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [polling, params]);

  const handleSelect = async (problemId: string) => {
    const { sessionId } = await params;
    try {
      const res = await fetch(`/api/discover/${sessionId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      if (res.ok) {
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            problems: prev.problems.map((p) => ({
              ...p,
              isSelected: p.id === problemId,
            })),
          };
        });
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  OL
                </span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading session...
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  OL
                </span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Session not found</h2>
            <p className="text-muted-foreground">
              This session doesn&apos;t exist or has expired.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Start New Discovery
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (session.status === "failed") {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  OL
                </span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Research Failed</h2>
            <p className="text-muted-foreground text-sm">
              {session.error ||
                "Something went wrong during research. Please try again."}
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Try Again
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const hasSelection = session.problems.some((p) => p.isSelected);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  OL
                </span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
          <Link
            href="/discover"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            New Discovery
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Topic:</span>
              <span className="font-medium text-foreground px-2 py-0.5 bg-muted rounded-md">
                {session.topic}
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              Discovered Problems ({session.problems.length})
            </h1>
            <p className="text-muted-foreground text-sm">
              Review the problems found in this space. Select one to continue
              with.
            </p>
          </div>

          {session.problems.length === 0 && polling ? (
            <div className="text-center py-16 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <svg
                  className="animate-spin w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                Still researching problems...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.problems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    sessionId={session.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {hasSelection && (
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Problem selected! Ready for the next phase.
                  </p>
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-6 py-2.5 rounded-lg font-medium text-sm cursor-not-allowed"
                  >
                    Phase 2 — Coming Soon
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
