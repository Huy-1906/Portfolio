"use client";

import Section from "./Section";
import { experience } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

const nodeColors = ["var(--v1)", "var(--v2)", "var(--v3)"];

// Lightly emphasise structural-FEM keywords for a structural-FEM reader.
const KEYWORDS =
  /\b(finite[- ]element|FEM|reduced[- ]order|simulation|numerical|mesh|stiffness|computational mechanics)\b/gi;

function emphasize(text: string) {
  // split() with a capturing group interleaves the matched keywords as
  // odd-indexed parts, so we key off the index instead of a stateful test.
  const parts = text.split(KEYWORDS);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-medium text-fg">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof experience)[number];
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const color = nodeColors[index % nodeColors.length];

  return (
    <div
      ref={ref}
      className="reveal relative pl-10"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <span
        className="absolute left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-bg"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-[20px] font-semibold text-fg">{item.role}</h3>
        <span className="mono shrink-0 text-[13px] text-fg-muted">
          {item.period}
        </span>
      </div>
      <p className="mono mt-1 text-[13px] text-fg-muted">{item.org}</p>
      <ul className="mt-5 space-y-3">
        {item.points.map((point) => (
          <li
            key={point}
            className="relative pl-5 text-[16px] leading-relaxed text-fg-muted"
          >
            <span
              className="absolute left-0 top-2.5 h-1 w-1 rounded-full bg-fg-muted"
              aria-hidden="true"
            />
            {emphasize(point)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  return (
    <Section id="experience" index="04" title="Experience">
      <div className="relative space-y-14">
        <span
          className="absolute bottom-2 left-[10px] top-2 w-px bg-border"
          aria-hidden="true"
        />
        {experience.map((item, index) => (
          <TimelineItem key={item.role} item={item} index={index} />
        ))}
      </div>
    </Section>
  );
}
