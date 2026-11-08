"use client";

import { type ReactNode, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Cinematic hero entrance, timed to land just after the intro loader. */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Land just after the intro overlay when it is showing this visit.
        const delay = document.documentElement.classList.contains("show-intro") ? 1.75 : 0.15;
        const tl = gsap.timeline({ delay });
        tl.fromTo(
          "[data-hero-line]",
          // y: 0 clears the CSS pre-hide transform that GSAP would otherwise parse as a px offset.
          { y: 0, yPercent: 115, rotate: 2.5 },
          { y: 0, yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.1, ease: "expo.out" },
        ).fromTo(
          "[data-hero]",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" },
          0.25,
        );
        // The scroll cue bows out as soon as the visitor starts scrolling.
        const cue = document.querySelector("[data-scroll-cue]");
        if (cue) {
          gsap.to(cue, {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: document.body, start: "top top", end: "+=240", scrub: true },
          });
        }
        // Parallax: copy drifts up and fades as the hero scrolls away.
        gsap.to(ref.current, {
          yPercent: -12,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top+=120", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="hero-intro max-w-4xl">
      {children}
    </div>
  );
}
