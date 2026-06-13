"use client";

import { useEffect } from "react";
import { nav } from "@/lib/data";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  onNavigate: (id: string) => void;
};

export default function MobileNav({
  open,
  onClose,
  activeId,
  onNavigate,
}: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-[250ms] motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <nav
        aria-label="Mobile navigation"
        className={`glass absolute top-0 right-0 flex h-full w-72 max-w-[80vw] flex-col gap-2 p-6 transition-transform duration-[250ms] ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="mb-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center self-end rounded-full text-fg"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            className={`flex min-h-11 items-center rounded-xl px-4 text-lg transition-colors ${
              activeId === item.id ? "text-accent" : "text-fg-muted"
            } hover:text-fg`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
