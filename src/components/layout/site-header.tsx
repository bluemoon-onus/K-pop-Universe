"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { buttonVariants } from "@/components/ui/button"
import { Link, stripLocaleSegment } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "./locale-switcher"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { href: "/", key: "home" },
  { href: "/artists", key: "artists" },
  { href: "/concerts", key: "concerts" },
  { href: "/my", key: "my" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const normalizedPath = stripLocaleSegment(pathname)
  const t = useTranslations("common")

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-heading font-bold text-primary-foreground shadow-lg shadow-primary/20 transition group-hover:-translate-y-0.5">
              KH
            </span>
            <div className="hidden sm:block">
              <p className="font-heading text-sm font-semibold tracking-wide text-foreground">
                {t("brand")}
              </p>
              <p className="text-xs text-muted-foreground">{t("tagline")}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label={t("navigation.mainNav")}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? normalizedPath === "/"
                  : normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground",
                    isActive && "bg-secondary text-foreground",
                  )}
                >
                  {t(`navigation.${item.key}`)}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LocaleSwitcher />
          <Link href="/my" className={buttonVariants({ variant: "outline" })}>
            {t("buttons.signIn")}
          </Link>
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
