"use client";

import Section from "./Section";

export default function ResearchFocus() {
  return (
    <Section id="research" index="02" title="Research Focus">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <p className="mono text-xs uppercase leading-relaxed tracking-[0.2em] text-fg-dim">
          FEM × Machine Learning
        </p>

        <p className="max-w-2xl text-2xl leading-snug tracking-tight text-fg sm:text-3xl">
          Training neural networks on finite-element simulation data to predict
          structural and material behavior — bridging classical FEM with
          <span className="text-fg-muted">
            {" "}
            data-driven inference, the foundation of modern structural digital
            twins.
          </span>
        </p>
      </div>
    </Section>
  );
}
