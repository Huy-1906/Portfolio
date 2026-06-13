"use client";

import { useCallback, useEffect, useState } from "react";
import { profile, nav } from "@/lib/data";

const SECTION_IDS = [
  "top",
  "about",
  "research",
  "experience",
  "publications",
  "skills",
  "work",
  "contact",
] as const;

const SECTION_LABELS: Record<string, string> = {
  top: "Intro",
  about: "About",
  research: "Research",
  experience: "Experience",
  publications: "Publications",
  skills: "Skills",
  work: "Work",
  contact: "Contact",
};

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);
  const [time, setTime] = useState("");
  const [active, setActive] = useState<string>("top");
  const [progress, setProgress] = useState(0);

  // theme init + clock
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

  // active-section tracking via IntersectionObserver
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.2, 0.5], rootMargin: "-20% 0px -55% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // scroll progress hairline
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toggle = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      document.documentElement.classList.toggle("dark", !next);
      try {
        localStorage.setItem("theme", next ? "light" : "dark");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const activeIndex = Math.max(0, SECTION_IDS.indexOf(active as never));
  const activeLabel = SECTION_LABELS[active] ?? "";

  return (
    <>
      {/* scroll progress hairline */}
      <div
        className="hud-progress"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
        aria-hidden
      />

      {/* mono HUD — bottom-left section index */}
      <div className="hud bottom-5 left-6 hidden md:block" aria-hidden>
        <span className="tabular-nums text-fg-muted">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-fg-dim">
          {" / "}
          {String(SECTION_IDS.length).padStart(2, "0")}
        </span>
        <span className="ml-3 uppercase tracking-[0.2em] text-fg-muted">
          {activeLabel}
        </span>
      </div>

      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-[2] flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="scrim text-sm font-medium tracking-tight text-fg"
        >
          {profile.name}
        </a>

        <nav className="mono hidden items-center gap-6 text-xs lg:flex">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`ul uppercase tracking-[0.18em] transition-colors ${
                active === n.id ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="mono flex items-center gap-4 text-xs text-fg-muted">
          <span className="scrim hidden tabular-nums sm:inline">
            HCMC · {time} GMT+7
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
            className="flex h-11 w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg"
          >
            {light ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <div className="content-layer">{children}</div>
    </>
  );
}
