"use client";

import { experience } from "@/lib/data";
import Section from "./Section";

export default function Experience() {
  return (
    <Section id="experience" index="03" title="Experience">
      <ol className="space-y-14 md:space-y-20">
        {experience.map((e) => (
          <li
            key={e.role}
            className="grid gap-4 border-t border-line pt-8 md:grid-cols-[12rem_1fr] md:gap-10"
          >
            <div className="mono text-xs uppercase tracking-[0.15em] text-fg-dim">
              {e.period}
            </div>
            <div>
              <h3 className="text-lg font-medium text-fg sm:text-xl">
                {e.role}
              </h3>
              <p className="mono mt-1 text-xs text-fg-muted">{e.org}</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-fg-muted">
                {e.points.map((pt, i) => (
                  <li key={i} className="grid grid-cols-[1rem_1fr] gap-2">
                    <span aria-hidden className="mono text-fg-dim">
                      —
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
