"use client";

import * as THREE from "three";

/**
 * Shared live state for the field. Mutated in-place inside `useFrame` by the
 * Rig (no React re-render per frame). Integrator + sections may import this
 * type to read/observe the same ref.
 */
export interface FieldLive {
  /** target scroll 0..1 (raw, written by scroll listener) */
  scrollTarget: number;
  /** damped scroll 0..1 (smoothed, drives camera + uniforms) */
  scroll: number;
  /** normalized pointer -1..1 */
  mouseX: number;
  mouseY: number;
  /** damped pointer for parallax -1..1 */
  parallaxX: number;
  parallaxY: number;
  /** cursor-force gaussian strength 0..1, decays each frame */
  mouseStrength: number;
  /** derived field uniforms (written by the driver) */
  amplitude: number;
  frequency: number;
  lineSharpness: number;
}

export function createFieldLive(): FieldLive {
  return {
    scrollTarget: 0,
    scroll: 0,
    mouseX: 0,
    mouseY: 0,
    parallaxX: 0,
    parallaxY: 0,
    mouseStrength: 0,
    amplitude: 1,
    frequency: 1.2,
    lineSharpness: 1,
  };
}

interface Keyframe {
  /** scroll position 0..1 */
  at: number;
  /** camera position */
  pos: [number, number, number];
  /** camera lookAt target */
  look: [number, number, number];
  amplitude: number;
  frequency: number;
  lineSharpness: number;
}

/**
 * Choreography for "The Solving Field". One scene, scroll 0→1.
 * 0.00 Hero: low grazing, calm.
 * 0.15 About: lift + pull back, amplitude up.
 * 0.30 Work: 3/4 top-down orbit, denser lines.
 * 0.55 Research: dive close.
 * 0.70 Exp/Pubs: dolly back, amplitude decays (converging).
 * 0.90 Stack: nearly frozen crisp lattice.
 * 1.00 Contact: face-on flat, calm.
 */
const KEYFRAMES: Keyframe[] = [
  { at: 0.0, pos: [0, 0.9, 6.2], look: [0, 0, 0], amplitude: 1.05, frequency: 1.1, lineSharpness: 0.9 },
  { at: 0.15, pos: [0.6, 2.6, 7.4], look: [0, 0, 0], amplitude: 1.45, frequency: 1.25, lineSharpness: 1.0 },
  { at: 0.3, pos: [2.4, 6.4, 4.6], look: [0, -0.2, 0], amplitude: 1.25, frequency: 1.7, lineSharpness: 1.5 },
  { at: 0.55, pos: [-0.8, 1.2, 3.1], look: [0, 0.1, 0], amplitude: 1.6, frequency: 1.9, lineSharpness: 1.3 },
  { at: 0.7, pos: [0.2, 3.0, 8.0], look: [0, 0, 0], amplitude: 0.85, frequency: 1.4, lineSharpness: 1.4 },
  { at: 0.9, pos: [0, 1.4, 6.6], look: [0, 0, 0], amplitude: 0.32, frequency: 1.2, lineSharpness: 2.2 },
  { at: 1.0, pos: [0, 0.05, 7.2], look: [0, 0, 0], amplitude: 0.5, frequency: 1.0, lineSharpness: 1.6 },
];

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _look = new THREE.Vector3();

/** Sample the choreography at scroll s (0..1) → writes into provided scratch. */
function sample(
  s: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
  out: { amplitude: number; frequency: number; lineSharpness: number }
): void {
  const clamped = Math.min(1, Math.max(0, s));
  let i = 0;
  for (; i < KEYFRAMES.length - 1; i++) {
    if (clamped <= KEYFRAMES[i + 1].at) break;
  }
  const k0 = KEYFRAMES[i];
  const k1 = KEYFRAMES[Math.min(i + 1, KEYFRAMES.length - 1)];
  const span = Math.max(1e-5, k1.at - k0.at);
  const t = smoothstep(Math.min(1, Math.max(0, (clamped - k0.at) / span)));

  _a.set(...k0.pos);
  _b.set(...k1.pos);
  outPos.lerpVectors(_a, _b, t);

  _a.set(...k0.look);
  _b.set(...k1.look);
  outLook.lerpVectors(_a, _b, t);

  out.amplitude = THREE.MathUtils.lerp(k0.amplitude, k1.amplitude, t);
  out.frequency = THREE.MathUtils.lerp(k0.frequency, k1.frequency, t);
  out.lineSharpness = THREE.MathUtils.lerp(k0.lineSharpness, k1.lineSharpness, t);
}

const _scratch = { amplitude: 1, frequency: 1, lineSharpness: 1 };

/**
 * Returns a per-frame stepper. Call inside `useFrame`.
 * Lerps `live.scroll` toward `live.scrollTarget`, samples the choreography,
 * eases the camera + lookAt, applies pointer parallax, and writes the derived
 * field uniforms back into `live`.
 *
 * @param parallaxDeg max camera angular parallax offset in degrees (±)
 */
export function useScrollDriver(parallaxDeg = 2.5) {
  const parallaxRad = (parallaxDeg * Math.PI) / 180;

  return function step(
    camera: THREE.Camera,
    live: FieldLive,
    delta: number
  ): void {
    // frame-rate independent damping factors
    const dScroll = 1 - Math.pow(0.0015, delta);
    const dCam = 1 - Math.pow(0.0009, delta);
    const dPar = 1 - Math.pow(0.02, delta);

    live.scroll += (live.scrollTarget - live.scroll) * dScroll;
    live.parallaxX += (live.mouseX - live.parallaxX) * dPar;
    live.parallaxY += (live.mouseY - live.parallaxY) * dPar;
    // cursor force decays (~0.6s half-life)
    live.mouseStrength *= Math.pow(0.05, delta);

    sample(live.scroll, _a, _look, _scratch);
    live.amplitude = _scratch.amplitude;
    live.frequency = _scratch.frequency;
    live.lineSharpness = _scratch.lineSharpness;

    // pointer parallax: orbit the camera slightly around the look target
    const radius = _a.distanceTo(_look);
    const offX = Math.sin(live.parallaxX * parallaxRad) * radius * 0.06;
    const offY = Math.sin(live.parallaxY * parallaxRad) * radius * 0.045;
    _b.copy(_a);
    _b.x += offX;
    _b.y += offY;

    camera.position.lerp(_b, dCam);
    camera.lookAt(_look);
  };
}

export default useScrollDriver;
