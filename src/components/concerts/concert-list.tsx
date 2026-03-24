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
  cardVariant = "default",
}: {
  title: string
  description?: string
  concerts: Concert[]
  isLoading?: boolean
  action?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  cardVariant?: "default" | "spotlight"
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
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`${title}-${index}`}
              className="glass-panel rounded-[2rem] border border-border/60 p-5"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Skeleton className="size-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28 rounded-full" />
                  <Skeleton className="h-7 w-3/4 rounded-full" />
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-16 rounded-[1.25rem]" />
                <Skeleton className="h-16 rounded-[1.25rem]" />
                <Skeleton className="h-16 rounded-[1.25rem]" />
                <Skeleton className="h-16 rounded-[1.25rem]" />
              </div>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : concerts.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} variant={cardVariant} />
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
