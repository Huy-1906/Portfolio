"use client";

import { skills } from "@/lib/data";
import Section from "./Section";

export default function Skills() {
  return (
    <Section id="skills" index="05" title="Skills">
      <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {skills.map((s) => (
          <div key={s.group} className="border-t border-line pt-5">
            <dt className="mono text-xs uppercase tracking-[0.2em] text-fg-dim">
              {s.group}
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-fg-muted">
              {s.items}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
