"use client";

/**
 * Pure CSS/SVG fallback for when WebGL is unavailable or motion is reduced.
 * Uses the `.field-poster` class (greyscale radial topography) defined in
 * globals.css, enhanced with a faint inline SVG iso-contour set. No WebGL.
 * Colors are driven by the theme via currentColor (text color = --fg).
 */
export default function StaticFieldPoster() {
  return (
    <div className="field-poster" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          color: "var(--fg)",
          opacity: 0.06,
        }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {Array.from({ length: 14 }).map((_, i) => {
            const r = 70 + i * 58;
            return (
              <ellipse
                key={i}
                cx={720}
                cy={430}
                rx={r}
                ry={r * 0.72}
                transform={`rotate(${-18 + i * 1.5} 720 430)`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
