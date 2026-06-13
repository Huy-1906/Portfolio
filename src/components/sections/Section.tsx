import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  index?: string;
  className?: string;
  children: ReactNode;
};

export default function Section({
  id,
  title,
  index,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-5xl px-6 py-24 md:py-32 ${className}`.trim()}
    >
      {title ? (
        <div className="mb-12">
          <h2 className="flex items-baseline gap-3 text-[31px] font-semibold leading-tight text-fg">
            {index ? (
              <span className="mono text-[16px] font-medium text-accent">
                {index} /
              </span>
            ) : null}
            {title}
          </h2>
          <span className="mt-5 block h-px w-full bg-border" />
        </div>
      ) : null}
      {children}
    </section>
  );
}
