import { getRequestConfig } from "next-intl/server"
import { defaultLocale, isValidLocale } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = requested && isValidLocale(requested) ? requested : defaultLocale

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
    timeZone: "Asia/Seoul",
  }
})
