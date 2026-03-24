import type { MetadataRoute } from "next"
import { locales } from "@i18n/routing"
import { getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const host = getSiteUrl().toString()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...locales.map((locale) => `/${locale}/my`)],
    },
    sitemap: `${host}sitemap.xml`,
    host,
  }
}
