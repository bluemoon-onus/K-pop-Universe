"use client"

import { useTranslations } from "next-intl"
import { sellerLinks } from "@/lib/constants"

const footerSellers = ["NOL", "INTERPARK", "TICKETLINK", "YES24", "WEVERSE"] as const

export function SiteFooter() {
  const t = useTranslations("common")

  return (
    <footer className="border-t border-border/60 bg-foreground/[0.03]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-accent">
            {t("brand")}
          </p>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {t("footer.disclaimerTitle")}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {t("footer.disclaimerBody")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("footer.sellerLinks")}
            </p>
            <div className="flex flex-wrap gap-2">
              {footerSellers.map((seller) => (
                <a
                  key={seller}
                  href={sellerLinks[seller]}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border/70 px-3 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent"
                >
                  {t(`sellers.${seller}`)}
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("labels.dataFreshness")}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">{t("footer.freshness")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
