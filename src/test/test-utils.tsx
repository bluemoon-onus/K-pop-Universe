import { render, type RenderOptions } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { type ReactElement } from "react"
import { AppProviders } from "@/components/layout/app-providers"
import messages from "@/messages/en.json"

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AppProviders>{ui}</AppProviders>
    </NextIntlClientProvider>,
    options,
  )
}
