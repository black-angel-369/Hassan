import { philosophy } from "@/content/portfolio";
import SceneHost from "@/components/three/SceneHost";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { PhilosophyLight } from "./PhilosophyLight";

function FieldPoster() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(34_211_238/0.18),rgb(139_140_248/0.08)_40%,transparent_70%)]" />
      <div className="bg-grid absolute inset-x-0 bottom-0 h-1/2 [transform:perspective(600px)_rotateX(60deg)] opacity-80" />
    </div>
  );
}

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-32"
    >
      <SceneHost scene="field" poster={<FieldPoster />} className="absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-ink-950)_0%,transparent_25%,transparent_70%,var(--color-ink-950)_100%)]"
      />
      <PhilosophyLight />

      <div className="container-x text-center">
        <Reveal>
          <p className="kicker">{philosophy.kicker}</p>
        </Reveal>
        <h2 id="philosophy-title" className="text-display mx-auto mt-8 max-w-6xl text-[clamp(2.6rem,8.5vw,8rem)]">
          <SplitHeading as="span" text={philosophy.heading[0]} className="block" />
          <SplitHeading as="span" text={philosophy.heading[1]} className="block" wordClassName="text-gradient" delay={0.15} />
        </h2>
        <Reveal delay={0.2} className="mx-auto mt-10 max-w-2xl">
          <p className="text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">{philosophy.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
