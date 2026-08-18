import { ImageResponse } from "next/og"
import { LOGO_DATA_URL } from "./og-logo"

export const alt = "Kamerinos by Sandra Pinzon — Bienestar, Estética & Salud en Bogotá"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#a0522d",
        color: "#fdf6f0",
      }}
    >
      <img
        src={LOGO_DATA_URL}
        width={220}
        height={216}
        alt=""
        style={{ marginBottom: 28 }}
      />
      <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: "-1px" }}>
        Kamerinos
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          marginTop: 6,
          letterSpacing: "8px",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        by Sandra Pinzón
      </div>
      <div style={{ display: "flex", fontSize: 26, marginTop: 26, opacity: 0.95 }}>
        Bienestar · Estética · Salud — Bogotá
      </div>
    </div>,
    { ...size },
  )
}
