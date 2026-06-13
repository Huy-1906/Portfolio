"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type Resolved = "dark" | "light";

const STORAGE_KEY = "theme";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

function readStored(): Theme {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "light" || v === "system" ? v : "light";
}

function systemResolved(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

function resolve(theme: Theme): Resolved {
  return theme === "system" ? systemResolved() : theme;
}

function apply(resolved: Resolved) {
  const root = document.documentElement;
  root.classList.toggle("light", resolved === "light");
  root.classList.toggle("dark", resolved === "dark");
}

export function useTheme(): {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: Resolved;
} {
  const [theme, setThemeState] = useState<Theme>(() => readStored());
  const [resolved, setResolved] = useState<Resolved>(() => resolve(readStored()));

  // Sync React state to whatever the anti-FOUC script already applied.
  useEffect(() => {
    const stored = readStored();
    const r = resolve(stored);
    apply(r);
  }, []);

  // Follow system changes only while theme === "system".
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia(LIGHT_QUERY);
    const onChange = () => {
      const r: Resolved = mql.matches ? "light" : "dark";
      setResolved(r);
      apply(r);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, t);
    const r = resolve(t);
    setThemeState(t);
    setResolved(r);
    apply(r);
  }, []);

  return { theme, setTheme, resolved };
}
