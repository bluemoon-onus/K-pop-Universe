import { useTranslations } from "next-intl"
import { ConcertList } from "@/components/concerts/concert-list"
import {
  getConcertsThisWeek,
  getLaterConcerts,
  getOpeningSoonConcerts,
} from "@/data/mock-concerts"
import { concertStatuses, eventTypes } from "@/lib/constants"

export default function ConcertsPage() {
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")
  const openingSoon = getOpeningSoonConcerts()
  const thisWeek = getConcertsThisWeek()
  const later = getLaterConcerts()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel rounded-[2rem] border border-border/60 px-6 py-10 sm:px-10">
        <div className="space-y-5">
          <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {tConcerts("title")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {tConcerts("subtitle")}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {tConcerts("listViewActive")}
          </span>
          <span className="rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground">
            {tConcerts("calendarSoon")}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <span
              key={type}
              className="rounded-full border border-border/70 px-3 py-2 text-sm text-muted-foreground"
            >
              {tCommon(`eventTypes.${type}`)}
            </span>
          ))}
          {concertStatuses.map((status) => (
            <span
              key={status}
              className="rounded-full border border-border/70 px-3 py-2 text-sm text-muted-foreground"
            >
              {tCommon(`status.${status}`)}
            </span>
          ))}
        </div>
      </section>

      <ConcertList title={tCommon("labels.openingSoon")} concerts={openingSoon} />
      <ConcertList title={tCommon("labels.thisWeek")} concerts={thisWeek} />
      <ConcertList title={tCommon("labels.later")} concerts={later} />
    </div>
  )
}
