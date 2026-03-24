import type {
  ArtistCategory,
  ConcertEventType,
  ConcertSeller,
  ConcertStatus,
  TicketPhaseType,
} from "@/types"

export const sellerLinks: Record<ConcertSeller, string> = {
  NOL: "https://world.nol.com/en/ticket",
  INTERPARK: "https://tickets.interpark.com/",
  TICKETLINK: "https://www.ticketlink.co.kr/",
  YES24: "https://ticket.yes24.com/",
  WEVERSE: "https://weverse.io/",
  OTHER: "#",
}

export const artistCategories: ArtistCategory[] = [
  "boy_group",
  "girl_group",
  "solo",
  "band",
  "other",
]

export const concertStatuses: ConcertStatus[] = [
  "upcoming",
  "open",
  "sold_out",
  "ended",
  "cancelled",
]

export const eventTypes: ConcertEventType[] = [
  "concert",
  "fan_meeting",
  "festival",
  "musical",
  "other",
]

export const ticketPhaseTypes: TicketPhaseType[] = [
  "fanclub_presale",
  "general_sale",
  "additional_sale",
]

export const HOURS_OPENING_SOON = 24
export const HOURS_THIS_WEEK = 24 * 7

export const TIMEZONE_OPTIONS = [
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Bangkok",
  "Europe/London",
  "America/Los_Angeles",
  "America/New_York",
] as const
