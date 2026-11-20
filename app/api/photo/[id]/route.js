import { read } from "@/lib/db";
import { parseId } from "@/lib/validate";

export const dynamic = "force-dynamic";

const PAIRS = [
  ["#ff9aa2", "#ffb7b2"], ["#f6a6d7", "#c3a6ff"], ["#ffd1a6", "#ff8fa3"],
  ["#ffc2e2", "#ff8cc6"], ["#ffb3c6", "#e0aaff"], ["#fbc2eb", "#a6c1ee"],
];
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// GET /api/photo/p01 -> locally generated illustrated portrait (no external host needed)
export async function GET(_req, { params }) {
  const parsed = parseId(params.id);
  const p = parsed.ok && read().profiles.find((x) => x.id === parsed.value);
  if (!p) return new Response("not found", { status: 404 });
  const n = Number(p.id.slice(1));
  const [a, b] = PAIRS[n % PAIRS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="600" fill="url(#g)"/><circle cx="330" cy="90" r="120" fill="#fff" opacity=".18"/><circle cx="60" cy="520" r="150" fill="#fff" opacity=".14"/><circle cx="200" cy="250" r="82" fill="#fff" opacity=".9"/><path d="M60 600c0-120 60-190 140-190s140 70 140 190z" fill="#fff" opacity=".9"/><text x="200" y="278" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="84" fill="${b}">${esc(p.name[0])}</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
}
