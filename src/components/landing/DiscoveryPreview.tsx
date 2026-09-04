import { PROBLEMS } from "./mock";
import { ArrowRight, Container, Eyebrow, VerticalLines, cx } from "./primitives";

export function DiscoveryPreview() {
  return (
    <section className="border-b border-nudge-line bg-nudge-surface">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow>The discovery experience</Eyebrow>
              <h2 className="mt-4 max-w-xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-nudge-ink">
                A topic in. Problems out. Each one with its evidence.
              </h2>
            </div>
            <div className="md:col-span-5 md:pb-1">
              <p className="text-sm leading-relaxed text-nudge-ink-2">
                Select a problem to expand its context, the people affected, and why
                it matters — then continue into evaluation.
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden border border-nudge-line bg-white">
            <div className="flex items-center justify-between border-b border-nudge-line-soft bg-nudge-surface px-5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nudge-ink-2">
                Discovered problems
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                Session · Personal finance
              </span>
            </div>

            <div className="grid md:grid-cols-12">
              <div className="space-y-3 border-b border-nudge-line-soft p-5 md:col-span-7 md:border-b-0 md:border-r">
                {PROBLEMS.map((problem) => (
                  <div
                    key={problem.id}
                    className={cx(
                      "border p-4",
                      problem.selected ? "border-nudge-primary" : "border-nudge-line"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-snug text-nudge-ink">
                        {problem.title}
                      </p>
                      {problem.selected && (
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-nudge-primary">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nudge-ink-2">
                      <span>
                        <span className="font-medium text-nudge-ink-2">Who:</span>{" "}
                        {problem.who}
                      </span>
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:inline">
                        {problem.evidence} ev · {problem.interpretation} inf ·{" "}
                        {problem.assumptions} as
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-nudge-line-soft pt-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-nudge-ink-2">
                        High confidence
                      </span>
                      <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-nudge-ink-2">
                        <span>Explore</span>
                        <span className="text-nudge-primary">Select</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-nudge-surface p-5 md:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                  Problem detail
                </p>
                <p className="mt-3 text-sm font-semibold leading-snug text-nudge-ink">
                  Recurring subscription charges are spread across separate apps and
                  providers, so people lose track of them.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-nudge-ink-2">
                  Who: consumers managing household budgets. Why: charges accumulate
                  silently and cancelling requires finding each one.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-primary">
                      Evidence
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-nudge-surface-2" />
                        <div className="h-2 w-10/12 bg-nudge-surface-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-nudge-surface-2" />
                        <div className="h-2 w-8/12 bg-nudge-surface-2" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                      Interpretation
                    </p>
                    <div className="mt-2 h-2 w-3/4 bg-nudge-surface-2" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                      Assumptions
                    </p>
                    <div className="mt-2 h-2 w-1/2 bg-nudge-surface-2" />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 border-t border-nudge-line-soft pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                  Next · Evaluate opportunity
                  <ArrowRight className="h-3.5 w-3.5 text-nudge-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}