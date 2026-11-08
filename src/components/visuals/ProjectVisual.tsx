import type { ProjectVisualKey } from "@/content/portfolio";

/**
 * Abstract, layered illustrations for each project. Layers use translateZ so
 * the parent TiltCard (preserve-3d) gives them real parallax depth. All motion
 * is CSS and gated with `motion-safe:`. Purely decorative → aria-hidden.
 */

const C = { cyan: "#22d3ee", cyanSoft: "#67e8f9", emerald: "#34d399", violet: "#8b8cf8", danger: "#f87171", line: "#94a3b8" };

function Frame({ children, glow = C.cyan }: { children: React.ReactNode; glow?: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden [transform-style:preserve-3d]">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(80% 70% at 50% 45%, ${glow}22, transparent 70%)` }}
      />
      <div className="bg-grid absolute inset-0 opacity-80" />
      {children}
    </div>
  );
}

function Layer({ z, className, children }: { z: number; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[var(--ease-out-expo)] ${className ?? ""}`}
      style={{ transform: `translateZ(${z}px)` }}
    >
      {children}
    </div>
  );
}

/* 01 — Dependency graph with one suspicious package */
function SupplyChain() {
  const nodes = [
    { x: 300, y: 70, r: 14, c: C.cyanSoft },
    { x: 160, y: 170, r: 9, c: C.cyan },
    { x: 300, y: 180, r: 9, c: C.cyan },
    { x: 440, y: 165, r: 9, c: C.violet },
    { x: 90, y: 270, r: 6, c: C.line },
    { x: 200, y: 285, r: 6, c: C.line },
    { x: 290, y: 290, r: 6, c: C.line },
    { x: 370, y: 280, r: 7, c: C.danger, flag: true },
    { x: 480, y: 275, r: 6, c: C.line },
    { x: 540, y: 240, r: 5, c: C.line },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 5], [2, 6], [2, 7], [3, 7], [3, 8], [3, 9],
  ];
  return (
    <Frame>
      <Layer z={10}>
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {edges.map(([a, b], i) => {
            const A = nodes[a];
            const B = nodes[b];
            const bad = B.flag;
            return (
              <path
                key={i}
                d={`M${A.x} ${A.y} C ${A.x} ${(A.y + B.y) / 2}, ${B.x} ${(A.y + B.y) / 2}, ${B.x} ${B.y}`}
                fill="none"
                stroke={bad ? C.danger : C.cyan}
                strokeOpacity={bad ? 0.75 : 0.35}
                strokeWidth={bad ? 1.4 : 1}
                strokeDasharray="4 8"
                className="motion-safe:animate-dash"
              />
            );
          })}
        </svg>
      </Layer>
      <Layer z={40}>
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {nodes.map((n, i) => (
            <g key={i}>
              {n.flag && (
                <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={C.danger} className="svg-box motion-safe:animate-ping-slow" />
              )}
              <circle cx={n.x} cy={n.y} r={n.r + 5} fill={n.c} fillOpacity="0.08" />
              <circle cx={n.x} cy={n.y} r={n.r} fill="#0b1120" stroke={n.c} strokeWidth="1.5" />
              <circle cx={n.x} cy={n.y} r={n.r * 0.35} fill={n.c} />
            </g>
          ))}
        </svg>
      </Layer>
      <Layer z={70} className="items-end justify-end p-5 md:p-7">
        <div className="glass rounded-xl px-4 py-3 font-mono text-[0.7rem] leading-relaxed">
          <p className="text-[var(--color-fg-subtle)]">dependency.diff</p>
          <p className="text-[var(--color-danger)]">▲ suspicious package change</p>
          <p className="text-[var(--color-violet-soft)]">◆ attack indicator surfaced</p>
        </div>
      </Layer>
    </Frame>
  );
}

/* 02 — Threat radar */
function ThreatRadar() {
  const blips = [
    { x: 62, y: 38, c: C.danger },
    { x: 34, y: 60, c: C.emerald },
    { x: 70, y: 66, c: C.cyanSoft },
    { x: 45, y: 28, c: C.emerald },
  ];
  return (
    <Frame glow={C.violet}>
      <Layer z={10}>
        <div className="relative aspect-square h-[82%]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[var(--color-cyan)]/20"
              style={{ inset: `${i * 12.5}%` }}
            />
          ))}
          <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--color-cyan)]/15" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--color-cyan)]/15" />
        </div>
      </Layer>
      <Layer z={30}>
        <div className="relative aspect-square h-[82%]">
          <div
            className="absolute inset-0 rounded-full motion-safe:animate-sweep"
            style={{ background: "conic-gradient(from 0deg, rgb(34 211 238 / 0.35), transparent 22%)" }}
          />
          {blips.map((b, i) => (
            <span key={i} className="absolute size-2.5 -translate-1/2" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
              <span
                className="absolute inset-0 rounded-full motion-safe:animate-ping-slow"
                style={{ background: b.c, animationDelay: `${i * 0.6}s` }}
              />
              <span className="absolute inset-0 rounded-full" style={{ background: b.c, boxShadow: `0 0 14px ${b.c}` }} />
            </span>
          ))}
        </div>
      </Layer>
      <Layer z={65} className="items-start justify-start p-5 md:p-7">
        <div className="glass w-44 rounded-xl p-3 font-mono text-[0.68rem]">
          <p className="text-[var(--color-fg-subtle)]">signals</p>
          {[
            ["url", 78, C.danger],
            ["domain", 54, C.violet],
            ["ip", 32, C.emerald],
          ].map(([k, w, c]) => (
            <div key={k as string} className="mt-2 flex items-center gap-2">
              <span className="w-12 text-[var(--color-fg-muted)]">{k}</span>
              <span className="h-1 flex-1 rounded-full bg-white/10">
                <span className="block h-full rounded-full" style={{ width: `${w}%`, background: c as string }} />
              </span>
            </div>
          ))}
        </div>
      </Layer>
    </Frame>
  );
}

/* 03 — Web application scan */
function WebScan() {
  const rows = [
    { w: 70, sev: C.danger },
    { w: 52, sev: null },
    { w: 84, sev: C.violet },
    { w: 40, sev: null },
    { w: 64, sev: C.emerald },
    { w: 58, sev: null },
  ];
  return (
    <Frame>
      <Layer z={15}>
        <div className="relative h-[78%] w-[78%] overflow-hidden rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-ink-900)]/80">
          <div className="flex items-center gap-1.5 border-b border-[var(--color-line)] px-3 py-2">
            {[C.danger, "#fbbf24", C.emerald].map((c) => (
              <span key={c} className="size-2 rounded-full opacity-70" style={{ background: c }} />
            ))}
            <span className="ml-3 h-3.5 flex-1 rounded bg-white/[0.05]" />
          </div>
          <div className="space-y-2.5 p-4">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: r.sev ?? "rgb(148 163 184 / 0.25)", boxShadow: r.sev ? `0 0 10px ${r.sev}` : undefined }}
                />
                <span className="h-2 rounded bg-white/[0.07]" style={{ width: `${r.w}%` }} />
              </div>
            ))}
          </div>
          <div
            className="absolute inset-x-0 top-9 h-12 motion-safe:animate-scanline"
            style={{
              ["--scan-distance" as string]: "150%",
              background: "linear-gradient(180deg, transparent, rgb(34 211 238 / 0.18), transparent)",
              borderBottom: "1px solid rgb(103 232 249 / 0.6)",
            }}
          />
        </div>
      </Layer>
      <Layer z={60} className="items-end justify-end p-5 md:p-7">
        <div className="glass rounded-xl p-3 font-mono text-[0.68rem]">
          <p className="text-[var(--color-fg-subtle)]">report.sections</p>
          <p className="mt-1 text-[var(--color-fg)]">discovery · analysis · reporting</p>
        </div>
      </Layer>
    </Frame>
  );
}

/* 04 — Reticle + terminal */
function Pentest() {
  return (
    <Frame glow={C.emerald}>
      <Layer z={10}>
        <svg viewBox="0 0 200 200" className="h-[80%]">
          <g fill="none" stroke={C.emerald} strokeOpacity=".35">
            <circle cx="100" cy="100" r="80" strokeDasharray="2 5" className="svg-box motion-safe:animate-spin-slow" />
            <circle cx="100" cy="100" r="58" />
            <circle cx="100" cy="100" r="34" strokeOpacity=".6" />
          </g>
          <g stroke={C.emerald} strokeOpacity=".7">
            <path d="M100 4v34M100 162v34M4 100h34M162 100h34" />
          </g>
          <circle cx="100" cy="100" r="3" fill={C.emerald} />
        </svg>
      </Layer>
      <Layer z={55} className="items-end justify-start p-5 md:p-7">
        <div className="glass w-[min(100%,300px)] rounded-xl p-4 font-mono text-[0.7rem] leading-relaxed">
          <p className="text-[var(--color-fg-subtle)]">assessment.log</p>
          <p className="text-[var(--color-fg-muted)]">
            <span className="text-[var(--color-emerald)]">›</span> scope confirmed
          </p>
          <p className="text-[var(--color-fg-muted)]">
            <span className="text-[var(--color-emerald)]">›</span> enumerate · test · verify
          </p>
          <p className="text-[var(--color-fg-muted)]">
            <span className="text-[var(--color-emerald)]">›</span> details redacted
            <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-[var(--color-emerald)] motion-safe:animate-blink" />
          </p>
        </div>
      </Layer>
    </Frame>
  );
}

/* 05 — Management dashboard */
function Dashboard() {
  return (
    <Frame glow={C.violet}>
      <Layer z={12}>
        <div className="grid h-[76%] w-[82%] grid-cols-[56px_1fr] overflow-hidden rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-ink-900)]/85">
          <div className="space-y-3 border-r border-[var(--color-line)] p-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`block h-2 rounded ${i === 1 ? "bg-[var(--color-cyan)]/70" : "bg-white/[0.08]"}`} />
            ))}
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-3 p-3">
            <div className="grid grid-cols-3 gap-2">
              {[C.cyan, C.violet, C.emerald].map((c) => (
                <div key={c} className="rounded-lg border border-[var(--color-line)] p-2">
                  <span className="block h-1.5 w-1/2 rounded bg-white/10" />
                  <span className="mt-2 block h-2.5 w-3/4 rounded" style={{ background: `${c}99` }} />
                </div>
              ))}
            </div>
            <div className="relative rounded-lg border border-[var(--color-line)]">
              <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor={C.cyan} stopOpacity=".35" />
                    <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 95 C 40 80, 60 88, 90 70 S 150 40, 190 52 S 250 30, 300 22 V120 H0Z" fill="url(#dash-fill)" />
                <path
                  d="M0 95 C 40 80, 60 88, 90 70 S 150 40, 190 52 S 250 30, 300 22"
                  fill="none"
                  stroke={C.cyanSoft}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </Layer>
      <Layer z={60} className="items-start justify-end p-5 md:p-7">
        <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.68rem] text-[var(--color-emerald)]">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          secure by design
        </div>
      </Layer>
    </Frame>
  );
}

const map: Record<ProjectVisualKey, () => React.JSX.Element> = {
  supplychain: SupplyChain,
  threat: ThreatRadar,
  scan: WebScan,
  pentest: Pentest,
  dashboard: Dashboard,
};

export function ProjectVisual({ kind }: { kind: ProjectVisualKey }) {
  const V = map[kind];
  return <V />;
}
