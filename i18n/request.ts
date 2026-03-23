import { getRequestConfig } from "next-intl/server"
import { defaultLocale, locales } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = locales.includes(requested as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : defaultLocale

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
    timeZone: "Asia/Seoul",
  }
})
