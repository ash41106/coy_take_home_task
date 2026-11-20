// Tiny dependency-free validators. Each returns { ok: true, value } or { ok: false, error }.
const bad = (error) => ({ ok: false, error });

export const ACTIONS = ["like", "pass", "super"];

export function parseSwipe(body) {
  if (!body || typeof body !== "object") return bad("JSON body required");
  const { profileId, action } = body;
  if (typeof profileId !== "string" || !/^p\d{2,4}$/.test(profileId)) return bad("profileId must look like 'p01'");
  if (!ACTIONS.includes(action)) return bad("action must be like, pass or super");
  return { ok: true, value: { profileId, action } };
}

export function parseMessage(body) {
  if (!body || typeof body !== "object") return bad("JSON body required");
  if (typeof body.profileId !== "string" || !/^p\d{2,4}$/.test(body.profileId)) return bad("invalid profileId");
  if (typeof body.text !== "string") return bad("text must be a string");
  const text = body.text.trim().slice(0, 500);
  if (!text) return bad("message is empty");
  return { ok: true, value: { profileId: body.profileId, text } };
}

export function parseId(id) {
  return typeof id === "string" && /^p\d{2,4}$/.test(id) ? { ok: true, value: id } : bad("invalid id");
}

export function parseFeedQuery(q) {
  const num = (k, d) => {
    const v = q.get(k);
    if (v === null || v === "") return d;
    const n = Number(v);
    return Number.isInteger(n) && n >= 18 && n <= 99 ? n : NaN;
  };
  const minAge = num("minAge", 18), maxAge = num("maxAge", 99);
  if (Number.isNaN(minAge) || Number.isNaN(maxAge)) return bad("ages must be integers between 18 and 99");
  if (minAge > maxAge) return bad("minAge cannot exceed maxAge");
  const city = (q.get("city") || "all").slice(0, 60);
  return { ok: true, value: { minAge, maxAge, city } };
}
