"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icons";

export default function Me({ onReset }) {
  const [s, setS] = useState(null);
  useEffect(() => { fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then(setS).catch(() => {}); }, []);

  const reset = async () => {
    if (!confirm("Reset demo? This clears all swipes, matches and chats.")) return;
    await fetch("/api/reset", { method: "POST" });
    onReset();
  };

  return (
    <section className="page">
      <header className="topbar"><h1 className="page-title">Me</h1></header>
      <div className="me-card">
        <div className="avatar me big"><span>You</span></div>
        <h2>You <small>· demo user</small></h2>
        <p>Single logged-in user — no sign-in needed.</p>
      </div>
      <div className="stats">
        <div><b>{s?.liked ?? "–"}</b><span>Likes sent</span></div>
        <div><b>{s?.passed ?? "–"}</b><span>Passes</span></div>
        <div><b>{s?.matches ?? "–"}</b><span>Matches</span></div>
        <div><b>{s?.remaining ?? "–"}</b><span>Left to see</span></div>
      </div>
      <div className="promise">
        <Icon name="lock" size={18} />
        <p><b>The Coy promise.</b> Nobody sees that you liked them — or that they liked you — unless it's mutual.</p>
      </div>
      <button className="btn ghost" onClick={reset}><Icon name="refresh" size={18} /> Reset demo data</button>
    </section>
  );
}
