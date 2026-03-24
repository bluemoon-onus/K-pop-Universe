import type { Artist } from "@/types"

export const artistGradientById: Record<string, string> = {
  bts: "from-chart-5/65 via-primary/35 to-chart-2/30",
  seventeen: "from-primary/70 via-accent/30 to-chart-4/28",
  aespa: "from-accent/70 via-chart-5/32 to-primary/26",
  blackpink: "from-primary/68 via-chart-5/34 to-accent/24",
  twice: "from-chart-4/65 via-primary/28 to-accent/24",
  straykids: "from-chart-3/60 via-accent/30 to-primary/24",
  gidle: "from-chart-5/62 via-primary/30 to-accent/24",
  ive: "from-primary/66 via-chart-4/28 to-accent/20",
  newjeans: "from-accent/60 via-chart-2/28 to-chart-4/24",
  lesserafim: "from-chart-5/62 via-primary/28 to-accent/22",
}

export const artistSquareFocusById: Record<string, string> = {
  bts: "object-[center_18%]",
  seventeen: "object-[center_20%]",
  aespa: "object-[center_18%]",
  blackpink: "object-[center_15%]",
  twice: "object-[center_18%]",
  straykids: "object-[center_16%]",
  gidle: "object-[center_16%]",
  ive: "object-[center_18%]",
  newjeans: "object-[center_16%]",
  lesserafim: "object-[center_18%]",
}

export const artistLandscapeFocusById: Record<string, string> = {
  bts: "object-[center_20%]",
  seventeen: "object-[center_16%]",
  aespa: "object-[center_18%]",
  blackpink: "object-[center_14%]",
  twice: "object-[center_18%]",
  straykids: "object-[center_18%]",
  gidle: "object-[center_18%]",
  ive: "object-[center_14%]",
  newjeans: "object-[center_14%]",
  lesserafim: "object-[center_18%]",
}

export function hasArtistImage(artist: Pick<Artist, "imageUrl"> | null) {
  return Boolean(artist?.imageUrl && !artist.imageUrl.includes("placehold.co"))
}
