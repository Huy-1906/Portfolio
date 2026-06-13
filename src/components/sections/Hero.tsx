"use client";

import dynamic from "next/dynamic";
import { profile } from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";

const HeroScene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});

/** Static viridis poster — shown when motion is reduced or WebGL is absent. */
function ViridisPoster() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-70"
      style={{
        background:
          "radial-gradient(120% 120% at 65% 45%, var(--v4) 0%, var(--v3) 22%, var(--v2) 46%, var(--v1) 70%, var(--v0) 100%)",
        maskImage:
          "radial-gradient(85% 85% at 60% 50%, #000 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(85% 85% at 60% 50%, #000 55%, transparent 100%)",
      }}
    />
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupported();
  const showCanvas = webgl && !reduced;

  return (
    <section
      id="top"
      className="relative flex min-h-dvh items-center overflow-hidden bg-bg text-fg"
    >
      {/* RIGHT zone — FE viewport. Behind text on mobile, ~60% on desktop. */}
      <div className="pointer-events-none absolute inset-0 md:left-auto md:w-[60%]">
        {showCanvas ? <HeroScene /> : <ViridisPoster />}
        {/* Legibility scrim toward the text column on small screens. */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent md:from-bg/40 md:via-transparent" />
      </div>

      {/* LEFT zone — text, ~40% on desktop, vertically centered. */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl px-6">
        <div className="flex max-w-xl flex-col gap-5 py-24 md:w-[44%] md:py-0">
          <h1 className="text-5xl font-bold tracking-tight text-fg md:text-6xl">
            {profile.name}
          </h1>

          <p className="text-xl text-fg-muted">{profile.role}</p>

          <p className="mono text-[13px] tracking-tight text-accent">
            FEM · reduced-order · CNN/ANN surrogates · agentic RAG
          </p>

          <p className="max-w-prose text-base leading-relaxed text-fg-muted">
            {profile.tagline}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5"
            >
              View work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#work"
        aria-label="Scroll to work"
        className="mono absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-fg-muted transition-colors hover:text-accent"
      >
        scroll ↓
      </a>
    </section>
  );
}
