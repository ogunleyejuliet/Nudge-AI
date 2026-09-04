import { PROBLEMS, TOPICS } from "./mock";
import { cx } from "./primitives";

export function ProductPreview() {
  return (
    <div className="overflow-hidden border border-nudge-line bg-white">
      <div className="flex items-center justify-between border-b border-nudge-line-soft bg-nudge-surface px-5 py-2.5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nudge-ink-2">
          <span className="h-2 w-2 bg-nudge-primary" />
          Explore a space
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
          Discovery · Session
        </span>
      </div>

      <div className="grid md:grid-cols-12">
        <div className="md:col-span-7 md:border-r md:border-nudge-line-soft">
          <div className="border-b border-nudge-line-soft px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
              Topic
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <span
                  key={topic.label}
                  className={cx(
                    "border px-3 py-1.5 text-[11px] font-medium tracking-wide",
                    topic.selected
                      ? "border-nudge-primary text-nudge-primary"
                      : "border-nudge-line text-nudge-ink-2"
                  )}
                >
                  {topic.label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 px-5 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
              Discovered problems
            </p>
            {PROBLEMS.map((problem) => (
              <div
                key={problem.id}
                className={cx(
                  "border p-4 bg-white",
                  problem.selected
                    ? "border-nudge-primary bg-nudge-primary/[0.03]"
                    : "border-nudge-line"
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
                <p className="mt-2 text-xs text-nudge-ink-2">
                  Who: <span className="text-nudge-ink">{problem.who}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-nudge-ink-2">
                  <span>{problem.evidence} evidence</span>
                  <span>{problem.interpretation} interpretation</span>
                  <span>{problem.assumptions} assumptions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden flex-col bg-nudge-surface md:col-span-5 md:flex">
          <div className="border-b border-nudge-line-soft px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
              Selected problem
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-nudge-ink">
              People struggle to keep track of recurring subscriptions and charges
              across separate apps and providers.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-6 px-5 py-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                Evidence
              </p>
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-nudge-surface-2" />
                  <div className="h-2 w-11/12 bg-nudge-surface-2" />
                  <div className="h-2 w-2/3 bg-nudge-surface-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-nudge-surface-2" />
                  <div className="h-2 w-10/12 bg-nudge-surface-2" />
                </div>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                Interpretation
              </p>
              <div className="mt-3 h-2 w-3/4 bg-nudge-surface-2" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-nudge-ink-2">
                Assumptions
              </p>
              <div className="mt-3 h-2 w-1/2 bg-nudge-surface-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}