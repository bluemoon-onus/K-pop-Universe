import {
  addDays,
  addHours,
  compareAsc,
  differenceInHours,
  isSameMonth,
  subDays,
  subHours,
} from "date-fns"
import { fromZonedTime } from "date-fns-tz"
import { sellerLinks } from "@/lib/constants"
import { mockArtists } from "./mock-artists"
import type {
  AlertPreference,
  ArtistFollow,
  ConcertEventType,
  ConcertSeller,
  ConcertSourceType,
  ConcertStatus,
  Concert,
  ConcertNotice,
  TicketPhase,
  TicketPrice,
  User,
} from "@/types"

export const mockNow = new Date()

type ConcertSeed = {
  id: string
  artistId: string
  title: string
  tourName: string | null
  eventType: ConcertEventType
  venueName: string
  venueAddress: string
  city: string
  countryCode: string
  timezone: string
  startOffsetDays: number
  startHour: number
  startMinute: number
  durationHours?: number
  agePolicy: string | null
  officialSeller: ConcertSeller
  sourceType: ConcertSourceType
  status: ConcertStatus
  pricing: {
    currency: string
    base: number
  }
  ticketing: {
    fanclubHoursFromNow: number | null
    generalHoursFromNow: number
    additionalHoursFromNow?: number
    fanclubCondition?: string | null
    fanclubNote?: string | null
    generalNote?: string | null
    additionalNote?: string | null
  }
  notice: {
    attendeeNameMatchRequired: boolean
    passportRequired: boolean
    onsitePickupOnly: boolean
    antiMacroNotice: boolean
    extraNotes: string[]
  }
}

function createZonedDate(
  dayOffset: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const shifted = addDays(mockNow, dayOffset)
  const localClock = new Date(
    shifted.getFullYear(),
    shifted.getMonth(),
    shifted.getDate(),
    hour,
    minute,
    0,
    0,
  )

  return fromZonedTime(localClock, timeZone)
}

function createAmount(base: number, multiplier: number) {
  return Math.round(base * multiplier)
}

function buildNoticeSummary(seed: ConcertSeed) {
  const artist = getArtistById(seed.artistId)
  const artistName = artist?.nameEn ?? seed.artistId

  if (seed.status === "ended") {
    return `${artistName} recently wrapped its ${seed.city} stop. This entry stays in mock data to preview ended-state handling.`
  }

  if (seed.status === "sold_out") {
    return `${artistName} in ${seed.city} is currently sold out, but official inventory updates may still appear later.`
  }

  if (seed.notice.passportRequired) {
    return `Fans traveling to ${seed.city} should prepare passport-ready pickup documents before checkout.`
  }

  if (seed.notice.onsitePickupOnly) {
    return `On-site pickup rules are highlighted for ${artistName} in ${seed.city}.`
  }

  return `Presale and general sale guidance is organized for ${artistName} in ${seed.city}.`
}

function buildImportantNotes(seed: ConcertSeed) {
  const autoNotes: string[] = []

  if (seed.notice.attendeeNameMatchRequired) {
    autoNotes.push("The attendee name should match the ID used for ticket pickup or venue entry.")
  }

  if (seed.notice.passportRequired) {
    autoNotes.push("Passport or government ID may be required for overseas ticket pickup.")
  }

  if (seed.notice.onsitePickupOnly) {
    autoNotes.push("Tickets are listed as on-site pickup only.")
  }

  if (seed.notice.antiMacroNotice) {
    autoNotes.push("The seller warns that abnormal or macro purchases may be cancelled.")
  }

  return [...seed.notice.extraNotes, ...autoNotes]
}

