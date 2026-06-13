"use client";

import { profile } from "@/lib/data";
import Section from "./Section";

const SOCIAL: { label: string; href: string }[] = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "ResearchGate", href: profile.links.researchgate },
];

export default function Contact() {
  return (
    <Section id="contact" index="07" title="Contact">
      <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
        Let&rsquo;s build something precise.
      </h2>

      <a
        href={`mailto:${profile.email}`}
        className="ul mono mt-10 inline-block text-lg text-fg sm:text-2xl"
      >
        {profile.email}
      </a>

      <div className="mono mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-fg-muted">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ul py-1 hover:text-fg"
          >
            {s.label} ↗
          </a>
        ))}
      </div>

      <footer className="mono mt-20 flex items-center justify-between border-t border-line pt-8 text-xs text-fg-dim">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
      </footer>
    </Section>
  );
}
