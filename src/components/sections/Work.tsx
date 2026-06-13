import Section from "@/components/sections/Section";
import ProjectFilter from "@/components/ProjectFilter";

export default function Work() {
  return (
    <Section id="work" title="Selected Work" index="03">
      <p className="max-w-2xl text-[15px] text-fg-muted">
        Computational mechanics, ML tooling, robotics, and web — filter by
        domain.
      </p>
      <ProjectFilter />
    </Section>
  );
}
