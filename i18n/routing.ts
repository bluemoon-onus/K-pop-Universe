import { defineRouting } from "next-intl/routing"

export const locales = ["en", "ko"] as const
export const defaultLocale = "en" as const

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
})

export type AppLocale = (typeof locales)[number]
