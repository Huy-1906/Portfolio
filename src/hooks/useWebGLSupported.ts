"use client";

import { useEffect, useState } from "react";

let cached: boolean | null = null;

/** Probe once whether a WebGL context can be created. Memoized per page load. */
function probe(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return true; // optimistic on server; real check happens client-side
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * Whether WebGL is available.
 * SSR-safe: returns `true` on the server, then re-checks on mount and
 * downgrades to `false` if no context can be created.
 */
export function useWebGLSupported(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(probe());
  }, []);

  return supported;
}

export default useWebGLSupported;
