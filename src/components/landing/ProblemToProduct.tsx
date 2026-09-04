import { ArrowRight, Container, Eyebrow, VerticalLines } from "./primitives";

const STAGES = [
  {
    num: "01",
    label: "Problem",
    title: "The raw struggle",
    copy: "What people can't do today — the context, the people affected, and why it matters.",
  },
  {
    num: "02",
    label: "Opportunity",
    title: "Worth solving?",
    copy: "Weigh the evidence and see whether the problem is meaningful enough to pursue.",
  },
  {
    num: "03",
    label: "Product Concept",
    title: "A direction",
    copy: "A structured product concept you can build toward instead of guessing.",
  },
];

export function ProblemToProduct() {
  return (
    <section className="border-b border-nudge-line bg-white">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative">
          <Eyebrow>From problem to product</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-nudge-ink">
            Evaluate the problem, then shape it into something you can build.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
            {STAGES.map((stage, index) => (
              <div
                key={stage.num}
                className="border-t border-nudge-line pt-6 md:border-t-0 md:border-l md:border-nudge-line md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center border border-nudge-secondary font-mono text-[11px] text-nudge-secondary">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-nudge-ink">
                    {stage.label}
                  </span>
                  {index < STAGES.length - 1 && (
                    <ArrowRight className="ml-auto h-4 w-4 text-nudge-primary md:hidden" />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-nudge-ink">
                  {stage.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-nudge-ink-2">
                  {stage.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}