const concertSeeds: ConcertSeed[] = [
  {
    id: "bts-permission-to-dance-seoul",
    artistId: "bts",
    title: "BTS Permission To Dance Encore in SEOUL",
    tourName: "Permission To Dance Encore",
    eventType: "concert",
    venueName: "Seoul Olympic Stadium",
    venueAddress: "25 Olympic-ro, Songpa-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 12,
    startHour: 19,
    startMinute: 0,
    durationHours: 26,
    agePolicy: "Ages 9 and up",
    officialSeller: "NOL",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "KRW", base: 165000 },
    ticketing: {
      fanclubHoursFromNow: 10,
      generalHoursFromNow: 34,
      fanclubCondition: "ARMY Membership verification is required before presale opens.",
      fanclubNote: "Two tickets maximum per verified account.",
      generalNote: "General sale follows after membership inventory is finalized.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Presale queue access starts 10 minutes before the published opening."],
    },
  },
  {
    id: "bts-permission-to-dance-los-angeles",
    artistId: "bts",
    title: "BTS Permission To Dance Encore in LOS ANGELES",
    tourName: "Permission To Dance Encore",
    eventType: "concert",
    venueName: "SoFi Stadium",
    venueAddress: "1001 Stadium Dr, Inglewood, CA",
    city: "Los Angeles",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    startOffsetDays: 46,
    startHour: 19,
    startMinute: 30,
    agePolicy: "All ages",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "upcoming",
    pricing: { currency: "USD", base: 189 },
    ticketing: {
      fanclubHoursFromNow: 240,
      generalHoursFromNow: 300,
      fanclubCondition: "US ARMY Membership holders receive first-access codes via Weverse.",
      generalNote: "Make sure your local seller account is verified before general sale.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Traveling fans should confirm local tax and pickup rules before purchase."],
    },
  },
  {
    id: "seventeen-right-here-seoul",
    artistId: "seventeen",
    title: "SEVENTEEN RIGHT HERE in SEOUL",
    tourName: "RIGHT HERE",
    eventType: "concert",
    venueName: "KSPO DOME",
    venueAddress: "424 Olympic-ro, Songpa-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 7,
    startHour: 18,
    startMinute: 0,
    durationHours: 24,
    agePolicy: "Ages 9 and up",
    officialSeller: "YES24",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "KRW", base: 154000 },
    ticketing: {
      fanclubHoursFromNow: 8,
      generalHoursFromNow: 22,
      fanclubCondition: "CARAT MEMBERSHIP verification via Weverse is required.",
      fanclubNote: "Two tickets maximum during presale.",
      generalNote: "General sale opens after presale inventory is settled.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Digital queue entry opens 15 minutes before the ticket window."],
    },
  },
  {
    id: "seventeen-right-here-london",
    artistId: "seventeen",
    title: "SEVENTEEN RIGHT HERE in LONDON",
    tourName: "RIGHT HERE",
    eventType: "concert",
    venueName: "The O2",
    venueAddress: "Peninsula Square, London",
    city: "London",
    countryCode: "GB",
    timezone: "Europe/London",
    startOffsetDays: 37,
    startHour: 20,
    startMinute: 0,
    agePolicy: "Ages 8 and up",
    officialSeller: "INTERPARK",
    sourceType: "seller",
    status: "sold_out",
    pricing: { currency: "GBP", base: 129 },
    ticketing: {
      fanclubHoursFromNow: -60,
      generalHoursFromNow: -36,
      fanclubCondition: "CARAT Membership and local promoter registration were required.",
      generalNote: "The official seller currently lists all seats as sold out.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: true,
      antiMacroNotice: true,
      extraNotes: ["Check the official page for any released production-hold seats."],
    },
  },
  {
    id: "aespa-parallel-line-tokyo",
    artistId: "aespa",
    title: "aespa SYNK : PARALLEL LINE in TOKYO",
    tourName: "SYNK : PARALLEL LINE",
    eventType: "concert",
    venueName: "Tokyo Dome",
    venueAddress: "1-3-61 Koraku, Bunkyo-ku, Tokyo",
    city: "Tokyo",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    startOffsetDays: 18,
    startHour: 18,
    startMinute: 30,
    agePolicy: "Preschool children not admitted",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "upcoming",
    pricing: { currency: "JPY", base: 16500 },
    ticketing: {
      fanclubHoursFromNow: 70,
      generalHoursFromNow: 118,
      fanclubCondition: "MY-J membership holders receive early access.",
      generalNote: "General sale starts after the fanclub round closes.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: true,
      antiMacroNotice: true,
      extraNotes: ["Physical pickup is only available on the event day."],
    },
  },
  {
    id: "aespa-parallel-line-bangkok",
    artistId: "aespa",
    title: "aespa SYNK : PARALLEL LINE in BANGKOK",
    tourName: "SYNK : PARALLEL LINE",
    eventType: "concert",
    venueName: "Impact Arena",
    venueAddress: "47/569-576 Popular 3 Rd, Pak Kret",
    city: "Bangkok",
    countryCode: "TH",
    timezone: "Asia/Bangkok",
    startOffsetDays: 29,
    startHour: 19,
    startMinute: 0,
    agePolicy: "Children under 4 not admitted",
    officialSeller: "INTERPARK",
    sourceType: "seller",
    status: "sold_out",
    pricing: { currency: "THB", base: 5900 },
    ticketing: {
      fanclubHoursFromNow: -72,
      generalHoursFromNow: -48,
      fanclubCondition: "MY membership verification was required for the first round.",
      generalNote: "Official inventory currently shows sold-out status.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Monitor the seller page for reclaimed tickets or added sections."],
    },
  },
  {
    id: "blackpink-born-pink-seoul",
    artistId: "blackpink",
    title: "BLACKPINK BORN PINK Encore in SEOUL",
    tourName: "BORN PINK Encore",
    eventType: "concert",
    venueName: "Gocheok Sky Dome",
    venueAddress: "430 Gyeongin-ro, Guro-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 15,
    startHour: 19,
    startMinute: 0,
    agePolicy: "Ages 12 and up",
    officialSeller: "NOL",
    sourceType: "seller",
    status: "open",
    pricing: { currency: "KRW", base: 176000 },
    ticketing: {
      fanclubHoursFromNow: -64,
      generalHoursFromNow: -32,
      additionalHoursFromNow: 72,
      fanclubCondition: "BLINK MEMBERSHIP registration was required for presale.",
      generalNote: "General sale is already open on the official seller.",
      additionalNote: "A small additional sale is scheduled from production hold inventory.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Queue volume may spike again when additional seats release."],
    },
  },
  {
    id: "blackpink-born-pink-paris",
    artistId: "blackpink",
    title: "BLACKPINK BORN PINK Encore in PARIS",
    tourName: "BORN PINK Encore",
    eventType: "concert",
    venueName: "Accor Arena",
    venueAddress: "8 Boulevard de Bercy, Paris",
    city: "Paris",
    countryCode: "FR",
    timezone: "Europe/Paris",
    startOffsetDays: 58,
    startHour: 20,
    startMinute: 0,
    agePolicy: "All ages",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "upcoming",
    pricing: { currency: "EUR", base: 149 },
    ticketing: {
      fanclubHoursFromNow: 480,
      generalHoursFromNow: 540,
      fanclubCondition: "BLINK MEMBERSHIP code delivery happens via Weverse notice.",
      generalNote: "General sale opens after local promoter prechecks finish.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["International cards may require 3D Secure verification."],
    },
  },
  {
    id: "twice-ready-to-be-tokyo",
    artistId: "twice",
    title: "TWICE READY TO BE in TOKYO",
    tourName: "READY TO BE",
    eventType: "concert",
    venueName: "Tokyo Dome",
    venueAddress: "1-3-61 Koraku, Bunkyo-ku, Tokyo",
    city: "Tokyo",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    startOffsetDays: 21,
    startHour: 18,
    startMinute: 0,
    agePolicy: "Preschool children not admitted",
    officialSeller: "YES24",
    sourceType: "seller",
    status: "open",
    pricing: { currency: "JPY", base: 15800 },
    ticketing: {
      fanclubHoursFromNow: -40,
      generalHoursFromNow: -12,
      additionalHoursFromNow: 96,
      fanclubCondition: "ONCE JAPAN members entered through a local fanclub round.",
      generalNote: "General sale is live now.",
      additionalNote: "Side-view seats are planned for release later this week.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: true,
      antiMacroNotice: true,
      extraNotes: ["The seller recommends completing identity verification before payment."],
    },
  },
  {
    id: "twice-ready-to-be-manila",
    artistId: "twice",
    title: "TWICE READY TO BE in MANILA",
    tourName: "READY TO BE",
    eventType: "concert",
    venueName: "Philippine Arena",
    venueAddress: "Ciudad de Victoria, Bulacan",
    city: "Manila",
    countryCode: "PH",
    timezone: "Asia/Manila",
    startOffsetDays: 43,
    startHour: 19,
    startMinute: 0,
    agePolicy: "Ages 7 and up",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "upcoming",
    pricing: { currency: "PHP", base: 8900 },
    ticketing: {
      fanclubHoursFromNow: 300,
      generalHoursFromNow: 336,
      fanclubCondition: "ONCE Membership verification is required.",
      generalNote: "General sale opens after fanclub allotment confirmation.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Check local promoter notices for delivery cutoffs and entry rules."],
    },
  },
  {
    id: "stray-kids-dominate-seoul",
    artistId: "straykids",
    title: "Stray Kids DOMINATE in SEOUL",
    tourName: "DOMINATE",
    eventType: "concert",
    venueName: "KSPO DOME",
    venueAddress: "424 Olympic-ro, Songpa-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 6,
    startHour: 18,
    startMinute: 0,
    agePolicy: "Ages 9 and up",
    officialSeller: "TICKETLINK",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "KRW", base: 154000 },
    ticketing: {
      fanclubHoursFromNow: 6,
      generalHoursFromNow: 20,
      fanclubCondition: "STAY fanclub verification is required in advance.",
      generalNote: "General sale starts less than a day after presale.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Prepare your seller account and payment method before the queue opens."],
    },
  },
  {
    id: "stray-kids-dominate-los-angeles",
    artistId: "straykids",
    title: "Stray Kids DOMINATE in LOS ANGELES",
    tourName: "DOMINATE",
    eventType: "concert",
    venueName: "BMO Stadium",
    venueAddress: "3939 S Figueroa St, Los Angeles, CA",
    city: "Los Angeles",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    startOffsetDays: 33,
    startHour: 20,
    startMinute: 0,
    agePolicy: "All ages",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "open",
    pricing: { currency: "USD", base: 179 },
    ticketing: {
      fanclubHoursFromNow: -120,
      generalHoursFromNow: -24,
      additionalHoursFromNow: 168,
      fanclubCondition: "STAY fanclub codes were issued through Weverse.",
      generalNote: "General sale is live now.",
      additionalNote: "Additional inventory may open after stage production is finalized.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Travelers should confirm venue bag and ID policies before departure."],
    },
  },
  {
    id: "gidle-i-sway-seoul",
    artistId: "gidle",
    title: "(G)I-DLE I SWAY in SEOUL",
    tourName: "I SWAY",
    eventType: "concert",
    venueName: "Jamsil Indoor Stadium",
    venueAddress: "25 Olympic-ro, Songpa-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 17,
    startHour: 19,
    startMinute: 0,
    agePolicy: "Ages 8 and up",
    officialSeller: "TICKETLINK",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "KRW", base: 143000 },
    ticketing: {
      fanclubHoursFromNow: 96,
      generalHoursFromNow: 130,
      fanclubCondition: "Neverland fanclub round requires a linked seller account.",
      generalNote: "General sale opens two days after presale closes.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Seats near the extended stage may release after production checks."],
    },
  },
  {
    id: "gidle-i-sway-bangkok",
    artistId: "gidle",
    title: "(G)I-DLE I SWAY in BANGKOK",
    tourName: "I SWAY",
    eventType: "concert",
    venueName: "Thunder Dome",
    venueAddress: "47/569-576 Popular 3 Rd, Pak Kret",
    city: "Bangkok",
    countryCode: "TH",
    timezone: "Asia/Bangkok",
    startOffsetDays: -5,
    startHour: 19,
    startMinute: 0,
    agePolicy: "All ages",
    officialSeller: "INTERPARK",
    sourceType: "seller",
    status: "ended",
    pricing: { currency: "THB", base: 5200 },
    ticketing: {
      fanclubHoursFromNow: -240,
      generalHoursFromNow: -216,
      fanclubCondition: "Neverland verification was required for first access.",
      generalNote: "General sale closed before the event date.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["This finished event remains in the mock set for ended-state coverage."],
    },
  },
  {
    id: "ive-show-what-i-have-tokyo",
    artistId: "ive",
    title: "IVE SHOW WHAT I HAVE in TOKYO",
    tourName: "SHOW WHAT I HAVE",
    eventType: "concert",
    venueName: "Ariake Arena",
    venueAddress: "1 Chome-11-1 Ariake, Koto City, Tokyo",
    city: "Tokyo",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    startOffsetDays: 25,
    startHour: 18,
    startMinute: 30,
    agePolicy: "Ages 7 and up",
    officialSeller: "NOL",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "JPY", base: 16800 },
    ticketing: {
      fanclubHoursFromNow: 168,
      generalHoursFromNow: 200,
      fanclubCondition: "DIVE JAPAN members receive the first presale window.",
      generalNote: "General sale follows a local lottery result announcement.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: true,
      antiMacroNotice: true,
      extraNotes: ["Lottery results and payment deadlines are published separately by the seller."],
    },
  },
  {
    id: "ive-show-what-i-have-london",
    artistId: "ive",
    title: "IVE SHOW WHAT I HAVE in LONDON",
    tourName: "SHOW WHAT I HAVE",
    eventType: "concert",
    venueName: "OVO Arena Wembley",
    venueAddress: "Arena Square, Engineers Way, London",
    city: "London",
    countryCode: "GB",
    timezone: "Europe/London",
    startOffsetDays: 60,
    startHour: 20,
    startMinute: 0,
    agePolicy: "All ages",
    officialSeller: "TICKETLINK",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "GBP", base: 135 },
    ticketing: {
      fanclubHoursFromNow: 650,
      generalHoursFromNow: 700,
      fanclubCondition: "DIVE pre-registration is required before the London presale.",
      generalNote: "General sale opens through the official global partner link.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["International checkout may require matching billing-country verification."],
    },
  },
  {
    id: "newjeans-supernatural-seoul",
    artistId: "newjeans",
    title: "NewJeans Supernatural Weekend in SEOUL",
    tourName: "Supernatural Weekend",
    eventType: "fan_meeting",
    venueName: "Jangchung Arena",
    venueAddress: "241 Dongho-ro, Jung-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: -10,
    startHour: 18,
    startMinute: 0,
    agePolicy: "Ages 8 and up",
    officialSeller: "TICKETLINK",
    sourceType: "seller",
    status: "ended",
    pricing: { currency: "KRW", base: 132000 },
    ticketing: {
      fanclubHoursFromNow: -300,
      generalHoursFromNow: -280,
      fanclubCondition: "Bunnies Club verification closed before the event week.",
      generalNote: "This ended listing remains to exercise the ended UI state.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["This record is intentionally retained for ended-concert coverage."],
    },
  },
  {
    id: "newjeans-supernatural-osaka",
    artistId: "newjeans",
    title: "NewJeans Supernatural Weekend in OSAKA",
    tourName: "Supernatural Weekend",
    eventType: "fan_meeting",
    venueName: "Osaka-jo Hall",
    venueAddress: "3-1 Osakajo, Chuo Ward, Osaka",
    city: "Osaka",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    startOffsetDays: 19,
    startHour: 18,
    startMinute: 0,
    agePolicy: "All ages",
    officialSeller: "WEVERSE",
    sourceType: "weverse",
    status: "upcoming",
    pricing: { currency: "JPY", base: 16200 },
    ticketing: {
      fanclubHoursFromNow: 144,
      generalHoursFromNow: 190,
      fanclubCondition: "Bunnies Membership holders receive the first booking round.",
      generalNote: "General sale will open after the Japanese fanclub wave concludes.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: true,
      antiMacroNotice: true,
      extraNotes: ["On-site pickup counters may require the exact ticket buyer information."],
    },
  },
  {
    id: "lesserafim-flame-rises-seoul",
    artistId: "lesserafim",
    title: "LE SSERAFIM FLAME RISES in SEOUL",
    tourName: "FLAME RISES",
    eventType: "concert",
    venueName: "KSPO DOME",
    venueAddress: "424 Olympic-ro, Songpa-gu, Seoul",
    city: "Seoul",
    countryCode: "KR",
    timezone: "Asia/Seoul",
    startOffsetDays: 24,
    startHour: 19,
    startMinute: 0,
    agePolicy: "Ages 9 and up",
    officialSeller: "NOL",
    sourceType: "seller",
    status: "sold_out",
    pricing: { currency: "KRW", base: 149000 },
    ticketing: {
      fanclubHoursFromNow: -72,
      generalHoursFromNow: -50,
      fanclubCondition: "FEARNOT Membership verification was required.",
      generalNote: "The event currently shows sold out on the official page.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: false,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["Keep watching for payment-failed seats or added sections."],
    },
  },
  {
    id: "lesserafim-flame-rises-singapore",
    artistId: "lesserafim",
    title: "LE SSERAFIM FLAME RISES in SINGAPORE",
    tourName: "FLAME RISES",
    eventType: "concert",
    venueName: "Singapore Indoor Stadium",
    venueAddress: "2 Stadium Walk, Singapore",
    city: "Singapore",
    countryCode: "SG",
    timezone: "Asia/Singapore",
    startOffsetDays: 49,
    startHour: 20,
    startMinute: 0,
    agePolicy: "Ages 6 and up",
    officialSeller: "INTERPARK",
    sourceType: "seller",
    status: "upcoming",
    pricing: { currency: "SGD", base: 248 },
    ticketing: {
      fanclubHoursFromNow: 360,
      generalHoursFromNow: 420,
      fanclubCondition: "FEARNOT Membership and mobile number verification are required.",
      generalNote: "General sale opens through the official global booking page.",
    },
    notice: {
      attendeeNameMatchRequired: true,
      passportRequired: true,
      onsitePickupOnly: false,
      antiMacroNotice: true,
      extraNotes: ["International attendees should verify entry rules for same-day pickup."],
    },
  },
]

