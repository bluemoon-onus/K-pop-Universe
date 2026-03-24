import { ImageResponse } from "next/og"
import { getBrandName } from "@/lib/site"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgb(27, 28, 44), rgb(21, 52, 76) 50%, rgb(231, 152, 61))",
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "86px",
              height: "86px",
              borderRadius: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.15)",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            KH
          </div>
          <div
            style={{
              fontSize: "28px",
              opacity: 0.9,
            }}
          >
            {getBrandName()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "920px",
            }}
          >
            Never miss K-pop ticket openings again.
          </div>
          <div
            style={{
              fontSize: "30px",
              opacity: 0.86,
              maxWidth: "820px",
            }}
          >
            Track presales, time zones, and official seller links in one artist-first hub.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
