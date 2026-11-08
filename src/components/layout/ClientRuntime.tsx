"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Marks the client as ready (cancels the pre-paint failsafe) and keeps
 *  ScrollTrigger measurements correct once web fonts finish loading. */
export function ClientRuntime() {
  useEffect(() => {
    (window as Window & { __mhnReady?: boolean }).__mhnReady = true;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