export const mockConcerts: Concert[] = concertSeeds.map((seed, index) => {
  const startDate = createZonedDate(
    seed.startOffsetDays,
    seed.startHour,
    seed.startMinute,
    seed.timezone,
  )

  return {
    id: seed.id,
    artistId: seed.artistId,
    title: seed.title,
    tourName: seed.tourName,
    eventType: seed.eventType,
    venueName: seed.venueName,
    venueAddress: seed.venueAddress,
    city: seed.city,
    countryCode: seed.countryCode,
    startDate,
    endDate: seed.durationHours ? addHours(startDate, seed.durationHours) : null,
    timezone: seed.timezone,
    agePolicy: seed.agePolicy,
    officialSeller: seed.officialSeller,
    officialTicketUrl: sellerLinks[seed.officialSeller],
    sourceUrl: sellerLinks[seed.officialSeller],
    sourceType: seed.sourceType,
    status: seed.status,
    lastVerifiedAt: subHours(mockNow, (index % 6) + 1),
    createdAt: subDays(mockNow, 40 - index),
    updatedAt: subHours(mockNow, (index % 4) + 1),
  }
})

export const mockTicketPhases: TicketPhase[] = concertSeeds.flatMap((seed) => {
  const phases: TicketPhase[] = []

  if (seed.ticketing.fanclubHoursFromNow !== null) {
    const fanclubOpenAt = addHours(mockNow, seed.ticketing.fanclubHoursFromNow)

    phases.push({
      id: `${seed.id}-fanclub`,
      concertId: seed.id,
      type: "fanclub_presale",
      openAt: fanclubOpenAt,
      closeAt: addHours(fanclubOpenAt, 18),
      timezone: seed.timezone,
      conditions: seed.ticketing.fanclubCondition ?? null,
      notes: seed.ticketing.fanclubNote ?? null,
    })
  }

  const generalOpenAt = addHours(mockNow, seed.ticketing.generalHoursFromNow)

  phases.push({
    id: `${seed.id}-general`,
    concertId: seed.id,
    type: "general_sale",
    openAt: generalOpenAt,
    closeAt: null,
    timezone: seed.timezone,
    conditions: null,
    notes: seed.ticketing.generalNote ?? null,
  })

  if (typeof seed.ticketing.additionalHoursFromNow === "number") {
    const additionalOpenAt = addHours(mockNow, seed.ticketing.additionalHoursFromNow)

    phases.push({
      id: `${seed.id}-additional`,
      concertId: seed.id,
      type: "additional_sale",
      openAt: additionalOpenAt,
      closeAt: null,
      timezone: seed.timezone,
      conditions: null,
      notes: seed.ticketing.additionalNote ?? null,
    })
  }

  return phases
})

