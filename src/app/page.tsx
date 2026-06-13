"use client";

import dynamic from "next/dynamic";
import Shell from "@/components/sections/Shell";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import ResearchFocus from "@/components/sections/ResearchFocus";
import Experience from "@/components/sections/Experience";
import Publications from "@/components/sections/Publications";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import StaticFieldPoster from "@/components/three/StaticFieldPoster";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

export default function Home() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupported();
  const [mounted, setMounted] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const use3D = mounted && webgl && !reduced && desktop;

  return (
    <>
      {use3D ? <Scene /> : <StaticFieldPoster />}
      <div className="grain" aria-hidden="true" />
      <Shell>
        <Hero />
        <About />
        <Work />
        <ResearchFocus />
        <Experience />
        <Publications />
        <Skills />
        <Contact />
      </Shell>
    </>
  );
}
