"use client";

import { ArrowUpRight, Lock, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";

function CaseStudyDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!project && d.open) d.close();
  }, [project]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClosed = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    d.addEventListener("close", onClosed);
    return () => d.removeEventListener("close", onClosed);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="case-title"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto max-h-[92dvh] w-[min(100vw-1.5rem,960px)] overflow-y-auto overscroll-contain rounded-[28px] border border-[var(--color-line-strong)] bg-[var(--color-ink-900)] p-0 text-[var(--color-fg)] shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)] backdrop:bg-[rgb(3_5_9/0.78)] backdrop:backdrop-blur-sm open:motion-safe:animate-[dialog-in_.5s_var(--ease-out-expo)]"
    >
      {project && (
        <div>
          <div className="relative aspect-[16/8] min-h-56 w-full overflow-hidden border-b border-[var(--color-line)]">
            <ProjectVisual kind={project.visual} />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="absolute top-4 right-4 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full glass text-[var(--color-fg)] transition-colors hover:border-[var(--color-line-strong)]"
              aria-label="Close case study"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="grid gap-10 p-6 md:grid-cols-5 md:p-10">
            <div className="md:col-span-3">
              <p className="kicker">
                Case study {project.index} · {project.category}
              </p>
              <h3 id="case-title" className="text-display mt-4 text-3xl md:text-5xl">
                {project.name}
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-[var(--color-fg-muted)]">{project.description}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-mono text-xs tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">Focus areas</h4>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[var(--color-fg)]">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-cyan)]" />
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-8 flex gap-3 rounded-2xl border border-[var(--color-line)] bg-white/[0.02] p-4 text-sm text-[var(--color-fg-muted)]">
                <Lock className="mt-0.5 size-4 shrink-0 text-[var(--color-violet-soft)]" aria-hidden />
                {project.availability}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.links?.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-cyan)] px-5 text-sm font-medium text-[var(--color-ink-950)]"
                  >
                    {l.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => ref.current?.close()}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-cyan)]"
                >
                  Discuss this project
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------------ */
/* Shared card content                                                       */
/* ------------------------------------------------------------------------ */

