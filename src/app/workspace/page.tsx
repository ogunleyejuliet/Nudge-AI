"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authHeaders } from "@/lib/auth";
import type { OpportunityListItem } from "@/lib/types";

export default function WorkspacePage() {
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/opportunities", { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setOpportunities(data);
    } catch {
      setError("Failed to load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      setConfirmDeleteId(null);
    } catch {
      setError("Failed to delete opportunity. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function scoreColor(score: number): string {
    if (score >= 7) return "text-success";
    if (score >= 5) return "text-warning";
    return "text-danger";
  }

  function statusBadge(status: string): { label: string; className: string } {
    switch (status) {
      case "defined":
        return { label: "Defined", className: "bg-primary/10 text-primary" };
      case "selected":
        return { label: "Selected", className: "bg-success/10 text-success" };
      case "exploring":
        return { label: "Exploring", className: "bg-warning/10 text-warning" };
      default:
        return { label: status, className: "bg-muted text-muted-foreground" };
    }
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
                <span className="text-primary-foreground font-bold text-sm">OL</span>
              </div>
              <span className="font-semibold text-lg">Opportunity Lab</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/discover"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              New Discovery
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">My Opportunities</h1>
            <p className="text-muted-foreground text-sm">
              Saved opportunities you can revisit, refine, and continue working on.
            </p>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12 border border-danger/20 rounded-lg bg-danger/5">
              <p className="text-danger font-medium mb-3">{error}</p>
              <button
                onClick={loadOpportunities}
                className="text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && opportunities.length === 0 && (
            <div className="text-center py-16 border border-border rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">No saved opportunities yet</h2>
              <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                Start a discovery to find your next big opportunity. When you generate a product concept, you can save it here.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
              >
                Start Discovering
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}

          {!loading && !error && opportunities.length > 0 && (
            <div className="space-y-4">
              {opportunities.map((opp) => {
                const badge = statusBadge(opp.status);
                return (
                  <div
                    key={opp.id}
                    className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-lg font-semibold truncate">{opp.conceptName}</h2>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {opp.conceptOneLiner}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Problem: {opp.problemTitle}</span>
                          <span>Topic: {opp.topic}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            Updated {new Date(opp.updatedAt).toLocaleDateString()}
                          </span>
                          <span className={scoreColor(opp.overallScore)}>
                            Score: {opp.overallScore.toFixed(1)}/10 — {opp.overallLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/workspace/${opp.id}`}
                          className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Open
                        </Link>

                        {confirmDeleteId === opp.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(opp.id)}
                              disabled={deletingId === opp.id}
                              className="px-3 py-2 text-sm font-medium bg-danger text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                              {deletingId === opp.id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(opp.id)}
                            className="px-3 py-2 text-sm font-medium text-danger border border-danger/20 rounded-lg hover:bg-danger/5"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
