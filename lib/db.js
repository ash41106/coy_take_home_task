import fs from "fs";
import path from "path";
import { makeProfiles, SEED_VERSION } from "./seed";

const FILE = path.join(process.cwd(), "data", "db.json");

// Shared across route bundles via globalThis so every request uses ONE queue + cache.
const G = (globalThis.__coy ||= { db: null, queue: Promise.resolve() });

function fresh() {
  return { v: SEED_VERSION, profiles: makeProfiles(), swipes: {}, matches: [], messages: {} };
}

function persist(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  // Atomic replace so a crash never leaves a half-written file. Windows can briefly lock the
  // target (antivirus/indexer) -> retry, then fall back to a direct write.
  for (let i = 0; ; i++) {
    try { fs.renameSync(tmp, FILE); break; }
    catch (e) {
      if (!["EPERM", "EBUSY", "EACCES"].includes(e.code)) throw e;
      if (i >= 5) { fs.writeFileSync(FILE, fs.readFileSync(tmp)); try { fs.unlinkSync(tmp); } catch {} break; }
      const end = Date.now() + 20 * (i + 1);
      while (Date.now() < end); // tiny sync backoff
    }
  }
  G.mtime = mtime();
}

function mtime() {
  try { return fs.statSync(FILE).mtimeMs; } catch { return 0; }
}

// Refresh seed-owned fields (photos) on older saved data without touching swipes/matches/messages.
function migrate(db) {
  const latest = new Map(makeProfiles().map((p) => [p.id, p]));
  for (const p of db.profiles) { const n = latest.get(p.id); if (n) p.photo = n.photo; }
  db.v = SEED_VERSION;
  persist(db);
}

function ensure() {
  // Reload if the file was changed/reset on disk by something else (e.g. a test run or manual edit).
  if (G.db && G.mtime === mtime()) return G.db;
  try {
    G.db = JSON.parse(fs.readFileSync(FILE, "utf8"));
    G.mtime = mtime();
    if (G.db.v !== SEED_VERSION) migrate(G.db);
  } catch {
    G.db = fresh();
    persist(G.db);
  }
  return G.db;
}

/** Read-only snapshot access (in-memory, always consistent with the last committed write). */
export function read() {
  return ensure();
}

/**
 * Run a read-modify-write transaction. Transactions are serialised, so two concurrent
 * swipes can never overwrite each other (no lost updates, no double matches).
 * If `fn` throws, nothing is persisted and the in-memory state is rolled back.
 */
export function mutate(fn) {
  const run = G.queue.then(() => {
    const db = ensure();
    const backup = structuredClone(db);
    try {
      const out = fn(db);
      persist(db);
      return out;
    } catch (e) {
      G.db = backup;
      throw e;
    }
  });
  G.queue = run.catch(() => {});
  return run;
}

export function reset() {
  return mutate((db) => {
    Object.assign(db, fresh());
  });
}

// Strip server-only fields. `likedMe` must never reach the client.
export function publicProfile({ likedMe, ...rest }) {
  return rest;
}

// Stable pseudo-random order so liked-you profiles can't be inferred by position.
export function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
