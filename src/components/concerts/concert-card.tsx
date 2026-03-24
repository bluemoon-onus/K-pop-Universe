"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CountdownTimer } from "@/components/common/countdown-timer"
import { SellerBadge } from "@/components/common/seller-badge"
import { StatusBadge } from "@/components/common/status-badge"
import {
  getConcertArtist,
  getConcertPhases,
  getConcertPrices,
  getNextTicketPhase,
  hasFanclubPresale,
  mockNow,
} from "@/data/mock-concerts"
import { Link } from "@/lib/i18n"
import {
  formatConcertDateRange,
  formatDateTimeLabel,
  formatConcertPriceRangeLabel,
  getArtistDisplayName,
  getArtistInitials,
} from "@/lib/utils"
import {
  artistGradientById,
  artistSquareFocusById,
  hasArtistImage,
} from "@/lib/artist-visuals"
import { cn } from "@/lib/utils"
import type { Concert, TicketPhaseType } from "@/types"

const phaseLabelKeys: Record<TicketPhaseType, string> = {
  fanclub_presale: "labels.fanclubPresale",
  general_sale: "labels.generalSale",
  additional_sale: "labels.additionalSale",
}

export function ConcertCard({
  concert,
  variant = "default",
}: {
  concert: Concert
  variant?: "default" | "spotlight"
}) {
  const locale = useLocale()
  const t = useTranslations("common")
  const tConcerts = useTranslations("concerts")
  const { timeZone } = useUserPreferences()
  const artist = getConcertArtist(concert)
  const phases = getConcertPhases(concert.id)
  const nextPhase = getNextTicketPhase(concert.id, mockNow)
  const fallbackPhase = nextPhase ?? phases[phases.length - 1] ?? null
  const prices = getConcertPrices(concert.id)
  const priceRange = formatConcertPriceRangeLabel(prices, locale)
  const hasArtistPhoto = hasArtistImage(artist)
  const phaseLabel = fallbackPhase ? t(phaseLabelKeys[fallbackPhase.type]) : null
  const artistGradient =
    artistGradientById[artist?.id ?? ""] ?? "from-accent/60 via-primary/30 to-chart-5/24"
  const artistInitials = artist
    ? getArtistInitials(artist)
    : concert.city.slice(0, 2).toUpperCase()
  const imageFocusClass = artistSquareFocusById[artist?.id ?? ""] ?? "object-center"

  if (variant === "spotlight") {
    return (
      <Card className="glass-panel card-lift border border-border/60">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <div className="min-w-0">
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <SellerBadge seller={concert.officialSeller} />
                <StatusBadge status={concert.status} />
                {hasFanclubPresale(concert.id) ? (
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {t("labels.fanclubPresale")}
                  </span>
                ) : null}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "relative flex size-15 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/55 bg-gradient-to-br text-white shadow-lg shadow-primary/15",
                      artistGradient,
                    )}
                  >
                    {hasArtistPhoto && artist ? (
                      <>
                        <Image
                          src={artist.imageUrl}
                          alt={`${artist.nameEn} artist photo`}
                          fill
                          sizes="60px"
                          className={cn("object-cover", imageFocusClass)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-white/10" />
                      </>
                    ) : null}
                    {!hasArtistPhoto ? (
                      <span className="relative font-heading text-sm font-semibold tracking-[0.12em]">
                        {artistInitials}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-accent">
                      {artist ? getArtistDisplayName(artist) : concert.city}
                    </p>
                    {phaseLabel ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {phaseLabel}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight sm:text-[2rem]">
                    {concert.title}
                  </CardTitle>
                  <p className="text-base leading-8 text-muted-foreground">
                    {concert.venueName} · {concert.city}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("labels.ticketOpens")}
                </p>
                {fallbackPhase ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">
                      {t("labels.sourceTime")}:{" "}
                      {formatDateTimeLabel(fallbackPhase.openAt, locale, fallbackPhase.timezone)}
                    </p>
                    <p className="text-muted-foreground">
                      {t("labels.yourTime")}:{" "}
                      {formatDateTimeLabel(fallbackPhase.openAt, locale, timeZone)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-foreground">{t(`status.${concert.status}`)}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("labels.date")}
                </p>
                <p className="text-sm text-foreground">
                  {formatConcertDateRange(concert, locale)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("labels.venue")}
                </p>
                <p className="text-sm text-foreground">{concert.venueName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("labels.priceRange")}
                </p>
                <p className="text-sm text-foreground">
                  {priceRange ?? tConcerts("detail.missingPrices")}
                </p>
              </div>
            </CardContent>
          </div>
          <div className="px-5 pt-0 lg:flex lg:items-center lg:justify-end lg:pl-0 lg:pr-5 lg:pt-5">
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br shadow-[0_24px_60px_-36px_color-mix(in_oklch,var(--foreground)_18%,transparent)] lg:w-[320px]",
                artistGradient,
              )}
            >
              {hasArtistPhoto && artist ? (
                <>
                  <Image
                    src={artist.imageUrl}
                    alt={`${artist.nameEn} artist photo`}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 320px, 100vw"
                    className={cn(
                      "object-cover transition duration-500 group-hover/card:scale-[1.03]",
                      imageFocusClass,
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/18 to-white/5 dark:from-background/90 dark:via-background/28 dark:to-transparent" />
                </>
              ) : null}
              <div className="absolute -left-8 top-6 size-28 rounded-full bg-accent/24 blur-3xl" />
              <div className="absolute -right-10 bottom-4 size-36 rounded-full bg-primary/26 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--card)_75%,transparent),transparent_44%),linear-gradient(145deg,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_52%)]" />
              {!hasArtistPhoto ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-white">
                  <div className="text-center">
                    <p className="font-heading text-5xl font-semibold tracking-[0.08em]">
                      {artistInitials}
                    </p>
                    <p className="mt-4 text-sm text-white/82">
                      {artist ? getArtistDisplayName(artist) : concert.title}
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/18 bg-black/18 px-3 py-1 text-[0.7rem] font-medium tracking-[0.16em] text-white/90 backdrop-blur-md">
                    {concert.city.toUpperCase()}
                  </span>
                  {phaseLabel ? (
                    <span className="rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[0.7rem] font-medium text-white/90 backdrop-blur-md">
                      {phaseLabel}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 font-heading text-2xl font-semibold text-white">
                  {concert.tourName ?? concert.title}
                </p>
                <p className="mt-1 text-sm text-white/80">{concert.venueName}</p>
              </div>
            </div>
          </div>
        </div>
        <CardFooter className="justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StatusBadge status={concert.status} />
            {nextPhase ? <CountdownTimer targetDate={nextPhase.openAt} /> : null}
          </div>
          <Link
            href={`/concerts/${concert.id}`}
            className={buttonVariants({ variant: "default" })}
          >
            {t("buttons.viewDetails")}
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="glass-panel card-lift border border-border/60">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <SellerBadge seller={concert.officialSeller} />
          <StatusBadge status={concert.status} />
          {hasFanclubPresale(concert.id) ? (
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              {t("labels.fanclubPresale")}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 via-accent/45 to-chart-5/40 font-heading text-sm font-semibold text-white shadow-lg shadow-primary/15 transition duration-300 group-hover/card:scale-105">
              {artist
                ? artist.nameEn.slice(0, 2).toUpperCase()
                : concert.city.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-accent">
              {artist ? getArtistDisplayName(artist) : concert.city}
            </p>
          </div>
          <CardTitle className="text-xl">{concert.title}</CardTitle>
          <p className="text-sm leading-7 text-muted-foreground">
            {concert.venueName} · {concert.city}
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t("labels.ticketOpens")}
          </p>
          {fallbackPhase ? (
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                {t("labels.sourceTime")}:{" "}
                {formatDateTimeLabel(fallbackPhase.openAt, locale, fallbackPhase.timezone)}
              </p>
              <p className="text-muted-foreground">
                {t("labels.yourTime")}:{" "}
                {formatDateTimeLabel(fallbackPhase.openAt, locale, timeZone)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-foreground">{t(`status.${concert.status}`)}</p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t("labels.date")}
          </p>
          <p className="text-sm text-foreground">
            {formatConcertDateRange(concert, locale)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t("labels.venue")}
          </p>
          <p className="text-sm text-foreground">
            {concert.venueName}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t("labels.priceRange")}
          </p>
          <p className="text-sm text-foreground">
            {priceRange ?? tConcerts("detail.missingPrices")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StatusBadge status={concert.status} />
          {nextPhase ? <CountdownTimer targetDate={nextPhase.openAt} /> : null}
        </div>
        <Link
          href={`/concerts/${concert.id}`}
          className={buttonVariants({ variant: "default" })}
        >
          {t("buttons.viewDetails")}
        </Link>
      </CardFooter>
    </Card>
  )
}
