"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Brief cinematic intro shown once per session. Purely decorative: the page
 * is rendered underneath and fully accessible; the overlay is aria-hidden,
 * skipped under reduced motion, and capped at ~1.6s.
 */
export function Loader() {
  const [show, setShow] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    // The pre-paint script in layout.tsx decides (reduced motion, already seen).
    if (!html.classList.contains("show-intro")) return;
    try {
      sessionStorage.setItem("mhn-intro", "1");
    } catch {
      /* storage disabled */
    }
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        html.classList.remove("show-intro");
        setShow(false);
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(bar.current, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
      .to(root.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "+=0.12");
    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;
  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[80] hidden flex-col justify-between bg-[var(--color-ink-950)] p-6 in-[.show-intro]:flex md:p-10"
    >
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase">
        <span>MHN // Portfolio</span>
        <span>Peshawar, PK</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="kicker mb-3">Initializing secure session</p>
          <p className="text-display text-4xl text-[var(--color-fg)] md:text-6xl">Hassan Nadeem</p>
        </div>
        <span ref={count} className="font-mono text-5xl text-[var(--color-cyan-soft)] tabular-nums md:text-7xl">
          000
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-line)]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-[var(--color-cyan)]" />
      </div>
    </div>
  );
}
