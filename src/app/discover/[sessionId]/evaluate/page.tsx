"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EvaluationWithDetails, ProblemWithDetails, EvaluationDimension } from "@/lib/types";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/lib/types";

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold w-8 text-right">{score}</span>
    </div>
  );
}

function EvidenceTag({ type }: { type: string }) {
  const styles: Record<string, string> = {
    evidence: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inference: "bg-amber-50 text-amber-700 border-amber-200",
    assumption: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${styles[type] || styles.inference}`}
    >
      {type}
    </span>
  );
}

function OverallScoreGauge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 7 ? "text-emerald-600" : score >= 5 ? "text-amber-600" : "text-red-500";
  const bg =
    score >= 7 ? "border-emerald-200 bg-emerald-50" : score >= 5 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50";
  return (
    <div className={`rounded-xl border-2 p-6 text-center ${bg}`}>
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-muted-foreground mt-1">out of 10</div>
      <div className={`text-sm font-semibold mt-2 ${color}`}>{label}</div>
    </div>
  );
}

export default function EvaluatePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const [sessionId, setSessionId] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<ProblemWithDetails | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { sessionId: sid } = await params;
      setSessionId(sid);

      try {
        const sessionRes = await fetch(`/api/discover/${sid}`);
        if (!sessionRes.ok) throw new Error("Session not found");
        const session = await sessionRes.json();

        const selected = session.problems?.find(
          (p: ProblemWithDetails) => p.isSelected
        );
        if (!selected) {
          setError("No problem selected. Go back and select a problem first.");
          setLoading(false);
          setEvaluating(false);
          return;
        }
        setSelectedProblem(selected);

        const evalRes = await fetch(`/api/discover/${sid}/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId: selected.id }),
        });

        if (evalRes.ok) {
          const evalData = await evalRes.json();
          setEvaluation(evalData);
        } else {
          const err = await evalRes.json();
          throw new Error(err.error || "Evaluation failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        setEvaluating(false);
      }
    };

    init();
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">
              {evaluating ? "Evaluating opportunity..." : "Loading..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {evaluating
                ? "Analyzing problem severity, market potential, evidence strength, and more."
                : "Fetching problem details."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !selectedProblem || !evaluation) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {error || "Evaluation not available"}
            </h2>
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header sessionId={sessionId} />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <Link
              href={`/discover/${sessionId}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Problems
            </Link>
            <h1 className="text-2xl font-bold">Opportunity Evaluation</h1>
            <p className="text-muted-foreground text-sm">
              AI-assessed evaluation of: <span className="font-medium text-foreground">{selectedProblem.title}</span>
            </p>
            <p className="text-xs text-muted-foreground italic">
              These scores are AI-assisted assessments based on available evidence, not objective market truth. Validate with real research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <OverallScoreGauge score={evaluation.overallScore} label={evaluation.overallLabel} />
            </div>
            <div className="md:col-span-2 p-5 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold text-sm mb-2">Assessment Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {evaluation.overallExplanation}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Dimension Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluation.dimensions
                .sort((a, b) => {
                  const order: EvaluationDimension[] = [
                    "problemSeverity", "frequency", "userPain", "existingAlternatives",
                    "marketPotential", "competition", "evidenceStrength", "opportunityPotential",
                  ];
                  return order.indexOf(a.dimension) - order.indexOf(b.dimension);
                })
                .map((dim) => (
                <div
                  key={dim.dimension}
                  className="p-4 rounded-lg border border-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {DIMENSION_LABELS[dim.dimension]}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {DIMENSION_DESCRIPTIONS[dim.dimension]}
                      </p>
                    </div>
                    <EvidenceTag type={dim.evidenceType} />
                  </div>
                  <ScoreBar score={dim.score} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {dim.explanation}
                  </p>
                  {dim.supportingEvidence && (
                    <p className="text-xs text-muted-foreground italic">
                      Evidence: {dim.supportingEvidence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 space-y-3">
              <h3 className="font-semibold text-sm text-amber-800">
                Uncertainties
              </h3>
              <ul className="space-y-2">
                {evaluation.uncertainties.map((u, i) => (
                  <li key={i} className="text-sm text-amber-700 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-3">
              <h3 className="font-semibold text-sm text-red-800">
                Needs Validation
              </h3>
              <ul className="space-y-2">
                {evaluation.needsValidation.map((v, i) => (
                  <li key={i} className="text-sm text-red-700 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-400">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <Link
              href={`/discover/${sessionId}/compare`}
              className="px-6 py-3 rounded-lg font-medium border border-border text-muted-foreground hover:bg-muted transition-colors text-center text-sm"
            >
              Compare All Opportunities
            </Link>
            <Link
              href={`/discover/${sessionId}/concept`}
              className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center text-sm"
            >
              Generate Product Concept
            </Link>
          </div>
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
        <div className="flex items-center gap-4 ml-auto">
          <Link href="/workspace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            My Opportunities
          </Link>
          {sessionId && (
            <span className="text-xs text-muted-foreground">
              Session: {sessionId.slice(0, 8)}...
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
