"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  Artist,
  ConcertEventType,
  ConcertSeller,
  ConcertStatus,
} from "@/types"
import type {
  ConcertDateRange,
  ConcertFilters,
} from "@/lib/discovery"
import { defaultConcertFilters } from "@/lib/discovery"

const DATE_RANGE_OPTIONS: ConcertDateRange[] = ["all", "30d", "60d"]

export function ConcertFiltersPanel({
  filters,
  artists,
  cityOptions,
  countryOptions,
  sellerOptions,
  statusOptions,
  eventTypeOptions,
  resultCount,
  hasActiveFilters,
  compact = false,
  onPatchFilters,
}: {
  filters: ConcertFilters
  artists: Artist[]
  cityOptions: string[]
  countryOptions: string[]
  sellerOptions: ConcertSeller[]
  statusOptions: ConcertStatus[]
  eventTypeOptions: ConcertEventType[]
  resultCount: number
  hasActiveFilters: boolean
  compact?: boolean
  onPatchFilters: (
    nextFilters:
      | Partial<ConcertFilters>
      | ((current: ConcertFilters) => ConcertFilters),
  ) => void
}) {
  const tCommon = useTranslations("common")
  const tConcerts = useTranslations("concerts")

  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader className="gap-3 border-b border-border/60 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {tConcerts("filters.title")}
            </p>
            <CardTitle className="text-xl">{tConcerts("filters.helper")}</CardTitle>
          </div>
          {hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPatchFilters(defaultConcertFilters)}
            >
              {tCommon("buttons.clearFilters")}
            </Button>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {tConcerts("filters.resultsCount", { count: resultCount })}
        </p>
      </CardHeader>
      <CardContent className={cn("space-y-6 pt-5", compact && "pb-6")}>
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{tConcerts("filters.artist")}</p>
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => {
              const active = filters.artistIds.includes(artist.id)

              return (
                <button
                  key={artist.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onPatchFilters((current) => ({
                      ...current,
                      artistIds: current.artistIds.includes(artist.id)
                        ? current.artistIds.filter((value) => value !== artist.id)
                        : [...current.artistIds, artist.id],
                    }))
                  }
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "border-border/70 bg-background/55 text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {artist.nameEn}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <FilterSelect
            label={tConcerts("filters.city")}
            value={filters.city}
            onChange={(nextValue) => onPatchFilters({ city: nextValue })}
            defaultLabel={tConcerts("filters.allCities")}
            options={cityOptions}
          />
          <FilterSelect
            label={tConcerts("filters.country")}
            value={filters.countryCode}
            onChange={(nextValue) => onPatchFilters({ countryCode: nextValue })}
            defaultLabel={tConcerts("filters.allCountries")}
            options={countryOptions}
          />
          <FilterSelect
            label={tConcerts("filters.seller")}
            value={filters.seller}
            onChange={(nextValue) => onPatchFilters({ seller: nextValue as ConcertSeller | "all" })}
            defaultLabel={tConcerts("filters.allSellers")}
            options={sellerOptions}
            renderOption={(option) => tCommon(`sellers.${option}`)}
          />
          <FilterSelect
            label={tConcerts("filters.status")}
            value={filters.status}
            onChange={(nextValue) => onPatchFilters({ status: nextValue as ConcertStatus | "all" })}
            defaultLabel={tConcerts("filters.allStatuses")}
            options={statusOptions}
            renderOption={(option) => tCommon(`status.${option}`)}
          />
          <FilterSelect
            label={tConcerts("filters.eventType")}
            value={filters.eventType}
            onChange={(nextValue) => onPatchFilters({ eventType: nextValue as ConcertEventType | "all" })}
            defaultLabel={tConcerts("filters.allTypes")}
            options={eventTypeOptions}
            renderOption={(option) => tCommon(`eventTypes.${option}`)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{tConcerts("filters.dateWindow")}</p>
          <div className="flex flex-wrap gap-2">
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filters.dateRange === option}
                onClick={() => onPatchFilters({ dateRange: option })}
                className={cn(
                  "rounded-full border px-3 py-2 text-sm transition",
                  filters.dateRange === option
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border/70 bg-background/55 text-muted-foreground hover:border-accent/35 hover:text-foreground",
                )}
              >
                {tConcerts(`filters.dateRange.${option}`)}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
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
        className="h-12 w-full rounded-2xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-ring"
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
