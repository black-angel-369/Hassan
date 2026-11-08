"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { getQualityTier, type QualityTier } from "@/lib/device";
import { useReducedMotion } from "@/hooks/useMediaQuery";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const FieldCanvas = dynamic(() => import("./FieldCanvas"), { ssr: false });

/** If WebGL throws (lost context, driver issues), keep the static poster. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Props = {
  scene: "hero" | "field";
  poster: ReactNode;
  className?: string;
  /** Pixels of margin before the scene starts rendering. */
  rootMargin?: string;
};

export default function SceneHost({ scene, poster, className, rootMargin = "200px" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [visible, setVisible] = useState(false);
  const [everVisible, setEverVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Defer capability probing until after first paint / idle time.
    const run = () => setTier(getQualityTier());
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (ric) ric(run, { timeout: 800 });
    else setTimeout(run, 200);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const canRender = tier && tier !== "off" && everVisible && !failed;
  const Scene = scene === "hero" ? HeroCanvas : FieldCanvas;

  return (
    <div ref={ref} className={className} aria-hidden>
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: ready && !failed ? 0 : 1 }}
      >
        {poster}
      </div>
      {canRender && (
        <SceneBoundary onError={() => setFailed(true)}>
          <div
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <Scene
              tier={tier}
              reducedMotion={reducedMotion}
              active={visible}
              onReady={() => setReady(true)}
            />
          </div>
        </SceneBoundary>
      )}
    </div>
  );
}
