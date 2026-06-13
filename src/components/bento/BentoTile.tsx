import type { ReactNode } from "react";

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12;

export interface BentoTileProps {
  children: ReactNode;
  /** column span on desktop (out of 12) */
  col?: Span;
  /** row span (tile height units) */
  row?: 1 | 2 | 3;
  className?: string;
  /** subtle accent corner glow */
  accent?: boolean;
  as?: "div" | "section" | "article" | "a";
  href?: string;
  id?: string;
  ariaLabel?: string;
}

const colClass: Record<Span, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

const rowClass: Record<1 | 2 | 3, string> = {
  1: "row-span-1",
  2: "md:row-span-2",
  3: "md:row-span-3",
};

export default function BentoTile({
  children,
  col = 4,
  row = 1,
  className = "",
  accent = false,
  as = "div",
  href,
  id,
  ariaLabel,
}: BentoTileProps) {
  const Comp = (href ? "a" : as) as "div";
  return (
    <Comp
      id={id}
      {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined } : {})}
      aria-label={ariaLabel}
      className={[
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 md:p-8",
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        href ? "cursor-pointer hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--border))] hover:-translate-y-0.5" : "",
        colClass[col],
        rowClass[row],
        className,
      ].join(" ")}
    >
      {accent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl"
          style={{ background: "var(--accent)" }}
        />
      )}
      {children}
    </Comp>
  );
}
