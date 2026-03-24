import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/common/json-ld"
import ArtistsPageClient from "./artists-page-client"
import { createPageMetadata, getLocalizedUrl } from "@/lib/site"
import type { AppLocale } from "@i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tArtists = await getTranslations({ locale, namespace: "artists" })

  return createPageMetadata({
    locale: locale as AppLocale,
    title: tArtists("title"),
    description: tArtists("subtitle"),
    path: "/artists",
    keywords: ["K-pop artists", "follow artists", "artist schedule"],
  })
}

export default async function ArtistsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tArtists = await getTranslations({ locale, namespace: "artists" })

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: tArtists("title"),
          description: tArtists("subtitle"),
          url: getLocalizedUrl(locale as AppLocale, "/artists"),
          inLanguage: locale,
        }}
      />
      <ArtistsPageClient />
    </>
  )
}
