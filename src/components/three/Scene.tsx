"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { TrussStructure, type TrussLive } from "./TrussStructure";

export interface HeroSceneProps {
  reducedMotion?: boolean;
  className?: string;
}

/** Smooth intro ramp 0 -> 1 over ~1.2s. */
function Intro({ live }: { live: React.RefObject<TrussLive> }) {
  const start = useRef<number | null>(null);
  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - start.current) / 1.2);
    // smootherstep
    live.current.intro = t * t * t * (t * (t * 6 - 15) + 10);
  });
  return null;
}

export default function HeroScene({
  reducedMotion = false,
  className = "",
}: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const live = useRef<TrussLive>({ intro: reducedMotion ? 1 : 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let onscreen = true;
    let visible = typeof document === "undefined" ? true : !document.hidden;
    const apply = () => setActive(onscreen && visible);
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    const onVis = () => {
      visible = !document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const loop = reducedMotion || !active ? "demand" : "always";

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [3.4, 1.6, 4.2], fov: 38 }}
        style={{ background: "transparent" }}
        frameloop={loop}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 4]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#2dd4bf" />
        <Environment preset="city" />
        {!reducedMotion && <Intro live={live} />}
        <TrussStructure live={live} />
      </Canvas>
    </div>
  );
}
