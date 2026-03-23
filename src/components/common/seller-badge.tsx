import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ConcertSeller } from "@/types"

export function SellerBadge({ seller }: { seller: ConcertSeller }) {
  const t = useTranslations("common")

  return <Badge variant="outline">{t(`sellers.${seller}`)}</Badge>
}
