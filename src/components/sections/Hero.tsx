"use client";

import { profile } from "@/lib/data";

const LINKS: { label: string; href: string; external: boolean }[] = [
  { label: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: "GitHub", href: profile.links.github, external: true },
  { label: "LinkedIn", href: profile.links.linkedin, external: true },
  { label: "ResearchGate", href: profile.links.researchgate, external: true },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center px-6 pt-28 pb-20 md:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* asymmetric: content hugs the left, right stays open for the canvas */}
        <div className="max-w-4xl">
          <p className="mono mb-6 text-xs uppercase tracking-[0.3em] text-fg-muted">
            {profile.role}
          </p>

          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-fg sm:text-7xl lg:text-8xl">
            {profile.name}
          </h1>

          <div className="scrim mt-10 max-w-xl">
            <p className="text-base leading-relaxed text-fg-muted sm:text-lg">
              {profile.tagline}
            </p>
          </div>

          <div className="mono mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`ul py-1 ${
                  l.external ? "text-fg-muted hover:text-fg" : "text-fg"
                }`}
                {...(l.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.label}
                {l.external ? " ↗" : ""}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <a
        href="#about"
        className="mono absolute bottom-8 left-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-fg-dim transition-colors hover:text-fg-muted md:left-10"
      >
        <span>Scroll</span>
        <svg
          width="12"
          height="22"
          viewBox="0 0 12 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="M6 0v20M1 15l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
