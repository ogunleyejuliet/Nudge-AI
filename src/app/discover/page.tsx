"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SUGGESTED_TOPICS = [
  "Personal finance",
  "Small businesses",
  "Fitness & wellness",
  "Education & learning",
  "Remote work",
  "Mental health",
];

export default function DiscoverPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setError("Please enter a topic");
      return;
    }

    setError(null);
    setIsResearching(true);

    try {
      const response = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Research failed");
      }

      if (data.status === "completed" && data.sessionId) {
        router.push(`/discover/${data.sessionId}`);
      } else {
        throw new Error(data.error || "No problems found for this topic");
      }
    } catch (err) {
      setIsResearching(false);
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setError(null);
  };

  if (isResearching) {
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
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  className="animate-spin w-8 h-8 text-primary"
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
              <h2 className="text-2xl font-bold">Researching &quot;{topic}&quot;</h2>
              <p className="text-muted-foreground">
                Our AI is analyzing the space to discover real problems and
                opportunities.
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground text-left max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg
                    className="animate-pulse w-3 h-3 text-primary"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                </div>
                <span>Identifying key challenges in the space</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg
                    className="animate-pulse w-3 h-3 text-primary"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                </div>
                <span>Gathering evidence and sources</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg
                    className="animate-pulse w-3 h-3 text-primary"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                </div>
                <span>Separating evidence from assumptions</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This typically takes 15-30 seconds.
            </p>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="max-w-lg w-full space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              What space do you want to explore?
            </h1>
            <p className="text-muted-foreground">
              Enter a topic, market, or industry. We&apos;ll research it and
              discover the real problems worth solving.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-foreground"
              >
                Topic or Market
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., personal finance, small businesses, fitness"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                maxLength={200}
                disabled={isResearching}
                autoFocus
              />
              {error && (
                <p className="text-sm text-danger">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResearching || !topic.trim()}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isResearching ? "Researching..." : "Start Discovery"}
            </button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Not sure where to start? Try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_TOPICS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
