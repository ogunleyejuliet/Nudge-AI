"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ComparisonItem {
  evaluationId: string;
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  affectedUsers: string;
  whyItMatters: string;
  confidence: string;
  overallScore: number;
  overallLabel: string;
  dimensions: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  uncertainties: string[];
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 7
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 5
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-600 border-red-200";
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border ${color}`}
    >
      {score}
    </span>
  );
}

function DimensionBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-muted-foreground truncate shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-medium w-4 text-right">{score}</span>
    </div>
  );
}

export default function ComparePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const [sessionId, setSessionId] = useState("");
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { sessionId: sid } = await params;
      setSessionId(sid);
      try {
        const res = await fetch(`/api/discover/${sid}/compare`);
        if (!res.ok) throw new Error("Failed to load comparisons");
        const data = await res.json();
        setItems(data);
        if (data.length > 0) {
          const sorted = [...data].sort(
            (a: ComparisonItem, b: ComparisonItem) =>
              b.overallScore - a.overallScore
          );
          setSelectedId(sorted[0].problemId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [params]);

  const handleSelect = async (problemId: string) => {
    try {
      await fetch(`/api/discover/${sessionId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      setSelectedId(problemId);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading comparisons...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">{error}</h2>
            <Link
              href={`/discover/${sessionId}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Back to Problems
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">No evaluations found</h2>
            <p className="text-muted-foreground">
              Evaluate at least one problem before comparing.
            </p>
            <Link
              href={`/discover/${sessionId}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Back to Problems
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const sorted = [...items].sort(
    (a, b) => b.overallScore - a.overallScore
  );

  const dimKeys = [
    "problemSeverity",
    "frequency",
    "userPain",
    "existingAlternatives",
    "marketPotential",
    "competition",
    "evidenceStrength",
    "opportunityPotential",
  ];
  const dimLabels: Record<string, string> = {
    problemSeverity: "Severity",
    frequency: "Frequency",
    userPain: "User Pain",
    existingAlternatives: "Gap",
    marketPotential: "Market",
    competition: "Competition",
    evidenceStrength: "Evidence",
    opportunityPotential: "Opportunity",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sessionId={sessionId} />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <Link
              href={`/discover/${sessionId}/evaluate`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Evaluation
            </Link>
            <h1 className="text-2xl font-bold">Compare Opportunities</h1>
            <p className="text-muted-foreground text-sm">
              Side-by-side comparison of all evaluated problems. Sorted by overall score.
            </p>
          </div>

          <div className="space-y-4">
            {sorted.map((item, idx) => (
              <div
                key={item.problemId}
                className={`rounded-xl border p-5 transition-all ${
                  selectedId === item.problemId
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-muted-foreground w-8 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-base">
                          {item.problemTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.problemDescription}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Target: {item.affectedUsers}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <ScorePill score={item.overallScore} />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {item.overallLabel}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {dimKeys.map((key) => (
                        <DimensionBar
                          key={key}
                          label={dimLabels[key] || key}
                          score={item.dimensions[key] || 5}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-emerald-700">Strengths:</span>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          {item.strengths.slice(0, 2).map((s, i) => (
                            <li key={i} className="line-clamp-1">- {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-amber-700">Weaknesses:</span>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          {item.weaknesses.slice(0, 2).map((w, i) => (
                            <li key={i} className="line-clamp-1">- {w}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">Risks:</span>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          {item.uncertainties.slice(0, 2).map((u, i) => (
                            <li key={i} className="line-clamp-1">- {u}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleSelect(item.problemId)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          selectedId === item.problemId
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {selectedId === item.problemId
                          ? "Selected"
                          : "Select This"}
                      </button>
                      <Link
                        href={`/discover/${sessionId}/evaluate`}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        View Evaluation
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedId && (
            <div className="text-center pt-4">
              <Link
                href={`/discover/${sessionId}/concept`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                Generate Product Concept for Selected Opportunity
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Header({ sessionId }: { sessionId: string }) {
  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OL</span>
          </div>
          <span className="font-semibold text-lg">Opportunity Lab</span>
        </Link>
        {sessionId && (
          <span className="text-xs text-muted-foreground ml-auto">
            Session: {sessionId.slice(0, 8)}...
          </span>
        )}
      </div>
    </header>
  );
}