function CardBody({ project: p, onOpen, compact = false }: { project: Project; onOpen: (p: Project) => void; compact?: boolean }) {
  return (
    <div className={`relative flex flex-col ${compact ? "p-7 xl:p-10" : "p-6 sm:p-8 lg:col-span-5 lg:p-12"}`}>
      <div className="flex items-start justify-between gap-6">
        <span className={`text-display ${compact ? "text-[clamp(3rem,5vw,4.5rem)]" : "text-[clamp(3.5rem,7vw,6rem)]"} leading-none text-transparent [-webkit-text-stroke:1px_rgb(148_163_184/0.35)]`}>
          {p.index}
        </span>
        <span className="mt-2 rounded-full border border-[var(--color-line)] px-3 py-1 text-right font-mono text-[0.68rem] tracking-wider text-[var(--color-cyan-soft)] uppercase">
          {p.category}
        </span>
      </div>
      <h3 className={`text-display ${compact ? "mt-5 text-[clamp(1.7rem,2.8vw,2.6rem)]" : "mt-8 text-[clamp(1.9rem,3.4vw,3rem)]"}`}>{p.name}</h3>
      <p className="mt-4 leading-relaxed text-[var(--color-fg-muted)]">{p.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${p.name} focus areas`}>
        {p.highlights.slice(0, 3).map((h) => (
          <li key={h} className="rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--color-fg)]">
            {h}
          </li>
        ))}
      </ul>

      <div className={`mt-auto flex flex-wrap items-center gap-3 ${compact ? "pt-6" : "pt-10"}`}>
        <button
          type="button"
          onClick={() => onOpen(p)}
          aria-haspopup="dialog"
          className="group/btn inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border border-[var(--color-line-strong)] py-2 pr-2 pl-5 text-sm font-medium transition-[border-color,background-color] duration-300 hover:border-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/[0.06]"
        >
          View case study
          <span className="flex size-8 items-center justify-center rounded-full bg-[var(--color-fg)] text-[var(--color-ink-950)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:rotate-90">
            <Plus className="size-4" aria-hidden />
          </span>
          <span className="sr-only">: {p.name}</span>
        </button>
        {p.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 px-3 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            {l.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tablet+: 3D ring carousel driven by scroll                                */
/* ------------------------------------------------------------------------ */

const N = projects.length;
const STEP = 360 / N;
/** Distance from ring centre to each card so neighbours sit edge to edge. */
const RADIUS_FACTOR = 0.5 / Math.tan(Math.PI / N);
/** Card width; the ring radius is derived from it in CSS. */
const CARD_W = "min(1040px, 84vw)";
const pad = (n: number) => String(n).padStart(2, "0");

function ProjectRing({ onOpen }: { onOpen: (p: Project) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const scrollToCard = useRef<(i: number) => void>(() => {});

  useGSAP(
    () => {
      const ringEl = ring.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-ring-card]", stage.current);
      const shades = cards.map((c) => c.querySelector<HTMLElement>("[data-ring-shade]")!);
      const dots = gsap.utils.toArray<HTMLElement>("[data-ring-dot]", stage.current);
      const setRot = gsap.quickSetter(ringEl, "rotationY", "deg");
      const lastShade = new Array<number>(N).fill(-1);
      let lastActive = -1;

      // One transform per frame on the ring; shades/attributes only when they change.
      const render = (pos: number) => {
        setRot(-pos * STEP);
        for (let i = 0; i < N; i++) {
          let d = Math.abs(i - pos) % N;
          d = Math.min(d, N - d);
          const shade = Math.round(Math.min(d * 0.55, 0.8) * 100) / 100;
          if (shade !== lastShade[i]) {
            shades[i].style.opacity = String(shade);
            lastShade[i] = shade;
          }
        }
        const active = Math.round(pos) % N;
        if (active !== lastActive) {
          cards.forEach((c, i) => {
            const on = i === active;
            c.toggleAttribute("data-active", on);
            c.setAttribute("aria-hidden", String(!on));
          });
          dots.forEach((d, i) => d.toggleAttribute("data-active", i === active));
          if (counter.current) counter.current.textContent = projects[active].index;
          lastActive = active;
        }
      };

      // Each step rotates to the next card, then holds so it can be read.
      const state = { pos: 0 };
      const HOLD = 0.6;
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onUpdate: () => render(state.pos) });
      tl.addLabel("p0").to({}, { duration: HOLD / 2 });
      for (let i = 1; i < N; i++) {
        tl.to(state, { pos: i, duration: 1 })
          .addLabel(`p${i}`)
          .to({}, { duration: i === N - 1 ? HOLD / 2 : HOLD });
      }

      const st = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (N - 1) * 0.9}`,
        pin: true,
        scrub: 0.7,
        animation: tl,
        invalidateOnRefresh: true,
      });

      // Keyboard users: tabbing into a card brings it to the front.
      scrollToCard.current = (i: number) => {
        if (i === lastActive) return;
        const t = tl.labels[`p${i}`] / tl.duration();
        window.scrollTo({ top: st.start + (st.end - st.start) * t });
      };

      render(0);
    },
    { scope: stage },
  );

  return (
    <div
      ref={stage}
      className="relative flex h-[100svh] items-center justify-center overflow-hidden pt-[var(--nav-h)] [perspective:1500px]"
      style={{ "--card-w": CARD_W, "--ring-r": `calc(var(--card-w) * ${RADIUS_FACTOR.toFixed(4)} + 48px)` } as React.CSSProperties}
    >
      {/* Pushes the ring back by its radius so the front card renders at 1:1. */}
      <div className="relative h-[min(70vh,620px)] w-[var(--card-w)] [transform-style:preserve-3d] [transform:translateZ(calc(var(--ring-r)*-1))]">
        <div ref={ring} className="absolute inset-0 will-change-transform [transform-style:preserve-3d]">
          {projects.map((p, i) => (
            <article
              key={p.name}
              data-ring-card
              aria-roledescription="slide"
              aria-label={`${p.index} of ${pad(N)}: ${p.name}`}
              onFocus={() => scrollToCard.current(i)}
              className="ring-card hairline-glow group absolute inset-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden lg:grid-cols-12 lg:grid-rows-1 rounded-[32px] border border-[var(--color-line)] bg-[var(--color-ink-900)] [backface-visibility:hidden]"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--ring-r))` }}
            >
              <div className="relative overflow-hidden border-b border-[var(--color-line)] lg:col-span-7 lg:border-r lg:border-b-0">
                <ProjectVisual kind={p.visual} />
              </div>
              <div className="flex lg:col-span-5">
                <CardBody project={p} onOpen={onOpen} compact />
              </div>
              <div
                data-ring-shade
                aria-hidden
                className="absolute inset-0 z-20 rounded-[inherit] bg-[var(--color-ink-950)] group-data-[active]:pointer-events-none"
                style={{ opacity: i === 0 ? 0 : 0.55 }}
              />
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-5 font-mono text-xs tracking-[0.18em] text-[var(--color-fg-subtle)]">
        <span>
          <span ref={counter} className="text-[var(--color-fg)]">
            01
          </span>{" "}
          / {pad(N)}
        </span>
        <span className="flex gap-2" aria-hidden>
          {projects.map((p) => (
            <span
              key={p.name}
              data-ring-dot
              className="h-1 w-4 rounded-full bg-[var(--color-line-strong)] transition-[width,background-color] duration-500 data-[active]:w-10 data-[active]:bg-[var(--color-cyan)]"
            />
          ))}
        </span>
        <span className="hidden uppercase xl:inline">Scroll to rotate</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Phones / reduced motion: simple stacked list                              */
/* ------------------------------------------------------------------------ */

function ProjectList({ onOpen }: { onOpen: (p: Project) => void }) {
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stack-inner]").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 80 },
            { autoAlpha: 1, y: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: list },
  );

  return (
    <div className="container-x">
      <ol ref={list} className="mt-16 space-y-6 md:mt-24">
        {projects.map((p) => (
          <li key={p.name} className="relative">
            <article
              data-stack-inner
              data-reveal
              className="glass hairline-glow group relative grid overflow-hidden rounded-[32px] bg-[var(--color-ink-900)]/90 lg:grid-cols-12"
            >
              <TiltCard max={4} className="relative min-h-[260px] overflow-hidden border-b border-[var(--color-line)] sm:min-h-[340px] lg:col-span-7 lg:border-r lg:border-b-0">
                <ProjectVisual kind={p.visual} />
              </TiltCard>
              <CardBody project={p} onOpen={onOpen} />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

const RING_QUERY = "(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const close = useCallback(() => setActive(null), []);
  const ring = useMediaQuery(RING_QUERY, false);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative pt-28 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(34_211_238/0.08),transparent_70%)]"
      />
      <div className="container-x">
        <SectionHeader
          index="04"
          kicker="Featured work"
          title="Security tools and software, engineered end to end."
          id="projects-title"
          intro="A selection of platforms and engagements across supply chain security, threat detection, vulnerability assessment, and secure full-stack systems."
          align="split"
        />
      </div>

      {ring ? (
        <div className="mt-6 pb-10">
          <ProjectRing onOpen={setActive} />
        </div>
      ) : (
        <div className="pb-28 md:pb-40">
          <ProjectList onOpen={setActive} />
        </div>
      )}

      <CaseStudyDialog project={active} onClose={close} />
    </section>
  );
}
