"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArtistGrid } from "@/components/artists/artist-grid"
import { AlertSettingPanel } from "@/components/common/alert-setting-panel"
import { StatePanel } from "@/components/common/state-panel"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockArtists, featuredArtists } from "@/data/mock-artists"
import { getConcertById } from "@/data/mock-concerts"

const TIME_ZONE_OPTIONS = [
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Bangkok",
  "Europe/London",
  "America/Los_Angeles",
  "America/New_York",
]

export default function MyPage() {
  const tCommon = useTranslations("common")
  const tAlerts = useTranslations("alerts")
  const tAuth = useTranslations("auth")
  const [activeTab, setActiveTab] = useState<"artists" | "alerts">("artists")
  const {
    isLoggedIn,
    email,
    timeZone,
    followedArtistIds,
    alertPreferences,
    setEmail,
    setTimeZone,
    signInDemo,
    signOutDemo,
  } = useUserPreferences()
  const followedArtists = mockArtists.filter((artist) => followedArtistIds.includes(artist.id))

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {!isLoggedIn ? (
            <StatePanel
              title={tAlerts("loggedOutTitle")}
              description={tAlerts("loggedOutDescription")}
              action={<Button onClick={signInDemo}>{tAuth("signIn")}</Button>}
            />
          ) : (
            <>
              <div role="tablist" className="flex flex-wrap gap-2">
                <Button
                  role="tab"
                  aria-selected={activeTab === "artists"}
                  variant={activeTab === "artists" ? "default" : "outline"}
                  onClick={() => setActiveTab("artists")}
                >
                  {tAlerts("tabs.artists")}
                </Button>
                <Button
                  role="tab"
                  aria-selected={activeTab === "alerts"}
                  variant={activeTab === "alerts" ? "default" : "outline"}
                  onClick={() => setActiveTab("alerts")}
                >
                  {tAlerts("tabs.alerts")}
                </Button>
              </div>

              {activeTab === "artists" ? (
                followedArtists.length ? (
                  <section className="space-y-5">
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      {tAlerts("tabs.artists")}
                    </h2>
                    <ArtistGrid artists={followedArtists} showConcertLinks />
                  </section>
                ) : (
                  <StatePanel
                    title={tAlerts("emptyArtistsTitle")}
                    description={tAlerts("emptyArtistsDescription")}
                    action={<ArtistGrid artists={featuredArtists.slice(0, 5)} showConcertLinks />}
                  />
                )
              ) : alertPreferences.length ? (
                <section className="space-y-5">
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {tAlerts("tabs.alerts")}
                  </h2>
                  <div className="grid gap-4">
                    {alertPreferences.map((preference) => {
                      const concert = getConcertById(preference.concertId)

                      if (!concert) {
                        return null
                      }

                      return (
                        <AlertSettingPanel
                          key={preference.id}
                          concertId={concert.id}
                          concertName={concert.title}
                        />
                      )
                    })}
                  </div>
                </section>
              ) : (
                <StatePanel
                  title={tAlerts("emptyAlertsTitle")}
                  description={tAlerts("emptyAlertsDescription")}
                />
              )}
            </>
          )}
        </div>

        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle>{tAlerts("settingsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{tAlerts("languageSetting")}</p>
              <LocaleSwitcher className="justify-between" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{tAlerts("themeSetting")}</p>
              <ThemeToggle className="w-full justify-between" />
            </div>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">{tAlerts("emailLabel")}</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={tAlerts("emailPlaceholder")}
                className="h-12 rounded-2xl border-border/70 bg-background/80 px-3"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">{tAlerts("timezoneLabel")}</span>
              <select
                value={timeZone}
                onChange={(event) => setTimeZone(event.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-ring"
              >
                {Array.from(new Set([...TIME_ZONE_OPTIONS, timeZone])).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-2xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground">
              {isLoggedIn ? tAlerts("signedInAs", { email }) : tAuth("hint")}
            </div>
            <Button variant={isLoggedIn ? "outline" : "default"} onClick={isLoggedIn ? signOutDemo : signInDemo}>
              {isLoggedIn ? tCommon("buttons.signOut") : tAuth("signIn")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
