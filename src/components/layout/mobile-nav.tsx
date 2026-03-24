"use client"

import { MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, stripLocaleSegment } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "./locale-switcher"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { href: "/", key: "home" },
  { href: "/artists", key: "artists" },
  { href: "/concerts", key: "concerts" },
  { href: "/my", key: "my" },
] as const

export function MobileNav() {
  const pathname = usePathname()
  const normalizedPath = stripLocaleSegment(pathname)
  const tCommon = useTranslations("common")
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={tCommon("buttons.menu")}
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <MenuIcon className="size-4" />
      </SheetTrigger>
      <SheetContent
        closeLabel={tCommon("buttons.close")}
        className="glass-panel surface-grid border-border/70"
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>{tCommon("brand")}</SheetTitle>
          <SheetDescription>{tCommon("tagline")}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4 py-2">
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
                  "rounded-2xl px-4 py-3 text-base font-medium transition hover:bg-muted/70",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => setOpen(false)}
              >
                {tCommon(`navigation.${item.key}`)}
              </Link>
            )
          })}
        </div>
        <div className="border-t border-border/60 px-4 py-4">
          <div className="space-y-3">
            <ThemeToggle className="w-full justify-center" />
            <LocaleSwitcher className="justify-between" />
          </div>
          <Button className="mt-4 w-full">{tCommon("buttons.signIn")}</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
