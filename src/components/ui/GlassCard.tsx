import type { ElementType, ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: ElementType;
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
}: GlassCardProps) {
  const Comp = Tag as ElementType<{
    className?: string;
    children?: ReactNode;
  }>;
  return (
    <Comp
      className={`glass ${hover ? "glass-hover" : ""} rounded-2xl p-6 ${className}`.trim()}
    >
      {children}
    </Comp>
  );
}
