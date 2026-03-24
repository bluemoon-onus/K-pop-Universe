"use client"

import { AlertTriangleIcon, ExternalLinkIcon, TicketIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AlertSettingPanel } from "@/components/common/alert-setting-panel"
import { CountdownTimer } from "@/components/common/countdown-timer"
import { FollowButton } from "@/components/common/follow-button"
import { SellerBadge } from "@/components/common/seller-badge"
import { StatusBadge } from "@/components/common/status-badge"
import { useToast } from "@/components/layout/toast-provider"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getConcertArtist,
  getConcertNotice,
  getConcertPhases,
  getConcertPrices,
  getNextTicketPhase,
  mockNow,
} from "@/data/mock-concerts"
import {
  formatConcertDateRange,
  formatCurrencyLabel,
  formatDateTimeLabel,
  formatLastVerified,
  getArtistDisplayName,
} from "@/lib/utils"
import type { Concert } from "@/types"

export function ConcertDetail({ concert }: { concert: Concert }) {
  const locale = useLocale()
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")
  const tToast = useTranslations("common.toast")
  const { timeZone } = useUserPreferences()
  const { pushToast } = useToast()
  const artist = getConcertArtist(concert)
  const phases = getConcertPhases(concert.id)
  const notice = getConcertNotice(concert.id)
  const prices = getConcertPrices(concert.id)
  const nextPhase = getNextTicketPhase(concert.id, mockNow)
  const fallbackPhase = nextPhase ?? phases[phases.length - 1] ?? null
  const [shareState, setShareState] = useState<"idle" | "copied">("idle")
  const officialLinkAvailable =
    concert.officialTicketUrl !== "#" &&
    (concert.officialTicketUrl.startsWith("https://") ||
      concert.officialTicketUrl.startsWith("http://"))
  const officialCtaDisabled =
    concert.status === "cancelled" ||
    concert.status === "sold_out" ||
    !officialLinkAvailable

  async function handleShare() {
    const shareUrl = typeof window === "undefined" ? "" : window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: concert.title,
          text: concert.title,
          url: shareUrl,
        })
        pushToast({
          tone: "info",
          title: tToast("linkShared"),
        })
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareState("copied")
      pushToast({
        tone: "success",
        title: tToast("linkCopied"),
      })
      window.setTimeout(() => setShareState("idle"), 2000)
    } catch {
      setShareState("idle")
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="glass-panel surface-grid rounded-[2rem] border border-border/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <SellerBadge seller={concert.officialSeller} />
            <StatusBadge status={concert.status} />
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              {tCommon(`eventTypes.${concert.eventType}`)}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-accent">
              {artist ? getArtistDisplayName(artist) : concert.city}
            </p>
            <h1 className="max-w-4xl font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {concert.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              {notice?.summary}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoBlock
              label={tConcerts("detail.overview")}
              value={formatConcertDateRange(concert, locale)}
            />
            <InfoBlock label={tCommon("labels.venue")} value={concert.venueName} />
            <InfoBlock label={tCommon("labels.city")} value={`${concert.city}, ${concert.countryCode}`} />
            <InfoBlock
              label={tCommon("labels.ticketOpens")}
              value={
                fallbackPhase
                  ? formatDateTimeLabel(fallbackPhase.openAt, locale, fallbackPhase.timezone)
                  : tCommon(`status.${concert.status}`)
              }
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {officialCtaDisabled ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className={`${buttonVariants({ variant: "default" })} cursor-not-allowed opacity-60`}
              >
                {tCommon("buttons.goToOfficialSite")}
              </button>
            ) : (
              <a
                href={concert.officialTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "default" })}
              >
                {tCommon("buttons.goToOfficialSite")}
              </a>
            )}
            <button
              type="button"
              className={buttonVariants({ variant: "outline" })}
              onClick={() =>
                document.getElementById(`alert-panel-${concert.id}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              {tCommon("buttons.setAlert")}
            </button>
            <button
              type="button"
              className={buttonVariants({ variant: "outline" })}
              onClick={() => void handleShare()}
            >
              {shareState === "copied" ? tCommon("buttons.copied") : tCommon("buttons.share")}
            </button>
          </div>
        </section>

        {concert.status === "cancelled" || concert.status === "sold_out" || !prices.length ? (
          <Card className="glass-panel border border-border/60">
            <CardHeader className="flex-row items-start gap-3">
              <AlertTriangleIcon className="mt-0.5 size-5 text-primary" />
              <div className="space-y-2">
                <CardTitle className="text-lg">
                  {concert.status === "cancelled"
                    ? tCommon("status.cancelled")
                    : concert.status === "sold_out"
                      ? tCommon("status.sold_out")
                      : tConcerts("detail.missingPrices")}
                </CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">
                  {concert.status === "cancelled"
                    ? notice?.summary
                    : concert.status === "sold_out"
                      ? notice?.summary
                      : tConcerts("detail.missingPrices")}
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <DetailSection title={tConcerts("detail.ticketOpening")}>
          <div className="grid gap-4">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="rounded-3xl border border-border/70 bg-background/35 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {phase.type === "fanclub_presale"
                        ? tCommon("labels.fanclubPresale")
                        : phase.type === "general_sale"
                          ? tCommon("labels.generalSale")
                          : tCommon("labels.additionalSale")}
                    </p>
                    <div className="mt-1 space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        {tCommon("labels.sourceTime")}:{" "}
                        {formatDateTimeLabel(phase.openAt, locale, phase.timezone)}
                      </p>
                      <p className="text-muted-foreground">
                        {tCommon("labels.yourTime")}:{" "}
                        {formatDateTimeLabel(phase.openAt, locale, timeZone)}
                      </p>
                    </div>
                  </div>
                  {phase.openAt > mockNow ? (
                    <CountdownTimer targetDate={phase.openAt} />
                  ) : null}
                </div>
                {phase.notes ? (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{phase.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        </DetailSection>

        {phases.some((phase) => phase.type === "fanclub_presale") ? (
          <DetailSection title={tConcerts("detail.membership")}>
            <div className="space-y-4">
              {phases
                .filter((phase) => phase.type === "fanclub_presale")
                .map((phase) => (
                  <div key={phase.id} className="rounded-3xl border border-border/70 bg-background/35 p-4">
                    <p className="text-sm font-medium text-foreground">{phase.conditions}</p>
                    {phase.notes ? (
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{phase.notes}</p>
                    ) : null}
                  </div>
                ))}
            </div>
          </DetailSection>
        ) : null}

        <DetailSection title={tConcerts("detail.prices")}>
          {prices.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {prices.map((price) => (
                <div
                  key={price.id}
                  className="rounded-3xl border border-border/70 bg-background/35 p-4"
                >
                  <p className="text-sm font-medium text-foreground">{price.label}</p>
                  <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                    {formatCurrencyLabel(price.amount, price.currency, locale)}
                  </p>
                  {price.notes ? (
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{price.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              {tConcerts("detail.missingPrices")}
            </p>
          )}
        </DetailSection>

        <DetailSection title={tConcerts("detail.venueInfo")}>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label={tCommon("labels.venue")} value={concert.venueName} />
            <InfoCard label={tCommon("labels.city")} value={`${concert.city}, ${concert.countryCode}`} />
            <InfoCard
              label={tCommon("labels.timezone")}
              value={concert.timezone}
            />
            <InfoCard
              label={tCommon("labels.agePolicy")}
              value={concert.agePolicy ?? tConcerts("detail.tba")}
            />
          </div>
          {concert.venueAddress ? (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{concert.venueAddress}</p>
          ) : null}
        </DetailSection>

        <DetailSection title={tConcerts("detail.importantNotes")}>
          <div className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/35 p-4">
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                <li>
                  {notice?.attendeeNameMatchRequired
                    ? tConcerts("detail.attendeeNameRequired")
                    : tConcerts("detail.attendeeNameNotListed")}
                </li>
                <li>
                  {notice?.passportRequired
                    ? tConcerts("detail.passportRequired")
                    : tConcerts("detail.passportNotListed")}
                </li>
                <li>
                  {notice?.onsitePickupOnly
                    ? tConcerts("detail.onsitePickupOnly")
                    : tConcerts("detail.onsitePickupNotListed")}
                </li>
                <li>
                  {notice?.antiMacroNotice
                    ? tConcerts("detail.antiMacroRule")
                    : tConcerts("detail.antiMacroNotListed")}
                </li>
              </ul>
            </div>
            {notice?.importantNotes.length ? (
              <ul className="grid gap-3">
                {notice.importantNotes.map((item) => (
                  <li key={item} className="rounded-3xl border border-border/70 bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </DetailSection>

        <DetailSection title={tConcerts("detail.officialSource")}>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={concert.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLinkIcon className="size-4" />
              {tCommon("labels.source")}
            </a>
            <p className="text-sm text-muted-foreground">
              {tCommon("labels.lastUpdated")}:{" "}
              {formatLastVerified(concert.lastVerifiedAt, locale, concert.timezone)}
            </p>
          </div>
        </DetailSection>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <Card className="glass-panel border border-border/60">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-accent">
              <TicketIcon className="size-4" />
              <CardTitle>{tCommon("labels.officialOnly")}</CardTitle>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {tCommon("footer.disclaimerBody")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextPhase ? <CountdownTimer targetDate={nextPhase.openAt} /> : null}
            {officialCtaDisabled ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className={`${buttonVariants({ variant: "default" })} w-full cursor-not-allowed justify-center opacity-60`}
              >
                {tCommon("buttons.goToOfficialSite")}
              </button>
            ) : (
              <a
                href={concert.officialTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({ variant: "default" })} w-full justify-center`}
              >
                {tCommon("buttons.goToOfficialSite")}
              </a>
            )}
            <button
              type="button"
              className={`${buttonVariants({ variant: "outline" })} w-full justify-center`}
              onClick={() => void handleShare()}
            >
              <span>{shareState === "copied" ? tCommon("buttons.copied") : tCommon("buttons.share")}</span>
            </button>
            {officialLinkAvailable ? null : (
              <p className="text-sm text-muted-foreground">
                {tConcerts("detail.externalUnavailable")}
              </p>
            )}
            {(concert.status === "sold_out" || concert.status === "cancelled") && officialLinkAvailable ? (
              <p className="text-sm text-muted-foreground">
                {concert.status === "sold_out"
                  ? tConcerts("detail.soldOutNotice")
                  : tConcerts("detail.cancelledNotice")}
              </p>
            ) : null}
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{artist?.nameEn}</p>
              <FollowButton artistId={concert.artistId} />
            </div>
          </CardContent>
        </Card>
        <div id={`alert-panel-${concert.id}`}>
          <AlertSettingPanel concertId={concert.id} concertName={concert.title} />
        </div>
      </aside>
    </div>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/35 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-7 text-foreground">{value}</p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/35 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-7 text-foreground">{value}</p>
    </div>
  )
}
