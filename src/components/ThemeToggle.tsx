"use client";

import { useTheme, type Theme } from "@/hooks/useTheme";

const NEXT: Record<Theme, Theme> = {
  dark: "light",
  light: "system",
  system: "dark",
};

const LABEL: Record<Theme, string> = {
  dark: "Dark theme",
  light: "Light theme",
  system: "System theme",
};

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      className="glass glass-hover inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-fg"
    >
      {theme === "dark" && <MoonIcon />}
      {theme === "light" && <SunIcon />}
      {theme === "system" && <MonitorIcon />}
    </button>
  );
}
