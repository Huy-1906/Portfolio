"use client";

import Header from "@/components/Header";
import BentoGrid from "@/components/bento/BentoGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-dvh bg-bg">
        <BentoGrid />
      </main>
    </>
  );
}
