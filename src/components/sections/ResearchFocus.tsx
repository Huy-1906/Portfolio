"use client";

import Section from "./Section";
import { publications, awards } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

const viridis = ["var(--v1)", "var(--v2)", "var(--v3)", "var(--v4)"];

export default function ResearchFocus() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Section id="research" index="03" title="Research & Publications">
      <div ref={ref} className="reveal">
        <div className="max-w-[68ch] space-y-4 text-[20px] leading-[1.6] text-fg-muted">
          <p>
            My research builds machine-learning surrogates for finite-element
            analysis — models that learn the input-to-response mapping directly
            and return in milliseconds what a full solve would take minutes to
            produce.
          </p>
          <p>
            The same approach drives reduced-order modeling: compact
            representations that preserve a structure&rsquo;s essential physics,
            bridging classical FEM with data-driven inference — the foundation
            of modern structural digital twins.
          </p>
        </div>

        <ol className="mt-14 space-y-px">
          {publications.map((pub, i) => {
            const published = /2026/.test(pub.venue);
            return (
              <li
                key={pub.title}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-border py-7 last:border-b"
              >
                <span
                  className="mono pt-1 text-[16px] font-medium"
                  style={{ color: viridis[i % viridis.length] }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[20px] font-semibold leading-snug text-fg">
                      {pub.title}
                    </h3>
                    {published ? (
                      <span className="mono rounded-md border border-accent/40 px-2 py-0.5 text-[13px] text-accent">
                        Published
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[14px] text-fg-muted">{pub.authors}</p>
                  <p className="mono mt-1 text-[13px] text-fg-muted">
                    {pub.venue}
                  </p>
                  {pub.doi ? (
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono mt-2 inline-block text-[13px] text-fg-muted underline decoration-border underline-offset-4 transition-colors duration-180 hover:text-accent"
                    >
                      {pub.doi.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14">
          <h3 className="mono text-[13px] uppercase tracking-wider text-accent">
            Recognition
          </h3>
          <ul className="mt-5 space-y-3">
            {awards.map((award) => (
              <li
                key={award}
                className="flex gap-3 text-[16px] leading-relaxed text-fg-muted"
              >
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--v2)" }}
                />
                {award}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
