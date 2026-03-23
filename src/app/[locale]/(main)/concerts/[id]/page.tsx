import { notFound } from "next/navigation"
import { ConcertDetail } from "@/components/concerts/concert-detail"
import { getConcertById, mockConcerts } from "@/data/mock-concerts"

export function generateStaticParams() {
  return mockConcerts.map((concert) => ({ id: concert.id }))
}

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const concert = getConcertById(id)

  if (!concert) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <ConcertDetail concert={concert} />
    </div>
  )
}
