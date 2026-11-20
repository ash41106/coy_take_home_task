"use client";
import { Heart, Sparkle } from "./Art";
import "./backdrop.css";

// Deterministic pseudo-random so server and client render identically (no hydration mismatch).
const r = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

const PALETTE = [
  ["#ff9ab8", "#ff4d7e"], ["#ffb3c6", "#f0568a"], ["#f6a6d7", "#c026d3"],
  ["#ffc2a8", "#ff6f91"], ["#e0aaff", "#a855f7"], ["#ffd1dc", "#ff7aa2"],
];

const HEARTS = Array.from({ length: 30 }, (_, i) => {
  const depth = r(i, 1);                        // 0 = far, 1 = near
  const size = 18 + Math.round(depth * depth * 84);
  return {
    left: Math.round(r(i, 2) * 100),
    size,
    blur: size > 60 ? 3 : size > 38 ? 1.2 : 0,
    opacity: 0.28 + depth * 0.4,
    dur: 16 + Math.round((1 - depth) * 16) + Math.round(r(i, 3) * 6),
    delay: -Math.round(r(i, 4) * 34),
    sway: 14 + Math.round(r(i, 5) * 36),
    pal: PALETTE[i % PALETTE.length],
    outline: i % 7 === 3,
  };
});

const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  left: Math.round(r(i, 7) * 100), top: Math.round(r(i, 8) * 100),
  size: 8 + Math.round(r(i, 9) * 16), delay: -(r(i, 10) * 6).toFixed(1), dur: (2.4 + r(i, 11) * 3).toFixed(1),
}));

const BOKEH = Array.from({ length: 9 }, (_, i) => ({
  left: Math.round(r(i, 12) * 100), top: Math.round(r(i, 13) * 100),
  size: 90 + Math.round(r(i, 14) * 190), dur: 14 + Math.round(r(i, 15) * 12), delay: -Math.round(r(i, 16) * 12),
  c: ["#ff8fb3", "#c9a6ff", "#ffc3a0", "#ffb3d9"][i % 4],
}));

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden>
      {BOKEH.map((b, i) => (
        <i key={i} className="bokeh" style={{ left: b.left + "%", top: b.top + "%", width: b.size, height: b.size, background: b.c, animationDuration: b.dur + "s", animationDelay: b.delay + "s" }} />
      ))}

      {/* big decorative hearts framing the phone on wide screens */}
      <Heart className="giant g1" size={340} from="#ffb3c6" to="#ff4d7e" />
      <Heart className="giant g2" size={280} from="#e0aaff" to="#a855f7" />
      <Heart className="giant g3" size={220} outline from="#ff4d7e" to="#a855f7" />
      <Heart className="giant g4" size={170} outline from="#ff7aa2" to="#ff4d7e" />

      {HEARTS.map((h, i) => (
        <span key={i} className="rise" style={{ left: h.left + "%", animationDuration: h.dur + "s", animationDelay: h.delay + "s", opacity: h.opacity, filter: h.blur ? `blur(${h.blur}px)` : undefined }}>
          <span className="swayer" style={{ "--sway": h.sway + "px", animationDuration: 5 + (i % 4) + "s" }}>
            <Heart size={h.size} from={h.pal[0]} to={h.pal[1]} outline={h.outline} />
          </span>
        </span>
      ))}

      {SPARKLES.map((s, i) => (
        <Sparkle key={i} className="twinkle" size={s.size} color={i % 3 === 0 ? "#ffd166" : "#fff"} style={{ left: s.left + "%", top: s.top + "%", animationDelay: s.delay + "s", animationDuration: s.dur + "s" }} />
      ))}
    </div>
  );
}
