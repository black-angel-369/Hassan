import { ImageResponse } from "next/og";
import { site } from "@/content/portfolio";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 78% 40%, rgba(34,211,238,0.28), rgba(139,140,248,0.10) 30%, rgba(5,7,11,0) 55%), linear-gradient(180deg, #0b1120 0%, #05070b 100%)",
          color: "#eef2f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#67e8f9", fontSize: 24, letterSpacing: 6 }}>
          <div style={{ width: 48, height: 2, background: "#22d3ee" }} />
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ marginTop: 24, fontSize: 36, color: "#a3b1c6" }}>{site.title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8492a8" }}>
          <span>Engineering Secure Digital Experiences.</span>
          <span>{site.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
