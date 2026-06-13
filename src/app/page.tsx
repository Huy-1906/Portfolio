"use client";

import { useEffect, useRef, useState } from "react";
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

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-4 border-b border-line pb-4">
      <span className="mono text-xs text-fg-dim">{n}</span>
      <h2 className="mono text-xs uppercase tracking-[0.3em] text-fg-muted">{children}</h2>
    </div>
  );
}

const order: Domain[] = ["fem", "ai", "robotics", "saas", "web"];

export default function Home() {
  const [light, setLight] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8">
      {/* top bar */}
      <header className="flex items-center justify-between py-6 mono text-xs text-fg-muted">
        <span>HCMC · {time} GMT+7</span>
        <button
          onClick={toggle}
          className="ul cursor-pointer uppercase tracking-widest hover:text-fg"
          aria-label="Toggle theme"
        >
          {light ? "dark" : "light"}
        </button>
      </header>

      {/* hero */}
      <section className="pt-20 pb-28 sm:pt-28 sm:pb-36">
        <p className="mono mb-8 text-xs uppercase tracking-[0.3em] text-fg-muted">
          {profile.role}
        </p>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">
          {profile.tagline}
        </p>
        <div className="mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a className="ul text-fg" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="ul text-fg-muted hover:text-fg" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="ul text-fg-muted hover:text-fg" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="ul text-fg-muted hover:text-fg" href={profile.links.researchgate} target="_blank" rel="noopener noreferrer">ResearchGate</a>
        </div>
      </section>

      {/* about */}
      <section className="py-20">
        <SectionLabel n="01">About</SectionLabel>
        <Reveal>
          <p className="max-w-2xl text-xl leading-relaxed">{about}</p>
          <dl className="mono mt-12 grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-4">
            {[
              ["Degree", education.period],
              ["English", "IELTS 6.0"],
              ["Published", "2026"],
              ["Location", "Ho Chi Minh City"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="text-fg-dim">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 max-w-2xl text-sm leading-relaxed text-fg-muted">
            <span className="text-fg">{education.school}</span> — {education.degree}.
            <span className="mt-3 block">Coursework: {education.coursework.join(", ")}.</span>
          </div>
        </Reveal>
      </section>

      {/* work */}
      <section className="py-20">
        <SectionLabel n="02">Selected Work</SectionLabel>
        <Reveal>
          <ul>
            {order.flatMap((d) => projects.filter((p) => p.domain === d)).map((p) => {
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-medium text-fg sm:text-xl">{p.title}</h3>
                    <span className="mono shrink-0 text-[11px] uppercase tracking-widest text-fg-dim">
                      {domainLabels[p.domain]}
                    </span>
                  </div>
                  <p className="mono mt-2 text-xs text-fg-dim">{p.stack}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{p.blurb}</p>
                  {p.confidential && (
                    <span className="mono mt-3 inline-block text-[11px] text-fg-dim">— details on request</span>
                  )}
                </>
              );
              return (
                <li key={p.title} className="row-line group py-7">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-100 group-hover:[&_h3]:underline">
                      {inner}
                      <span className="mono mt-3 inline-block text-xs text-fg-muted ul">visit ↗</span>
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* research focus */}
      <section className="py-20">
        <SectionLabel n="03">Research Focus</SectionLabel>
        <Reveal>
          <p className="max-w-2xl text-xl leading-relaxed">
            Training neural networks on finite-element simulation data to predict
            structural and material behavior — bridging classical FEM with
            data-driven inference, the foundation of modern structural digital twins.
          </p>
        </Reveal>
      </section>

      {/* experience */}
      <section className="py-20">
        <SectionLabel n="04">Experience</SectionLabel>
        <Reveal>
          <ul className="space-y-10">
            {experience.map((e) => (
              <li key={e.role} className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                <div className="mono text-xs text-fg-dim">{e.period}</div>
                <div>
                  <h3 className="font-medium text-fg">{e.role}</h3>
                  <p className="mono text-xs text-fg-muted">{e.org}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-muted">
                    {e.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* publications */}
      <section className="py-20">
        <SectionLabel n="05">Publications</SectionLabel>
        <Reveal>
          <ul className="space-y-6">
            {publications.map((p) => (
              <li key={p.title} className="border-t border-line pt-6">
                <a href={p.doi} target="_blank" rel="noopener noreferrer" className="ul text-lg font-medium text-fg">{p.title}</a>
                <p className="mono mt-2 text-xs text-fg-muted">{p.authors}</p>
                <p className="mono mt-1 text-xs text-fg-dim">{p.venue}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-line pt-6">
            <p className="mono text-xs uppercase tracking-widest text-fg-dim">Recognition</p>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              {awards.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* skills */}
      <section className="py-20">
        <SectionLabel n="06">Stack</SectionLabel>
        <Reveal>
          <dl className="space-y-6">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-2 border-t border-line pt-4 sm:grid-cols-[10rem_1fr]">
                <dt className="mono text-xs uppercase tracking-widest text-fg-dim">{s.group}</dt>
                <dd className="text-sm leading-relaxed text-fg-muted">{s.items}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* contact */}
      <section className="py-28">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&rsquo;s build something precise.
          </h2>
          <a href={`mailto:${profile.email}`} className="ul mono mt-8 inline-block text-lg text-fg">
            {profile.email}
          </a>
        </Reveal>
      </section>

      <footer className="mono flex items-center justify-between border-t border-line py-8 text-xs text-fg-dim">
        <span>© {profile.name}</span>
        <span>Ho Chi Minh City</span>
      </footer>
    </div>
  );
}
