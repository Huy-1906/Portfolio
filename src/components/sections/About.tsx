"use client";

import { about, education } from "@/lib/data";
import Section from "./Section";

const FACTS: [string, string][] = [
  ["Degree", education.period],
  ["English", "IELTS 6.0"],
  ["Published", "2026"],
  ["Based in", "Ho Chi Minh City"],
];

export default function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <p className="max-w-2xl text-xl leading-relaxed text-fg sm:text-2xl">
            {about}
          </p>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-fg-muted">
            <span className="text-fg">{education.school}</span> —{" "}
            {education.degree}.
          </p>
          <p className="mono mt-4 text-xs leading-relaxed text-fg-dim">
            {education.languages}
          </p>
        </div>

        <div>
          <dl className="mono grid grid-cols-2 gap-x-8 gap-y-7 text-sm">
            {FACTS.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="text-fg-dim">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border-t border-line pt-4">
            <p className="mono text-xs uppercase tracking-[0.2em] text-fg-dim">
              Coursework
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-fg-muted">
              {education.coursework.map((c) => (
                <li key={c} className="whitespace-nowrap">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
