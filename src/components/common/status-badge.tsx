import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ConcertStatus } from "@/types"

const statusStyles: Record<ConcertStatus, string> = {
  upcoming: "border-accent/35 bg-accent/12 text-accent",
  open: "border-chart-3/35 bg-chart-3/15 text-chart-3",
  sold_out: "border-primary/35 bg-primary/14 text-primary",
  ended: "border-border bg-muted text-muted-foreground",
  cancelled: "border-destructive/35 bg-destructive/15 text-destructive",
}

export function StatusBadge({ status }: { status: ConcertStatus }) {
  const t = useTranslations("common")

  return (
    <Badge variant="outline" className={cn(statusStyles[status])}>
      {t(`status.${status}`)}
    </Badge>
  )
}
