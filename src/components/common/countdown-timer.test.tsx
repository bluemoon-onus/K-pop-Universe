import { act, screen } from "@testing-library/react"
import { vi } from "vitest"
import { CountdownTimer } from "./countdown-timer"
import { renderWithProviders } from "@/test/test-utils"

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-24T00:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders a ticking countdown for upcoming targets", () => {
    renderWithProviders(
      <CountdownTimer targetDate={new Date("2026-03-24T02:30:00Z")} />,
    )

    expect(screen.getByText("02h 30m 00s")).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText("02h 29m 59s")).toBeInTheDocument()
  })

  it("shows the live label once the target time has passed", () => {
    renderWithProviders(
      <CountdownTimer targetDate={new Date("2026-03-23T23:59:00Z")} />,
    )

    expect(screen.getByText("Open now")).toBeInTheDocument()
  })
})
