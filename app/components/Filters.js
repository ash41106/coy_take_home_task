"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const DEFAULT_FILTERS = { minAge: 18, maxAge: 40, city: "all" };

export default function Filters({ value, cities, onClose, onApply }) {
  const [f, setF] = useState(value);
  return (
    <motion.div className="sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <h3>Discovery preferences</h3>
        <label>Min age <b>{f.minAge}</b>
          <input type="range" min="18" max="40" value={f.minAge} onChange={(e) => setF({ ...f, minAge: Math.min(+e.target.value, f.maxAge) })} />
        </label>
        <label>Max age <b>{f.maxAge}</b>
          <input type="range" min="18" max="40" value={f.maxAge} onChange={(e) => setF({ ...f, maxAge: Math.max(+e.target.value, f.minAge) })} />
        </label>
        <label>City
          <select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>
            <option value="all">Anywhere</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <div className="sheet-actions">
          <button className="btn ghost" onClick={() => onApply(DEFAULT_FILTERS)}>Reset</button>
          <button className="btn" onClick={() => onApply(f)}>Apply</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
