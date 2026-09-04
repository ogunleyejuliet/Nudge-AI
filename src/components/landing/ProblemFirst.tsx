import { ArrowRight, Container, Eyebrow, VerticalLines } from "./primitives";

const PATH = ["Topic", "Problem", "Evidence", "Opportunity", "Product"];

export function ProblemFirst() {
  return (
    <section className="border-b border-nudge-line bg-white">
      <Container className="relative py-16 md:py-24">
        <VerticalLines />
        <div className="relative grid gap-12 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-7 md:pr-10">
            <Eyebrow>Problem first</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.1rem,4.8vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-nudge-ink">
              DON&apos;T START WITH
              <br />
              THE PRODUCT.
              <br />
              START WITH THE PROBLEM.
            </h2>
          </div>

          <div className="md:col-span-5 md:border-l md:border-nudge-line md:pl-10">
            <p className="text-base leading-relaxed text-nudge-ink-2">
              Most teams begin with an app idea and only later discover whether the
              underlying problem is meaningful.
            </p>
            <p className="mt-4 text-base leading-relaxed text-nudge-ink-2">
              Nudge AI reverses that process. You begin with a space you care about,
              and the research shows you what&apos;s actually missing.
            </p>
            <div className="mt-8 border-t border-nudge-line pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-nudge-ink-2">
                The path
              </p>
              <ol className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-nudge-ink">
                {PATH.map((stage, index) => (
                  <li key={stage} className="flex items-center gap-2">
                    {index > 0 && (
                      <ArrowRight className="h-3.5 w-3.5 text-nudge-primary" />
                    )}
                    <span>{stage}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}