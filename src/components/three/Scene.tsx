"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import SolvingField, { type FieldMaterials } from "./SolvingField";
import {
  createFieldLive,
  useScrollDriver,
  type FieldLive,
} from "./useScrollDriver";

/* ------------------------------------------------------------------ */
/* theme helpers                                                      */
/* ------------------------------------------------------------------ */

interface ThemeColors {
  fg: THREE.Color;
  bg: THREE.Color;
}

function readTheme(): ThemeColors {
  // dark default; light when documentElement has .light
  const light =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light");
  return light
    ? { fg: new THREE.Color("#0a0a0a"), bg: new THREE.Color("#f7f7f5") }
    : { fg: new THREE.Color("#ededed"), bg: new THREE.Color("#0a0a0a") };
}

/* ------------------------------------------------------------------ */
/* Rig — owns all per-frame work                                      */
/* ------------------------------------------------------------------ */

interface RigProps {
  live: FieldLive;
  materials: React.MutableRefObject<FieldMaterials | null>;
  theme: ThemeColors;
  reduced: boolean;
}

function Rig({ live, materials, theme, reduced }: RigProps) {
  const { camera, invalidate } = useThree();
  const step = useScrollDriver(2.5);

  // scroll + pointer listeners (write into the shared live ref only)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      live.scrollTarget = max > 0 ? window.scrollY / max : 0;
      invalidate();
    };
    const onMove = (e: PointerEvent) => {
      live.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      live.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
      live.mouseStrength = Math.min(1, live.mouseStrength + 0.45);
      invalidate();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [live, invalidate]);

  useFrame((_state, delta) => {
    const d = Math.min(delta, 0.05);
    // reduced motion: freeze time + zero cursor force, still allow scroll pose
    step(camera, live, reduced ? d * 0.0 + d : d);

    const m = materials.current;
    const apply = (mat: THREE.ShaderMaterial | null) => {
      if (!mat) return;
      const u = mat.uniforms;
      u.uTime.value += reduced ? 0 : d;
      u.uAmplitude.value = live.amplitude;
      u.uFrequency.value = live.frequency;
      u.uLineSharpness.value = live.lineSharpness;
      (u.uMouse.value as THREE.Vector2).set(live.mouseX, live.mouseY);
      u.uMouseStrength.value = reduced ? 0 : live.mouseStrength;
      (u.uFg.value as THREE.Color).copy(theme.fg);
      (u.uBg.value as THREE.Color).copy(theme.bg);
    };
    apply(m?.pointMat ?? null);
    apply(m?.lineMat ?? null);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Scene                                                              */
/* ------------------------------------------------------------------ */

export interface SceneProps {
  /** grid resolution per side (default 200) */
  segments?: number;
}

/**
 * The single persistent fixed WebGL canvas behind all DOM.
 * Mount once (ideally via next/dynamic({ ssr: false })) at the app root.
 */
export default function Scene({ segments = 200 }: SceneProps) {
  const live = useMemo(() => createFieldLive(), []);
  const materials = useRef<FieldMaterials | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<ThemeColors>(() => ({
    fg: new THREE.Color("#ededed"),
    bg: new THREE.Color("#0a0a0a"),
  }));
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);

  // theme: read on mount + observe documentElement class changes
  useEffect(() => {
    setTheme(readTheme());
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // reduced motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // pause when tab hidden or canvas offscreen
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | null = null;
    const el = wrapRef.current;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => setActive(entry.isIntersecting && !document.hidden),
        { threshold: 0 }
      );
      io.observe(el);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // reduced motion → render on demand (still re-poses on scroll via invalidate)
  const frameloop: "always" | "demand" | "never" = !active
    ? "never"
    : reduced
      ? "demand"
      : "always";

  return (
    <div ref={wrapRef} className="canvas-layer" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0.9, 6.2] }}
      >
        <fog attach="fog" args={[theme.bg.getHex(), 6, 18]} />
        <SolvingField segments={segments} materialsRef={materials} />
        <Rig live={live} materials={materials} theme={theme} reduced={reduced} />
      </Canvas>
    </div>
  );
}
