import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Artist, Concert, TicketPhase } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getArtistDisplayName(artist: Artist) {
  return artist.nameKo === artist.nameEn
    ? artist.nameKo
    : `${artist.nameKo} / ${artist.nameEn}`
}

export function getArtistInitials(artist: Artist) {
  const source = artist.nameEn || artist.nameKo
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatConcertDateRange(
  concert: Pick<Concert, "startDate" | "endDate" | "timezone">,
  locale: string,
) {
  const start = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: concert.timezone,
  }).format(concert.startDate)

  if (!concert.endDate) {
    return start
  }

  const end = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: concert.timezone,
  }).format(concert.endDate)

  return `${start} - ${end}`
}

export function formatDateTimeLabel(
  date: Date,
  locale: string,
  timeZone: string,
  includeZone = true,
) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: includeZone ? "short" : undefined,
  }).format(date)
}

export function formatCurrencyLabel(
  amount: number,
  currency: string,
  locale: string,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatLastVerified(
  date: Date,
  locale: string,
  timeZone: string,
) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(date)
}

export function formatConcertPriceRangeLabel(
  prices: Array<{ amount: number; currency: string }>,
  locale: string,
) {
  if (!prices.length) {
    return null
  }

  const sorted = [...prices].sort((left, right) => left.amount - right.amount)
  const lowest = sorted[0]
  const highest = sorted[sorted.length - 1]

  if (lowest.amount === highest.amount) {
    return formatCurrencyLabel(lowest.amount, lowest.currency, locale)
  }

  return `${formatCurrencyLabel(lowest.amount, lowest.currency, locale)} - ${formatCurrencyLabel(highest.amount, highest.currency, locale)}`
}

export function getNextPhaseLabel(phases: TicketPhase[]) {
  return [...phases].sort(
    (left, right) => left.openAt.getTime() - right.openAt.getTime(),
  )[0] ?? null
}