export const mockTicketPrices: TicketPrice[] = concertSeeds.flatMap((seed) => [
  {
    id: `${seed.id}-vip`,
    concertId: seed.id,
    label: "VIP",
    currency: seed.pricing.currency,
    amount: createAmount(seed.pricing.base, 1.35),
    notes: "Premium package with priority entry or soundcheck benefits.",
  },
  {
    id: `${seed.id}-r`,
    concertId: seed.id,
    label: "R",
    currency: seed.pricing.currency,
    amount: createAmount(seed.pricing.base, 1),
    notes: null,
  },
  {
    id: `${seed.id}-s`,
    concertId: seed.id,
    label: "S",
    currency: seed.pricing.currency,
    amount: createAmount(seed.pricing.base, 0.78),
    notes: null,
  },
])

export const mockConcertNotices: ConcertNotice[] = concertSeeds.map((seed) => ({
  id: `${seed.id}-notice`,
  concertId: seed.id,
  summary: buildNoticeSummary(seed),
  attendeeNameMatchRequired: seed.notice.attendeeNameMatchRequired,
  passportRequired: seed.notice.passportRequired,
  onsitePickupOnly: seed.notice.onsitePickupOnly,
  antiMacroNotice: seed.notice.antiMacroNotice,
  importantNotes: buildImportantNotes(seed),
}))

