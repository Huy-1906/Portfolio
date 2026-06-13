"use client";

import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ResearchFocus from "@/components/sections/ResearchFocus";
import Work from "@/components/sections/Work";
import MLViz from "@/components/sections/MLViz";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <ResearchFocus />
        <Work />
        <MLViz />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
