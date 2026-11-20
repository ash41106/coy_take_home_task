"use client";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Icon } from "./Icons";
import Photo from "./Photo";

export const THRESHOLD = 110;

export function StaticCard({ p }) {
  return (
    <motion.div className="card behind" initial={{ scale: 0.88, y: 24 }} animate={{ scale: 0.94, y: 14 }}>
      <Photo p={p} />
      <div className="shade" />
    </motion.div>
  );
}

/** Top card: drag gestures + imperative `fling(dir)` used by the buttons and keyboard. */
const SwipeCard = forwardRef(function SwipeCard({ p, info, onInfo, onDone }, ref) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const likeOp = useTransform(x, [20, 120], [0, 1]);
  const nopeOp = useTransform(x, [-120, -20], [1, 0]);
  const superOp = useMotionValue(0);

  useEffect(() => {
    controls.start({ scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } });
  }, [controls]);

  const fling = async (dir) => {
    if (dir === "super") {
      superOp.set(1);
      await controls.start({ y: -700, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } });
    } else {
      const to = dir === "like" ? 700 : -700;
      await controls.start({ x: to, rotate: dir === "like" ? 22 : -22, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } });
    }
    onDone(p, dir);
  };
  useImperativeHandle(ref, () => ({ fling }));

  return (
    <motion.div
      className="card"
      data-testid="card"
      data-profile={p.id}
      style={{ x, rotate }}
      animate={controls}
      initial={{ scale: 0.94, y: 14 }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={(_, i) => {
        if (i.offset.x > THRESHOLD || i.velocity.x > 600) fling("like");
        else if (i.offset.x < -THRESHOLD || i.velocity.x < -600) fling("pass");
      }}
    >
      <Photo p={p} />
      <div className="shade" />
      <motion.div className="stamp like" style={{ opacity: likeOp }}>LIKE</motion.div>
      <motion.div className="stamp nope" style={{ opacity: nopeOp }}>NOPE</motion.div>
      <motion.div className="stamp super" style={{ opacity: superOp }}>SUPER ⭐</motion.div>

      <div className="meta" onPointerDownCapture={(e) => e.stopPropagation()}>
        <div className="row">
          <h2>{p.name}<small>{p.age}</small></h2>
          <button className="info-btn" onClick={onInfo} aria-label="More info"><Icon name="info" size={22} /></button>
        </div>
        <p className="place"><Icon name="pin" size={15} /> {p.place}</p>
        <div className={"more" + (info ? " open" : "")}>
          <p className="bio">{p.bio}</p>
          <div className="chips">{p.interests.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
      </div>
    </motion.div>
  );
});

export default SwipeCard;
