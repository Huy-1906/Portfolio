"use client";

import dynamic from "next/dynamic";
import BentoTile from "@/components/bento/BentoTile";
import {
  profile,
  about,
  education,
  experience,
  projects,
  skills,
  publications,
  awards,
  domainLabels,
  type Domain,
} from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";

const HeroScene = dynamic(() => import("@/components/three/Scene"), { ssr: false });
const CNNViz = dynamic(() => import("@/components/CNNViz"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="mono text-[13px] text-fg-muted">loading…</span>
    </div>
  ),
});

const domainDot: Record<Domain, string> = {
  fem: "var(--v2)",
  ai: "var(--v1)",
  robotics: "var(--v3)",
  saas: "var(--v4)",
  web: "var(--v0)",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
      {children}
    </span>
  );
}

export default function BentoGrid() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupported();
  const show3D = webgl && !reduced;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        {/* HERO — big tile with truss 3D */}
        <BentoTile col={8} row={2} accent id="top" className="justify-between">
          <div className="pointer-events-none absolute inset-0 opacity-90">
            {show3D ? (
              <HeroScene />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(80% 80% at 70% 40%, var(--v2), transparent 70%)",
                }}
              />
            )}
          </div>
          <div className="relative z-10">
            <Label>Engineering Mechanics · Computational</Label>
          </div>
          <div className="relative z-10 mt-auto">
            <h1 className="text-5xl font-bold tracking-tight text-fg md:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-3 max-w-md text-lg text-fg-muted">{profile.role}</p>
            <p className="mono mt-4 text-[13px] text-accent">
              FEM · reduced-order modeling · ML surrogates
            </p>
          </div>
        </BentoTile>

        {/* Quick links / CTA stack */}
        <BentoTile col={4} row={2} className="justify-between">
          <Label>Connect</Label>
          <div className="mt-auto flex flex-col gap-3">
            <a href="#work" className="rounded-xl bg-accent px-5 py-3 text-center text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5">
              View work
            </a>
            <a href={`mailto:${profile.email}`} className="mono truncate rounded-xl border border-border px-5 py-3 text-center text-[13px] text-fg transition-colors hover:border-accent hover:text-accent">
              {profile.email}
            </a>
            <div className="mt-2 flex gap-2">
              {[
                { href: profile.links.github, label: "GitHub" },
                { href: profile.links.linkedin, label: "LinkedIn" },
                { href: profile.links.researchgate, label: "RG" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="mono flex-1 rounded-lg border border-border px-2 py-2 text-center text-[11px] text-fg-muted transition-colors hover:border-accent hover:text-accent">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </BentoTile>

        {/* About */}
        <BentoTile col={7} row={1}>
          <Label>About</Label>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{about}</p>
        </BentoTile>

        {/* Stat tiles */}
        <BentoTile col={5} row={1} className="justify-center">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Expected", "2028"],
              ["IELTS", "6.0"],
              ["Published", "2026"],
              ["Based in", "HCMC"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="mono text-[11px] uppercase tracking-wider text-fg-muted">{k}</div>
                <div className="mono mt-1 text-2xl font-semibold text-fg">{v}</div>
              </div>
            ))}
          </div>
        </BentoTile>

        {/* Education */}
        <BentoTile col={6} row={1}>
          <Label>Education</Label>
          <h3 className="mt-3 text-base font-semibold text-fg">{education.school}</h3>
          <p className="mt-1 text-[13px] italic text-fg-muted">{education.degree}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {education.coursework.slice(0, 5).map((c) => (
              <span key={c} className="mono rounded-md border border-border px-2 py-0.5 text-[11px] text-fg-muted">{c}</span>
            ))}
          </div>
        </BentoTile>

        {/* Publication highlight */}
        <BentoTile col={6} row={1} accent>
          <Label>Publication</Label>
          {publications.map((p) => (
            <div key={p.title} className="mt-3">
              <a href={p.doi} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold leading-snug text-fg transition-colors hover:text-accent">
                {p.title}
              </a>
              <p className="mono mt-2 text-[12px] text-fg-muted">{p.venue}</p>
              <span className="mono mt-2 inline-block rounded-md bg-accent/15 px-2 py-0.5 text-[11px] text-accent">Published 2026</span>
            </div>
          ))}
        </BentoTile>

        {/* Work header */}
        <BentoTile col={12} row={1} className="!flex-row items-center justify-between" id="work">
          <div>
            <Label>Selected Work</Label>
            <p className="mt-2 text-sm text-fg-muted">Computational mechanics · AI tooling · robotics · web</p>
          </div>
          <span className="mono text-3xl font-bold text-fg-muted/40">{projects.length}</span>
        </BentoTile>

        {/* Project tiles */}
        {projects.slice(0, 6).map((proj) => (
          <BentoTile key={proj.title} col={4} row={1} href={proj.link} ariaLabel={proj.title}>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: domainDot[proj.domain] }} />
              <span className="mono text-[11px] uppercase tracking-wider text-accent">{domainLabels[proj.domain]}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-fg">{proj.title}</h3>
            <p className="mono mt-1 text-[11px] text-fg-muted">{proj.stack}</p>
            <p className="mt-2 line-clamp-3 text-[13px] text-fg-muted">{proj.blurb}</p>
            {proj.confidential && (
              <span className="mono mt-auto pt-3 text-[11px] text-fg-muted">concept · details on request</span>
            )}
          </BentoTile>
        ))}

        {/* CNN viz showpiece */}
        <BentoTile col={8} row={2} id="ml" className="p-0">
          <div className="absolute left-6 top-6 z-10">
            <Label>ML Surrogate · CNN</Label>
          </div>
          <div className="h-full min-h-[320px] w-full">
            <CNNViz />
          </div>
          <div className="mono absolute bottom-5 left-6 right-6 z-10 flex items-center justify-between text-[11px] text-fg-muted">
            <span>Input RVE → convolutions → predicted field</span>
            <span className="inline-flex items-center gap-1">
              low
              <span className="inline-block h-1.5 w-16 rounded-full" style={{ background: "linear-gradient(90deg,var(--v0),var(--v2),var(--v4))" }} aria-hidden />
              high
            </span>
          </div>
        </BentoTile>

        {/* Research thesis */}
        <BentoTile col={4} row={2} id="research">
          <Label>Research Focus</Label>
          <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
            Training neural networks on finite-element simulation data to predict
            structural and material behavior — bridging classical FEM with
            data-driven inference, the foundation of modern structural digital twins.
          </p>
          <p className="mt-auto pt-4 text-[13px] text-fg-muted">
            Recognition
          </p>
          <ul className="mt-2 space-y-1">
            {awards.map((a) => (
              <li key={a} className="text-[12px] leading-snug text-fg-muted">— {a}</li>
            ))}
          </ul>
        </BentoTile>

        {/* Experience */}
        <BentoTile col={7} row={1} id="experience">
          <Label>Experience</Label>
          <div className="mt-3 space-y-4">
            {experience.map((e) => (
              <div key={e.role}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-fg">{e.role}</h3>
                  <span className="mono shrink-0 text-[11px] text-fg-muted">{e.period}</span>
                </div>
                <p className="mono text-[12px] text-fg-muted">{e.org}</p>
              </div>
            ))}
          </div>
        </BentoTile>

        {/* Skills */}
        <BentoTile col={5} row={1} id="skills">
          <Label>Stack</Label>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.flatMap((s) => s.items.split(", ").slice(0, 3)).slice(0, 14).map((item, i) => (
              <span key={`${item}-${i}`} className="mono rounded-md border border-border px-2 py-0.5 text-[11px] text-fg-muted transition-colors hover:border-accent hover:text-accent">{item}</span>
            ))}
          </div>
        </BentoTile>

        {/* Contact */}
        <BentoTile col={12} row={1} accent id="contact" className="!flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">Let&rsquo;s build something precise.</h2>
            <p className="mono mt-2 text-[13px] text-fg-muted">© {profile.name} — Ho Chi Minh City</p>
          </div>
          <a href={`mailto:${profile.email}`} className="mono shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5">
            {profile.email}
          </a>
        </BentoTile>
      </div>
    </div>
  );
}
