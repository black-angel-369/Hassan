"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query hook. Returns `serverFallback` during SSR/hydration. */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)", false);
export const useIsMobile = () => useMediaQuery("(max-width: 767px)", false);
