import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/common/json-ld"
import HomePageClient from "./home-page-client"
import { createPageMetadata, getBrandName, getLocalizedUrl } from "@/lib/site"
import type { AppLocale } from "@i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tHome = await getTranslations({ locale, namespace: "home" })

  return createPageMetadata({
    locale: locale as AppLocale,
    title: tHome("hero.eyebrow"),
    description: tHome("hero.subtitle"),
    path: "/",
    keywords: [
      "K-pop tickets",
      "concert alerts",
      "ticket openings",
      "fanclub presale",
    ],
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })
  const tHome = await getTranslations({ locale, namespace: "home" })

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: getBrandName(),
          url: getLocalizedUrl(locale as AppLocale, "/"),
          description: tCommon("metadata.description"),
          potentialAction: {
            "@type": "SearchAction",
            target: `${getLocalizedUrl(locale as AppLocale, "/concerts")}?query={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
          inLanguage: locale,
          headline: tHome("hero.eyebrow"),
        }}
      />
      <HomePageClient />
    </>
  )
}
