import { ArrowDown, ArrowRight } from "lucide-react";
import { hero, site } from "@/content/portfolio";
import { ButtonLink } from "@/components/ui/Button";
import SceneHost from "@/components/three/SceneHost";
import { HeroIntro } from "./HeroIntro";

/** Static stand-in for the 3D core (no-WebGL, pre-load, failures). */
function CorePoster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[8%]">
      <div className="relative aspect-square w-[min(78vw,560px)] opacity-90">
        <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.35),rgb(139_140_248/0.12)_45%,transparent_70%)] blur-2xl" />
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" fill="none">
          <g stroke="#67e8f9" strokeOpacity=".22">
            <ellipse cx="200" cy="200" rx="180" ry="62" transform="rotate(-18 200 200)" />
            <ellipse cx="200" cy="200" rx="165" ry="48" transform="rotate(28 200 200)" strokeOpacity=".14" />
            <circle cx="200" cy="200" r="120" strokeDasharray="2 6" />
          </g>
          <path
            d="M200 120 269 160v80l-69 40-69-40v-80l69-40Z"
            stroke="url(#pg)"
            strokeWidth="1.2"
            fill="url(#pf)"
          />
          <path d="M200 120v160M131 160l138 80M269 160l-138 80" stroke="#67e8f9" strokeOpacity=".18" />
          <circle cx="200" cy="200" r="7" fill="#a5f3fc" />
          <defs>
            <linearGradient id="pg" x1="131" y1="120" x2="269" y2="280">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#8b8cf8" />
            </linearGradient>
            <radialGradient id="pf" cx="0.5" cy="0.5" r="0.6">
              <stop stopColor="#22d3ee" stopOpacity=".18" />
              <stop offset="1" stopColor="#0b1120" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Backdrop: gradient wash + grid + 3D core */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(120%_80%_at_75%_30%,#0d1830_0%,#070b14_45%,#05070b_80%)]" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-20 opacity-70" />
      <SceneHost
        scene="hero"
        poster={<CorePoster />}
        className="absolute inset-0 -z-10 opacity-60 md:opacity-100"
        rootMargin="0px"
      />
      {/* Legibility scrims */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(5_7_11/0.92)_0%,rgb(5_7_11/0.55)_38%,transparent_65%)] max-md:bg-[linear-gradient(180deg,transparent_0%,rgb(5_7_11/0.55)_45%,rgb(5_7_11/0.9)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[var(--color-ink-950)]"
      />

      <div className="container-x flex flex-1 flex-col justify-end pt-28 pb-10 md:justify-center md:pt-32 md:pb-24">
        <HeroIntro>
          <p data-hero className="kicker flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[var(--color-cyan)]" aria-hidden />
            {site.name}
          </p>

          <h1 id="hero-title" className="text-display mt-6 text-[clamp(2.75rem,8.4vw,7.6rem)]">
            <span className="sr-only">
              {site.name} — {site.title}. {hero.headline.join(" ")}
            </span>
            <span aria-hidden className="block">
              {hero.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span
                    data-hero-line
                    className={`block ${i === hero.headline.length - 1 ? "text-gradient" : ""}`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p data-hero className="mt-6 font-mono text-sm tracking-wide text-[var(--color-fg-muted)] md:text-base">
            {site.roles[0]} <span className="text-[var(--color-cyan)]">/</span> {site.roles[1]}
          </p>

          <p data-hero className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {hero.statement}
          </p>

          <div data-hero className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href={hero.primaryCta.href} icon={<ArrowRight className="size-4" aria-hidden />}>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <ul data-hero aria-label="Focus areas" className="mt-12 flex flex-wrap gap-x-6 gap-y-3 md:mt-16">
            {hero.indicators.map((label, i) => (
              <li key={label} className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-[var(--color-fg-muted)] uppercase">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full animate-pulse-dot"
                  style={{
                    color: ["#22d3ee", "#34d399", "#8b8cf8"][i % 3],
                    background: ["#22d3ee", "#34d399", "#8b8cf8"][i % 3],
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
                {label}
              </li>
            ))}
          </ul>
        </HeroIntro>
      </div>

      <a
        href="#about"
        data-scroll-cue
        className="group absolute right-[clamp(1.25rem,4vw,3rem)] bottom-8 hidden min-h-11 items-center gap-3 font-mono text-xs tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase transition-colors hover:text-[var(--color-fg)] md:flex"
      >
        Scroll
        <span className="flex size-10 items-center justify-center rounded-full border border-[var(--color-line-strong)] transition-colors group-hover:border-[var(--color-cyan)]">
          <ArrowDown className="size-4 motion-safe:animate-float" aria-hidden />
        </span>
      </a>
    </section>
  );
}
