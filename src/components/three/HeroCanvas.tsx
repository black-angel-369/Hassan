"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { QualityTier } from "@/lib/device";
import { createCoreMaterial, createGlowPointsMaterial, createPulseLineMaterial, PALETTE } from "./materials";

type Props = {
  tier: Exclude<QualityTier, "off">;
  reducedMotion: boolean;
  active: boolean;
  onReady?: () => void;
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
type Rng = () => number;

/** Deterministic PRNG so the composition is identical on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─────────────────────────── Geometry builders ─────────────────────────── */

function buildNetwork(rand: Rng, count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const jitter = radius * (0.92 + rand() * 0.16);
    pts.push(new THREE.Vector3(Math.cos(th) * r * jitter, y * jitter, Math.sin(th) * r * jitter));
  }

  // Nodes
  const nPos = new Float32Array(count * 3);
  const nCol = new Float32Array(count * 3);
  const nSize = new Float32Array(count);
  const nSeed = new Float32Array(count);
  pts.forEach((p, i) => {
    p.toArray(nPos, i * 3);
    const roll = rand();
    const c = roll > 0.93 ? PALETTE.emerald : roll > 0.85 ? PALETTE.violet : PALETTE.cyanSoft;
    c.toArray(nCol, i * 3);
    nSize[i] = roll > 0.85 ? 3.4 + rand() * 1.6 : 1.6 + rand() * 1.8;
    nSeed[i] = rand();
  });
  const nodes = new THREE.BufferGeometry();
  nodes.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
  nodes.setAttribute("color", new THREE.BufferAttribute(nCol, 3));
  nodes.setAttribute("aSize", new THREE.BufferAttribute(nSize, 1));
  nodes.setAttribute("aSeed", new THREE.BufferAttribute(nSeed, 1));

  // Edges: connect each node to its nearest neighbours (deduplicated).
  const seen = new Set<string>();
  const ePos: number[] = [];
  const eT: number[] = [];
  const eSeed: number[] = [];
  const eActive: number[] = [];
  const maxDist = radius * 0.62;
  for (let i = 0; i < count; i++) {
    const near = pts
      .map((p, j) => ({ j, d: p.distanceTo(pts[i]) }))
      .filter((o) => o.j !== i && o.d < maxDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // Slightly bow edges outward via a mid point for a less mechanical look.
      const a = pts[i];
      const b = pts[j];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.setLength(mid.length() * 1.04);
      const s = rand();
      const active = s < 0.32 ? 1 : 0;
      // Two segments a→mid, mid→b with continuous t.
      ePos.push(a.x, a.y, a.z, mid.x, mid.y, mid.z, mid.x, mid.y, mid.z, b.x, b.y, b.z);
      eT.push(0, 0.5, 0.5, 1);
      for (let k = 0; k < 4; k++) {
        eSeed.push(s);
        eActive.push(active);
      }
    }
  }
  const edges = new THREE.BufferGeometry();
  edges.setAttribute("position", new THREE.Float32BufferAttribute(ePos, 3));
  edges.setAttribute("aT", new THREE.Float32BufferAttribute(eT, 1));
  edges.setAttribute("aSeed", new THREE.Float32BufferAttribute(eSeed, 1));
  edges.setAttribute("aActive", new THREE.Float32BufferAttribute(eActive, 1));
  return { nodes, edges };
}

