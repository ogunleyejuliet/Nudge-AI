"use client";

import { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { CloseIcon, Container, MenuIcon, Wordmark } from "./primitives";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#audience", label: "Who it's for" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-nudge-line bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />

        <nav aria-label="Landing" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-nudge-ink-2 transition-colors hover:text-nudge-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <PrimaryButton size="sm">Start Exploring</PrimaryButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center border border-nudge-line text-nudge-ink transition-colors hover:border-nudge-primary md:hidden cursor-pointer"
        >
          {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-nudge-line bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-nudge-line-soft py-3 text-sm text-nudge-ink-2 transition-colors hover:text-nudge-ink"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <PrimaryButton className="w-full justify-center">Start Exploring</PrimaryButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}