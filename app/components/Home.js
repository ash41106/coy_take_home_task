"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { Icon } from "./Icons";
import Photo from "./Photo";
import "./home.css";
import { Heart, Badge, Sparkle } from "./Art";

const STEPS = [
  { e: "eye", t: "Discover", d: "One profile at a time — no endless scrolling, no noise." },
  { e: "heart", t: "Like quietly", d: "Swipe right in secret. They never see it unless they like you back." },
  { e: "spark", t: "It's a match", d: "Only mutual sparks light up — then the conversation begins." },
];
const FEATURES = [
  { i: "lock", t: "Secret admirers, kept secret", d: "No “who liked you” list. Ever. Mutual or nothing." },
  { i: "star", t: "Super likes", d: "Make your interest unmistakable — without breaking the promise." },
  { i: "filter", t: "Your vibe, your filters", d: "Narrow by age and city, find your people faster." },
  { i: "chat", t: "Icebreakers built in", d: "Matched? One tap and the first hello is sent." },
];
const TAGS = ["Chai over coffee", "Rain walks", "Indie playlists", "Sunset chasers", "Bookshop dates", "Dancing in the kitchen", "Midnight pani puri", "Golden retrievers", "Road trips", "Poetry & pasta"];
const QUOTES = [
  { q: "I stopped overthinking who liked me. It just… happened.", n: "Meera, 23" },
  { q: "Finally an app where a like feels like a secret, not a statistic.", n: "Arjun, 28" },
  { q: "Matched at midnight, coffee by Sunday. Coy is dangerous.", n: "Tara, 24" },
];

