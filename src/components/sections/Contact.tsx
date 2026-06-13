"use client";

import { profile } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

type IconProps = { className?: string };

function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function ResearchGateIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 8.36c0 1.6-.55 2.84-1.64 3.72-1.1.88-2.6 1.32-4.52 1.32h-1.1V18H9.06V3.96h4.4c1.9 0 3.38.42 4.46 1.26 1.11.86 1.67 2.0 1.67 3.14Zm-2.34.08c0-.72-.27-1.28-.81-1.68-.54-.4-1.32-.6-2.34-.6h-1.97v4.74h1.78c2.36 0 3.54-.82 3.54-2.46ZM6.18 18H3.9V3.96h2.28V18Z" />
    </svg>
  );
}

const socials = [
  { label: "GitHub", href: profile.links.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedInIcon },
  {
    label: "ResearchGate",
    href: profile.links.researchgate,
    Icon: ResearchGateIcon,
  },
];

export default function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl border-t border-border px-6 py-24 md:py-32"
    >
      <div ref={ref} className="reveal">
        <h2 className="max-w-[68ch] text-[40px] font-semibold leading-tight text-fg">
          Let&rsquo;s build something precise.
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="mono mt-8 inline-block break-all text-[25px] text-fg transition-colors duration-180 hover:text-accent"
        >
          {profile.email}
        </a>

        <div className="mt-10 flex gap-6">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center text-fg-muted transition-colors duration-180 hover:text-accent"
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>

        <footer className="mono mt-20 text-[13px] text-fg-muted">
          © {profile.name} — Ho Chi Minh City
        </footer>
      </div>
    </section>
  );
}
