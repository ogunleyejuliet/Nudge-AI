"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { authHeaders } from "@/lib/auth";
import { REFINABLE_SECTIONS } from "@/lib/types";
import type { ProductConcept, EvaluationWithDetails } from "@/lib/types";

interface OpportunityDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sessionId: string;
  topic: string;
  status: string;
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
  evaluation: EvaluationWithDetails;
  concept: ProductConcept;
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refiningSection, setRefiningSection] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/opportunities/${id}`, { headers: authHeaders() });
        if (!res.ok) {
          if (res.status === 404) {
            setError("Opportunity not found. It may have been deleted.");
          } else {
            throw new Error("Failed to load");
          }
          return;
        }
        const data = await res.json();
        data.createdAt = new Date(data.createdAt);
        data.updatedAt = new Date(data.updatedAt);
        setOpp(data);
      } catch {
        setError("Failed to load opportunity. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function handleRefine(section: string) {
    if (!opp) return;
    setRefiningSection(section);
    setRefineError(null);

    try {
      const res = await fetch(`/api/opportunities/${opp.id}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ section }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Refinement failed");
      }

      const updated = await res.json();
      updated.createdAt = new Date(updated.createdAt);
      updated.updatedAt = new Date(updated.updatedAt);
      setOpp(updated);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setRefiningSection(null);
    }
  }

  function scoreColor(score: number): string {
    if (score >= 7) return "text-success";
    if (score >= 5) return "text-warning";
    return "text-danger";
  }

  function strengthTypeColor(type: string): string {
    switch (type) {
      case "evidence": return "bg-success/10 text-success";
      case "inference": return "bg-warning/10 text-warning";
      case "assumption": return "bg-danger/10 text-danger";
      default: return "bg-muted text-muted-foreground";
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OL</span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6">
                  <div className="h-5 bg-muted rounded w-1/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OL</span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="max-w-5xl mx-auto text-center py-16">
            <h2 className="text-lg font-semibold mb-2">Opportunity not found</h2>
            <p className="text-muted-foreground text-sm mb-4">{error || "This opportunity may have been deleted."}</p>
            <Link href="/workspace" className="text-sm text-primary hover:underline">
              Back to My Opportunities
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const concept = opp.concept;
  const evalData = opp.evaluation;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OL</span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My Opportunities
            </Link>
            <Link href="/discover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              New Discovery
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/workspace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Opportunities
              </Link>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-muted-foreground">Opportunity</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">{concept.name}</h1>
            <p className="text-lg text-muted-foreground">{concept.oneLiner}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Topic: <span className="font-medium text-foreground">{opp.topic}</span></span>
              <span>Updated: {new Date(opp.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {refineError && (
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4 flex items-center justify-between">
              <span className="text-danger text-sm">{refineError}</span>
              <button onClick={() => setRefineError(null)} className="text-danger hover:underline text-sm">
                Dismiss
              </button>
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Problem</h2>
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">{opp.problem.title}</h3>
              <p className="text-muted-foreground text-sm">{opp.problem.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1">Affected Users</h4>
                  <p className="text-sm text-muted-foreground">{opp.problem.affectedUsers}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1">Why It Matters</h4>
                  <p className="text-sm text-muted-foreground">{opp.problem.whyItMatters}</p>
                </div>
              </div>
            </div>
          </section>

          {opp.evidence.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Evidence</h2>
              <div className="space-y-3">
                {opp.evidence.map((ev, i) => (
                  <div key={i} className="border border-success/20 rounded-lg p-4 bg-success/5">
                    <p className="text-sm mb-2">{ev.content}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-medium">Source: {ev.source}</span>
                      <span className={`px-2 py-0.5 rounded-full ${strengthTypeColor(ev.strength)}`}>
                        {ev.strength} strength
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {opp.evidence.length === 0 && (
            <section className="border border-border rounded-lg p-6 text-center">
              <p className="text-muted-foreground text-sm">No evidence data available.</p>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Evaluation</h2>
            <div className="border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className={`text-4xl font-bold ${scoreColor(evalData.overallScore)}`}>
                  {evalData.overallScore.toFixed(1)}
                </div>
                <div>
                  <p className="font-semibold">{evalData.overallLabel}</p>
                  <p className="text-sm text-muted-foreground">{evalData.overallExplanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evalData.dimensions.map((dim) => (
                  <div key={dim.dimension} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{dim.label}</span>
                      <span className={scoreColor(dim.score)}>{dim.score}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${dim.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Product Blueprint</h2>

            {[
              { key: "targetUsers", label: "Target Users", value: concept.targetUsers, type: "string" as const },
              { key: "userNeeds", label: "User Needs", value: concept.userNeeds, type: "array" as const },
              { key: "proposedSolution", label: "Proposed Solution", value: concept.proposedSolution, type: "string" as const },
              { key: "valueProposition", label: "Value Proposition", value: concept.valueProposition, type: "string" as const },
              { key: "coreFeatures", label: "Core Features", value: concept.coreFeatures, type: "array" as const },
              { key: "mvpFeatures", label: "MVP Features", value: concept.mvpFeatures, type: "array" as const },
              { key: "userJourney", label: "User Journey", value: concept.userJourney, type: "array" as const },
              { key: "businessModel", label: "Business Model", value: concept.businessModel, type: "string" as const },
              { key: "majorRisks", label: "Major Risks", value: concept.majorRisks, type: "array" as const },
            ].map((section) => (
              <div key={section.key} className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{section.label}</h3>
                  {section.key in REFINABLE_SECTIONS && (
                    <button
                      onClick={() => handleRefine(section.key)}
                      disabled={refiningSection === section.key}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover disabled:opacity-50 transition-colors"
                    >
                      {refiningSection === section.key ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Refining...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Refine
                        </>
                      )}
                    </button>
                  )}
                </div>
                {section.type === "string" ? (
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{section.value as string}</p>
                ) : (
                  <ul className="space-y-2">
                    {(section.value as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {concept.excludedFromMvp.length > 0 && (
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Excluded from MVP</h3>
                <ul className="space-y-2">
                  {concept.excludedFromMvp.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-danger mt-1 shrink-0">×</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {concept.keyAssumptions.length > 0 && (
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Key Assumptions</h3>
                <ul className="space-y-2">
                  {concept.keyAssumptions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-warning mt-1 shrink-0">?</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {concept.validationQuestions.length > 0 && (
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Validation Questions</h3>
                <ul className="space-y-2">
                  {concept.validationQuestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-danger mt-1 shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
