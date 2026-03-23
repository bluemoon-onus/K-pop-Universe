import { useTranslations } from "next-intl"
import { InboxIcon } from "lucide-react"
import { ConcertCard } from "./concert-card"
import { StatePanel } from "@/components/common/state-panel"
import type { Concert } from "@/types"

export function ConcertList({
  title,
  description,
  concerts,
}: {
  title: string
  description?: string
  concerts: Concert[]
}) {
  const t = useTranslations("common.states")

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {concerts.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      ) : (
        <StatePanel
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          icon={<InboxIcon className="size-5" />}
        />
      )}
    </section>
  )
}
