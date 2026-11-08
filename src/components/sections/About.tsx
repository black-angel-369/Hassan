import Image from "next/image";
import portrait from "@/assets/hassan-nadeem.jpg";
import { GraduationCap, MapPin, Building2, Crosshair } from "lucide-react";
import { about, site } from "@/content/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LogoMark } from "@/components/ui/Logo";

const factIcons = [GraduationCap, Building2, MapPin, Crosshair];

/** Layered identity card with portrait. */
function IdentityCard() {
  return (
    <div className="rounded-[28px]">
      <div className="glass hairline-glow relative overflow-hidden rounded-[28px] p-7 md:p-9">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
        {/* Decorative orbit rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-72"
        >
          <div className="absolute inset-0 rounded-full border border-[var(--color-cyan)]/20 motion-safe:animate-spin-slow" />
          <div className="absolute inset-8 rounded-full border border-dashed border-[var(--color-violet)]/30 motion-safe:animate-[spin_36s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.25),transparent_70%)]" />
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line-strong)]">
            <Image
              src={portrait}
              alt={`Portrait of ${site.name}`}
              placeholder="blur"
              sizes="(min-width: 1024px) 38vw, (min-width: 768px) 70vw, 90vw"
              className="aspect-[4/5] w-full object-cover object-[center_25%]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[var(--color-ink-900)]/80"
            />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              <LogoMark className="size-10 text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)]" />
              <span className="rounded-full border border-[var(--color-emerald)]/40 bg-[var(--color-ink-900)]/80 px-3 py-1 font-mono text-[0.7rem] tracking-wider text-[var(--color-emerald)] uppercase backdrop-blur-sm">
                Secure by design
              </span>
            </div>
          </div>
          <p className="mt-8 font-mono text-xs tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase">Profile</p>
          <p className="text-display mt-2 text-3xl md:text-4xl">{site.name}</p>
          <p className="mt-2 text-[var(--color-fg-muted)]">{site.title}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] text-sm">
            {[
              ["Discipline", "Software Eng."],
              ["Specialism", "Security"],
              ["Base", "Peshawar, PK"],
              ["Status", "BS in progress"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--color-ink-900)]/90 p-4">
                <dt className="font-mono text-[0.68rem] tracking-wider text-[var(--color-fg-subtle)] uppercase">{k}</dt>
                <dd className="mt-1 text-[var(--color-fg)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-40 size-[520px] rounded-full bg-[radial-gradient(circle,rgb(139_140_248/0.10),transparent_65%)] blur-2xl"
      />
      <div className="container-x">
        <SectionHeader index="01" kicker={about.kicker} title={about.heading} id="about-title" />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal stagger={0.12} className="space-y-6 text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl md:leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[var(--color-fg)]" : undefined}>
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal stagger={0.08} as="dl" className="mt-14 grid gap-4 sm:grid-cols-2">
              {about.facts.map((f, i) => {
                const Icon = factIcons[i % factIcons.length];
                return (
                  <div
                    key={f.label}
                    className="group rounded-2xl border border-[var(--color-line)] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-[var(--color-line-strong)] hover:bg-white/[0.035]"
                  >
                    <dt className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-[var(--color-fg-subtle)] uppercase">
                      <Icon className="size-4 text-[var(--color-cyan)]" aria-hidden />
                      {f.label}
                    </dt>
                    <dd className="mt-3">
                      <span className="block font-medium text-[var(--color-fg)]">{f.value}</span>
                      <span className="mt-1 block text-sm text-[var(--color-fg-muted)]">{f.note}</span>
                    </dd>
                  </div>
                );
              })}
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-28" y={40}>
              <IdentityCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
