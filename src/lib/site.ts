import type { Metadata } from "next"
import { locales, type AppLocale } from "@i18n/routing"

const FALLBACK_SITE_URL = "https://kpop-ticket-hub.vercel.app"
const BRAND_NAME = "K-pop Ticket Hub"

function normalizeSiteUrl(rawUrl: string) {
  return rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`
}

export function getSiteUrl() {
  return new URL(
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL),
  )
}

export function getBrandName() {
  return BRAND_NAME
}

export function getLocalizedPath(locale: AppLocale, path = "/") {
  const normalizedPath =
    path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`

  return `/${locale}${normalizedPath}` || `/${locale}`
}

export function getLocalizedUrl(locale: AppLocale, path = "/") {
  return new URL(getLocalizedPath(locale, path), getSiteUrl()).toString()
}

export function getLanguageAlternates(path = "/") {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(locale, path)]),
  )
}

export function createPageMetadata({
  locale,
  title,
  description,
  path = "/",
  images = [new URL("/opengraph-image", getSiteUrl()).toString()],
  keywords,
  robots,
}: {
  locale: AppLocale
  title: string
  description: string
  path?: string
  images?: string[]
  keywords?: string[]
  robots?: Metadata["robots"]
}): Metadata {
  const absoluteUrl = getLocalizedUrl(locale, path)

  return {
    title,
    description,
    keywords,
    metadataBase: getSiteUrl(),
    alternates: {
      canonical: absoluteUrl,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: BRAND_NAME,
      type: "website",
      images,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/twitter-image", getSiteUrl()).toString()],
    },
    robots,
  }
}