function Count({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => { const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [to]);
  return <>{v}{suffix}</>;
}

export default function Home({ onStart }) {
  const scroller = useRef(null);
  const [people, setPeople] = useState([]);
  const [stats, setStats] = useState(null);
  const { scrollY } = useScroll({ container: scroller });
  const heroY = useTransform(scrollY, [0, 400], [0, 90]);
  const heroFade = useTransform(scrollY, [0, 320], [1, 0.25]);
  const view = { once: true, root: scroller, amount: 0.3 };

  useEffect(() => {
    fetch("/api/feed", { cache: "no-store" }).then((r) => r.json()).then((d) => setPeople(d.profiles.slice(0, 3))).catch(() => {});
    fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  const reveal = (i = 0) => ({ initial: { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 }, viewport: view, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } });

  return (
    <div className="home" ref={scroller} data-testid="home">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
        <motion.div style={{ y: heroY, opacity: heroFade }} className="hero-inner">
          <motion.span className="pill" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {people.length > 0 && <span className="avs">{people.map((p) => <span className="av" key={p.id}><Photo p={p} /></span>)}</span>}
            Where crushes turn into couples
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}>
            Love, but make it <em>coy.</em>
          </motion.h1>
          <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            Swipe in secret. Spark only when it's <b>mutual</b>. No pressure, no public likes — just butterflies.
          </motion.p>

          {/* floating card stack */}
          <div className="stack" aria-hidden>
            {people[2] && <motion.div className="mini c3" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}><Photo p={people[2]} /></motion.div>}
            {people[1] && <motion.div className="mini c2" animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.4 }}><Photo p={people[1]} /></motion.div>}
            {people[0] && (
              <motion.div className="mini c1" animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
                <Photo p={people[0]} />
                <div className="mini-meta"><b>{people[0].name}, {people[0].age}</b><span>{people[0].place}</span></div>
              </motion.div>
            )}
            <motion.span className="float-chip f1" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.4 }}>{people[1] && <span className="chip-av"><Photo p={people[1]} /></span>}<Badge from="#ff7aa2" to="#e0316a" size={28}><Heart size={14} from="#fff" to="#ffe3ec" gloss={false} /></Badge> It's a match!</motion.span>
            <motion.span className="float-chip f2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.9 }}><Badge from="#ffd166" to="#f59e0b" size={28}><Icon name="star" size={15} fill="#fff" /></Badge> Super like</motion.span>
            <motion.span className="float-chip f3" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4.4 }}><Badge from="#a78bfa" to="#7c3aed" size={28}><Icon name="lock" size={15} /></Badge> Secret till mutual</motion.span>
          </div>

          <motion.button className="cta" onClick={onStart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} animate={{ boxShadow: ["0 0 0 0 rgba(255,77,126,.5)", "0 0 0 18px rgba(255,77,126,0)"] }} transition={{ boxShadow: { repeat: Infinity, duration: 1.8 } }}>
            Start discovering <Icon name="heart" size={20} fill="currentColor" />
          </motion.button>
          <p className="scroll-cue">scroll for the magic ↓</p>
        </motion.div>
      </section>

      {/* ================= LIVE STATS ================= */}
      <motion.section className="live" {...reveal()}>
        <div><b><Count to={stats ? stats.remaining : 35} /></b><span>people nearby</span></div>
        <div><b><Count to={stats ? stats.liked : 0} /></b><span>hearts sent</span></div>
        <div><b><Count to={stats ? stats.matches : 0} /></b><span>your matches</span></div>
      </motion.section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee" aria-hidden>
        <div className="track">{[...TAGS, ...TAGS].map((t, i) => <span key={i}><Heart className="tag-dot" size={11} from="#ff9ab8" to="#e0316a" gloss={false} />{t}</span>)}</div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section className="sec">
        <motion.h2 {...reveal()}>How the <em>magic</em> happens</motion.h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <motion.div key={s.t} className="step" {...reveal(i)} whileHover={{ y: -6 }}>
              <div className="step-n">{i + 1}</div>
              <div className="step-e">{s.e === "heart" ? <Heart size={26} /> : s.e === "spark" ? <Sparkle size={24} color="#a855f7" /> : <Icon name="eye" size={24} />}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PROMISE ================= */}
      <motion.section className="promise-hero" {...reveal()}>
        <div className="glow" />
        <motion.div className="lock" animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4 }}><Icon name="lock" size={34} /></motion.div>
        <h2>The Coy promise</h2>
        <p>Nobody ever sees that you liked them — or that they liked you — <b>unless it's mutual.</b> Your crush stays your secret until it's theirs too.</p>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <section className="sec">
        <motion.h2 {...reveal()}>Made for <em>butterflies</em></motion.h2>
        <div className="feats">
          {FEATURES.map((f, i) => (
            <motion.div key={f.t} className="feat" {...reveal(i)} whileHover={{ scale: 1.03 }}>
              <span className="feat-i"><Icon name={f.i} size={22} /></span>
              <div><h3>{f.t}</h3><p>{f.d}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= QUOTES ================= */}
      <section className="sec">
        <motion.h2 {...reveal()}>Sparks, <em>overheard</em></motion.h2>
        <div className="quotes">
          {QUOTES.map((q, i) => (
            <motion.blockquote key={q.n} {...reveal(i)}>
              <span className="qm">“</span>{q.q}<footer>— {q.n}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <motion.section className="final" {...reveal()}>
        <div className="hearts-row" aria-hidden><Heart size={20} from="#fff" to="#ffd6e6" /><Heart size={30} from="#fff" to="#ffc2d9" /><Heart size={42} from="#fff" to="#ffb3cd" /><Heart size={30} from="#fff" to="#ffc2d9" /><Heart size={20} from="#fff" to="#ffd6e6" /></div>
        <h2>Your person is <em>one swipe</em> away.</h2>
        <p>{stats ? `${stats.remaining} people` : "Dozens of people"} are waiting to be discovered.</p>
        <motion.button className="cta light" onClick={onStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Find my spark <Icon name="flame" size={20} />
        </motion.button>
        <small>coy. · made with love for the shy-hearted</small>
      </motion.section>
    </div>
  );
}
