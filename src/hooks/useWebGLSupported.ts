"use client";

import { useSyncExternalStore } from "react";

function detect(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext;
  } catch {
    return false;
  }
}

/**
 * Returns whether a WebGL context can be created. Runs once on mount
 * (throwaway canvas), so it is SSR-safe and stable for the session.
 */
export function useWebGLSupported(): boolean {
  return useSyncExternalStore(
    () => () => {},
    detect,
    () => false,
  );
}
