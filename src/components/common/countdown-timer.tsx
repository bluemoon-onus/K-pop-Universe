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

  if (days > 0) {
    return `${days}${labels.days} ${hours}${labels.hours}`
  }

  if (hours > 0) {
    return `${hours}${labels.hours} ${minutes}${labels.minutes}`
  }

  return `${Math.max(minutes, 0)}${labels.minutes}`
}

export function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
  const t = useTranslations("common.countdown")
  const target = useMemo(
    () => (typeof targetDate === "string" ? new Date(targetDate) : targetDate),
    [targetDate],
  )
  const [secondsLeft, setSecondsLeft] = useState(() => differenceInSeconds(target, new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(differenceInSeconds(target, new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [target])

  return (
    <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      {formatCountdown(secondsLeft, {
        days: t("days"),
        hours: t("hours"),
        minutes: t("minutes"),
        live: t("live"),
      })}
    </span>
  )
}
