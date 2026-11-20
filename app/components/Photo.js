"use client";
import { useState } from "react";

// Remote portrait first; if the host is unreachable, fall back to our locally generated SVG portrait.
export default function Photo({ p }) {
  const [src, setSrc] = useState(p.photo);
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className="photo"
      src={src}
      alt={p.name}
      draggable={false}
      onError={() => { const local = `/api/photo/${p.id}`; if (src !== local) setSrc(local); }}
    />
  );
}
