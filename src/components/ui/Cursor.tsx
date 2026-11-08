"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A trailing ring that accompanies (never replaces) the native cursor.
 * It grows over interactive elements and contracts on press.
 * Rendered only for fine pointers with motion allowed.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const r = ring.current!;
    const d = dot.current!;
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let hover = false;
    let down = false;
    let visible = false;
    let raf = 0;

    const tick = () => {
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      const scale = (hover ? 1.9 : 1) * (down ? 0.8 : 1);
      r.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        r.style.opacity = "1";
        d.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const next = !!t?.closest("a, button, [role='button'], input, textarea, select, label, summary");
      if (next !== hover) {
        hover = next;
        r.dataset.hover = String(hover);
      }
    };
    const leave = () => {
      visible = false;
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const press = () => (down = true);
    const release = () => (down = false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] size-9 rounded-full border border-[var(--color-cyan-soft)]/50 opacity-0 transition-[opacity,background-color,border-color] duration-300 data-[hover=true]:border-[var(--color-cyan-soft)]/80 data-[hover=true]:bg-[var(--color-cyan)]/[0.06]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-[var(--color-cyan-soft)] opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
