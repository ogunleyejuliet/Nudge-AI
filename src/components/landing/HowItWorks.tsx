import { Container, Eyebrow, VerticalLines } from "./primitives";

const STEPS = [
  {
    num: "01",
    label: "Discover",
    copy: "Choose a topic or market you're interested in and uncover potential problems within it.",
  },
  {
    num: "02",
    label: "Evaluate",
    copy: "Explore the problem, review supporting evidence, and understand whether the opportunity is worth investigating.",
  },
  {
    num: "03",
    label: "Define",
    copy: "Turn a selected problem into a structured product concept.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-b border-nudge-line bg-white">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative">
          <Eyebrow>Method</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-nudge-ink">
            How Nudge works
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="border-t border-nudge-line pt-6 md:border-t-0 md:border-l md:border-nudge-line md:px-8 md:py-0 md:first:border-l-0 md:first:pl-0"
              >
                <span className="text-[48px] font-medium leading-none tracking-tight text-nudge-line">
                  {step.num}
                </span>
                <h3 className="mt-5 text-lg font-semibold uppercase tracking-[0.14em] text-nudge-ink">
                  {step.label}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-nudge-ink-2">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}