import Link from "next/link";
import { Container, Wordmark } from "./primitives";

const LANDING_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#audience", label: "Who it's for" },
];

export function Footer() {
  return (
    <footer className="border-t border-nudge-line bg-white">
      <Container className="py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Wordmark />

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm">
            <nav aria-label="Product">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-nudge-ink-2">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/discover"
                    className="text-nudge-ink-2 transition-colors hover:text-nudge-ink"
                  >
                    New Discovery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="text-nudge-ink-2 transition-colors hover:text-nudge-ink"
                  >
                    My Opportunities
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Landing">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-nudge-ink-2">
                Landing
              </p>
              <ul className="mt-3 space-y-2">
                {LANDING_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-nudge-ink-2 transition-colors hover:text-nudge-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-nudge-line-soft pt-6 text-[11px] text-nudge-ink-2">
          <p>© {new Date().getFullYear()} Nudge AI</p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Research · Problems · Product thinking
          </p>
        </div>
      </Container>
    </footer>
  );
}