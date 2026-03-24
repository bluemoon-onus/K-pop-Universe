"use client"

import { MoonStarIcon, SunMediumIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useUserPreferences, type AppTheme } from "@/components/layout/user-preferences-provider"
import { cn } from "@/lib/utils"

const themeOptions: Array<{
  value: AppTheme
  icon: typeof SunMediumIcon
}> = [
  { value: "light", icon: SunMediumIcon },
  { value: "dark", icon: MoonStarIcon },
]

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common.theme")
  const { theme, setTheme } = useUserPreferences()

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 p-1 text-sm shadow-sm backdrop-blur-sm",
        className,
      )}
      role="group"
      aria-label={t("label")}
    >
      {themeOptions.map((option) => {
        const Icon = option.icon
        const active = theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
            aria-pressed={active}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{t(option.value)}</span>
            <span className="sr-only sm:hidden">{t(option.value)}</span>
          </button>
        )
      })}
    </div>
  )
}
