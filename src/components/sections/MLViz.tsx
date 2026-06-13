"use client";

import dynamic from "next/dynamic";
import Section from "@/components/sections/Section";

const CNNViz = dynamic(() => import("@/components/CNNViz"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="mono text-[13px] text-fg-muted">loading viz…</span>
    </div>
  ),
});

export default function MLViz() {
  return (
    <Section id="ml" title="ML Surrogate for Mechanics" index="04">
      <p className="max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        CNN and ANN surrogate models learn structural and material behavior
        directly from finite-element simulation data. Once trained, they bridge
        the gap between full FE solves and near-instant prediction — the same
        reduced-order spirit, driven by learned features instead of hand-built
        bases.
      </p>

      <div className="card mt-10 min-h-[440px] overflow-hidden p-0 md:min-h-[560px]">
        <div className="h-[440px] w-full md:h-[560px]">
          <CNNViz />
        </div>
      </div>

      <div className="mono mt-4 flex flex-wrap items-center justify-between gap-4 text-[13px] text-fg-muted">
        <span>Input RVE → convolutions → predicted field</span>
        <span className="inline-flex items-center gap-2">
          low
          <span
            className="inline-block h-2 w-28 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--v0), var(--v1), var(--v2), var(--v3), var(--v4))",
            }}
            aria-hidden="true"
          />
          high
        </span>
      </div>
    </Section>
  );
}
