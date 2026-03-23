"use client"

import { BellIcon, MailIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AlertPreference } from "@/types"

type ReminderKey = "remind24h" | "remind1h" | "remind10m"

function serializeSettings(settings: {
  remind24h: boolean
  remind1h: boolean
  remind10m: boolean
  emailEnabled: boolean
}) {
  return JSON.stringify(settings)
}

export function AlertSettingPanel({
  defaultPreference,
  concertName,
}: {
  defaultPreference?: Partial<AlertPreference>
  concertName?: string
}) {
  const t = useTranslations("alerts")
  const tCommon = useTranslations("common.buttons")
  const [settings, setSettings] = useState({
    remind24h: defaultPreference?.remind24h ?? true,
    remind1h: defaultPreference?.remind1h ?? true,
    remind10m: defaultPreference?.remind10m ?? false,
    emailEnabled: defaultPreference?.emailEnabled ?? true,
  })
  const [saveState, setSaveState] = useState<"idle" | "success" | "duplicate">("idle")
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(() =>
    defaultPreference ? serializeSettings(settings) : null,
  )

  const reminderLabels = useMemo(
    () =>
      [
        { key: "remind24h", label: t("remind24h") },
        { key: "remind1h", label: t("remind1h") },
        { key: "remind10m", label: t("remind10m") },
      ] as Array<{ key: ReminderKey; label: string }>,
    [t],
  )

  const feedback =
    saveState === "success" ? t("success") : saveState === "duplicate" ? t("duplicate") : null

  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2 text-accent">
          <BellIcon className="size-4" />
          <CardTitle>{t("panelTitle")}</CardTitle>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          {concertName ? `${concertName} · ${t("panelBody")}` : t("panelBody")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {reminderLabels.map((reminder) => {
            const active = settings[reminder.key]

            return (
              <button
                key={reminder.key}
                type="button"
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    [reminder.key]: !current[reminder.key],
                  }))
                }
                className={cn(
                  "rounded-full border px-3 py-2 text-sm transition",
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border/70 text-muted-foreground hover:border-accent/50 hover:text-foreground",
                )}
              >
                {reminder.label}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() =>
            setSettings((current) => ({
              ...current,
              emailEnabled: !current.emailEnabled,
            }))
          }
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
            settings.emailEnabled
              ? "border-accent/45 bg-accent/10"
              : "border-border/70 bg-background/40",
          )}
        >
          <span className="flex items-center gap-2">
            <MailIcon className="size-4" />
            {t("emailEnabled")}
          </span>
          <span className="text-muted-foreground">
            {settings.emailEnabled ? t("emailOn") : t("emailOff")}
          </span>
        </button>
        <div className="rounded-2xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground">
          {t("pushSoon")}
        </div>
        <Button
          className="w-full"
          onClick={() => {
            const snapshot = serializeSettings(settings)

            if (snapshot === savedSnapshot) {
              setSaveState("duplicate")
              return
            }

            setSavedSnapshot(snapshot)
            setSaveState("success")
          }}
        >
          {tCommon("saveAlerts")}
        </Button>
        {feedback ? <p className="text-sm text-accent">{feedback}</p> : null}
      </CardContent>
    </Card>
  )
}
