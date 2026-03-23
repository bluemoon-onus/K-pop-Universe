"use client"

import {
  addMonths,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns"
import { startTransition, useDeferredValue, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { ConcertList } from "@/components/concerts/concert-list"
import { SearchBar } from "@/components/common/search-bar"
import { StatePanel } from "@/components/common/state-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { mockArtists } from "@/data/mock-artists"
import { mockConcerts, mockNow } from "@/data/mock-concerts"
import {
  ConcertDateRange,
  ConcertSort,
  ConcertView,
  defaultConcertFilters,
  filterConcerts,
  getCalendarDays,
  getConcertsForCalendarDate,
  groupConcertsByTiming,
  sortConcerts,
} from "@/lib/discovery"
import { cn } from "@/lib/utils"

const DATE_RANGE_OPTIONS: ConcertDateRange[] = ["all", "30d", "60d"]
const SORT_OPTIONS: ConcertSort[] = ["opening", "date", "updated"]

export default function ConcertsPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")
  const [isPending, startFilterTransition] = useTransition()
  const [view, setView] = useState<ConcertView>("list")
  const [sortBy, setSortBy] = useState<ConcertSort>("opening")
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(mockNow))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
  const calendarDays = getCalendarDays(calendarMonth)
  const selectedDateConcerts = selectedDate
    ? sortConcerts(getConcertsForCalendarDate(filteredConcerts, selectedDate), sortBy)
    : []
  const hasActiveFilters =
    effectiveFilters.query.trim().length > 0 ||
    effectiveFilters.artistIds.length > 0 ||
    effectiveFilters.city !== "all" ||
    effectiveFilters.countryCode !== "all" ||
    effectiveFilters.seller !== "all" ||
    effectiveFilters.status !== "all" ||
    effectiveFilters.eventType !== "all" ||
    effectiveFilters.dateRange !== "all"

  function patchFilters(
    nextFilters: Partial<typeof filters> | ((current: typeof filters) => typeof filters),
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
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
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
              className="w-full rounded-2xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-ring"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {tConcerts(`sort.${option}`)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              className="flex-1"
              onClick={() => startTransition(() => setView("list"))}
            >
              {tCommon("labels.listView")}
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              className="flex-1"
              onClick={() => startTransition(() => setView("calendar"))}
            >
              {tCommon("labels.calendarView")}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{tConcerts("filters.artist")}</p>
            <div className="flex flex-wrap gap-2">
              {mockArtists.map((artist) => {
                const active = filters.artistIds.includes(artist.id)

                return (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() =>
                      patchFilters((current) => ({
                        ...current,
                        artistIds: current.artistIds.includes(artist.id)
                          ? current.artistIds.filter((value) => value !== artist.id)
                          : [...current.artistIds, artist.id],
                      }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 text-muted-foreground",
                    )}
                  >
                    {artist.nameEn}
                  </button>
                )
              })}
            </div>
          </div>

          <FilterSelect
            label={tConcerts("filters.city")}
            value={filters.city}
            onChange={(nextValue) => patchFilters({ city: nextValue })}
            defaultLabel={tConcerts("filters.allCities")}
            options={cityOptions}
          />
          <FilterSelect
            label={tConcerts("filters.country")}
            value={filters.countryCode}
            onChange={(nextValue) => patchFilters({ countryCode: nextValue })}
            defaultLabel={tConcerts("filters.allCountries")}
            options={countryOptions}
          />
          <FilterSelect
            label={tConcerts("filters.seller")}
            value={filters.seller}
            onChange={(nextValue) => patchFilters({ seller: nextValue as typeof filters.seller })}
            defaultLabel={tConcerts("filters.allSellers")}
            options={sellerOptions}
          />
          <FilterSelect
            label={tConcerts("filters.status")}
            value={filters.status}
            onChange={(nextValue) => patchFilters({ status: nextValue as typeof filters.status })}
            defaultLabel={tConcerts("filters.allStatuses")}
            options={Array.from(new Set(mockConcerts.map((concert) => concert.status))).sort()}
            renderOption={(option) => tCommon(`status.${option}`)}
          />
          <FilterSelect
            label={tConcerts("filters.eventType")}
            value={filters.eventType}
            onChange={(nextValue) => patchFilters({ eventType: nextValue as typeof filters.eventType })}
            defaultLabel={tConcerts("filters.allTypes")}
            options={Array.from(new Set(mockConcerts.map((concert) => concert.eventType))).sort()}
            renderOption={(option) => tCommon(`eventTypes.${option}`)}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => patchFilters({ dateRange: option })}
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition",
                filters.dateRange === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 text-muted-foreground",
              )}
            >
              {tConcerts(`filters.dateRange.${option}`)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => patchFilters(defaultConcertFilters)}
            className={buttonVariants({ variant: "outline" })}
          >
            {tCommon("buttons.clearFilters")}
          </button>
        </div>
      </section>

      {view === "list" ? (
        filteredConcerts.length ? (
          <div className="space-y-10">
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
          </div>
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {new Intl.DateTimeFormat(locale, {
                  month: "long",
                  year: "numeric",
                }).format(calendarMonth)}
              </h2>
              <p className="text-sm text-muted-foreground">{tConcerts("calendar.instructions")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCalendarMonth((current) => subMonths(current, 1))}>
                {tCommon("buttons.previous")}
              </Button>
              <Button variant="outline" onClick={() => setCalendarMonth((current) => addMonths(current, 1))}>
                {tCommon("buttons.next")}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date) => {
              const concertsOnDate = getConcertsForCalendarDate(filteredConcerts, date)
              const active = selectedDate ? date.getTime() === selectedDate.getTime() : false

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "min-h-24 rounded-2xl border border-border/70 p-3 text-left transition hover:border-primary/40",
                    !isSameMonth(date, calendarMonth) && "opacity-40",
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
                      <p className="text-xs text-accent">+{concertsOnDate.length - 2}</p>
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
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  defaultLabel,
  options,
  renderOption,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  defaultLabel: string
  options: string[]
  renderOption?: (value: string) => string
}) {
  return (
    <label className="space-y-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-ring"
      >
        <option value="all">{defaultLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {renderOption ? renderOption(option) : option}
          </option>
        ))}
      </select>
    </label>
  )
}
