import { BadgeCheck, GraduationCap, ShieldCheck, Code2 } from "lucide-react";
import { experience } from "@/content/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineProgress } from "./TimelineProgress";

const icons = [ShieldCheck, Code2, BadgeCheck];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          index="02"
          kicker="Experience"
          title="Teaching, building, and serving."
          id="experience-title"
          intro="A path shaped by hands-on instruction and real-world exposure — explaining security and web development to others, and working inside a professional public-sector environment."
          align="split"
        />

        <TimelineProgress className="relative mt-20 md:mt-28">
          <ol className="relative space-y-14 md:space-y-24">
            {experience.map((item, i) => {
              const Icon = icons[i % icons.length];
              const right = i % 2 === 1;
              return (
                <li key={item.role + (item.org ?? "")} className="relative grid md:grid-cols-2 md:gap-20">
                  {/* Node on the spine */}
                  <span
                    aria-hidden
                    className="absolute top-2 left-0 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-cyan)]/40 bg-[var(--color-ink-950)] shadow-[0_0_24px_-4px_rgb(34_211_238/0.6)] md:left-1/2"
                  >
                    <Icon className="size-4 text-[var(--color-cyan-soft)]" />
                  </span>

                  <Reveal
                    y={36}
                    className={`pl-10 md:pl-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                  >
                    <article
                      className={`glass hairline-glow group relative rounded-3xl p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 md:p-8 ${
                        right ? "" : "md:ml-auto"
                      } max-w-xl`}
                    >
                      <p className="font-mono text-xs tracking-[0.18em] text-[var(--color-cyan-soft)] uppercase">
                        {item.type}
                      </p>
                      <h3 className="text-display mt-3 text-2xl md:text-3xl">{item.role}</h3>
                      {item.org && <p className="mt-1.5 text-lg text-[var(--color-fg)]">{item.org}</p>}
                      <p className="mt-4 text-[var(--color-fg-muted)]">{item.summary}</p>
                      <p className="mt-6 font-mono text-[0.7rem] tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
                        {item.pointsLabel}
                      </p>
                      <ul className={`mt-3 flex flex-wrap gap-2 ${right ? "" : "md:justify-end"}`}>
                        {item.points.map((p) => (
                          <li
                            key={p}
                            className="rounded-full border border-[var(--color-line)] bg-white/[0.03] px-3 py-1.5 text-sm text-[var(--color-fg)] transition-colors duration-300 group-hover:border-[var(--color-line-strong)]"
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </TimelineProgress>

        <Reveal className="mt-20 flex items-center gap-3 text-sm text-[var(--color-fg-muted)] md:justify-center">
          <GraduationCap className="size-4 text-[var(--color-emerald)]" aria-hidden />
          Alongside: BS Software Engineering at CUSIT, Peshawar — in progress.
        </Reveal>
      </div>
    </section>
  );
}
