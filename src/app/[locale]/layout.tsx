import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { AppProviders } from "@/components/layout/app-providers"
import { getLocaleDirection } from "@/lib/i18n"
import { locales, type AppLocale } from "@i18n/routing"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as AppLocale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AppProviders>
        <div dir={getLocaleDirection(locale)} className="flex min-h-screen flex-col">
          {children}
        </div>
      </AppProviders>
    </NextIntlClientProvider>
  )
}
