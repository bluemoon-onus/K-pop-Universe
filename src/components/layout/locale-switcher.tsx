"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { locales, type AppLocale } from "@i18n/routing"
import { cn } from "@/lib/utils"
import { switchLocaleInPath } from "@/lib/i18n"

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("common.localeSwitcher")

  return (
    <label className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        className="rounded-full border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale
          const nextPath = switchLocaleInPath(pathname, nextLocale)
          const query = searchParams.toString()

          router.replace(query ? `${nextPath}?${query}` : nextPath)
        }}
      >
        {locales.map((option) => (
          <option key={option} value={option}>
            {t(option)}
          </option>
        ))}
      </select>
    </label>
  )
}
