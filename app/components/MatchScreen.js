"use client";
import { motion } from "framer-motion";
import Photo from "./Photo";
import { Heart, Sparkle } from "./Art";
import { Icon } from "./Icons";

const COLORS = ["#fff", "#ffd166", "#ffe3ec", "#c9a6ff", "#ffb3cd"];

export default function MatchScreen({ p, onClose, onChat }) {
  const bits = Array.from({ length: 44 }, (_, i) => ({
    left: (i * 37) % 100, delay: (i % 9) * 0.12, dur: 2.6 + (i % 5) * 0.4, size: 12 + (i % 4) * 8, kind: i % 4,
    color: COLORS[i % COLORS.length],
  }));
  return (
    <motion.div className="match" data-testid="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {bits.map((b, i) => (
        <span key={i} className="confetti" style={{ left: b.left + "%", animationDelay: b.delay + "s", animationDuration: b.dur + "s" }}>
          {b.kind === 0 && <Heart size={b.size + 6} from="#fff" to="#ffc2d9" />}
          {b.kind === 1 && <Sparkle size={b.size} color={b.color} />}
          {b.kind === 2 && <i className="paper" style={{ width: b.size * 0.5, height: b.size, background: b.color }} />}
          {b.kind === 3 && <i className="dot" style={{ width: b.size * 0.5, height: b.size * 0.5, background: b.color }} />}
        </span>
      ))}
      <motion.div className="match-body" initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <h1>It's a match!</h1>
        <p>You and {p.name} liked each other</p>
        <div className="pair">
          <div className="avatar me"><span>You</span></div>
          <motion.div className="pulse-heart" animate={{ scale: [1, 1.22, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Heart size={58} from="#fff" to="#ffc2d9" /></motion.div>
          <div className="avatar"><Photo p={p} /></div>
        </div>
        <button className="btn big" onClick={onChat}><Icon name="chat" size={20} /> Say hello</button>
        <button className="btn ghost" onClick={onClose}>Keep swiping</button>
      </motion.div>
    </motion.div>
  );
}
