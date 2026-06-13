"use client";

/* eslint-disable react-hooks/immutability */

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { IUniform } from "three";

/**
 * GPU-driven finite-element displacement plate. The per-vertex modal
 * superposition runs entirely in the vertex shader off a `uTime` uniform
 * (~0.1 Hz modal wobble). The fragment shader maps normalized vertical
 * displacement through the VIRIDIS colormap and fades the plate out at its
 * borders (fresnel-style edge dissolve) so it reads as an instrument viewport
 * rather than a hard quad.
 */

interface HeroUniforms {
  [uniform: string]: IUniform;
  uTime: { value: number };
  uOpacity: { value: number };
  uColorBoost: { value: number };
  /** 0→1 intro ramp scaling displacement amplitude on mount. */
  uIntro: { value: number };
  uDispScale: { value: number };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uDispScale;
  varying float vDisp;
  varying vec2 vUv;

  // Superposed modal shapes — slow ~0.1Hz wobble driven on the GPU.
  float displacement(vec2 p, float t) {
    return 0.45 * sin(1.1 * p.x + t) * cos(1.1 * p.y + t * 0.8)
         + 0.25 * sin(2.0 * p.x - t * 0.6) * sin(1.6 * p.y + t);
  }

  void main() {
    vUv = uv;
    // Slow time + intro amplitude ramp.
    float slowT = uTime * 0.63;
    float amp = uDispScale * uIntro;
    float raw = displacement(position.xy, slowT);
    float z = raw * amp;
    // Normalize the analytic amplitude range (~[-0.7,0.7]) to [0,1].
    vDisp = clamp((raw + 0.7) / 1.4, 0.0, 1.0);
    vec3 displaced = vec3(position.xy, z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform float uColorBoost;
  varying float vDisp;
  varying vec2 vUv;

  // 5-stop VIRIDIS, piecewise-linear across the canonical control colors.
  vec3 viridis(float t) {
    t = clamp(t, 0.0, 1.0);
    const vec3 c0 = vec3(0.266667, 0.003922, 0.329412); // #440154
    const vec3 c1 = vec3(0.231373, 0.321569, 0.545098); // #3B528B
    const vec3 c2 = vec3(0.129412, 0.564706, 0.549020); // #21908C
    const vec3 c3 = vec3(0.364706, 0.784314, 0.388235); // #5DC863
    const vec3 c4 = vec3(0.992157, 0.905882, 0.145098); // #FDE725
    float s = t * 4.0;
    vec3 col = mix(c0, c1, clamp(s, 0.0, 1.0));
    col = mix(col, c2, clamp(s - 1.0, 0.0, 1.0));
    col = mix(col, c3, clamp(s - 2.0, 0.0, 1.0));
    col = mix(col, c4, clamp(s - 3.0, 0.0, 1.0));
    return col;
  }

  void main() {
    float t = clamp(vDisp * uColorBoost, 0.0, 1.0);
    vec3 col = viridis(t);

    // Edge fade: dissolve toward the plate borders so it reads as a viewport.
    vec2 d = abs(vUv - 0.5) * 2.0;
    float edge = max(d.x, d.y);
    float fade = 1.0 - smoothstep(0.62, 1.0, edge);

    gl_FragColor = vec4(col, uOpacity * fade);
  }
`;

// Wireframe reuses the same displacement so the overlay tracks the surface.
const wireFragmentShader = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  varying float vDisp;
  varying vec2 vUv;
  void main() {
    vec2 d = abs(vUv - 0.5) * 2.0;
    float edge = max(d.x, d.y);
    float fade = 1.0 - smoothstep(0.62, 1.0, edge);
    // accent teal (#2DD4BF) at low opacity.
    gl_FragColor = vec4(0.176, 0.831, 0.749, 0.10 * uOpacity * fade);
  }
`;

export interface HeroLiveValues {
  opacity: number;
  colorBoost: number;
}

export interface HeroMeshProps {
  /** Static opacity; used when `live` is not supplied. */
  opacity?: number;
  /** Static colormap intensity; used when `live` is not supplied. */
  colorBoost?: number;
  /** Freeze animation (reduced-motion). Geometry still renders. */
  paused?: boolean;
  /**
   * Optional ref holding live scroll-driven values. When present it overrides
   * the static props each frame WITHOUT re-rendering the React tree.
   */
  live?: RefObject<HeroLiveValues>;
}

const INTRO_SECONDS = 1.2;

export function HeroMesh({
  opacity = 0.95,
  colorBoost = 1,
  paused = false,
  live,
}: HeroMeshProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const introStart = useRef<number | null>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(4, 4, 64, 64), []);
  const wireGeo = useMemo(
    () => new THREE.WireframeGeometry(geometry),
    [geometry]
  );

  const uniforms = useMemo<HeroUniforms>(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColorBoost: { value: colorBoost },
      uIntro: { value: paused ? 1 : 0 },
      uDispScale: { value: 1 },
    }),
    // Init once; live values are pushed in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!paused) {
      uniforms.uTime.value = t;
      if (introStart.current === null) introStart.current = t;
      const intro = Math.min((t - introStart.current) / INTRO_SECONDS, 1);
      // Smootherstep ease-out for the amplitude ramp-in.
      uniforms.uIntro.value = intro * intro * (3 - 2 * intro);
      if (groupRef.current)
        groupRef.current.rotation.z = Math.PI / 4 + Math.sin(t * 0.1) * 0.05;
    } else {
      uniforms.uIntro.value = 1;
    }

    const o = live?.current?.opacity ?? opacity;
    const cb = live?.current?.colorBoost ?? colorBoost;
    uniforms.uOpacity.value = o;
    uniforms.uColorBoost.value = cb;
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 3, 0, Math.PI / 4]}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={wireGeo}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={wireFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default HeroMesh;
