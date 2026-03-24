"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowButton } from "@/components/common/follow-button"
import { getConcertsByArtist } from "@/data/mock-concerts"
import { getArtistDisplayName, getArtistInitials } from "@/lib/utils"
import type { Artist } from "@/types"

const gradientByArtist: Record<string, string> = {
  bts: "from-chart-5/70 via-primary/25 to-chart-2/25",
  seventeen: "from-primary/70 via-accent/20 to-chart-4/25",
  aespa: "from-accent/60 via-chart-5/25 to-primary/20",
  blackpink: "from-primary/60 via-chart-5/30 to-accent/20",
  twice: "from-chart-4/60 via-primary/25 to-accent/25",
  straykids: "from-chart-3/60 via-accent/25 to-primary/20",
  gidle: "from-chart-5/60 via-primary/25 to-accent/20",
  ive: "from-primary/60 via-chart-4/20 to-accent/15",
  newjeans: "from-accent/55 via-chart-2/20 to-chart-4/20",
  lesserafim: "from-chart-5/60 via-primary/25 to-accent/20"
}

export function ArtistCard({
  artist,
  showConcertLink = false,
}: {
  artist: Artist
  showConcertLink?: boolean
}) {
  const tArtists = useTranslations("artists")
  const tCommon = useTranslations("common")
  const concerts = getConcertsByArtist(artist.id)

  return (
    <Card className="glass-panel card-lift border border-border/60">
      <CardHeader className="gap-4">
        <Link href={`/concerts?artist=${artist.id}`} className="space-y-4">
          <div
            className={`flex h-28 w-full items-end rounded-[1.75rem] bg-gradient-to-br ${gradientByArtist[artist.id] ?? "from-accent/50 to-primary/40"} p-5 transition duration-300 group-hover/card:scale-[1.02]`}
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-black/20 font-heading text-xl font-bold text-white shadow-lg shadow-black/10 transition duration-300 group-hover/card:-translate-y-1">
              {getArtistInitials(artist)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
              {artist.isFeatured ? tArtists("featuredLabel") : tCommon(`categories.${artist.category}`)}
            </p>
            <CardTitle className="text-xl">{getArtistDisplayName(artist)}</CardTitle>
            <p className="text-sm leading-7 text-muted-foreground">
              {tArtists("trackedConcerts", { count: concerts.length })}
            </p>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {artist.aliases.map((alias) => (
            <span
              key={alias}
              className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
            >
              {alias}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        {showConcertLink ? (
          <Link href={`/concerts?artist=${artist.id}`} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {tArtists("viewConcerts")}
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">
            {tCommon(`categories.${artist.category}`)}
          </span>
        )}
        <FollowButton artistId={artist.id} />
      </CardFooter>
    </Card>
  )
}
