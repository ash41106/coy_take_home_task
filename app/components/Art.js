"use client";
import { useId } from "react";

const HEART = "M16 28.5S2 20 2 10.4C2 5.8 5.5 2.5 9.7 2.5c2.7 0 5 1.4 6.3 3.7 1.3-2.3 3.6-3.7 6.3-3.7C26.5 2.5 30 5.8 30 10.4 30 20 16 28.5 16 28.5z";

/** Crisp vector heart with soft gradient + glossy highlight (replaces emoji). */
export function Heart({ size = 24, from = "#ff7aa2", to = "#e0316a", gloss = true, outline = false, style, className }) {
  const id = "h" + useId().replace(/:/g, "");
  return (
    <svg className={className} style={style} width={size} height={size * 0.94} viewBox="0 0 32 30" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {outline ? (
        <path d={HEART} fill="none" stroke={`url(#${id})`} strokeWidth="1.6" />
      ) : (
        <>
          <path d={HEART} fill={`url(#${id})`} />
          {gloss && <path d="M9.2 5.2c-2.6.3-4.6 2.4-4.6 5.1 0 1 .3 2 .8 3 .1-3.6 1.7-6.5 4.2-8.1z" fill="#fff" opacity=".5" />}
        </>
      )}
    </svg>
  );
}

export function Sparkle({ size = 18, color = "#fff", style, className }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z" fill={color} />
    </svg>
  );
}

/** Small round badge holding an icon – used on floating chips. */
export function Badge({ children, from, to, size = 30 }) {
  return (
    <span className="badge-ic" style={{ width: size, height: size, background: `linear-gradient(135deg, ${from}, ${to})` }}>
      {children}
    </span>
  );
}

export function Envelope({ size = 96 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 96 72" aria-hidden>
      <defs>
        <linearGradient id="env" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#ffd6e6" /></linearGradient>
      </defs>
      <rect x="4" y="8" width="88" height="58" rx="10" fill="url(#env)" stroke="#ffb3cd" strokeWidth="2" />
      <path d="M6 14l42 30 42-30" fill="none" stroke="#ffb3cd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(34 24) scale(.95)"><Heart size={30} /></g>
    </svg>
  );
}
