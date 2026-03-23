"use client"

import { AlertTriangleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { StatePanel } from "@/components/common/state-panel"

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("common")

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <StatePanel
        title={t("states.errorTitle")}
        description={t("states.errorDescription")}
        icon={<AlertTriangleIcon className="size-5" />}
        action={<Button onClick={() => reset()}>{t("buttons.retry")}</Button>}
      />
    </div>
  )
}
