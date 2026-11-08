import * as THREE from "three";

export const PALETTE = {
  cyan: new THREE.Color("#22d3ee"),
  cyanSoft: new THREE.Color("#67e8f9"),
  emerald: new THREE.Color("#34d399"),
  violet: new THREE.Color("#8b8cf8"),
  navy: new THREE.Color("#0b1120"),
  white: new THREE.Color("#eef2f7"),
};

/**
 * Soft round glowing points. Per-vertex attributes:
 *  - color (vec3), aSize (float), aSeed (float, 0..1)
 */
export function createGlowPointsMaterial(opts: { pixelRatio: number; twinkle?: number; sizeScale?: number }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: opts.pixelRatio },
      uTwinkle: { value: opts.twinkle ?? 0.5 },
      uSizeScale: { value: opts.sizeScale ?? 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uTwinkle;
      uniform float uSizeScale;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * (0.8 + aSeed * 1.6) + aSeed * 40.0));
        vTw = tw;
        gl_PointSize = aSize * uSizeScale * uPixelRatio * (0.65 + 0.35 * tw) * (10.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float core = 1.0 - smoothstep(0.0, 0.18, d);
        float halo = (1.0 - smoothstep(0.0, 0.5, d)) * 0.35;
        float a = (core + halo) * uOpacity * (0.55 + 0.45 * vTw);
        gl_FragColor = vec4(vColor * (0.8 + core * 0.6), a);
      }
    `,
  });
}

/** Faceted crystal with fresnel rim + slow scanning band. */
export function createCoreMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uRim: { value: PALETTE.cyan.clone() },
      uDeep: { value: PALETTE.navy.clone() },
      uAccent: { value: PALETTE.violet.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vViewPos;
      varying vec3 vObj;
      void main() {
        vObj = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewPos = mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uRim;
      uniform vec3 uDeep;
      uniform vec3 uAccent;
      varying vec3 vViewPos;
      varying vec3 vObj;
      void main() {
        // Flat facet normal from screen-space derivatives.
        vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
        vec3 v = normalize(-vViewPos);
        float facing = abs(dot(n, v));
        float fres = pow(1.0 - facing, 2.0);
        float f = fract(vObj.y * 0.9 - uTime * 0.18);
        float band = 1.0 - smoothstep(0.0, 0.045, min(f, 1.0 - f));
        vec3 col = mix(uDeep, uRim, fres);
        col += uAccent * pow(fres, 4.0) * 0.8;
        col += uRim * band * 0.35;
        col += vec3(0.6, 0.9, 1.0) * pow(facing, 24.0) * 0.25; // specular glint
        float a = (0.22 + fres * 0.7 + band * 0.2) * uOpacity;
        gl_FragColor = vec4(col, a);
      }
    `,
  });
}

/**
 * Network edges with travelling pulses. Attributes:
 *  - aT (0 at segment start, 1 at end), aSeed (per-edge random), aActive (0/1)
 */
export function createPulseLineMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBase: { value: PALETTE.cyan.clone() },
      uPulse: { value: PALETTE.cyanSoft.clone() },
      uAlt: { value: PALETTE.emerald.clone() },
    },
    vertexShader: /* glsl */ `
      attribute float aT;
      attribute float aSeed;
      attribute float aActive;
      varying float vT;
      varying float vSeed;
      varying float vActive;
      varying float vDepth;
      void main() {
        vT = aT; vSeed = aSeed; vActive = aActive;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = smoothstep(-9.0, -4.0, mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uBase;
      uniform vec3 uPulse;
      uniform vec3 uAlt;
      varying float vT;
      varying float vSeed;
      varying float vActive;
      varying float vDepth;
      void main() {
        float head = fract(uTime * (0.18 + vSeed * 0.22) + vSeed * 7.0);
        float dist = vT - head;
        float trail = (1.0 - smoothstep(0.0, 0.22, -dist)) * step(dist, 0.0);
        float spike = 1.0 - smoothstep(0.0, 0.03, abs(dist));
        float pulse = vActive * max(trail, spike);
        vec3 pc = mix(uPulse, uAlt, step(0.75, vSeed));
        vec3 col = uBase * 0.55 + pc * pulse * 1.4;
        float a = (0.07 + 0.08 * vDepth + pulse * 0.75) * uOpacity;
        gl_FragColor = vec4(col, a);
      }
    `,
  });
}
