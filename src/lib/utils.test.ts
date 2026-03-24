import { mockArtists } from "@/data/mock-artists"
import {
  formatConcertPriceRangeLabel,
  formatCurrencyLabel,
  getArtistDisplayName,
  getArtistInitials,
} from "./utils"

describe("utility formatting", () => {
  it("builds the bilingual artist display label", () => {
    expect(getArtistDisplayName(mockArtists[0])).toBe("방탄소년단 / BTS")
  })

  it("derives stable artist initials from the English name", () => {
    expect(getArtistInitials(mockArtists[9])).toBe("LS")
  })

  it("formats price ranges in the current locale", () => {
    expect(
      formatConcertPriceRangeLabel(
        [
          { amount: 120, currency: "USD" },
          { amount: 275, currency: "USD" },
        ],
        "en",
      ),
    ).toBe("$120 - $275")
  })

  it("formats a single currency label without decimals", () => {
    expect(formatCurrencyLabel(165000, "KRW", "en")).toBe("₩165,000")
  })
})
