import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { AppProviders } from "@/components/layout/app-providers"
import { createPageMetadata, getBrandName } from "@/lib/site"
import { locales, isValidLocale } from "@i18n/routing"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: "common.metadata" })
  const pageMetadata = createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
  })

  return {
    ...pageMetadata,
    title: {
      default: t("title"),
      template: `%s | ${getBrandName()}`,
    },
    applicationName: getBrandName(),
    category: "entertainment",
    other: {
      "og:site_name": getBrandName(),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>
        {/* TODO: Mount Vercel Analytics and Sentry providers once production envs are ready. */}
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </AppProviders>
    </NextIntlClientProvider>
  )
}
