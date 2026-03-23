import { useTranslations } from "next-intl"
import { ArtistGrid } from "@/components/artists/artist-grid"
import { SearchBar } from "@/components/common/search-bar"
import { featuredArtists, mockArtists } from "@/data/mock-artists"
import { mockArtistFollows } from "@/data/mock-concerts"
import { artistCategories } from "@/lib/constants"

export default function ArtistsPage() {
  const tCommon = useTranslations("common")
  const tArtists = useTranslations("artists")

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
          <SearchBar placeholder={tArtists("searchPlaceholder")} className="max-w-2xl" />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {artistCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-border/70 px-3 py-2 text-sm text-muted-foreground"
            >
              {tCommon(`categories.${category}`)}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {tArtists("featuredLabel")}
        </h2>
        <ArtistGrid
          artists={featuredArtists}
          followedArtistIds={mockArtistFollows.map((follow) => follow.artistId)}
        />
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {tCommon("navigation.artists")}
        </h2>
        <ArtistGrid
          artists={mockArtists}
          followedArtistIds={mockArtistFollows.map((follow) => follow.artistId)}
        />
      </section>
    </div>
  )
}
