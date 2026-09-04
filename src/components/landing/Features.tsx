import { Container, Eyebrow, VerticalLines } from "./primitives";

const FEATURES = [
  {
    num: "01",
    title: "Problem Discovery",
    copy: "Find potential problems within a topic instead of receiving random startup ideas.",
  },
  {
    num: "02",
    title: "Problem Exploration",
    copy: "Expand a problem to understand the context and affected users.",
  },
  {
    num: "03",
    title: "Evidence",
    copy: "Review evidence supporting discovered problems.",
  },
  {
    num: "04",
    title: "Opportunity Evaluation",
    copy: "Assess an opportunity before deciding what to build.",
  },
  {
    num: "05",
    title: "Product Concept",
    copy: "Turn a selected problem into a structured product concept.",
  },
  {
    num: "06",
    title: "Refinement",
    copy: "Improve individual sections of a concept rather than regenerating everything.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-nudge-line bg-white">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative">
          <Eyebrow>Core features</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-nudge-ink">
            Everything you need to go from curiosity to concept.
          </h2>
          <div className="mt-12 grid gap-px border border-nudge-line bg-nudge-line md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.num} className="bg-white p-6 md:p-8">
                <span className="font-mono text-[11px] text-nudge-ink-2">
                  {feature.num}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-wide text-nudge-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-nudge-ink-2">
                  {feature.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}