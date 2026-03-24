"use client"

import { startTransition, useDeferredValue, useState } from "react"
import { useTranslations } from "next-intl"
import { ArtistGrid } from "@/components/artists/artist-grid"
import { SearchBar } from "@/components/common/search-bar"
import { StatePanel } from "@/components/common/state-panel"
import { mockArtists } from "@/data/mock-artists"
import { artistMatchesQuery } from "@/lib/discovery"
import { artistCategories } from "@/lib/constants"
import type { ArtistCategory } from "@/types"

type ArtistFilter = "all" | ArtistCategory

export default function ArtistsPage() {
  const tCommon = useTranslations("common")
  const tArtists = useTranslations("artists")
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ArtistFilter>("all")
  const deferredQuery = useDeferredValue(query)

  const filteredArtists = mockArtists.filter((artist) => {
    if (selectedCategory !== "all" && artist.category !== selectedCategory) {
      return false
    }

    return artistMatchesQuery(artist, deferredQuery)
  })

  const featuredArtists = filteredArtists.filter((artist) => artist.isFeatured)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel rounded-[2rem] border border-border/60 px-6 py-10 sm:px-10">
        <div className="max-w-4xl space-y-5">
          <p className="font-heading text-sm uppercase tracking-[0.22em] text-accent">
            {tArtists("featuredLabel")}
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {tArtists("title")}
          </h1>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            {tArtists("subtitle")}
          </p>
          <SearchBar
            placeholder={tArtists("searchPlaceholder")}
            className="max-w-2xl"
            value={query}
            onValueChange={(nextValue) => {
              startTransition(() => setQuery(nextValue))
            }}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startTransition(() => setSelectedCategory("all"))}
            className={`rounded-full px-3 py-2 text-sm transition ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-border/70 text-muted-foreground"
            }`}
          >
            {tArtists("allCategories")}
          </button>
          {artistCategories
            .filter((category) => category !== "other")
            .map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => startTransition(() => setSelectedCategory(category))}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/70 text-muted-foreground"
                }`}
              >
                {tCommon(`categories.${category}`)}
              </button>
            ))}
        </div>
      </section>

      {featuredArtists.length ? (
        <section className="space-y-5">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {tArtists("featuredLabel")}
          </h2>
          <ArtistGrid artists={featuredArtists} showConcertLinks />
        </section>
      ) : null}

      <section className="space-y-5">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {tCommon("navigation.artists")}
        </h2>
        {filteredArtists.length ? (
          <ArtistGrid artists={filteredArtists} showConcertLinks />
        ) : (
          <StatePanel
            title={tArtists("noResultsTitle")}
            description={tArtists("noResultsDescription")}
          />
        )}
      </section>
    </div>
  )
}
