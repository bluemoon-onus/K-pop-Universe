"use client"

import { HeartIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useToast } from "@/components/layout/toast-provider"
import { Button } from "@/components/ui/button"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"
import { cn } from "@/lib/utils"

export function FollowButton({
  artistId,
}: {
  artistId: string
}) {
  const t = useTranslations("common.buttons")
  const tToast = useTranslations("common.toast")
  const { isArtistFollowed, toggleArtistFollow } = useUserPreferences()
  const { pushToast } = useToast()
  const [isCelebrating, setIsCelebrating] = useState(false)
  const followed = isArtistFollowed(artistId)

  return (
    <Button
      variant={followed ? "secondary" : "outline"}
      className={cn(
        "min-w-28",
        followed && "border-primary/25 bg-primary/12 text-primary hover:bg-primary/18",
        isCelebrating && "scale-[1.03]",
      )}
      onClick={() => {
        const nextFollowed = !followed

        toggleArtistFollow(artistId)
        if (nextFollowed) {
          setIsCelebrating(true)
          window.setTimeout(() => setIsCelebrating(false), 280)
        }

        pushToast({
          tone: nextFollowed ? "success" : "info",
          title: nextFollowed ? tToast("followed") : tToast("unfollowed"),
        })
      }}
    >
      <HeartIcon
        className={cn(
          "size-4 transition-transform duration-200",
          followed && "fill-current",
          isCelebrating && "scale-125",
        )}
      />
      {followed ? t("following") : t("follow")}
    </Button>
  )
}
