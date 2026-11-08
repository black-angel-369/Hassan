import { Brain, Code2, Layers, Network, ShieldCheck, type LucideIcon } from "lucide-react";
import { coreExpertise, skillGroups, type ExpertiseIconKey } from "@/content/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";

const iconMap: Record<ExpertiseIconKey, LucideIcon> = {
  shield: ShieldCheck,
  code: Code2,
  layers: Layers,
  network: Network,
  brain: Brain,
};

// Bento layout: first card is the hero tile.
const spans = [
  "md:col-span-6 lg:col-span-7 lg:row-span-2",
  "md:col-span-3 lg:col-span-5",
  "md:col-span-3 lg:col-span-5",
  "md:col-span-3 lg:col-span-6",
  "md:col-span-3 lg:col-span-6",
];

/** Decorative per-card motif: an animated shield lattice for the hero tile. */
function ShieldMotif() {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className="pointer-events-none absolute -right-10 -bottom-10 size-80 opacity-70 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tilt:-rotate-6 group-hover/tilt:scale-105 md:size-[22rem]">
      <defs>
        <linearGradient id="sm" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#67e8f9" stopOpacity=".7" />
          <stop offset="1" stopColor="#8b8cf8" stopOpacity=".15" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d="M160 40 260 85v70c0 62-44 104-100 125C104 259 60 217 60 155V85l100-45Z"
          fill="none"
          stroke="url(#sm)"
          strokeWidth="1"
          transform={`translate(160 160) scale(${1 - i * 0.18}) translate(-160 -160)`}
          strokeOpacity={1 - i * 0.2}
        />
      ))}
      <circle cx="160" cy="160" r="5" fill="#67e8f9" className="motion-safe:animate-pulse" />
    </svg>
  );
}

export function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative py-28 md:py-40">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <SectionHeader
          index="03"
          kicker="Expertise"
          title="Five disciplines. One security-first mindset."
          id="expertise-title"
          intro="Core capabilities that span the full lifecycle — from writing the code, to shipping the application, to testing how it holds up under pressure."
          align="split"
        />

        <Reveal stagger={0.07} className="mt-16 grid gap-4 md:mt-24 md:grid-cols-6 lg:grid-cols-12 lg:auto-rows-[minmax(220px,auto)]">
          {coreExpertise.map((item, i) => {
            const Icon = iconMap[item.icon];
            const featured = i === 0;
            return (
              <TiltCard key={item.title} max={featured ? 4 : 6} className={`rounded-3xl ${spans[i]}`}>
                <article
                  className={`glass hairline-glow relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-8 ${
                    featured ? "min-h-[340px] lg:min-h-full" : "min-h-[220px]"
                  }`}
                >
                  {featured && <ShieldMotif />}
                  <div className="flex items-start justify-between [transform:translateZ(24px)]">
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/[0.08] text-[var(--color-cyan-soft)] transition-colors duration-300 group-hover/tilt:border-[var(--color-cyan)]/60">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-[var(--color-fg-subtle)]">0{i + 1}</span>
                  </div>
                  <div className="relative mt-auto pt-10 [transform:translateZ(18px)]">
                    <h3 className={`text-display ${featured ? "text-3xl md:text-5xl" : "text-2xl"}`}>{item.title}</h3>
                    <p className={`mt-3 text-[var(--color-fg-muted)] ${featured ? "max-w-md md:text-lg" : ""}`}>
                      {item.description}
                    </p>
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </Reveal>

        {/* Grouped capabilities */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <h3 className="kicker">Toolkit & capabilities</h3>
          </Reveal>
          <Reveal stagger={0.08} className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((g) => (
              <div key={g.title} className="group bg-[var(--color-ink-950)] p-7 transition-colors duration-500 hover:bg-[var(--color-ink-900)]">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-display text-xl font-semibold tracking-tight">{g.title}</h4>
                  <span className="font-mono text-xs text-[var(--color-fg-subtle)]">{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-fg-subtle)]">{g.caption}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-lg border border-[var(--color-line)] bg-white/[0.025] px-3 py-1.5 font-mono text-[0.8rem] text-[var(--color-fg)] transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--color-cyan)]/50 hover:text-[var(--color-cyan-soft)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
