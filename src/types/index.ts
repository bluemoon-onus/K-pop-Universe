export type ArtistCategory =
  | "boy_group"
  | "girl_group"
  | "solo"
  | "band"
  | "other"

export type ConcertEventType =
  | "concert"
  | "fan_meeting"
  | "festival"
  | "musical"
  | "other"

export type ConcertSeller =
  | "NOL"
  | "INTERPARK"
  | "TICKETLINK"
  | "YES24"
  | "WEVERSE"
  | "OTHER"

export type ConcertSourceType =
  | "seller"
  | "agency"
  | "weverse"
  | "social"
  | "manual"

export type ConcertStatus =
  | "upcoming"
  | "open"
  | "sold_out"
  | "ended"
  | "cancelled"

export type TicketPhaseType =
  | "fanclub_presale"
  | "general_sale"
  | "additional_sale"

export type AppLanguage = "ko" | "en"

export interface Artist {
  id: string
  slug: string
  nameKo: string
  nameEn: string
  aliases: string[]
  category: ArtistCategory
  imageUrl: string
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Concert {
  id: string
  artistId: string
  title: string
  tourName: string | null
  eventType: ConcertEventType
  venueName: string
  venueAddress: string | null
  city: string
  countryCode: string
  startDate: Date
  endDate: Date | null
  timezone: string
  agePolicy: string | null
  officialSeller: ConcertSeller
  officialTicketUrl: string
  sourceUrl: string
  sourceType: ConcertSourceType
  status: ConcertStatus
  lastVerifiedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface TicketPhase {
  id: string
  concertId: string
  type: TicketPhaseType
  openAt: Date
  closeAt: Date | null
  timezone: string
  conditions: string | null
  notes: string | null
}

export interface TicketPrice {
  id: string
  concertId: string
  label: string
  currency: string
  amount: number
  notes: string | null
}

export interface ConcertNotice {
  id: string
  concertId: string
  summary: string
  attendeeNameMatchRequired: boolean
  passportRequired: boolean
  onsitePickupOnly: boolean
  antiMacroNotice: boolean
  importantNotes: string[]
}

export interface User {
  id: string
  email: string
  language: AppLanguage
  timezone: string
  createdAt: Date
}

export interface ArtistFollow {
  id: string
  userId: string
  artistId: string
  createdAt: Date
}

export interface AlertPreference {
  id: string
  userId: string
  concertId: string
  remind24h: boolean
  remind1h: boolean
  remind10m: boolean
  emailEnabled: boolean
  pushEnabled: boolean
}
