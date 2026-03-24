import { defaultLocale, isValidLocale, type AppLocale } from "@i18n/routing"

export function getLocaleDirection(locale: string) {
  return locale.startsWith("ar") ? "rtl" : "ltr"
}

export function stripLocaleSegment(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] && isValidLocale(segments[0])) {
    return `/${segments.slice(1).join("/")}` || "/"
  }

  return pathname || "/"
}

export function switchLocaleInPath(pathname: string, locale: AppLocale) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] && isValidLocale(segments[0])) {
    segments[0] = locale
  } else {
    segments.unshift(locale)
  }

  return `/${segments.join("/")}` || `/${defaultLocale}`
}