function buildDust(rand: Rng, count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.randomDirection().multiplyScalar(3.4 + Math.pow(rand(), 0.6) * 7);
    v.toArray(pos, i * 3);
    const c = rand() > 0.8 ? PALETTE.violet : rand() > 0.5 ? PALETTE.cyan : PALETTE.white;
    c.toArray(col, i * 3);
    size[i] = 0.5 + rand() * 1.1;
    seed[i] = rand();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

function buildOrbiters(count: number, radius: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pos.set([Math.cos(a) * radius, 0, Math.sin(a) * radius], i * 3);
    (i % 3 === 0 ? PALETTE.emerald : PALETTE.cyanSoft).toArray(col, i * 3);
    size[i] = i % 3 === 0 ? 3.2 : 1.4;
    seed[i] = i / count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

/* ─────────────────────────────── Scene ─────────────────────────────── */

function CoreScene({ tier, reducedMotion }: Omit<Props, "active" | "onReady">) {
  const { gl, size, camera, invalidate } = useThree();
  const high = tier === "high";
  const dpr = gl.getPixelRatio();

  const res = useMemo(() => {
    const rand = mulberry32(7);
    const network = buildNetwork(rand, high ? 150 : 80, 2.35);
    const dust = buildDust(rand, high ? 1800 : 600);
    const orbitA = buildOrbiters(high ? 48 : 30, 2.95);
    const orbitB = buildOrbiters(high ? 32 : 20, 3.35);
    const coreGeo = new THREE.IcosahedronGeometry(1, 1);
    const innerGeo = new THREE.OctahedronGeometry(0.42, 0);
    const shellGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1));
    const ringGeos = [2.95, 3.35, 3.8].map((r) => new THREE.TorusGeometry(r, 0.0035, 6, high ? 260 : 160));
    const nucleus = new THREE.BufferGeometry();
    nucleus.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));
    nucleus.setAttribute("color", new THREE.Float32BufferAttribute(PALETTE.cyanSoft.toArray(), 3));
    nucleus.setAttribute("aSize", new THREE.Float32BufferAttribute([46], 1));
    nucleus.setAttribute("aSeed", new THREE.Float32BufferAttribute([0.3], 1));

    const mats = {
      core: createCoreMaterial(),
      inner: createCoreMaterial(),
      nodes: createGlowPointsMaterial({ pixelRatio: dpr, twinkle: 0.6 }),
      dust: createGlowPointsMaterial({ pixelRatio: dpr, twinkle: 0.8, sizeScale: 0.9 }),
      orbit: createGlowPointsMaterial({ pixelRatio: dpr, twinkle: 0.3 }),
      nucleus: createGlowPointsMaterial({ pixelRatio: dpr, twinkle: 0.25 }),
      edges: createPulseLineMaterial(),
      shell: new THREE.LineBasicMaterial({
        color: PALETTE.cyan,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      ring: new THREE.MeshBasicMaterial({
        color: PALETTE.cyanSoft,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      ringAlt: new THREE.MeshBasicMaterial({
        color: PALETTE.violet,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
    mats.inner.uniforms.uRim.value = PALETTE.emerald.clone();
    return { network, dust, orbitA, orbitB, coreGeo, innerGeo, shellGeo, ringGeos, nucleus, mats };
  }, [high, dpr]);

  // Explicit GPU cleanup — Three.js never frees VRAM on its own.
  useEffect(() => {
    return () => {
      res.network.nodes.dispose();
      res.network.edges.dispose();
      res.dust.dispose();
      res.orbitA.dispose();
      res.orbitB.dispose();
      res.coreGeo.dispose();
      res.innerGeo.dispose();
      res.shellGeo.dispose();
      res.nucleus.dispose();
      res.ringGeos.forEach((g) => g.dispose());
      Object.values(res.mats).forEach((m) => m.dispose());
    };
  }, [res]);

  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const core = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const orbitARef = useRef<THREE.Points>(null);
  const orbitBRef = useRef<THREE.Points>(null);
  const rings = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scroll = useRef(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1.5);
      if (reducedMotion) invalidate();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion, invalidate]);

  // Responsive composition: core sits right of the copy on wide screens,
  // centred and higher (behind the headline, dimmed via CSS) on narrow ones.
  const aspect = size.width / size.height;
  const wide = aspect > 1.15;
  const baseX = wide ? Math.min(2.6, 1.2 + (aspect - 1.15) * 1.6) : 0;
  const baseY = wide ? 0 : 0.9;
  const baseScale = wide ? 1 : aspect < 0.7 ? 0.74 : 0.86;

  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const intro = reducedMotion ? 1 : easeOutExpo(Math.min((t - start.current) / 2.6, 1));
    const dt = Math.min(delta, 0.05);

    const p = pointer.current;
    p.x += (p.tx - p.x) * Math.min(dt * 2.2, 1);
    p.y += (p.ty - p.y) * Math.min(dt * 2.2, 1);

    const m = res.mats;
    const time = reducedMotion ? 4 : t;
    for (const mat of [m.core, m.inner, m.nodes, m.dust, m.orbit, m.nucleus, m.edges]) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uOpacity.value = intro;
    }
    m.inner.uniforms.uOpacity.value = intro * 0.9;
    m.nucleus.uniforms.uOpacity.value = intro * 0.55;
    m.shell.opacity = 0.16 * intro;
    m.ring.opacity = 0.22 * intro;
    m.ringAlt.opacity = 0.16 * intro;

    const s = scroll.current;
    if (root.current) {
      const sc = baseScale * (0.62 + 0.38 * intro) * (1 - s * 0.12);
      root.current.scale.setScalar(sc);
      root.current.position.set(baseX + p.x * 0.18, baseY + s * 1.6 - p.y * 0.12, -s * 1.5);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, p.y * 0.28, dt * 3);
      root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, -p.x * 0.08, dt * 3);
    }
    if (reducedMotion) return;

    const introSpin = (1 - intro) * 2.4; // fast unwinding during the entrance
    if (spin.current) spin.current.rotation.y += dt * (0.075 + introSpin) + p.x * dt * 0.25;
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.12;
      shell.current.rotation.x += dt * 0.04;
    }
    if (core.current) {
      core.current.rotation.y += dt * 0.22;
      core.current.rotation.z += dt * 0.08;
      const breathe = 1 + Math.sin(t * 1.1) * 0.025;
      core.current.scale.setScalar(breathe);
    }
    if (inner.current) inner.current.rotation.y -= dt * 0.6;
    if (dustRef.current) dustRef.current.rotation.y += dt * 0.012;
    if (orbitARef.current) orbitARef.current.rotation.y += dt * 0.32;
    if (orbitBRef.current) orbitBRef.current.rotation.y -= dt * 0.2;
    if (rings.current) rings.current.rotation.y += dt * 0.03;
  });

  return (
    <group ref={root}>
      <points ref={dustRef} geometry={res.dust} material={res.mats.dust} />
      <group ref={spin}>
        <lineSegments geometry={res.network.edges} material={res.mats.edges} />
        <points geometry={res.network.nodes} material={res.mats.nodes} />
      </group>
      <lineSegments ref={shell} geometry={res.shellGeo} material={res.mats.shell} />
      <mesh ref={core} geometry={res.coreGeo} material={res.mats.core} />
      <mesh ref={inner} geometry={res.innerGeo} material={res.mats.inner} />
      <points geometry={res.nucleus} material={res.mats.nucleus} />
      <group ref={rings}>
        <group rotation={[Math.PI / 2.25, 0, 0.18]}>
          <mesh geometry={res.ringGeos[0]} material={res.mats.ring} />
          <points ref={orbitARef} geometry={res.orbitA} material={res.mats.orbit} rotation={[Math.PI / 2, 0, 0]} />
        </group>
        <group rotation={[Math.PI / 1.7, 0.4, -0.3]}>
          <mesh geometry={res.ringGeos[1]} material={res.mats.ringAlt} />
          <points ref={orbitBRef} geometry={res.orbitB} material={res.mats.orbit} rotation={[Math.PI / 2, 0, 0]} />
        </group>
        <group rotation={[Math.PI / 2.6, -0.5, 0.6]}>
          <mesh geometry={res.ringGeos[2]} material={res.mats.ring} />
        </group>
      </group>
    </group>
  );
}

export default function HeroCanvas({ tier, reducedMotion, active, onReady }: Props) {
  const high = tier === "high";
  return (
    <Canvas
      aria-hidden
      role="presentation"
      dpr={high ? [1, 1.75] : [1, 1.3]}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      gl={{ antialias: high, alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0, 9] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Small delay so the first frames render before the poster fades.
        requestAnimationFrame(() => onReady?.());
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CoreScene tier={tier} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
