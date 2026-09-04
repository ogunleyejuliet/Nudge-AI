import { Container, Eyebrow, VerticalLines } from "./primitives";

const AUDIENCES = [
  {
    num: "01",
    label: "Founders",
    copy: "Explore markets and identify problems worth investigating before investing in a product.",
  },
  {
    num: "02",
    label: "Product designers",
    copy: "Turn problem discovery into clearer product opportunities and product concepts.",
  },
  {
    num: "03",
    label: "Developers",
    copy: "Move from \"I want to build something\" to a more structured problem and product direction.",
  },
];

export function Audience() {
  return (
    <section id="audience" className="scroll-mt-20 border-b border-nudge-line bg-white">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative">
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-nudge-ink">
            Built for people who build.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.num}
                className="border-t border-nudge-line pt-6 md:border-t-0 md:border-l md:border-nudge-line md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
              >
                <span className="font-mono text-[11px] text-nudge-ink-2">
                  {audience.num}
                </span>
                <h3 className="mt-4 text-lg font-semibold uppercase tracking-[0.12em] text-nudge-ink">
                  {audience.label}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-nudge-ink-2">
                  {audience.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}