export const mockUser: User = {
  id: "user-jina",
  email: "jina@example.com",
  language: "en",
  timezone: "America/Los_Angeles",
  createdAt: new Date("2026-03-01T09:00:00+09:00"),
}

export const mockArtistFollows: ArtistFollow[] = [
  {
    id: "follow-1",
    userId: "user-jina",
    artistId: "bts",
    createdAt: subDays(mockNow, 12),
  },
  {
    id: "follow-2",
    userId: "user-jina",
    artistId: "seventeen",
    createdAt: subDays(mockNow, 10),
  },
  {
    id: "follow-3",
    userId: "user-jina",
    artistId: "aespa",
    createdAt: subDays(mockNow, 8),
  },
  {
    id: "follow-4",
    userId: "user-jina",
    artistId: "ive",
    createdAt: subDays(mockNow, 6),
  },
  {
    id: "follow-5",
    userId: "user-jina",
    artistId: "lesserafim",
    createdAt: subDays(mockNow, 4),
  },
]

export const mockAlertPreferences: AlertPreference[] = [
  {
    id: "alert-1",
    userId: "user-jina",
    concertId: "bts-permission-to-dance-seoul",
    remind24h: true,
    remind1h: true,
    remind10m: true,
    emailEnabled: true,
    pushEnabled: false,
  },
  {
    id: "alert-2",
    userId: "user-jina",
    concertId: "seventeen-right-here-seoul",
    remind24h: true,
    remind1h: true,
    remind10m: false,
    emailEnabled: true,
    pushEnabled: false,
  },
  {
    id: "alert-3",
    userId: "user-jina",
    concertId: "stray-kids-dominate-seoul",
    remind24h: true,
    remind1h: true,
    remind10m: true,
    emailEnabled: true,
    pushEnabled: false,
  },
]

