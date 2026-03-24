import {
  addDays,
  compareAsc,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  differenceInHours,
} from "date-fns"
import { getConcertArtist, getNextTicketPhase, mockNow } from "@/data/mock-concerts"
import { HOURS_OPENING_SOON, HOURS_THIS_WEEK } from "@/lib/constants"
import type { Concert, ConcertEventType, ConcertSeller, ConcertStatus } from "@/types"

export type ConcertSort = "opening" | "date" | "updated"
export type ConcertView = "list" | "calendar"
export type ConcertDateRange = "all" | "30d" | "60d"

export type ConcertFilters = {
  query: string
  artistIds: string[]
  city: string
  countryCode: string
  seller: ConcertSeller | "all"
  status: ConcertStatus | "all"
  eventType: ConcertEventType | "all"
  dateRange: ConcertDateRange
}

export const defaultConcertFilters: ConcertFilters = {
  query: "",
  artistIds: [],
  city: "all",
  countryCode: "all",
  seller: "all",
  status: "all",
  eventType: "all",
  dateRange: "all",
}

export function getActiveConcertFilterCount(filters: ConcertFilters) {
  return [
    filters.query.trim().length > 0,
    filters.artistIds.length > 0,
    filters.city !== "all",
    filters.countryCode !== "all",
    filters.seller !== "all",
    filters.status !== "all",
    filters.eventType !== "all",
    filters.dateRange !== "all",
  ].filter(Boolean).length
}

function normalizeValue(value: string) {
  return value.toLowerCase().trim()
}

export function artistMatchesQuery(
  artist: {
    nameKo: string
    nameEn: string
    aliases: string[]
  },
  query: string,
) {
  const normalizedQuery = normalizeValue(query)

  if (!normalizedQuery) {
    return true
  }

  return [
    artist.nameKo,
    artist.nameEn,
    ...artist.aliases,
  ].some((value) => normalizeValue(value).includes(normalizedQuery))
}

export function concertMatchesQuery(concert: Concert, query: string) {
  const normalizedQuery = normalizeValue(query)

  if (!normalizedQuery) {
    return true
  }

  const artist = getConcertArtist(concert)

  return [
    concert.title,
    concert.tourName ?? "",
    concert.city,
    concert.countryCode,
    concert.venueName,
    concert.venueAddress ?? "",
    artist?.nameKo ?? "",
    artist?.nameEn ?? "",
    ...(artist?.aliases ?? []),
  ].some((value) => normalizeValue(value).includes(normalizedQuery))
}

export function filterConcerts(
  concerts: Concert[],
  filters: ConcertFilters,
  referenceDate = mockNow,
) {
  return concerts.filter((concert) => {
    if (!concertMatchesQuery(concert, filters.query)) {
      return false
    }

    if (filters.artistIds.length && !filters.artistIds.includes(concert.artistId)) {
      return false
    }

    if (filters.city !== "all" && concert.city !== filters.city) {
      return false
    }

    if (filters.countryCode !== "all" && concert.countryCode !== filters.countryCode) {
      return false
    }

    if (filters.seller !== "all" && concert.officialSeller !== filters.seller) {
      return false
    }

    if (filters.status !== "all" && concert.status !== filters.status) {
      return false
    }

    if (filters.eventType !== "all" && concert.eventType !== filters.eventType) {
      return false
    }

    if (
      filters.dateRange === "30d" &&
      differenceInHours(concert.startDate, addDays(referenceDate, 30)) > 0
    ) {
      return false
    }

    if (
      filters.dateRange === "60d" &&
      differenceInHours(concert.startDate, addDays(referenceDate, 60)) > 0
    ) {
      return false
    }

    return true
  })
}

export function sortConcerts(
  concerts: Concert[],
  sortBy: ConcertSort,
  referenceDate = mockNow,
) {
  return [...concerts].sort((left, right) => {
    if (sortBy === "updated") {
      return right.updatedAt.getTime() - left.updatedAt.getTime()
    }

    if (sortBy === "date") {
      return compareAsc(left.startDate, right.startDate)
    }

    const leftPhase = getNextTicketPhase(left.id, referenceDate)
    const rightPhase = getNextTicketPhase(right.id, referenceDate)

    return compareAsc(
      leftPhase?.openAt ?? left.startDate,
      rightPhase?.openAt ?? right.startDate,
    )
  })
}

export function groupConcertsByTiming(
  concerts: Concert[],
  referenceDate = mockNow,
) {
  const openingSoon: Concert[] = []
  const thisWeek: Concert[] = []
  const later: Concert[] = []

  concerts.forEach((concert) => {
    const nextPhase = getNextTicketPhase(concert.id, referenceDate)
    const phaseInHours = nextPhase
      ? differenceInHours(nextPhase.openAt, referenceDate)
      : null
    const concertInHours = differenceInHours(concert.startDate, referenceDate)

    if (phaseInHours !== null && phaseInHours >= 0 && phaseInHours <= HOURS_OPENING_SOON) {
      openingSoon.push(concert)
      return
    }

    if (concertInHours >= 0 && concertInHours <= HOURS_THIS_WEEK) {
      thisWeek.push(concert)
      return
    }

    later.push(concert)
  })

  return {
    openingSoon,
    thisWeek,
    later,
  }
}

export function getCalendarDays(monthDate: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 }),
  })
}

export function getConcertsForCalendarDate(concerts: Concert[], date: Date) {
  return concerts.filter((concert) => isSameDay(concert.startDate, date))
}
