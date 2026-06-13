"use client";

import Section from "./Section";
import { about, education, profile } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

const stats = [
  { label: "Expected", value: "2028" },
  { label: "IELTS", value: "6.0" },
  { label: "Published", value: "2026" },
  { label: "Based in", value: "Ho Chi Minh City" },
];

export default function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Section id="about" index="01" title="About">
      <div ref={ref} className="reveal">
        <p className="max-w-[68ch] text-[20px] leading-[1.6] text-fg-muted">
          {about}
        </p>

        <dl className="mt-12 flex flex-wrap items-stretch gap-x-8 gap-y-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 ${
                i > 0 ? "border-border pl-8 sm:border-l" : ""
              }`}
            >
              <dt className="mono text-[13px] uppercase tracking-wider text-fg-muted">
                {stat.label}
              </dt>
              <dd className="mono text-[16px] text-fg">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <span className="mt-12 block h-px w-full bg-border" />

        <div className="mt-12">
          <h3 className="text-[20px] font-semibold text-fg">
            {education.school}
          </h3>
          <p className="mt-1 text-[16px] italic text-fg-muted">
            {education.degree}
          </p>
          <p className="mono mt-1 text-[13px] text-fg-muted">
            {education.period}
          </p>

          <ul
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Selected coursework"
          >
            {education.coursework.map((course) => (
              <li
                key={course}
                className="mono rounded-md border border-border px-3 py-1 text-[13px] text-fg-muted"
              >
                {course}
              </li>
            ))}
          </ul>

          <p className="mono mt-6 text-[13px] text-fg-muted">
            {education.languages}
          </p>
        </div>
      </div>
    </Section>
  );
}
