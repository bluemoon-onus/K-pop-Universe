"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowButton } from "@/components/common/follow-button"
import { getConcertsByArtist } from "@/data/mock-concerts"
import {
  artistGradientById,
  artistLandscapeFocusById,
  hasArtistImage,
} from "@/lib/artist-visuals"
import { cn, getArtistDisplayName, getArtistInitials } from "@/lib/utils"
import type { Artist } from "@/types"

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
  const hasPhoto = hasArtistImage(artist)
  const gradient = artistGradientById[artist.id] ?? "from-accent/50 to-primary/40"
  const imageFocusClass = artistLandscapeFocusById[artist.id] ?? "object-center"

  return (
    <Card className="glass-panel card-lift border border-border/60">
      <CardHeader className="gap-4">
        <Link href={`/concerts?artist=${artist.id}`} className="space-y-4">
          <div
            className={cn(
              "relative h-36 w-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br p-5 transition duration-300 group-hover/card:scale-[1.02]",
              gradient,
            )}
          >
            {hasPhoto ? (
              <>
                <Image
                  src={artist.imageUrl}
                  alt={`${artist.nameEn} group photo`}
                  fill
                  sizes="(min-width: 1280px) 240px, (min-width: 768px) 33vw, 100vw"
                  className={cn(
                    "object-cover transition duration-500 group-hover/card:scale-[1.04]",
                    imageFocusClass,
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/28 to-white/5 dark:from-background/90 dark:via-background/38 dark:to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--card)_65%,transparent),transparent_42%),linear-gradient(145deg,color-mix(in_oklch,var(--foreground)_10%,transparent),transparent_56%)]" />
              </>
            ) : null}
            <div className="relative flex w-full items-end justify-between gap-4">
              <span className="rounded-full border border-white/16 bg-black/18 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/88 backdrop-blur-md">
                {artist.isFeatured ? tArtists("featuredLabel") : tCommon(`categories.${artist.category}`)}
              </span>
              {!hasPhoto ? (
                <div className="flex size-14 items-center justify-center rounded-2xl bg-black/20 font-heading text-xl font-bold text-white shadow-lg shadow-black/10 transition duration-300 group-hover/card:-translate-y-1">
                  {getArtistInitials(artist)}
                </div>
              ) : null}
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
