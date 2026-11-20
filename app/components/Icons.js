const P = {
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  flame: <path d="M12 2c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  heart: <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.5-8 11-8 11z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  send: <path d="M3 11l18-8-8 18-2-7z" />,
  back: <path d="M15 5l-7 7 7 7" />,
  trash: <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />,
  refresh: <path d="M20 11a8 8 0 10-2 6M20 4v7h-7" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
};

export function Icon({ name, size = 24, fill = "none", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      {P[name]}
    </svg>
  );
}
