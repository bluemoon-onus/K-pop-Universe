import { ArtistCard } from "./artist-card"
import type { Artist } from "@/types"

export function ArtistGrid({
  artists,
  followedArtistIds = [],
}: {
  artists: Artist[]
  followedArtistIds?: string[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          defaultFollowed={followedArtistIds.includes(artist.id)}
        />
      ))}
    </div>
  )
}
