"use client"

import { useTranslations } from "next-intl"
import { InboxIcon } from "lucide-react"
import { ConcertCard } from "./concert-card"
import { StatePanel } from "@/components/common/state-panel"
import { Skeleton } from "@/components/ui/skeleton"
import type { Concert } from "@/types"

export function ConcertList({
  title,
  description,
  concerts,
  isLoading = false,
  action,
  emptyTitle,
  emptyDescription,
}: {
  title: string
  description?: string
  concerts: Concert[]
  isLoading?: boolean
  action?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
}) {
  const t = useTranslations("common.states")

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`${title}-${index}`} className="h-72 rounded-[2rem]" />
          ))}
        </div>
      ) : concerts.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      ) : (
        <StatePanel
          title={emptyTitle ?? t("emptyTitle")}
          description={emptyDescription ?? t("emptyDescription")}
          icon={<InboxIcon className="size-5" />}
        />
      )}
    </section>
  )
}
