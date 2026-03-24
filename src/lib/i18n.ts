import { createNavigation } from "next-intl/navigation"
import { routing } from "@i18n/routing"
export {
  getLocaleDirection,
  stripLocaleSegment,
  switchLocaleInPath,
} from "./locale-utils"

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
