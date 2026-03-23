"use client"

import {
  CalendarDaysIcon,
  LayoutListIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import {
  addMonths,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns"
import { startTransition, type ReactNode, useDeferredValue, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { ConcertFiltersPanel } from "@/components/concerts/concert-filters"
import { ConcertList } from "@/components/concerts/concert-list"
import { SearchBar } from "@/components/common/search-bar"
import { StatePanel } from "@/components/common/state-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mockArtists } from "@/data/mock-artists"
import { mockConcerts, mockNow } from "@/data/mock-concerts"
import {
  ConcertSort,
  ConcertView,
  defaultConcertFilters,
  filterConcerts,
  getActiveConcertFilterCount,
  getCalendarDays,
  getConcertsForCalendarDate,
  groupConcertsByTiming,
  sortConcerts,
} from "@/lib/discovery"
import { cn } from "@/lib/utils"

const SORT_OPTIONS: ConcertSort[] = ["opening", "date", "updated"]

export default function ConcertsPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")
  const [isPending, startFilterTransition] = useTransition()
  const [view, setView] = useState<ConcertView>("list")
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(mockNow))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sortBy, setSortBy] = useState<ConcertSort>("opening")
  const [filters, setFilters] = useState(() => ({
    ...defaultConcertFilters,
    query: searchParams.get("query") ?? "",
    artistIds: searchParams.get("artist") ? [searchParams.get("artist") as string] : [],
  }))
  const deferredQuery = useDeferredValue(filters.query)

  const effectiveFilters = {
    ...filters,
    query: deferredQuery,
  }
  const filteredConcerts = sortConcerts(
    filterConcerts(mockConcerts, effectiveFilters),
    sortBy,
  )
  const groupedConcerts = groupConcertsByTiming(filteredConcerts)
  const cityOptions = Array.from(new Set(mockConcerts.map((concert) => concert.city))).sort()
  const countryOptions = Array.from(
    new Set(mockConcerts.map((concert) => concert.countryCode)),
  ).sort()
  const sellerOptions = Array.from(
    new Set(mockConcerts.map((concert) => concert.officialSeller)),
  ).sort()
  const statusOptions = Array.from(
    new Set(mockConcerts.map((concert) => concert.status)),
  ).sort()
  const eventTypeOptions = Array.from(
    new Set(mockConcerts.map((concert) => concert.eventType)),
  ).sort()
  const calendarDays = getCalendarDays(calendarMonth)
  const selectedDateConcerts = selectedDate
    ? sortConcerts(getConcertsForCalendarDate(filteredConcerts, selectedDate), sortBy)
    : []
  const activeFilterCount = getActiveConcertFilterCount(effectiveFilters)
  const hasActiveFilters = activeFilterCount > 0

  function patchFilters(
    nextFilters:
      | Partial<typeof filters>
      | ((current: typeof filters) => typeof filters),
  ) {
    startFilterTransition(() => {
      setFilters((current) =>
        typeof nextFilters === "function"
          ? nextFilters(current)
          : { ...current, ...nextFilters },
      )
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel surface-grid rounded-[2rem] border border-border/60 px-6 py-10 sm:px-10">
        <div className="space-y-5">
          <p className="font-heading text-sm uppercase tracking-[0.22em] text-accent">
            {tCommon("navigation.concerts")}
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {tConcerts("title")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {tConcerts("subtitle")}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <ConcertFiltersPanel
            filters={filters}
            artists={mockArtists}
            cityOptions={cityOptions}
            countryOptions={countryOptions}
            sellerOptions={sellerOptions}
            statusOptions={statusOptions}
            eventTypeOptions={eventTypeOptions}
            resultCount={filteredConcerts.length}
            hasActiveFilters={hasActiveFilters}
            onPatchFilters={patchFilters}
          />
        </aside>

        <div className="space-y-6">
          <section className="glass-panel rounded-[2rem] border border-border/60 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? tConcerts("filters.resultsCount", { count: filteredConcerts.length })
                    : tCommon("footer.freshness")}
                </p>
                <div className="flex flex-wrap gap-2 lg:hidden">
                  <MobileFilterButton
                    activeFilterCount={activeFilterCount}
                    filtersPanel={
                      <ConcertFiltersPanel
                        compact
                        filters={filters}
                        artists={mockArtists}
                        cityOptions={cityOptions}
                        countryOptions={countryOptions}
                        sellerOptions={sellerOptions}
                        statusOptions={statusOptions}
                        eventTypeOptions={eventTypeOptions}
                        resultCount={filteredConcerts.length}
                        hasActiveFilters={hasActiveFilters}
                        onPatchFilters={patchFilters}
                      />
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  aria-pressed={view === "list"}
                  onClick={() => startTransition(() => setView("list"))}
                >
                  <LayoutListIcon className="size-4" />
                  {tCommon("labels.listView")}
                </Button>
                <Button
                  variant={view === "calendar" ? "default" : "outline"}
                  size="sm"
                  aria-pressed={view === "calendar"}
                  onClick={() => startTransition(() => setView("calendar"))}
                >
                  <CalendarDaysIcon className="size-4" />
                  {tCommon("labels.calendarView")}
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
              <SearchBar
                placeholder={tConcerts("filters.searchPlaceholder")}
                value={filters.query}
                onValueChange={(nextQuery) => patchFilters({ query: nextQuery })}
              />
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>{tConcerts("filters.sortBy")}</span>
                <select
                  value={sortBy}
                  onChange={(event) =>
                    startTransition(() => setSortBy(event.target.value as ConcertSort))
                  }
                  className="h-12 w-full rounded-2xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-ring"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {tConcerts(`sort.${option}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div
            aria-busy={isPending}
            className={cn(
              "space-y-10 transition-all duration-300",
              isPending && "opacity-60 saturate-[0.9]",
            )}
          >
            {view === "list" ? (
              filteredConcerts.length ? (
                <>
                  {groupedConcerts.openingSoon.length ? (
                    <ConcertList
                      title={tCommon("labels.openingSoon")}
                      concerts={groupedConcerts.openingSoon}
                      isLoading={isPending}
                    />
                  ) : null}
                  {groupedConcerts.thisWeek.length ? (
                    <ConcertList
                      title={tCommon("labels.thisWeek")}
                      concerts={groupedConcerts.thisWeek}
                      isLoading={isPending}
                    />
                  ) : null}
                  {groupedConcerts.later.length ? (
                    <ConcertList
                      title={tCommon("labels.later")}
                      concerts={groupedConcerts.later}
                      isLoading={isPending}
                    />
                  ) : null}
                </>
              ) : (
                <StatePanel
                  title={
                    hasActiveFilters
                      ? tConcerts("states.filteredTitle")
                      : tCommon("states.emptyTitle")
                  }
                  description={
                    hasActiveFilters
                      ? tConcerts("states.filteredDescription")
                      : tCommon("states.emptyDescription")
                  }
                />
              )
            ) : (
              <section className="space-y-5">
                <div className="glass-panel rounded-[2rem] border border-border/60 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-semibold text-foreground">
                        {new Intl.DateTimeFormat(locale, {
                          month: "long",
                          year: "numeric",
                        }).format(calendarMonth)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {tConcerts("calendar.instructions")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarMonth((current) => subMonths(current, 1))}
                      >
                        {tCommon("buttons.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarMonth((current) => addMonths(current, 1))}
                      >
                        {tCommon("buttons.next")}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {calendarDays.map((date) => {
                    const concertsOnDate = getConcertsForCalendarDate(filteredConcerts, date)
                    const active = selectedDate ? date.getTime() === selectedDate.getTime() : false

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        aria-pressed={active}
                        aria-label={`${new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date)}${concertsOnDate.length ? `, ${concertsOnDate.length}` : ""}`}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "glass-panel card-lift min-h-24 rounded-[1.5rem] border border-border/70 p-3 text-left transition hover:border-primary/40 sm:min-h-28",
                          !isSameMonth(date, calendarMonth) && "opacity-35",
                          active && "border-primary bg-primary/10",
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">
                          {new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date)}
                        </p>
                        <div className="mt-3 space-y-1">
                          {concertsOnDate.slice(0, 2).map((concert) => (
                            <p key={concert.id} className="truncate text-xs text-muted-foreground">
                              {concert.title}
                            </p>
                          ))}
                          {concertsOnDate.length > 2 ? (
                            <p className="text-xs text-accent">
                              +{concertsOnDate.length - 2}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {selectedDate ? (
                  <ConcertList
                    title={`${tConcerts("calendar.selectedDate")}: ${new Intl.DateTimeFormat(locale, {
                      dateStyle: "long",
                    }).format(selectedDate)}`}
                    concerts={selectedDateConcerts}
                    emptyTitle={tConcerts("calendar.noConcertsTitle")}
                    emptyDescription={tConcerts("calendar.noConcertsDescription")}
                  />
                ) : (
                  <StatePanel
                    title={tCommon("labels.calendarView")}
                    description={tConcerts("calendar.instructions")}
                  />
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileFilterButton({
  activeFilterCount,
  filtersPanel,
}: {
  activeFilterCount: number
  filtersPanel: ReactNode
}) {
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <SlidersHorizontalIcon className="size-4" />
        {tConcerts("filters.title")}
        {activeFilterCount ? (
          <>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground" aria-hidden="true">
              {activeFilterCount}
            </span>
            <span className="sr-only">({activeFilterCount})</span>
          </>
        ) : null}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        closeLabel={tCommon("buttons.close")}
        className="surface-grid max-h-[88vh] overflow-y-auto rounded-t-[2rem] border-border/70 px-0 pb-6"
      >
        <SheetHeader className="border-b border-border/60 px-5 pb-5">
          <SheetTitle>{tConcerts("filters.title")}</SheetTitle>
          <SheetDescription>{tConcerts("filters.helper")}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pt-4 sm:px-5">{filtersPanel}</div>
      </SheetContent>
    </Sheet>
  )
}
