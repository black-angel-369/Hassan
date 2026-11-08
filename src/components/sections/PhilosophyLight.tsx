"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** A soft light beam that sweeps across the statement as it scrolls through. */
export function PhilosophyLight() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { xPercent: -60, opacity: 0 },
          {
            xPercent: 60,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current?.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(103_232_249/0.14),rgb(139_140_248/0.06)_55%,transparent)] blur-2xl"
    />
  );
}
