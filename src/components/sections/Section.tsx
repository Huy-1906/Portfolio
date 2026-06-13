"use client";

import { useReveal } from "./useReveal";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
  /** Wrap content in `.scrim` for legibility over the 3D canvas. */
  scrim?: boolean;
};

/**
 * Reusable section wrapper: generous vertical rhythm, asymmetric max-width,
 * a mono numbered label `{index} / {TITLE}` with a short hairline rule.
 */
export default function Section({
  id,
  index,
  title,
  children,
  scrim = true,
}: SectionProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id={id}
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <header className="mb-12 flex items-baseline gap-5 md:mb-16">
        <span className="mono text-xs text-fg-dim tabular-nums">{index}</span>
        <span aria-hidden className="h-px w-8 shrink-0 bg-line md:w-12" />
        <h2 className="mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          {title}
        </h2>
      </header>

      <div ref={ref} className={`reveal ${scrim ? "scrim" : ""}`}>
        {children}
      </div>
    </section>
  );
}
