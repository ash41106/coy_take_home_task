"use client";
import { motion } from "framer-motion";
import { Envelope } from "./Art";

export default function Empty({ filtered, onClear, onRestart }) {
  return (
    <motion.div className="empty" data-testid="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="empty-heart"><Envelope size={110} /></div>
      <h2>{filtered ? "No one matches those filters" : "You've seen everyone for now"}</h2>
      <p>{filtered ? "Try widening your age range or city — new hearts are waiting." : "Check back soon — new people join Coy every day. Your matches are waiting in the Matches tab."}</p>
      {filtered && <button className="btn" onClick={onClear}>Clear filters</button>}
      {!filtered && onRestart && <button className="btn" onClick={onRestart}>Start over (reset demo)</button>}
    </motion.div>
  );
}
