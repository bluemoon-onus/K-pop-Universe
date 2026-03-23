import { ArtistCard } from "./artist-card"
import type { Artist } from "@/types"

export function ArtistGrid({
  artists,
  showConcertLinks = false,
}: {
  artists: Artist[]
  showConcertLinks?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 2xl:grid-cols-5">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          showConcertLink={showConcertLinks}
        />
      ))}
    </div>
  )
}
