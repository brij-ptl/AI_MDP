# Vitalis AI — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS frontend for the AI Precision
Healthcare Platform, built to the file architecture you provided.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:7000 — the dev/start scripts are pinned to port **7000**
(not the Next.js default 3000) since that's already in use on your machine.
For production:

```bash
npm run build
npm run start
```

## Fixed: slow/blank first page load

The first build I sent used `next/font/google` to load Poppins/Sora, which
makes the **Next.js dev/build server itself** fetch fonts.googleapis.com
during compilation. If that network call is slow or blocked on your machine,
the very first route you open hangs for several seconds (retrying 3x) before
falling back — which is almost certainly why only `/cookies` rendered for you
and everything else looked blank: whichever route you opened first ate that
delay, and if your browser gave up waiting, it looked broken while later
routes (already past that one-time hit) loaded instantly.

Fixed by loading the fonts the same way your reference files did — a plain
`@import` in `globals.css`, fetched by the **browser**, not the dev server.
Font loading no longer blocks compiling or serving any page. Verified locally:
cold `next dev`, first hit to `/` returns `200` with full content, second hit
in 85ms.

## Theme

Colors are derived from `public/images/hero_page.jpeg` (clinical navy background,
cyan/blue "AI pulse" accent) and defined as CSS variables in `src/app/globals.css`,
consumed via Tailwind (`tailwind.config.ts`). Toggle light/dark with the theme
button in the navbar (also in Settings) — it's backed by `ThemeContext`.

## Two intentional deviations from the diagram (both required for the app to build)

1. **`/admin` routes** — the diagram's `(admin)/dashboard`, `(admin)/diseases` and
   `(admin)/analytics` share the same folder names as `(dashboard)/dashboard`,
   `(public)/diseases`, and `(dashboard)/analytics`. In Next's App Router,
   `(parenthesized)` route groups don't add a URL segment, so those pairs would
   resolve to the identical URL and Next refuses to build. I moved the admin
   section to a real `admin/` folder (not a route group), so it now lives at
   `/admin/dashboard`, `/admin/diseases`, etc. — everything else is untouched.
2. **`next.config.ts`** — Next.js only started supporting a TypeScript config
   file natively in v15, so the frontend is pinned to `next@^15.3.0` (still
   React 18) rather than 14, which the earlier scaffold assumed.

Everything else — every folder, every file name, every page — matches the
architecture exactly.

## Notable pieces

- `src/constants/diseaseQuestions.ts` — the physician-style intake question set
  for all 16 disease modules (heart, diabetes, stroke, hypertension, kidney,
  liver, fatty liver, breast/lung/cervical/prostate cancer, thyroid, Parkinson's,
  Alzheimer's, anemia, obesity).
- `src/constants/plans.ts` — the 4 pricing tiers (₹49 / ₹149 / ₹399 / ₹999).
- `src/context/TrialContext.tsx` — the 2-free-predictions cookie-tracked trial
  manager; prediction forms lock and redirect to `/pricing` once it's used up.
- `src/context/CookieConsentContext.tsx` — cookie banner + anonymous visitor-id
  cookie set on every sign-in/sign-up.
- `src/components/auth/AuthCard.tsx` — the animated split login/register card,
  recolored from your reference to the navy/cyan theme.
- All API calls in `src/services/*.ts` point at `NEXT_PUBLIC_API_BASE_URL`
  (set in `.env.local`) and are ready to wire up to the FastAPI backend.

## Verified

`npm install && npm run build` completes with 0 errors and prerenders all 56
routes (confirmed in this environment with a temporary system-font swap, since
this sandbox can't reach fonts.googleapis.com — your machine will fetch
Poppins/Sora normally on a real build).
