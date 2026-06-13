"use client";

import { useState } from "react";
import type { Domain } from "@/lib/data";
import { domainLabels, projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

type Filter = "all" | Domain;

const domains = Object.keys(domainLabels) as Domain[];

export default function ProjectFilter() {
  const [selected, setSelected] = useState<Filter>("all");

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    ...domains.map((d) => ({ value: d, label: domainLabels[d] })),
  ];

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Filter projects by domain"
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const active = chip.value === selected;
          return (
            <button
              key={chip.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(chip.value)}
              className={`mono min-h-11 cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors ${
                active
                  ? "border-accent bg-accent text-[var(--accent-fg)]"
                  : "border-border text-fg-muted hover:text-fg"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const shown = selected === "all" || project.domain === selected;
          return (
            <div
              key={project.title}
              aria-hidden={!shown}
              className={`transition-opacity duration-300 motion-reduce:transition-none ${
                shown
                  ? "opacity-100"
                  : "pointer-events-none hidden opacity-0"
              }`}
            >
              <ProjectCard project={project} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
