import type { ReactNode, SVGProps } from "react";
import Link from "next/link";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Container({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cx("mx-auto w-full max-w-[1120px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function VerticalLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-5 right-5 hidden md:flex sm:left-8 sm:right-8"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-full flex-1 border-l border-nudge-line-soft last:border-r" />
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-nudge-ink-2">
      <span className="inline-block h-1.5 w-1.5 bg-nudge-primary" />
      {children}
    </p>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center bg-nudge-primary">
        <span className="text-sm font-bold leading-none text-white">N</span>
      </span>
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-nudge-ink">
        Nudge AI
      </span>
    </Link>
  );
}

export function HatchPattern({
  stroke = "#D0D0D0",
  opacity = 0.35,
  className,
}: {
  stroke?: string;
  opacity?: number;
  className?: string;
}) {
  const encoded = `%23${stroke.replace("#", "")}`;
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpath d='M0 22L22 0' stroke='${encoded}' stroke-width='1' fill='none' opacity='${opacity}'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 12L12 4M6 4h6v6" />
    </svg>
  );
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3 8h10M9.5 3.5L14 8l-4.5 4.5" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l4 4" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3 8.5l3.5 3L13 4.5" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M2 4h12M2 8h12M2 12h12" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}