"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import SwipeCard, { StaticCard } from "./SwipeCard";
import MatchScreen from "./MatchScreen";
import Filters, { DEFAULT_FILTERS } from "./Filters";
import Empty from "./Empty";

export default function Discover({ onMatchChange, onChat }) {
  const [deck, setDeck] = useState(null);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [match, setMatch] = useState(null);
  const [toast, setToast] = useState(null);
  const [info, setInfo] = useState(false);
  const topRef = useRef(null);
  const busy = useRef(false);

  const load = useCallback(async (f) => {
    const q = new URLSearchParams({ minAge: f.minAge, maxAge: f.maxAge, city: f.city });
    const res = await fetch("/api/feed?" + q, { cache: "no-store" });
    if (!res.ok) throw new Error("feed failed");
    const d = await res.json();
    setDeck(d.profiles);
    setCities(d.cities);
  }, []);
  useEffect(() => { load(filters).catch(() => setDeck([])); }, [filters, load]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  // Called after the card finished flying away.
  const commit = useCallback(async (profile, action) => {
    setDeck((d) => d.filter((p) => p.id !== profile.id)); // never shown again, even optimistically
    setInfo(false);
    try {
      const r = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, action }),
      });
      if (!r.ok) throw new Error("swipe failed");
      const res = await r.json();
      if (res.match) { setMatch(res.profile); onMatchChange?.(); }
      else flash(action === "like" ? "Liked" : action === "super" ? "Super liked" : "Passed");
    } catch {
      setDeck((d) => [profile, ...d]); // failure: restore card so nothing is lost
      flash("Couldn't save swipe — try again");
    } finally {
      busy.current = false;
    }
  }, [onMatchChange]);

  const swipe = (dir) => {
    if (busy.current || !deck?.length) return;
    busy.current = true;
    topRef.current?.fling(dir);
  };

  useEffect(() => {
    const k = (e) => {
      if (match || showFilters) return;
      if (e.key === "ArrowRight") swipe("like");
      if (e.key === "ArrowLeft") swipe("pass");
      if (e.key === "ArrowUp") swipe("super");
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const top = deck?.[0];
  const next = deck?.[1];
  const filtered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <section className="discover">
      <header className="topbar">
        <h1 className="logo">coy<span>.</span></h1>
        <button className={"icon-btn" + (filtered ? " on" : "")} onClick={() => setShowFilters(true)} aria-label="Filters">
          <Icon name="filter" />
        </button>
      </header>

      <div className="deck">
        {deck === null && <div className="loader"><i /><i /><i /></div>}
        {deck && !top && <Empty filtered={filtered} onClear={() => setFilters(DEFAULT_FILTERS)} onRestart={async () => { await fetch("/api/reset", { method: "POST" }); onMatchChange?.(); setDeck(null); load(filters).catch(() => setDeck([])); }} />}
        {next && <StaticCard key={next.id} p={next} />}
        {top && <SwipeCard key={top.id} ref={topRef} p={top} info={info} onInfo={() => setInfo((i) => !i)} onDone={commit} />}
      </div>

      {top && (
        <div className="actions">
          <button className="act pass" onClick={() => swipe("pass")} aria-label="Pass"><Icon name="x" size={30} /></button>
          <button className="act sup" onClick={() => swipe("super")} aria-label="Super like"><Icon name="star" size={24} fill="currentColor" /></button>
          <button className="act like" onClick={() => swipe("like")} aria-label="Like"><Icon name="heart" size={30} fill="currentColor" /></button>
        </div>
      )}
      {top && <p className="hint">Drag the card, use buttons, or ← → ↑ keys · {deck.length} left</p>}

      <AnimatePresence>{toast && <motion.div className="toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
      <AnimatePresence>{match && <MatchScreen p={match} onClose={() => setMatch(null)} onChat={() => onChat(match)} />}</AnimatePresence>
      <AnimatePresence>{showFilters && <Filters value={filters} cities={cities} onClose={() => setShowFilters(false)} onApply={(f) => { setFilters(f); setShowFilters(false); }} />}</AnimatePresence>
    </section>
  );
}
