import { Award, Network, ShieldCheck, Bug } from "lucide-react";
import { certifications } from "@/content/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";

const icons = [ShieldCheck, Bug, Network];
const accents = ["#22d3ee", "#34d399", "#8b8cf8"];

/** Certificate-style guilloche rosette, drawn procedurally. */
function Guilloche({ color }: { color: string }) {
  const paths = Array.from({ length: 14 }, (_, i) => {
    const r = 46 + i * 2.2;
    const pts: string[] = [];
    for (let a = 0; a <= 360; a += 4) {
      const t = (a * Math.PI) / 180;
      const rr = r + Math.sin(t * 9 + i * 0.5) * 6;
      pts.push(`${(100 + rr * Math.cos(t)).toFixed(1)},${(100 + rr * Math.sin(t)).toFixed(1)}`);
    }
    return `M${pts.join("L")}Z`;
  });
  return (
    <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -top-16 -right-16 size-64 opacity-[0.22] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/tilt:rotate-45">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth="0.4" />
      ))}
    </svg>
  );
}

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          index="05"
          kicker="Certifications"
          title="Credentials in security and networking."
          id="certifications-title"
          intro="Formal training from Cisco across defensive security, ethical hacking, and the networking foundations both depend on."
          align="split"
        />

        <Reveal stagger={0.1} as="ul" className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
          {certifications.map((c, i) => {
            const Icon = icons[i % icons.length];
            const accent = accents[i % accents.length];
            return (
              <li key={c.name}>
                <TiltCard max={8} className="h-full rounded-[28px]">
                  <article className="glass relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[28px] p-7 md:p-8">
                    <Guilloche color={accent} />
                    {/* Certificate inner border */}
                    <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[20px] border border-dashed border-white/[0.07]" />
                    <div className="relative flex items-center justify-between [transform:translateZ(24px)]">
                      <span
                        className="flex size-12 items-center justify-center rounded-2xl border"
                        style={{ borderColor: `${accent}55`, background: `${accent}14`, color: accent }}
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
                        {c.track}
                      </span>
                    </div>

                    <div className="relative mt-auto pt-16 [transform:translateZ(30px)]">
                      <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase">Certificate</p>
                      <h3 className="text-display mt-3 text-[1.85rem] leading-tight">{c.name}</h3>
                      <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-line)] pt-5">
                        <Award className="size-4" style={{ color: accent }} aria-hidden />
                        <p className="text-sm text-[var(--color-fg-muted)]">
                          Issued by <span className="font-medium text-[var(--color-fg)]">{c.issuer}</span>
                        </p>
                      </div>
                    </div>
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                    />
                  </article>
                </TiltCard>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
