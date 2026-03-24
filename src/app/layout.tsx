import type { Metadata, Viewport } from "next"
import { getLocaleDirection } from "@/lib/locale-utils"
import { getSiteUrl } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d2a" },
  ],
  colorScheme: "dark light",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  const { locale } = await params
  const activeLocale = locale ?? "en"

  return (
    <html
      lang={activeLocale}
      dir={getLocaleDirection(activeLocale)}
      suppressHydrationWarning
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
