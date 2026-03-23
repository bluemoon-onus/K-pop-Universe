"use client"

import { HeartIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function FollowButton({
  defaultFollowed = false,
}: {
  defaultFollowed?: boolean
}) {
  const t = useTranslations("common.buttons")
  const [followed, setFollowed] = useState(defaultFollowed)

  // TODO: Replace local toggle state with an authenticated follow mutation when auth is connected.
  return (
    <Button
      variant={followed ? "secondary" : "outline"}
      onClick={() => setFollowed((current) => !current)}
    >
      <HeartIcon className="size-4" />
      {followed ? t("following") : t("follow")}
    </Button>
  )
}
