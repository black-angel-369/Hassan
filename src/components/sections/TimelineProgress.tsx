"use client";

import { type ReactNode, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Timeline spine that "draws" itself in sync with scroll. */
export function TimelineProgress({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <span aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-[var(--color-line)] md:left-1/2" />
      <span
        ref={fill}
        aria-hidden
        className="absolute top-0 bottom-0 left-0 w-px origin-top bg-gradient-to-b from-[var(--color-cyan)] via-[var(--color-violet)] to-[var(--color-emerald)] md:left-1/2"
      />
      {children}
    </div>
  );
}
