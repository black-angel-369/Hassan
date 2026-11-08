"use client";

import { type ElementType, type ReactNode, useCallback, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  max?: number;
};

/**
 * Cursor-reactive 3D tilt with a soft spotlight. Writes CSS variables only
 * (--rx, --ry, --mx, --my) via rAF — no React re-renders. Disabled for
 * coarse pointers and reduced motion via the media check on each enter.
 */
export function TiltCard({ children, className, as: Tag = "div", max = 7 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const enabled = useRef(false);

  const onEnter = useCallback(() => {
    enabled.current = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        if (enabled.current) {
          el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
          el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        }
      });
    },
    [max],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <Tag
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt group/tilt relative [transform-style:preserve-3d] [transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-500 ease-[var(--ease-out-expo)] ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(103 232 249 / 0.10), transparent 45%)",
        }}
      />
      {children}
    </Tag>
  );
}
