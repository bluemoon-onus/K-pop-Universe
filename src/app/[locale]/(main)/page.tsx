import { useTranslations } from "next-intl"
import { ArtistGrid } from "@/components/artists/artist-grid"
import { ConcertList } from "@/components/concerts/concert-list"
import { SearchBar } from "@/components/common/search-bar"
import { Link } from "@/lib/i18n"
import { buttonVariants } from "@/components/ui/button"
import { featuredArtists } from "@/data/mock-artists"
import { getOpeningSoonConcerts, getThisMonthConcerts } from "@/data/mock-concerts"

export default function HomePage() {
  const tCommon = useTranslations("common")
  const tHome = useTranslations("home")
  const openingSoonConcerts = getOpeningSoonConcerts()
  const monthConcerts = getThisMonthConcerts()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="surface-grid glass-panel overflow-hidden rounded-[2rem] border border-border/60 px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="space-y-6">
            <p className="font-heading text-sm uppercase tracking-[0.22em] text-accent">
              {tHome("hero.eyebrow")}
            </p>
            <h1 className="max-w-4xl font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {tHome("hero.title")}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {tHome("hero.subtitle")}
            </p>
            <SearchBar
              placeholder={tHome("hero.searchPlaceholder")}
              className="max-w-2xl"
            />
            <div className="flex flex-wrap gap-3">
              <Link href="/concerts" className={buttonVariants({ variant: "default" })}>
                {tCommon("buttons.browseConcerts")}
              </Link>
              <Link href="/artists" className={buttonVariants({ variant: "outline" })}>
                {tCommon("buttons.followArtists")}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                title: tHome("why.presaleTitle"),
                body: tHome("why.presaleBody"),
              },
              {
                title: tHome("why.timezoneTitle"),
                body: tHome("why.timezoneBody"),
              },
              {
                title: tHome("why.officialTitle"),
                body: tHome("why.officialBody"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-border/60 bg-black/15 p-5"
              >
                <p className="font-heading text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConcertList
        title={tHome("sections.upcoming")}
        description={tCommon("footer.freshness")}
        concerts={openingSoonConcerts}
      />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              {tHome("sections.featuredArtists")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {tCommon("tagline")}
            </p>
          </div>
          <Link href="/artists" className={buttonVariants({ variant: "outline" })}>
            {tCommon("buttons.browseArtists")}
          </Link>
        </div>
        <ArtistGrid artists={featuredArtists.slice(0, 3)} />
      </section>

      <ConcertList
        title={tHome("sections.monthConcerts")}
        concerts={monthConcerts}
      />
    </div>
  )
}
