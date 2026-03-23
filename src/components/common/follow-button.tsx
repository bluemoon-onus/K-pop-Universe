"use client"

import { HeartIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useUserPreferences } from "@/components/layout/user-preferences-provider"

export function FollowButton({
  artistId,
}: {
  artistId: string
}) {
  const t = useTranslations("common.buttons")
  const { isArtistFollowed, toggleArtistFollow } = useUserPreferences()
  const followed = isArtistFollowed(artistId)

  return (
    <Button
      variant={followed ? "secondary" : "outline"}
      onClick={() => toggleArtistFollow(artistId)}
    >
      <HeartIcon className="size-4" />
      {followed ? t("following") : t("follow")}
    </Button>
  )
}
