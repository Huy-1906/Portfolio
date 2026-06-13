"use client";

import { projects, domainLabels, type Domain } from "@/lib/data";
import Section from "./Section";

const ORDER: Domain[] = ["fem", "ai", "robotics", "web"];

const ordered = ORDER.flatMap((d) => projects.filter((p) => p.domain === d));

export default function Work() {
  return (
    <Section id="work" index="06" title="Selected Work">
      <ul>
        {ordered.map((p, i) => {
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-lg font-medium tracking-tight text-fg sm:text-2xl">
                  {p.title}
                </h3>
                <span className="mono shrink-0 text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                  {domainLabels[p.domain]}
                </span>
              </div>
              <p className="mono mt-3 text-xs text-fg-dim">{p.stack}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {p.blurb}
              </p>
              {p.link ? (
                <span className="ul mono mt-4 inline-block text-xs text-fg-muted group-hover:text-fg">
                  visit ↗
                </span>
              ) : p.confidential ? (
                <span className="mono mt-4 inline-block text-xs text-fg-dim">
                  details on request
                </span>
              ) : null}
            </>
          );

          return (
            <li
              key={p.title}
              className="border-t border-line last:border-b last:border-line"
            >
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-8 transition-[padding] duration-300 ease-out hover:md:pl-3"
                >
                  <span className="mono mb-3 block text-[11px] tabular-nums text-fg-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {body}
                </a>
              ) : (
                <div className="block py-8">
                  <span className="mono mb-3 block text-[11px] tabular-nums text-fg-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
