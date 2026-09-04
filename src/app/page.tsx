"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                OL
              </span>
            </div>
            <span className="font-semibold text-lg">Opportunity Lab</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Find the next big
              <br />
              <span className="text-primary">problem worth solving</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Enter a topic or market. Opportunity Lab researches the space,
              surfaces real problems, and shows you the evidence behind each
              opportunity.
            </p>
          </div>

          <button
            onClick={() => router.push("/discover")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-medium text-base hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Discover Opportunities
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-4 h-4 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm mb-1">AI Research</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter any topic and let AI discover the hidden problems in that
                space.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-4 h-4 text-accent-foreground"
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
              </div>
              <h3 className="font-medium text-sm mb-1">Evidence-Based</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every problem is backed by evidence, inferences, and clearly
                marked assumptions.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-4 h-4 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm mb-1">Select & Explore</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pick the problem that resonates and prepare for the next step.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 px-6">
        <div className="max-w-5xl mx-auto text-center text-xs text-muted-foreground">
          Opportunity Lab — AI-powered problem discovery
        </div>
      </footer>
    </div>
  );
}
