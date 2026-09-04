import { Container, VerticalLines } from "./primitives";

const CATEGORIES = [
  {
    label: "Evidence",
    copy: "What is observable or sourced — the passages behind each problem.",
  },
  {
    label: "AI interpretation",
    copy: "Inferences the model draws from that evidence, kept separate from it.",
  },
  {
    label: "Assumptions",
    copy: "Marked explicitly, so you know what isn't verified yet.",
  },
];

export function Evidence() {
  return (
    <section className="border-b border-nudge-line bg-nudge-surface">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative grid gap-10 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-6 md:pr-10">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-nudge-ink-2">
              <span className="inline-block h-1.5 w-1.5 bg-nudge-primary" />
              Evidence, interpretation, assumptions
            </p>
            <h2 className="mt-6 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] tracking-tight text-nudge-ink">
              AI SHOULD HELP YOU INVESTIGATE.
              <br />
              NOT PRETEND TO KNOW.
            </h2>
          </div>

          <div className="md:col-span-6 md:border-l md:border-nudge-line md:pl-10">
            <div className="divide-y divide-nudge-line border-y border-nudge-line">
              {CATEGORIES.map((category) => (
                <div key={category.label} className="py-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-nudge-ink">
                    {category.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-nudge-ink-2">
                    {category.copy}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-md text-[11px] leading-relaxed text-nudge-ink-2">
              Nudge doesn&apos;t validate a business or guarantee an opportunity — it
              helps you see what&apos;s known, what&apos;s inferred, and what&apos;s assumed.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}