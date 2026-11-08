"use client";

import { type ElementType, type ReactNode, useRef } from "react";
import { gsap, MOTION_OK, REDUCED, ScrollTrigger, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children with a stagger instead of the wrapper itself. */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
};

/**
 * Scroll-triggered fade/translate. Elements carry `data-reveal`, which CSS hides
 * only while the `js-motion` class is present (set pre-paint, removed for
 * reduced motion) — so content is never lost if JS fails.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger,
  y = 28,
  delay = 0,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            delay,
            stagger: stagger ?? 0,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });
      mm.add(REDUCED, () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={stagger ? undefined : ""}
      data-reveal-children={stagger ? "" : undefined}
    >
      {children}
    </Tag>
  );
}

type SplitProps = {
  text: string;
  id?: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Trigger immediately on mount (hero) rather than on scroll. */
  immediate?: boolean;
};

/**
 * Word-by-word masked reveal for short headings. Screen readers get the
 * full string once (visually hidden), the animated words are aria-hidden.
 */
export function SplitHeading({ text, id, as: Tag = "h2", className, wordClassName, delay = 0, immediate }: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelectorAll<HTMLElement>("[data-word]");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          inner,
          { y: 0, yPercent: 110, rotate: 3 },
          {
            y: 0,
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            delay,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          },
        );
      });
      mm.add(REDUCED, () => {
        gsap.set(inner, { y: 0, yPercent: 0, rotate: 0 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word className={`inline-block will-change-transform ${wordClassName ?? ""}`}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Refresh ScrollTrigger once fonts/layout settle. */
export function refreshScroll() {
  ScrollTrigger.refresh();
}
