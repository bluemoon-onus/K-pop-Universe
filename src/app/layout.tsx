import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "K-pop Ticket Hub",
  description:
    "A global K-pop concert discovery and ticket-opening alert platform with official seller links only.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
