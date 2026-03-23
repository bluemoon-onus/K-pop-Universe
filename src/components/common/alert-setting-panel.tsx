"use client"

import { BellIcon, MailIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useReducer } from "react"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ReminderKey = "remind24h" | "remind1h" | "remind10m"
type AlertDraft = {
  remind24h: boolean
  remind1h: boolean
  remind10m: boolean
  emailEnabled: boolean
}

type AlertPanelState = {
  settings: AlertDraft
  saveState: "idle" | "success" | "duplicate"
  savedSnapshot: string
}

type AlertPanelAction =
  | {
      type: "hydrate"
      settings: AlertDraft
      savedSnapshot: string
    }
  | { type: "toggle-reminder"; key: ReminderKey }
  | { type: "toggle-email" }
  | { type: "duplicate" }
  | { type: "saved"; savedSnapshot: string }

function reducer(state: AlertPanelState, action: AlertPanelAction): AlertPanelState {
  if (action.type === "hydrate") {
    return {
      settings: action.settings,
      saveState: "idle",
      savedSnapshot: action.savedSnapshot,
    }
  }

  if (action.type === "toggle-reminder") {
    return {
      ...state,
      settings: {
        ...state.settings,
        [action.key]: !state.settings[action.key],
      },
    }
  }

  if (action.type === "toggle-email") {
    return {
      ...state,
      settings: {
        ...state.settings,
        emailEnabled: !state.settings.emailEnabled,
      },
    }
  }

  if (action.type === "duplicate") {
    return {
      ...state,
      saveState: "duplicate",
    }
  }

  if (action.type === "saved") {
    return {
      ...state,
      saveState: "success",
      savedSnapshot: action.savedSnapshot,
    }
  }

  return state
}

export function AlertSettingPanel({
  concertId,
  concertName,
  disabled = false,
}: {
  concertId: string
  concertName?: string
  disabled?: boolean
}) {
  const t = useTranslations("alerts")
  const tCommon = useTranslations("common.buttons")
  const { getAlertPreference, saveAlertPreference } = useUserPreferences()
  const preference = getAlertPreference(concertId)
  const hydratedSettings = {
    remind24h: preference?.remind24h ?? true,
    remind1h: preference?.remind1h ?? true,
    remind10m: preference?.remind10m ?? false,
    emailEnabled: preference?.emailEnabled ?? true,
  }
  const preferenceSnapshot = JSON.stringify(hydratedSettings)
  const [state, dispatch] = useReducer(reducer, {
    settings: hydratedSettings,
    saveState: "idle",
    savedSnapshot: preferenceSnapshot,
  })

  useEffect(() => {
    dispatch({
      type: "hydrate",
      settings: JSON.parse(preferenceSnapshot) as AlertDraft,
      savedSnapshot: preferenceSnapshot,
    })
  }, [concertId, preferenceSnapshot])

  const reminderLabels: Array<{ key: ReminderKey; label: string }> = [
    { key: "remind24h", label: t("remind24h") },
    { key: "remind1h", label: t("remind1h") },
    { key: "remind10m", label: t("remind10m") },
  ]

  const feedback =
    state.saveState === "success"
      ? t("success")
      : state.saveState === "duplicate"
        ? t("duplicate")
        : null

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
            const active = state.settings[reminder.key]

            return (
              <button
                key={reminder.key}
                type="button"
                disabled={disabled}
                onClick={() => dispatch({ type: "toggle-reminder", key: reminder.key })}
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
          disabled={disabled}
          onClick={() => dispatch({ type: "toggle-email" })}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
            state.settings.emailEnabled
              ? "border-accent/45 bg-accent/10"
              : "border-border/70 bg-background/40",
          )}
        >
          <span className="flex items-center gap-2">
            <MailIcon className="size-4" />
            {t("emailEnabled")}
          </span>
          <span className="text-muted-foreground">
            {state.settings.emailEnabled ? t("emailOn") : t("emailOff")}
          </span>
        </button>
        <div className="rounded-2xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground">
          {t("pushSoon")}
        </div>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => {
            const snapshot = JSON.stringify(state.settings)

            if (snapshot === state.savedSnapshot) {
              dispatch({ type: "duplicate" })
              return
            }

            saveAlertPreference(concertId, {
              ...state.settings,
              pushEnabled: false,
            })
            dispatch({ type: "saved", savedSnapshot: snapshot })
          }}
        >
          {tCommon("saveAlerts")}
        </Button>
        {feedback ? <p className="text-sm text-accent">{feedback}</p> : null}
      </CardContent>
    </Card>
  )
}
