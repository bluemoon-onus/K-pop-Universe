import { useLocale, useTranslations } from "next-intl"
import { ArtistGrid } from "@/components/artists/artist-grid"
import { AlertSettingPanel } from "@/components/common/alert-setting-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getConcertById,
  getFollowedArtists,
  mockAlertPreferences,
} from "@/data/mock-concerts"
import { formatDateTimeLabel } from "@/lib/utils"

export default function MyPage() {
  const locale = useLocale()
  const tCommon = useTranslations("common")
  const tAlerts = useTranslations("alerts")
  const followedArtists = getFollowedArtists()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel rounded-[2rem] border border-border/60 px-6 py-10 sm:px-10">
        <div className="max-w-4xl space-y-5">
          <p className="font-heading text-sm uppercase tracking-[0.22em] text-accent">
            {tCommon("navigation.my")}
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {tAlerts("title")}
          </h1>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            {tAlerts("subtitle")}
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {tCommon("navigation.artists")}
        </h2>
        <ArtistGrid
          artists={followedArtists}
          followedArtistIds={followedArtists.map((artist) => artist.id)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {tAlerts("panelTitle")}
          </h2>
          <div className="grid gap-4">
            {mockAlertPreferences.map((preference) => {
              const concert = getConcertById(preference.concertId)

              if (!concert) {
                return null
              }

              return (
                <Card key={preference.id} className="glass-panel border border-border/60">
                  <CardHeader className="gap-2">
                    <CardTitle>{concert.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTimeLabel(concert.startDate, locale, concert.timezone)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <AlertSettingPanel
                      defaultPreference={preference}
                      concertName={concert.title}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle>{tCommon("buttons.signIn")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>{tAlerts("pushSoon")}</p>
            <p>{tCommon("footer.freshness")}</p>
            <p>{tCommon("footer.disclaimerBody")}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
