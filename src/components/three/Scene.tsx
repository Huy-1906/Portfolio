"use client";

/* eslint-disable react-hooks/immutability */

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { HeroMesh, type HeroLiveValues } from "./HeroMesh";

/**
 * Contained hero WebGL canvas. Fills its parent element (NOT a fixed full-page
 * background) so Hero.tsx can place it in the right zone of the layout. Renders
 * only the finite-element displacement plate, framed slightly right-of-center
 * and lit so the viridis colormap stays vivid against the dark instrument bg.
 *
 * Pauses the render loop when offscreen or when the tab is hidden.
 */

interface RigProps {
  hero: React.RefObject<HeroLiveValues>;
}

/** Idle breathing of the colormap intensity — keeps the plate alive. */
function Rig({ hero }: RigProps) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    hero.current.colorBoost = 1 + Math.sin(t * 0.18) * 0.06;
  });
  return null;
}

export interface HeroSceneProps {
  /** Reduced-motion: freeze per-frame animation; render once on demand. */
  reducedMotion?: boolean;
  /** Extra className for the contained wrapper. */
  className?: string;
}

export default function HeroScene({
  reducedMotion = false,
  className = "",
}: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hero = useRef<HeroLiveValues>({ opacity: 0.96, colorBoost: 1 });
  const [active, setActive] = useState(true);

  // Pause the loop when the canvas scrolls offscreen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let onscreen = true;
    let visible =
      typeof document === "undefined" ? true : !document.hidden;

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
        camera={{ position: [0.6, 0.1, 5.4], fov: 42 }}
        style={{ background: "transparent" }}
        frameloop={loop}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.15} />
        <directionalLight position={[-5, -3, 2]} intensity={0.45} />
        <Rig hero={hero} />
        <HeroMesh live={hero} paused={reducedMotion} />
      </Canvas>
    </div>
  );
}
