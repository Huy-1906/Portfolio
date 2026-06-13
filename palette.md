# Design System — Lý Gia Huy Portfolio

A dark-first, dual-theme design system built around a scientific/computational identity. This document is the single source of truth for color, type, spacing, motion, and the liquid-glass surface language.

---

## 1. Brand & Principles

- **Identity**: computational mechanics meets software and AI — precise, technical, premium.
- **Mode**: dark default (OLED), full light support, `system` follows OS.
- **Surface language**: liquid glass — translucent, blurred, softly lit panels over a deep canvas.
- **Restraint**: one accent (green "run" color), color never the sole signal, motion always meaningful.

---

## 2. Color Tokens

### Dark (default)
| Role | Token | Hex | Contrast on bg |
|------|-------|-----|----------------|
| Background | `--bg` | `#0F172A` | — |
| Elevated bg | `--bg-elev` | `#131C30` | — |
| Foreground | `--fg` | `#F8FAFC` | 15.8:1 (AAA) |
| Muted text | `--fg-muted` | `#94A3B8` | 6.1:1 (AA) |
| Accent | `--accent` | `#22C55E` | 7.4:1 (AAA large) |
| Surface | `--surface` | `#1E293B` | — |
| Surface alt | `--surface-2` | `#334155` | — |
| Border | `--border` | `#475569` | — |

### Light
| Role | Token | Hex | Contrast on bg |
|------|-------|-----|----------------|
| Background | `--bg` | `#F8FAFC` | — |
| Elevated bg | `--bg-elev` | `#FFFFFF` | — |
| Foreground | `--fg` | `#0F172A` | 15.8:1 (AAA) |
| Muted text | `--fg-muted` | `#475569` | 7.0:1 (AAA) |
| Accent | `--accent` | `#16A34A` | 3.9:1 (AA large) — darker for light bg |
| Surface | `--surface` | `#FFFFFF` | — |
| Border | `--border` | `#CBD5E1` | — |

**Rule**: accent shifts darker (`#16A34A`) in light mode to keep AA contrast. Functional state colors always pair with icon/text, never color alone.

---

## 3. Liquid Glass Spec

| Property | Dark | Light |
|----------|------|-------|
| Background | `rgba(30,41,59,0.45)` | `rgba(255,255,255,0.55)` |
| Border | `rgba(255,255,255,0.12)` | `rgba(15,23,42,0.10)` |
| Inner glow | `rgba(255,255,255,0.06)` | `rgba(15,23,42,0.04)` |
| Blur | `14px` + `saturate(140%)` | same |
| Shadow | `0 8px 30px rgba(0,0,0,0.45)` | `0 8px 30px rgba(15,23,42,0.12)` |

Usage: header nav, project cards, LLM-Lab frame, contact panel. **Not** for body text blocks. Hover lifts `translateY(-3px)` + accent-tinted border. Blur must signal layering/dismissal, never pure decoration.

---

## 4. Typography

- **Family**: Inter (300 / 400 / 500 / 600 / 700), `next/font`, var `--font-inter`.
- **Scale** (rem): 0.75 · 0.875 · 1 · 1.125 · 1.5 · 2 · 3 · 4.
- **Body**: 16px min, line-height 1.6, measure 60–75ch.
- **Headings**: 600–700 weight, tight tracking.
- **Numbers/data**: tabular figures for metrics (F1, year, DOI).

---

## 5. Spacing & Layout

- **Rhythm**: 4 / 8 px base — gaps and padding in multiples (8, 16, 24, 32, 48, 64, 96).
- **Container**: max-width 72rem (`max-w-6xl`), responsive gutters (24px mobile → 48px desktop).
- **Breakpoints**: 375 / 768 / 1024 / 1440.
- **Section rhythm**: vertical padding 96px desktop, 64px mobile.

---

## 6. Motion Tokens

| Token | Value | Use |
|-------|-------|-----|
| micro | 150–200ms ease-out | hover, toggle, press |
| transition | 250–300ms ease | theme switch, reveal |
| stagger | 40ms / item | list/grid entrance |
| scroll-reveal | 600ms ease | section enter |

Easing: ease-out entering, ease-in exiting; exit ~70% of enter duration. All motion gated by `prefers-reduced-motion` → instant, no scroll-jack, 3D replaced by static poster.

---

## 7. Component States

- **Interactive**: rest → hover (lift + accent border) → active (scale 0.98) → focus (2px accent ring, 2px offset) → disabled (opacity 0.5, no pointer).
- **Touch target**: ≥44px.
- **Cursor**: pointer on all clickables.

---

## 8. 3D / Canvas Guidelines

- One shared WebGL context for the whole page.
- GPU shaders for per-vertex math (no CPU per-frame loops).
- `dpr [1, 1.75]`, pause rAF offscreen, mobile <768px & reduced-motion → no canvas.
- Canvas `aria-hidden`; all information also lives in semantic DOM.

---

## 9. Accessibility Checklist

- [ ] Text contrast ≥4.5:1 (body), verified both themes
- [ ] Focus rings visible (accent), keyboard nav full
- [ ] Color never the only signal
- [ ] `prefers-reduced-motion` respected — 3D → poster
- [ ] Heading hierarchy sequential, skip-link present
- [ ] Canvas decorative + `aria-hidden`, DOM is complete without WebGL
- [ ] Touch targets ≥44px, 8px spacing

---

## 10. Anti-patterns

- Light mode as an afterthought (design both together).
- Glass everywhere → no hierarchy. Reserve for elevated surfaces.
- Multiple WebGL canvases.
- Animating width/height/top/left (use transform/opacity).
- Emoji as icons (use Lucide/Heroicons SVG).
- Raw hex in components (use tokens).
