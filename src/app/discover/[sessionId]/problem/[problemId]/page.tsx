"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProblemWithDetails } from "@/lib/types";

function ConfidenceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[level] || colors.low}`}
    >
      {level} confidence
    </span>
  );
}

function StrengthBadge({ strength }: { strength: string }) {
  const colors: Record<string, string> = {
    high: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-gray-50 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[strength] || colors.low}`}
    >
      {strength}
    </span>
  );
}

function SectionHeader({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-base">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string; problemId: string }>;
}) {
  const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      const { sessionId: sid, problemId } = await params;
      setSessionId(sid);
      try {
        const res = await fetch(`/api/discover/${sid}`);
        if (res.ok) {
          const data = await res.json();
          const found = data.problems?.find(
            (p: ProblemWithDetails) => p.id === problemId
          );
          if (found) {
            setProblem(found);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [params]);

  const handleSelect = async () => {
    if (!problem) return;
    setSelecting(true);
    try {
      await fetch(`/api/discover/${sessionId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id }),
      });
      setProblem((prev) =>
        prev ? { ...prev, isSelected: true } : prev
      );
    } catch {
      // ignore
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4">
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
            Loading problem details...
          </div>
        </main>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4">
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
            <h2 className="text-xl font-semibold">Problem not found</h2>
            <Link
              href={`/discover/${sessionId}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Back to Results
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
            href={`/discover/${sessionId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Results
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <ConfidenceBadge level={problem.confidence} />
              {problem.isSelected && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  Selected
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {problem.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {problem.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Affected Users
              </p>
              <p className="text-sm">{problem.affectedUsers}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Why It Matters
              </p>
              <p className="text-sm">{problem.whyItMatters}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <SectionHeader
                icon={
                  <svg
                    className="w-4 h-4 text-emerald-600"
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
                }
                title="Evidence"
                description="Information that can be traced to a known source"
                color="bg-emerald-50"
              />
              <div className="space-y-3 pl-11">
                {problem.evidences.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No supporting evidence was found for this problem.
                  </p>
                ) : (
                  problem.evidences.map((ev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/30 space-y-2"
                    >
                      <p className="text-sm leading-relaxed">{ev.content}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-medium">
                          Source:
                        </span>
                        <span className="text-muted-foreground">
                          {ev.source}
                        </span>
                        <StrengthBadge strength={ev.strength} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                icon={
                  <svg
                    className="w-4 h-4 text-amber-600"
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
                }
                title="AI Inferences"
                description="Logical conclusions drawn from the evidence above"
                color="bg-amber-50"
              />
              <div className="space-y-3 pl-11">
                {problem.inferences.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No inferences were generated.
                  </p>
                ) : (
                  problem.inferences.map((inf, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-amber-100 bg-amber-50/30"
                    >
                      <p className="text-sm leading-relaxed">{inf.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                icon={
                  <svg
                    className="w-4 h-4 text-red-600"
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
                }
                title="Assumptions"
                description="Things assumed but not independently verified"
                color="bg-red-50"
              />
              <div className="space-y-3 pl-11">
                {problem.assumptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No assumptions were noted.
                  </p>
                ) : (
                  problem.assumptions.map((ass, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-red-100 bg-red-50/30"
                    >
                      <p className="text-sm leading-relaxed">{ass.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {problem.isSelected ? (
                <Link
                  href={`/discover/${sessionId}/evaluate`}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center"
                >
                  Evaluate This Opportunity
                </Link>
              ) : (
                <button
                  onClick={handleSelect}
                  disabled={selecting}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {selecting ? "Selecting..." : "Select This Problem"}
                </button>
              )}
              <Link
                href={`/discover/${sessionId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium border border-border text-muted-foreground hover:bg-muted transition-colors text-center"
              >
                Back to All Problems
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