export function getArtistById(artistId: string) {
  return mockArtists.find((artist) => artist.id === artistId) ?? null
}

export function getConcertById(concertId: string) {
  return mockConcerts.find((concert) => concert.id === concertId) ?? null
}

export function getConcertArtist(concert: Concert) {
  return getArtistById(concert.artistId)
}

export function getConcertPhases(concertId: string) {
  return mockTicketPhases
    .filter((phase) => phase.concertId === concertId)
    .sort((left, right) => compareAsc(left.openAt, right.openAt))
}

export function getConcertPrices(concertId: string) {
  return mockTicketPrices.filter((price) => price.concertId === concertId)
}

export function getConcertNotice(concertId: string) {
  return mockConcertNotices.find((notice) => notice.concertId === concertId) ?? null
}

export function getConcertsByArtist(artistId: string) {
  return mockConcerts.filter((concert) => concert.artistId === artistId)
}

export function getFeaturedConcerts() {
  return mockConcerts
    .filter(
      (concert) =>
        concert.startDate >= mockNow && getArtistById(concert.artistId)?.isFeatured,
    )
    .sort((left, right) => compareAsc(left.startDate, right.startDate))
}

export function getOpeningSoonConcerts(referenceDate = mockNow) {
  return mockConcerts
    .filter((concert) => {
      const nextPhase = getNextTicketPhase(concert.id, referenceDate)
      return (
        nextPhase &&
        differenceInHours(nextPhase.openAt, referenceDate) >= 0 &&
        differenceInHours(nextPhase.openAt, addDays(referenceDate, 3)) <= 0
      )
    })
    .sort((left, right) => {
      const leftPhase = getNextTicketPhase(left.id, referenceDate)
      const rightPhase = getNextTicketPhase(right.id, referenceDate)

      return compareAsc(
        leftPhase?.openAt ?? left.startDate,
        rightPhase?.openAt ?? right.startDate,
      )
    })
}

