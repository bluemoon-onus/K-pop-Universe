import type { MetadataRoute } from "next"
import { getBrandName } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: getBrandName(),
    short_name: "Ticket Hub",
    description:
      "Global K-pop concert discovery and ticket-opening alerts with official seller links only.",
    start_url: "/en",
    display: "standalone",
    background_color: "#fcfbf7",
    theme_color: "#1d1d2a",
    categories: ["music", "events", "entertainment"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
