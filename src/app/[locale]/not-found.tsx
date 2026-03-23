import { AlertTriangleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { StatePanel } from "@/components/common/state-panel"
import { Link } from "@/lib/i18n"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("common")

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <StatePanel
        title={t("states.emptyTitle")}
        description={t("states.emptyDescription")}
        icon={<AlertTriangleIcon className="size-5" />}
        action={
          <Link href="/concerts" className={buttonVariants({ variant: "default" })}>
            {t("buttons.browseConcerts")}
          </Link>
        }
      />
    </div>
  )
}
