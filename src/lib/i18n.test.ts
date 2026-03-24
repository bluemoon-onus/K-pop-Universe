import {
  getLocaleDirection,
  stripLocaleSegment,
  switchLocaleInPath,
} from "./locale-utils"

describe("i18n helpers", () => {
  it("returns rtl only for arabic-style locales", () => {
    expect(getLocaleDirection("ar")).toBe("rtl")
    expect(getLocaleDirection("en")).toBe("ltr")
  })

  it("strips locale prefixes from pathnames", () => {
    expect(stripLocaleSegment("/ja/concerts/abc123")).toBe("/concerts/abc123")
    expect(stripLocaleSegment("/concerts")).toBe("/concerts")
  })

  it("switches or inserts locale prefixes", () => {
    expect(switchLocaleInPath("/en/concerts", "ko")).toBe("/ko/concerts")
    expect(switchLocaleInPath("/concerts", "ja")).toBe("/ja/concerts")
  })
})
