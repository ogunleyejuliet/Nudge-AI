import { PrimaryButton } from "./PrimaryButton";
import { Container, HatchPattern } from "./primitives";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-nudge-line bg-[#090909] text-white">
      <HatchPattern stroke="#FFFFFF" opacity={0.05} />
      <Container className="relative py-20 md:py-28">
        <div className="relative max-w-3xl">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            <span className="inline-block h-1.5 w-1.5 bg-nudge-primary" />
            What&apos;s next
          </p>
          <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.04] tracking-tight">
            YOUR NEXT PRODUCT
            <br />
            COULD START WITH
            <br />
            A BETTER PROBLEM.
          </h2>
          <div className="mt-6 h-[3px] w-12 bg-nudge-primary" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            Explore a space. Find a problem. Discover what you could build.
          </p>
          <div className="mt-9">
            <PrimaryButton size="lg">Explore Opportunities</PrimaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}