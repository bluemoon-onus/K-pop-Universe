import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/common/json-ld"
import { ConcertDetail } from "@/components/concerts/concert-detail"
import {
  getConcertArtist,
  getConcertById,
  getConcertNotice,
  getConcertPrices,
  mockConcerts,
} from "@/data/mock-concerts"
import { sellerLinks } from "@/lib/constants"
import { createPageMetadata, getLocalizedUrl } from "@/lib/site"
import { getArtistDisplayName } from "@/lib/utils"
import type { AppLocale } from "@i18n/routing"

export function generateStaticParams() {
  return mockConcerts.map((concert) => ({ id: concert.id }))
}

function mapAvailability(status: string) {
  if (status === "sold_out") {
    return "https://schema.org/SoldOut"
  }

  if (status === "cancelled") {
    return "https://schema.org/Discontinued"
  }

  return "https://schema.org/InStock"
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const concert = getConcertById(id)

  if (!concert) {
    return {}
  }

  const artist = getConcertArtist(concert)
  const pageTitle = artist
    ? `${concert.title} - ${getArtistDisplayName(artist)}`
    : concert.title
  const pageDescription = `${concert.venueName} · ${concert.city}, ${concert.countryCode}. Official seller: ${concert.officialSeller}.`

  return createPageMetadata({
    locale: locale as AppLocale,
    title: pageTitle,
    description: pageDescription,
    path: `/concerts/${concert.id}`,
    keywords: [
      concert.title,
      concert.city,
      concert.officialSeller,
      artist?.nameEn ?? "",
    ].filter(Boolean),
  })
}

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const concert = getConcertById(id)

  if (!concert) {
    notFound()
  }

  const artist = getConcertArtist(concert)
  const notice = getConcertNotice(concert.id)
  const prices = getConcertPrices(concert.id)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicEvent",
          name: concert.title,
          description: notice?.summary,
          startDate: concert.startDate.toISOString(),
          endDate: concert.endDate?.toISOString(),
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus:
            concert.status === "cancelled"
              ? "https://schema.org/EventCancelled"
              : concert.status === "ended"
                ? "https://schema.org/EventCompleted"
                : "https://schema.org/EventScheduled",
          url: getLocalizedUrl(locale as AppLocale, `/concerts/${concert.id}`),
          performer: artist
            ? {
                "@type": "MusicGroup",
                name: getArtistDisplayName(artist),
              }
            : undefined,
          location: {
            "@type": "Place",
            name: concert.venueName,
            address: {
              "@type": "PostalAddress",
              streetAddress: concert.venueAddress ?? undefined,
              addressLocality: concert.city,
              addressCountry: concert.countryCode,
            },
          },
          offers: prices.map((price) => ({
            "@type": "Offer",
            url: concert.officialTicketUrl,
            price: price.amount,
            priceCurrency: price.currency,
            availability: mapAvailability(concert.status),
          })),
          organizer: {
            "@type": "Organization",
            name: concert.officialSeller,
            url: sellerLinks[concert.officialSeller] ?? concert.sourceUrl,
          },
        }}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ConcertDetail concert={concert} />
      </div>
    </>
  )
}
