import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/common/json-ld"
import ConcertsPageClient from "./concerts-page-client"
import { createPageMetadata, getLocalizedUrl } from "@/lib/site"
import type { AppLocale } from "@i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tConcerts = await getTranslations({ locale, namespace: "concerts" })

  return createPageMetadata({
    locale: locale as AppLocale,
    title: tConcerts("title"),
    description: tConcerts("subtitle"),
    path: "/concerts",
    keywords: ["concert schedule", "ticket schedule", "official ticket sellers"],
  })
}

export default async function ConcertsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tConcerts = await getTranslations({ locale, namespace: "concerts" })

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: tConcerts("title"),
          description: tConcerts("subtitle"),
          url: getLocalizedUrl(locale as AppLocale, "/concerts"),
          inLanguage: locale,
        }}
      />
      <ConcertsPageClient />
    </>
  )
}
