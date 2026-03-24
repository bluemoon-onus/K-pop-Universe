"use client"

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
} from "@/lib/utils"
import type { Concert } from "@/types"

export function ConcertCard({ concert }: { concert: Concert }) {
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
              {artist ? artist.nameEn.slice(0, 2).toUpperCase() : concert.city.slice(0, 2).toUpperCase()}
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
