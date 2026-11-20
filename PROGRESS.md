# Coy – Discover Tab · Progress

Research notes / decisions
- Stack: Next.js 14 (App Router, JS) – UI + API routes in one app; framer-motion for drag/spring physics.
- Storage: JSON file (data/db.json), atomic write (tmp + rename); no native deps, Windows-friendly. Auto-seeds on first run.
- Privacy (Coy's core promise): `likedMe` is server-only. /feed never includes it and order is a stable hash shuffle so likers can't be inferred by position. Only mutual matches expose anything. Chat only allowed with mutual matches.
- Photos: randomuser.me portraits with gradient-initial fallback (offline safe).
- Theme: "lovey-dovey" – blush/rose/lilac gradients, glass surfaces, Fraunces serif + Inter, floating hearts, confetti.

## Plan
- [x] Research & plan
- [x] Scaffold project (package.json, next config, deps)
- [x] Seed data: 35 profiles, 9 who already liked the user
- [x] DB layer (lib/db.js) with persistence
- [x] API: GET /api/feed, POST /api/swipe, GET /api/matches
- [x] API extras: filters, unmatch, messages, stats, reset demo
- [x] UI: tab bar (blank Home, Discover, Matches, Me)
- [x] Swipe card: drag gestures, LIKE/NOPE stamps, buttons, keyboard arrows
- [x] Super like
- [x] "It's a match!" screen + confetti
- [x] Matches view + chat (starters, simulated reply) + unmatch
- [x] Filters sheet (age, city), empty state, expandable profile info
- [x] Lovey-dovey theme polish
- [x] README.md, run.bat
- [x] Production build passes
- [x] API tests (privacy, no-repeat, idempotency, persistence, match rules) – 9/9 pass

## Added during execution
- [x] /api/stats + Me tab (counters, privacy promise, reset demo)
- [x] Optimistic removal + restore-on-failure for swipes; busy lock against double-swipes
- [x] scripts/api-test.mjs (`npm test` against running server)
- [x] Avoided `bash` heredoc issue by writing files directly
- [ ] Optional: push to a public GitHub repo (needs user's account/confirmation)

## Round 2 – quality pass (target 90+)
- [x] Serialised write queue (mutate) + in-memory cache + rollback on error – no lost updates under concurrency
- [x] Input validation module (lib/validate.js) applied to all routes (400/404/403)
- [x] Local SVG portrait fallback (/api/photo/[id]) – no hard external dependency
- [x] Split Discover.js into SwipeCard / MatchScreen / Filters / Empty
- [x] API tests expanded to 34 checks: privacy regression on every route, ordering leak, concurrency, validation
- [x] Playwright e2e (6 tests): button + drag swipe, match, reload persistence, no-repeat, empty state, filters – all pass
- [x] Visually verified screenshots; fixed see-through match overlay
- [x] run.bat gained `test` mode
- [ ] Push to public GitHub repo (needs user's account + go-ahead)
- [ ] Future: TypeScript migration, SQLite for multi-process deploys

## Round 3 – Home landing page
- [x] Home tab replaced blank placeholder with landing page (user request): animated hero w/ floating profile cards, live stats counters, interest marquee, how-it-works, Coy promise, features, quotes, final CTA
- [x] CTA buttons switch to Discover; app now opens on Home
- [x] e2e updated (landing renders + CTA works); screenshots reviewed on mobile viewport
- [x] Removed awkward wavy underline in final CTA

## Round 4 - visual realism pass
- [x] Removed all 3D emoji from UI chrome; replaced with crisp vector Heart/Sparkle/Badge/Envelope (Art.js)
- [x] Hero chips use real profile avatars + vector badges; avatar stack in the pill
- [x] New Backdrop: 30 depth-blurred hearts (sizes 18-100px) rising with sway, twinkling sparkles, bokeh, giant framing hearts on wide screens
- [x] Phone surface: scattered heart pattern + gradient glows so it never looks empty
- [x] Match confetti rebuilt as vector hearts/sparkles/paper
- [x] Higher-res (640px) hand-picked portraits sorted by gender (pravatar); seed-version migration refreshes old saved data
- [x] scripts/screenshot.mjs (desktop + mobile captures)
