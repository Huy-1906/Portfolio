"use client";

import { publications, awards } from "@/lib/data";
import Section from "./Section";

export default function Publications() {
  return (
    <Section id="publications" index="04" title="Publications">
      <ul className="space-y-8">
        {publications.map((p) => (
          <li key={p.title} className="border-t border-line pt-8">
            <a
              href={p.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="ul text-lg font-medium leading-snug text-fg sm:text-xl"
            >
              {p.title}
            </a>
            <p className="mono mt-3 text-xs text-fg-muted">{p.authors}</p>
            <p className="mono mt-1 text-xs text-fg-dim">{p.venue}</p>
            <a
              href={p.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="ul mono mt-3 inline-block text-xs text-fg-muted"
            >
              DOI ↗
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-16 border-t border-line pt-8">
        <p className="mono text-xs uppercase tracking-[0.2em] text-fg-dim">
          Recognition
        </p>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-fg-muted">
          {awards.map((a) => (
            <li key={a} className="grid grid-cols-[1rem_1fr] gap-2">
              <span aria-hidden className="mono text-fg-dim">
                ◦
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
