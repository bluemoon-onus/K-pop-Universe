import { LoaderCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { StatePanel } from "@/components/common/state-panel"

export default function MainLoading() {
  const t = useTranslations("common.states")

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <StatePanel
        title={t("loadingTitle")}
        description={t("loadingDescription")}
        icon={<LoaderCircleIcon className="size-5 animate-spin" />}
      />
    </div>
  )
}
