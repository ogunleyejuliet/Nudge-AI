"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRight, cx } from "./primitives";

export function PrimaryButton({
  children = "Find Opportunities",
  size = "md",
  className,
}: {
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/discover")}
      className={cx(
        "group inline-flex items-center gap-1.5 bg-nudge-primary font-medium text-white transition-colors hover:bg-nudge-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nudge-primary cursor-pointer",
        size === "sm"
          ? "px-5 py-2.5 text-sm"
          : size === "lg"
            ? "px-8 py-3.5 text-base"
            : "px-7 py-3 text-sm",
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}