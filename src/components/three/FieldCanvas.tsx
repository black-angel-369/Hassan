"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { QualityTier } from "@/lib/device";
import { PALETTE } from "./materials";

type Props = {
  tier: Exclude<QualityTier, "off">;
  reducedMotion: boolean;
  active: boolean;
  onReady?: () => void;
};

/** A flowing topographic field of light — a calm "signal plane". */
function Field({ tier, reducedMotion }: Omit<Props, "active" | "onReady">) {
  const { gl } = useThree();
  const cols = tier === "high" ? 180 : 90;
  const rows = tier === "high" ? 70 : 40;

  const { geometry, material } = useMemo(() => {
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos[i++] = (c / (cols - 1) - 0.5) * 26;
        pos[i++] = 0;
        pos[i++] = (r / (rows - 1) - 0.5) * 12;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: gl.getPixelRatio() },
        uA: { value: PALETTE.cyan.clone() },
        uB: { value: PALETTE.violet.clone() },
        uC: { value: PALETTE.emerald.clone() },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uPixelRatio;
        varying float vH;
        varying float vFade;
        void main() {
          vec3 p = position;
          float t = uTime * 0.35;
          float h = sin(p.x * 0.35 + t) * 0.45
                  + sin(p.z * 0.6 - t * 1.3) * 0.35
                  + sin((p.x + p.z) * 0.22 + t * 0.7) * 0.5;
          float d = distance(p.xz, uPointer * vec2(11.0, 5.0));
          h += exp(-d * d * 0.08) * 0.9 * sin(d * 1.4 - uTime * 2.4);
          p.y = h;
          vH = h;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vFade = (1.0 - smoothstep(10.0, 13.0, abs(position.x))) * (1.0 - smoothstep(4.0, 6.0, abs(position.z)));
          gl_PointSize = uPixelRatio * (1.4 + max(h, 0.0) * 1.6) * (14.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uA;
        uniform vec3 uB;
        uniform vec3 uC;
        varying float vH;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float k = smoothstep(-1.0, 1.2, vH);
          vec3 col = mix(uB, uA, k);
          col = mix(col, uC, smoothstep(1.0, 1.6, vH) * 0.6);
          float a = (1.0 - smoothstep(0.1, 0.5, d)) * (0.18 + k * 0.55) * vFade;
          gl_FragColor = vec4(col, a);
        }
      `,
    });
    return { geometry: g, material: m };
  }, [cols, rows, gl]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const target = useRef(new THREE.Vector2());
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = reducedMotion ? 3 : state.clock.elapsedTime;
    material.uniforms.uPointer.value.lerp(target.current, Math.min(delta * 1.5, 1));
  });

  return <points geometry={geometry} material={material} />;
}

export default function FieldCanvas({ tier, reducedMotion, active, onReady }: Props) {
  return (
    <Canvas
      aria-hidden
      dpr={tier === "high" ? [1, 1.5] : [1, 1.2]}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 3.2, 9.5] }}
      onCreated={({ camera, gl }) => {
        gl.setClearColor(0x000000, 0);
        camera.lookAt(0, -0.6, 0);
        requestAnimationFrame(() => onReady?.());
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field tier={tier} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