export function getThisMonthConcerts(referenceDate = mockNow) {
  return mockConcerts
    .filter(
      (concert) =>
        concert.startDate >= referenceDate && isSameMonth(concert.startDate, referenceDate),
    )
    .sort((left, right) => compareAsc(left.startDate, right.startDate))
}

export function getConcertsThisWeek(referenceDate = mockNow) {
  return mockConcerts
    .filter(
      (concert) =>
        differenceInHours(concert.startDate, referenceDate) >= 0 &&
        differenceInHours(concert.startDate, addDays(referenceDate, 7)) <= 0,
    )
    .sort((left, right) => compareAsc(left.startDate, right.startDate))
}

export function getLaterConcerts(referenceDate = mockNow) {
  return mockConcerts
    .filter((concert) => differenceInHours(concert.startDate, addDays(referenceDate, 7)) > 0)
    .sort((left, right) => compareAsc(left.startDate, right.startDate))
}

export function getNextTicketPhase(concertId: string, referenceDate = mockNow) {
  return getConcertPhases(concertId).find((phase) => phase.openAt >= referenceDate) ?? null
}

export function hasFanclubPresale(concertId: string) {
  return getConcertPhases(concertId).some((phase) => phase.type === "fanclub_presale")
}

export function getFollowedArtists() {
  return mockArtists.filter((artist) =>
    mockArtistFollows.some((follow) => follow.artistId === artist.id),
  )
}

export function getFollowedConcerts() {
  const followedArtistIds = new Set(mockArtistFollows.map((follow) => follow.artistId))

  return mockConcerts
    .filter((concert) => followedArtistIds.has(concert.artistId))
    .sort((left, right) => compareAsc(left.startDate, right.startDate))
}
