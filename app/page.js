"use client";
import { useCallback, useEffect, useState } from "react";
import Discover from "./components/Discover";
import Matches from "./components/Matches";
import Me from "./components/Me";
import Home from "./components/Home";
import Backdrop from "./components/Backdrop";
import { Icon } from "./components/Icons";

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "discover", label: "Discover", icon: "flame" },
  { id: "matches", label: "Matches", icon: "chat" },
  { id: "me", label: "Me", icon: "user" },
];

export default function Page() {
  const [tab, setTab] = useState("home");
  const [matchCount, setMatchCount] = useState(0);
  const [openChat, setOpenChat] = useState(null); // profile to open in chat
  const [epoch, setEpoch] = useState(0); // bump to force-refresh children after reset

  const refreshCount = useCallback(() => {
    fetch("/api/matches", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMatchCount(d.matches.length))
      .catch(() => {});
  }, []);
  useEffect(refreshCount, [refreshCount, tab]);

  return (
    <div className="stage">
      <Backdrop />
      <div className="phone">
        <main className="screen">
          {tab === "home" && <Home key={epoch} onStart={() => setTab("discover")} />}
          {tab === "discover" && (
            <Discover
              key={epoch}
              onMatchChange={refreshCount}
              onChat={(p) => { setOpenChat(p); setTab("matches"); }}
            />
          )}
          {tab === "matches" && <Matches key={epoch} initialChat={openChat} onChange={refreshCount} onDiscover={() => setTab("discover")} />}
          {tab === "me" && <Me onReset={() => { setEpoch((e) => e + 1); refreshCount(); setTab("discover"); }} />}
        </main>
        <nav className="tabbar" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={"tab" + (tab === t.id ? " active" : "")}
              onClick={() => { setTab(t.id); if (t.id !== "matches") setOpenChat(null); }}
            >
              <span className="tab-ico">
                <Icon name={t.icon} />
                {t.id === "matches" && matchCount > 0 && <b className="badge">{matchCount}</b>}
              </span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
