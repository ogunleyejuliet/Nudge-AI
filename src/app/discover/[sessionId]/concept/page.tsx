"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authHeaders } from "@/lib/auth";
import type { ProblemWithDetails } from "@/lib/types";

interface ProductConcept {
  name: string;
  oneLiner: string;
  problem: string;
  targetUsers: string;
  userNeeds: string[];
  proposedSolution: string;
  valueProposition: string;
  coreFeatures: string[];
  mvpFeatures: string[];
  excludedFromMvp: string[];
  userJourney: string[];
  businessModel: string;
  keyAssumptions: string[];
  validationQuestions: string[];
  majorRisks: string[];
}

interface ConceptData {
  id: string;
  problemId: string;
  sessionId: string;
  evaluationId: string;
  concept: ProductConcept;
}

function Section({
  title,
  children,
  icon,
  onRefine,
  refining,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onRefine?: () => void;
  refining?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/10 shrink-0">
          {icon}
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
        {onRefine && (
          <button
            onClick={onRefine}
            disabled={refining}
            className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover disabled:opacity-50 transition-colors"
          >
            {refining ? (
              <>
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Refining...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                Refine
              </>
            )}
          </button>
        )}
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

function TagList({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "default" | "green" | "amber" | "red" | "blue";
}) {
  const styles: Record<string, string> = {
    default: "border-border bg-muted/50",
    green: "border-emerald-200 bg-emerald-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    red: "border-red-200 bg-red-50/50",
    blue: "border-blue-200 bg-blue-50/50",
  };
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className={`text-sm rounded-lg border p-3 ${styles[variant]}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ConceptPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const [sessionId, setSessionId] = useState("");
  const [concept, setConcept] = useState<ConceptData | null>(null);
  const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedOppId, setSavedOppId] = useState<string | null>(null);
  const [refiningSection, setRefiningSection] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

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
          return;
        }
        setProblem(selected);

        // Try existing concept first
        const existingRes = await fetch(`/api/discover/${sid}/concept`);
        if (existingRes.ok) {
          const concepts = await existingRes.json();
          const existingConcept = concepts.find(
            (c: ConceptData) => c.problemId === selected.id
          );
          if (existingConcept) {
            setConcept(existingConcept);
            setLoading(false);
            return;
          }
        }

        // Generate new concept
        setGenerating(true);
        const genRes = await fetch(`/api/discover/${sid}/concept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId: selected.id }),
        });

        if (!genRes.ok) {
          const err = await genRes.json();
          throw new Error(err.error || "Failed to generate concept");
        }

        setConcept(await genRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    };
    init();
  }, [params]);

  async function handleSave() {
    if (!concept || !problem || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ sessionId, problemId: problem.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      const data = await res.json();
      setSaved(true);
      setSavedOppId(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save opportunity");
    } finally {
      setSaving(false);
    }
  }

  async function handleRefineSection(section: string) {
    if (!concept || !problem) return;
    setRefiningSection(section);
    setRefineError(null);
    try {
      const res = await fetch("/api/ai/refine-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          currentContent: concept.concept[section as keyof typeof concept.concept],
          problemTitle: problem.title,
          problemDescription: problem.description,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Refinement failed");
      }
      const { refined } = await res.json();
      setConcept((prev) => prev ? {
        ...prev,
        concept: { ...prev.concept, [section]: refined },
      } : prev);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setRefiningSection(null);
    }
  }

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
              {generating ? "Generating product concept..." : "Loading..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {generating
                ? "Creating a structured product strategy from the evaluated opportunity."
                : "Fetching concept data."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !concept) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header sessionId={sessionId} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {error || "Concept not available"}
            </h2>
            <Link
              href={`/discover/${sessionId}/evaluate`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Back to Evaluation
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const c = concept.concept;

  return (
    <div className="flex flex-col min-h-screen">
      <Header sessionId={sessionId} />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-3">
            <Link
              href={`/discover/${sessionId}/evaluate`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Evaluation
            </Link>

            <div className="p-6 rounded-xl border-2 border-primary/20 bg-primary/5">
              <h1 className="text-3xl font-bold text-primary">{c.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">{c.oneLiner}</p>
            </div>

            <p className="text-xs text-muted-foreground italic">
              This is an AI-generated product concept. It is a proposed direction, not a validated business plan.
              Key assumptions and validation questions are identified below.
            </p>
          </div>

          {problem && (
            <Section
              title="Problem"
              icon={
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c.problem || problem.description}
              </p>
            </Section>
          )}

          <Section
            title="Target Users"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            onRefine={() => handleRefineSection("targetUsers")}
            refining={refiningSection === "targetUsers"}
          >
            <p className="text-sm text-muted-foreground">{c.targetUsers}</p>
          </Section>

          <Section
            title="User Needs"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            onRefine={() => handleRefineSection("userNeeds")}
            refining={refiningSection === "userNeeds"}
          >
            <TagList items={c.userNeeds} variant="blue" />
          </Section>

          <Section
            title="Proposed Solution"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            onRefine={() => handleRefineSection("proposedSolution")}
            refining={refiningSection === "proposedSolution"}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.proposedSolution}
            </p>
          </Section>

          <Section
            title="Value Proposition"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            onRefine={() => handleRefineSection("valueProposition")}
            refining={refiningSection === "valueProposition"}
          >
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {c.valueProposition}
            </p>
          </Section>

          <Section
            title="Core Features"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
            onRefine={() => handleRefineSection("coreFeatures")}
            refining={refiningSection === "coreFeatures"}
          >
            <TagList items={c.coreFeatures} />
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section
              title="MVP Features"
              icon={
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
              onRefine={() => handleRefineSection("mvpFeatures")}
              refining={refiningSection === "mvpFeatures"}
            >
              <TagList items={c.mvpFeatures} variant="green" />
            </Section>
            <Section
              title="Excluded from MVP"
              icon={
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            >
              <TagList items={c.excludedFromMvp} variant="red" />
            </Section>
          </div>

          <Section
            title="User Journey"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
            onRefine={() => handleRefineSection("userJourney")}
            refining={refiningSection === "userJourney"}
          >
            <NumberedList items={c.userJourney} />
          </Section>

          <Section
            title="Business Model"
            icon={
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onRefine={() => handleRefineSection("businessModel")}
            refining={refiningSection === "businessModel"}
          >
            <p className="text-sm text-muted-foreground leading-relaxed p-4 rounded-lg border border-border bg-muted/30">
              {c.businessModel}
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section
              title="Key Assumptions"
              icon={
                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
            >
              <TagList items={c.keyAssumptions} variant="amber" />
            </Section>
            <Section
              title="Validation Questions"
              icon={
                <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <TagList items={c.validationQuestions} variant="red" />
            </Section>
          </div>

          <Section
            title="Major Risks"
            icon={
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            onRefine={() => handleRefineSection("majorRisks")}
            refining={refiningSection === "majorRisks"}
          >
            <TagList items={c.majorRisks} variant="red" />
          </Section>

          <div className="pt-6 border-t border-border space-y-4">
            {refineError && (
              <div className="bg-danger/5 border border-danger/20 rounded-lg p-4 flex items-center justify-between">
                <span className="text-danger text-sm">{refineError}</span>
                <button onClick={() => setRefineError(null)} className="text-danger hover:underline text-sm">
                  Dismiss
                </button>
              </div>
            )}

            {saved && (
              <div className="bg-success/5 border border-success/20 rounded-lg p-4 text-center">
                <p className="text-success font-medium text-sm">
                  Saved to My Opportunities!
                </p>
                {savedOppId && (
                  <Link
                    href={`/workspace/${savedOppId}`}
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    View in Workspace →
                  </Link>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground italic text-center">
              This product concept was generated by AI based on the problem evaluation.
              All proposed features, business models, and strategies need to be validated with real users and market research before proceeding.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {!saved ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors text-center text-sm"
                >
                  {saving ? "Saving..." : "Save to Workspace"}
                </button>
              ) : (
                <Link
                  href={`/workspace/${savedOppId}`}
                  className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center text-sm"
                >
                  Open in Workspace
                </Link>
              )}
              <Link
                href={`/discover/${sessionId}/compare`}
                className="px-6 py-3 rounded-lg font-medium border border-border text-muted-foreground hover:bg-muted transition-colors text-center text-sm"
              >
                Compare Opportunities
              </Link>
              <Link
                href="/discover"
                className="px-6 py-3 rounded-lg font-medium border border-border text-muted-foreground hover:bg-muted transition-colors text-center text-sm"
              >
                Start New Discovery
              </Link>
            </div>
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
