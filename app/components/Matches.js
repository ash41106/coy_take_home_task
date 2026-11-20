"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "./Icons";
import Photo from "./Photo";
import { Heart } from "./Art";

export default function Matches({ initialChat, onChange, onDiscover }) {
  const [list, setList] = useState(null);
  const [chat, setChat] = useState(initialChat || null);

  const load = useCallback(() => {
    fetch("/api/matches", { cache: "no-store" }).then((r) => r.json()).then((d) => setList(d.matches)).catch(() => setList([]));
  }, []);
  useEffect(load, [load]);

  if (chat)
    return <Chat p={chat} onBack={() => { setChat(null); load(); }} onUnmatch={async () => {
      if (!confirm(`Unmatch with ${chat.name}?`)) return;
      await fetch("/api/matches?id=" + chat.id, { method: "DELETE" });
      setChat(null); load(); onChange?.();
    }} />;

  return (
    <section className="page">
      <header className="topbar"><h1 className="page-title">Matches</h1></header>
      <p className="sub"><Icon name="lock" size={14} /> Only mutual likes appear here. We never reveal who liked you first.</p>
      {list === null && <div className="loader"><i /><i /><i /></div>}
      {list && list.length === 0 && (
        <div className="empty">
          <div className="empty-heart"><Heart size={84} /></div>
          <h2>No matches yet</h2>
          <p>Keep swiping — when a like is mutual, it lands here.</p>
          <button className="btn" onClick={onDiscover}>Go discover</button>
        </div>
      )}
      {list && list.length > 0 && (
        <>
          <div className="strip">
            {list.map((m) => (
              <button key={m.id} className="bubble" onClick={() => setChat(m)}>
                <div className="ring"><Photo p={m} /></div>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
          <ul className="mlist">
            {list.map((m, i) => (
              <motion.li key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <button onClick={() => setChat(m)}>
                  <div className="thumb"><Photo p={m} /></div>
                  <div className="txt">
                    <b>{m.name}, {m.age}</b>
                    <span>{m.lastMessage || `Matched · ${new Date(m.matchedAt).toLocaleDateString()} — say hi`}</span>
                  </div>
                  <Icon name="heart" size={18} fill="currentColor" />
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

const STARTERS = ["Hey! Your bio made me smile 😊", "Tea or coffee?", "What's your go-to comfort movie?"];

function Chat({ p, onBack, onUnmatch }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const end = useRef(null);

  const poll = useCallback(() => {
    fetch("/api/messages?id=" + p.id, { cache: "no-store" }).then((r) => r.json()).then((d) => d.messages && setMsgs(d.messages)).catch(() => {});
  }, [p.id]);
  useEffect(() => { poll(); const t = setInterval(poll, 1500); return () => clearInterval(t); }, [poll]);
  // Braces matter: newer browsers return a Promise from scrollIntoView, which React would treat as a cleanup fn.
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const send = async (t) => {
    const body = (t ?? text).trim();
    if (!body) return;
    setText("");
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId: p.id, text: body }) });
    poll();
  };

  return (
    <section className="page chat">
      <header className="chat-head">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <div className="thumb sm"><Photo p={p} /></div>
        <div className="who"><b>{p.name}</b><span>{p.place}</span></div>
        <button className="icon-btn" onClick={onUnmatch} aria-label="Unmatch"><Icon name="trash" size={20} /></button>
      </header>
      <div className="msgs">
        {msgs.length === 0 && (
          <div className="starters">
            <p>You matched! Break the ice</p>
            {STARTERS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
        {msgs.map((m, i) => <div key={i} className={"msg " + (m.from === "me" ? "mine" : "theirs")}>{m.text}</div>)}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${p.name}…`} maxLength={500} />
        <button className="send" aria-label="Send"><Icon name="send" size={20} /></button>
      </form>
    </section>
  );
}
