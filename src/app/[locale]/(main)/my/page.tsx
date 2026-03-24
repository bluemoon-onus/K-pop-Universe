import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import MyPageClient from "./my-page-client"
import { createPageMetadata } from "@/lib/site"
import type { AppLocale } from "@i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tAlerts = await getTranslations({ locale, namespace: "alerts" })

  return createPageMetadata({
    locale: locale as AppLocale,
    title: tAlerts("title"),
    description: tAlerts("subtitle"),
    path: "/my",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  })
}

export default function MyPage() {
  return <MyPageClient />
}
