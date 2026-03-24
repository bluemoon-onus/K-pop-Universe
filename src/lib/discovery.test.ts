import { mockArtists } from "@/data/mock-artists"
import { mockConcerts } from "@/data/mock-concerts"
import {
  artistMatchesQuery,
  defaultConcertFilters,
  filterConcerts,
  getActiveConcertFilterCount,
  groupConcertsByTiming,
} from "./discovery"

describe("discovery helpers", () => {
  it("matches artist aliases and bilingual names", () => {
    expect(artistMatchesQuery(mockArtists[1], "svt")).toBe(true)
    expect(artistMatchesQuery(mockArtists[0], "방탄")).toBe(true)
    expect(artistMatchesQuery(mockArtists[0], "not-a-match")).toBe(false)
  })

  it("filters concerts across multiple dimensions", () => {
    const results = filterConcerts(mockConcerts, {
      ...defaultConcertFilters,
      seller: "INTERPARK",
      status: "sold_out",
    })

    expect(results.length).toBeGreaterThan(0)
    expect(results.every((concert) => concert.officialSeller === "INTERPARK")).toBe(true)
    expect(results.every((concert) => concert.status === "sold_out")).toBe(true)
  })

  it("counts active filters consistently", () => {
    expect(
      getActiveConcertFilterCount({
        ...defaultConcertFilters,
        query: "seoul",
        artistIds: ["bts"],
        city: "Seoul",
      }),
    ).toBe(3)
  })

  it("surfaces imminent openings in the openingSoon group", () => {
    const grouped = groupConcertsByTiming(mockConcerts)

    expect(grouped.openingSoon.some((concert) => concert.id === "bts-permission-to-dance-seoul")).toBe(true)
  })
})
