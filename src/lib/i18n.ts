import { createNavigation } from "next-intl/navigation"
import { defaultLocale, locales, routing, type AppLocale } from "@i18n/routing"

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  ko: "한국어",
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

export function getLocaleDirection(locale: string) {
  return locale.startsWith("ar") ? "rtl" : "ltr"
}

export function stripLocaleSegment(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] && locales.includes(segments[0] as AppLocale)) {
    return `/${segments.slice(1).join("/")}` || "/"
  }

  return pathname || "/"
}

export function switchLocaleInPath(pathname: string, locale: AppLocale) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] && locales.includes(segments[0] as AppLocale)) {
    segments[0] = locale
  } else {
    segments.unshift(locale)
  }

  return `/${segments.join("/")}` || `/${defaultLocale}`
}
