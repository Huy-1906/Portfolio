import type { Domain, Project } from "@/lib/data";
import { domainLabels } from "@/lib/data";

const domainDot: Record<Domain, string> = {
  fem: "var(--v2)",
  ai: "var(--v1)",
  robotics: "var(--v3)",
  saas: "var(--v4)",
  web: "var(--v0)",
};

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, domain, stack, link, blurb, confidential } = project;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: domainDot[domain] }}
            aria-hidden="true"
          />
          {domainLabels[domain]}
        </span>
        {confidential ? (
          <span className="mono inline-flex items-center gap-1 text-[11px] text-fg-muted">
            <LockIcon />
            concept
          </span>
        ) : link ? (
          <span className="text-fg-muted transition-colors group-hover:text-accent">
            <ExternalLinkIcon />
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-[20px] font-semibold leading-snug text-fg">
        {title}
      </h3>
      <p className="mono mt-1.5 text-[13px] text-fg-muted">{stack}</p>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fg-muted">
        {blurb}
      </p>
    </>
  );

  const base = "card flex h-full min-h-[180px] flex-col p-6";

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${base} card-hover cursor-pointer no-underline`}
      >
        {body}
      </a>
    );
  }

  return <div className={`group ${base}`}>{body}</div>;
}
