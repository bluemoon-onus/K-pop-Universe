"use client"

import { differenceInSeconds } from "date-fns"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

function formatCountdown(totalSeconds: number, labels: Record<string, string>) {
  if (totalSeconds <= 0) {
    return labels.live
  }

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const paddedHours = String(hours).padStart(2, "0")
  const paddedMinutes = String(minutes).padStart(2, "0")
  const paddedSeconds = String(seconds).padStart(2, "0")

  if (days > 0) {
    return `${days}${labels.days} ${paddedHours}${labels.hours} ${paddedMinutes}${labels.minutes}`
  }

  return `${paddedHours}${labels.hours} ${paddedMinutes}${labels.minutes} ${paddedSeconds}${labels.seconds}`
}

export function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
  const t = useTranslations("common.countdown")
  const target = useMemo(
    () => (typeof targetDate === "string" ? new Date(targetDate) : targetDate),
    [targetDate],
  )
  const [secondsLeft, setSecondsLeft] = useState(() => differenceInSeconds(target, new Date()))
  const isUrgent = secondsLeft > 0 && secondsLeft <= 60 * 60 * 24

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(differenceInSeconds(target, new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [target])

  const formattedText = formatCountdown(secondsLeft, {
    days: t("days"),
    hours: t("hours"),
    minutes: t("minutes"),
    seconds: t("seconds"),
    live: t("live"),
  })

  return (
    <span
      role="timer"
      aria-label={`${t("ariaLabel")}: ${formattedText}`}
      aria-live="polite"
      aria-atomic="true"
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        isUrgent
          ? "border-primary/30 bg-primary/10 text-primary shadow-lg shadow-primary/10"
          : "border-accent/25 bg-accent/10 text-accent"
      }`}
    >
      {formattedText}
    </span>
  )
}
