# Muhammad Hassan Nadeem — Portfolio

A 3D, animated personal portfolio for a Software Engineer & Cybersecurity Analyst.
Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Three.js / React Three Fiber · GSAP ScrollTrigger · Motion**.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (type-checks too) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npx tsc --noEmit` | Strict type-check only |

Requires Node.js 20.9+.

## Editing content

**All copy lives in [`src/content/portfolio.ts`](src/content/portfolio.ts).** Edit it to change the name, bio, experience, skills, projects, certifications, contact details, and navigation. No component changes are needed.

- **Social links:** add entries to `site.socials` (e.g. `{ label: "GitHub", href: "https://github.com/…" }`). They appear in the footer and in the structured data (`sameAs`). Nothing is shown until real URLs are added.
- **Project links:** add `links: [{ label: "GitHub", href: "…" }]` to a project. A button then appears on its card and in its case study. Projects without links show a private case study instead.
- **Project visuals:** each project has a `visual` key (`supplychain`, `threat`, `scan`, `pentest`, `dashboard`), rendered by `src/components/visuals/ProjectVisual.tsx`.

## Contact form

The form validates on the client and again on the server (`src/lib/contact.ts`, shared by both), then posts to `POST /api/contact`.

- **With Resend configured:** messages are delivered as plain text from the server. The API key never reaches the browser.
- **Without it (the default):** the button reads **"Compose email"**. Submitting opens the visitor's email app with the message pre-filled, and the UI says plainly that nothing is sent until they press send there. It never fakes a "message sent" state.

Protections: same-origin check, a honeypot field, size limits, control-character sanitisation, plain-text-only emails, and a best-effort per-instance rate limit (5 messages per 10 minutes per IP). For strict limits across serverless instances, back the limiter with a shared store such as Upstash Redis.

### Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical/OG/sitemap URL. Falls back to Vercel's production URL. |
| `RESEND_API_KEY` | For email delivery | Resend API key (server-only) |
| `CONTACT_TO_EMAIL` | For email delivery | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | For email delivery | Sender on a domain verified in Resend |

The page is statically prerendered, so **redeploy after changing these variables**.

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com/new](https://vercel.com/new), import the repo. The framework is auto-detected as Next.js; no build settings need changing.
3. Add the environment variables above under *Settings → Environment Variables*, then deploy.
4. After adding a custom domain, set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

## Architecture

```
src/
  app/                 layout (fonts, SEO, JSON-LD), page, API route, OG image, robots, sitemap, icon
  content/portfolio.ts all site copy (single source of truth)
  components/
    layout/            Navbar, Footer, Loader, ClientRuntime
    sections/          Hero, About, Experience, Expertise, Projects, Certifications, Philosophy, Contact
    three/             WebGL only: HeroCanvas (secure core), FieldCanvas (philosophy field),
                       materials (GLSL shaders), SceneHost (lazy loading, quality tiers, fallbacks)
    visuals/           Layered SVG/CSS-3D project illustrations
    ui/                Reveal/SplitHeading, Magnetic, Button, TiltCard, Cursor, SectionHeader, Logo
  hooks/               SSR-safe media-query hooks (reduced motion, fine pointer)
  lib/                 gsap setup, device capability tiers, contact validation, site config
```

Design tokens (colours, fonts, easings, keyframes) live in the `@theme` block of `src/app/globals.css`. Every text/background pair was checked at or above WCAG AA 4.5:1.

### 3D and performance

- 3D scenes load lazily (`next/dynamic`, `ssr: false`) after idle time, and only once they are near the viewport.
- **Quality tiers:** `high` on capable desktops; `low` (fewer particles, lower DPR, no antialiasing) on mobile, coarse pointers, ≤4 GB RAM, ≤4 cores, or Save-Data; `off` without WebGL. In that case a static SVG poster stays in place.
- Render loops pause off-screen (`frameloop="never"`). Geometries and materials are disposed explicitly on unmount. An error boundary keeps the poster if WebGL fails at runtime.
- At most two WebGL contexts exist; the project art is SVG/CSS-3D, so it adds none.

### Accessibility

Semantic landmarks, skip link, visible focus rings, `aria-current` navigation, a focus-trapped mobile menu (Escape closes), native `<dialog>` case studies, labelled form fields with inline errors and focus-to-first-error, and a polite live region for status.

Under `prefers-reduced-motion`, every animation renders its final state, the 3D scenes draw a single static frame, and the intro loader and custom cursor are disabled. Stacked project cards lift above the stack when focused, so keyboard focus is never obscured (WCAG 2.4.11).
