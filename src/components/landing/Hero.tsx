import { PrimaryButton } from "./PrimaryButton";
import { ProductPreview } from "./ProductPreview";
import { ArrowRight, Container, Eyebrow, HatchPattern, VerticalLines } from "./primitives";

const PIPELINE = ["Topic", "Problem", "Evidence", "Opportunity", "Product Concept"];

function PipelineCard() {
  return (
    <div className="relative overflow-hidden border border-nudge-line bg-nudge-surface">
      <HatchPattern opacity={0.14} />
      <div className="relative p-6">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-nudge-ink-2">
          <span className="inline-block h-1.5 w-1.5 bg-nudge-primary" />
          Research pipeline
        </p>
        <ol className="mt-4">
          {PIPELINE.map((stage, index) => (
            <li
              key={stage}
              className="flex items-center gap-3 border-b border-nudge-line-soft py-3 last:border-b-0"
            >
              <span className="font-mono text-[11px] text-nudge-ink-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium tracking-wide text-nudge-ink">
                {stage}
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-nudge-primary" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="border-b border-nudge-line bg-white">
      <Container className="relative pt-20 md:pt-28">
        <VerticalLines />
        <div className="relative grid gap-12 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-7 md:pr-12">
            <Eyebrow>AI-powered problem discovery</Eyebrow>
            <h1 className="mt-6 text-[clamp(2.75rem,6vw,4rem)] font-semibold leading-[1.02] tracking-tight text-nudge-ink">
              FIND PROBLEMS
              <br />
              WORTH BUILDING FOR.
            </h1>
            <div className="mt-6 h-[3px] w-12 bg-nudge-primary" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-nudge-ink-2 md:text-lg">
              Nudge AI helps you explore a space, discover problems, investigate the
              evidence, and turn promising opportunities into product concepts.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PrimaryButton size="lg">Find Opportunities</PrimaryButton>
              <a
                href="#how"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-nudge-ink transition-colors hover:text-nudge-primary"
              >
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-medium uppercase tracking-[0.16em] text-nudge-ink-2">
              <span>01 · Start with a topic</span>
              <span className="hidden text-nudge-line sm:inline">/</span>
              <span>02 · Find a problem</span>
              <span className="hidden text-nudge-line sm:inline">/</span>
              <span>03 · Explore the evidence</span>
            </div>
          </div>

          <div className="md:col-span-5">
            <PipelineCard />
          </div>
        </div>
      </Container>

      <Container className="relative pb-16 pt-12 md:pb-24 md:pt-16">
        <VerticalLines />
        <div className="relative md:px-24">
          <ProductPreview />
        </div>
      </Container>
    </section>
  );
}