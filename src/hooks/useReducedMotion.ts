"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reactive `prefers-reduced-motion` flag. SSR-safe (defaults to false on the
 * server, then syncs + subscribes on the client).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
    const mql = window.matchMedia(QUERY);
      const onChange = () => onStoreChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
