"use client";

import Section from "./Section";
import { skills } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

function SkillGroup({
  group,
  items,
  index,
}: {
  group: string;
  items: string;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const chips = items
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h3 className="mono text-[13px] uppercase tracking-wider text-accent">
        {group}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {chips.map((item) => (
          <li
            key={item}
            className="mono rounded-md border border-border px-3 py-1 text-[13px] text-fg-muted transition-colors duration-180 hover:border-accent"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills" index="05" title="Skills">
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skills.map((skill, index) => (
          <SkillGroup
            key={skill.group}
            group={skill.group}
            items={skill.items}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
