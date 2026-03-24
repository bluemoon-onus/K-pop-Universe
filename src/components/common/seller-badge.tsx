import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ConcertSeller } from "@/types"
import { cn } from "@/lib/utils"

const sellerStyles: Record<
  ConcertSeller,
  { dot: string; className: string }
> = {
  NOL: {
    dot: "bg-[#ff6a3d]",
    className: "border-[#ff6a3d]/30 bg-[#ff6a3d]/10 text-[#ff6a3d]",
  },
  INTERPARK: {
    dot: "bg-[#4c6fff]",
    className: "border-[#4c6fff]/30 bg-[#4c6fff]/10 text-[#4c6fff]",
  },
  TICKETLINK: {
    dot: "bg-[#11b37a]",
    className: "border-[#11b37a]/30 bg-[#11b37a]/10 text-[#11b37a]",
  },
  YES24: {
    dot: "bg-[#7c4dff]",
    className: "border-[#7c4dff]/30 bg-[#7c4dff]/10 text-[#7c4dff]",
  },
  WEVERSE: {
    dot: "bg-[#00bcd4]",
    className: "border-[#00bcd4]/30 bg-[#00bcd4]/10 text-[#00bcd4]",
  },
  OTHER: {
    dot: "bg-foreground/55",
    className: "border-border/70 bg-muted/70 text-foreground",
  },
}

export function SellerBadge({ seller }: { seller: ConcertSeller }) {
  const t = useTranslations("common")
  const style = sellerStyles[seller]

  return (
    <Badge variant="outline" className={cn("border px-2.5 py-1", style.className)}>
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {t(`sellers.${seller}`)}
    </Badge>
  )
}
