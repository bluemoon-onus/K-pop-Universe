import type { MetadataRoute } from "next"
import { mockConcerts } from "@/data/mock-concerts"
import { locales } from "@i18n/routing"
import { getLocalizedUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/artists", "/concerts"]

  const localizedPages = locales.flatMap((locale) =>
    staticRoutes.map((path) => ({
      url: getLocalizedUrl(locale, path || "/"),
      lastModified: new Date(),
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
  )

  const concertPages = locales.flatMap((locale) =>
    mockConcerts.map((concert) => ({
      url: getLocalizedUrl(locale, `/concerts/${concert.id}`),
      lastModified: concert.updatedAt,
      changeFrequency: "daily" as const,
      priority: concert.status === "ended" ? 0.5 : 0.7,
    })),
  )

  return [...localizedPages, ...concertPages]
}
