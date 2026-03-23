"use client"

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react"
import { mockAlertPreferences, mockArtistFollows, mockUser } from "@/data/mock-concerts"
import type { AlertPreference } from "@/types"

const STORAGE_KEYS = {
  follows: "kpop-ticket-hub:follows",
  alerts: "kpop-ticket-hub:alerts",
  session: "kpop-ticket-hub:session",
} as const

type SavedSession = {
  isLoggedIn: boolean
  email: string
  timeZone: string
}

type UserPreferencesState = {
  hasHydrated: boolean
  isLoggedIn: boolean
  email: string
  timeZone: string
  followedArtistIds: string[]
  alertPreferences: AlertPreference[]
}

type UserPreferencesAction =
  | { type: "hydrate"; payload: SavedSession & Pick<UserPreferencesState, "followedArtistIds" | "alertPreferences"> }
  | { type: "toggle-artist-follow"; artistId: string }
  | {
      type: "save-alert-preference"
      concertId: string
      nextPreference: Pick<
        AlertPreference,
        "remind24h" | "remind1h" | "remind10m" | "emailEnabled" | "pushEnabled"
      >
    }
  | { type: "set-email"; email: string }
  | { type: "set-timezone"; timeZone: string }
  | { type: "set-login"; isLoggedIn: boolean }

type UserPreferencesContextValue = {
  hasHydrated: boolean
  isLoggedIn: boolean
  email: string
  timeZone: string
  followedArtistIds: string[]
  alertPreferences: AlertPreference[]
  isArtistFollowed: (artistId: string) => boolean
  getAlertPreference: (concertId: string) => AlertPreference | null
  toggleArtistFollow: (artistId: string) => void
  saveAlertPreference: (
    concertId: string,
    nextPreference: Pick<
      AlertPreference,
      "remind24h" | "remind1h" | "remind10m" | "emailEnabled" | "pushEnabled"
    >,
  ) => void
  setEmail: (nextEmail: string) => void
  setTimeZone: (nextTimeZone: string) => void
  signInDemo: () => void
  signOutDemo: () => void
}

const defaultFollowedArtistIds = mockArtistFollows.map((follow) => follow.artistId)
const defaultAlertPreferences = mockAlertPreferences.map((preference) => ({
  ...preference,
}))
const defaultState: UserPreferencesState = {
  hasHydrated: false,
  isLoggedIn: false,
  email: mockUser.email,
  timeZone: mockUser.timezone,
  followedArtistIds: defaultFollowedArtistIds,
  alertPreferences: defaultAlertPreferences,
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null)

function readStoredValue<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || mockUser.timezone
}

function createAlertId(concertId: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `alert-${concertId}-${crypto.randomUUID()}`
  }

  return `alert-${concertId}-${Date.now()}`
}

function reducer(
  state: UserPreferencesState,
  action: UserPreferencesAction,
): UserPreferencesState {
  if (action.type === "hydrate") {
    return {
      ...state,
      hasHydrated: true,
      isLoggedIn: action.payload.isLoggedIn,
      email: action.payload.email,
      timeZone: action.payload.timeZone,
      followedArtistIds: action.payload.followedArtistIds,
      alertPreferences: action.payload.alertPreferences,
    }
  }

  if (action.type === "toggle-artist-follow") {
    return {
      ...state,
      followedArtistIds: state.followedArtistIds.includes(action.artistId)
        ? state.followedArtistIds.filter((value) => value !== action.artistId)
        : [...state.followedArtistIds, action.artistId],
    }
  }

  if (action.type === "save-alert-preference") {
    const existing = state.alertPreferences.find(
      (preference) => preference.concertId === action.concertId,
    )

    return {
      ...state,
      alertPreferences: existing
        ? state.alertPreferences.map((preference) =>
            preference.concertId === action.concertId
              ? { ...preference, ...action.nextPreference }
              : preference,
          )
        : [
            ...state.alertPreferences,
            {
              id: createAlertId(action.concertId),
              userId: mockUser.id,
              concertId: action.concertId,
              ...action.nextPreference,
            },
          ],
    }
  }

  if (action.type === "set-email") {
    return {
      ...state,
      email: action.email,
    }
  }

  if (action.type === "set-timezone") {
    return {
      ...state,
      timeZone: action.timeZone,
    }
  }

  if (action.type === "set-login") {
    return {
      ...state,
      isLoggedIn: action.isLoggedIn,
    }
  }

  return state
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(() => {
    const session = readStoredValue<SavedSession>(STORAGE_KEYS.session, {
      isLoggedIn: false,
      email: mockUser.email,
      timeZone: getBrowserTimeZone(),
    })

    dispatch({
      type: "hydrate",
      payload: {
        ...session,
        followedArtistIds: readStoredValue(STORAGE_KEYS.follows, defaultFollowedArtistIds),
        alertPreferences: readStoredValue(STORAGE_KEYS.alerts, defaultAlertPreferences),
      },
    })
  }, [])

  useEffect(() => {
    if (!state.hasHydrated || typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.follows,
      JSON.stringify(state.followedArtistIds),
    )
  }, [state.followedArtistIds, state.hasHydrated])

  useEffect(() => {
    if (!state.hasHydrated || typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.alerts,
      JSON.stringify(state.alertPreferences),
    )
  }, [state.alertPreferences, state.hasHydrated])

  useEffect(() => {
    if (!state.hasHydrated || typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({
        isLoggedIn: state.isLoggedIn,
        email: state.email,
        timeZone: state.timeZone,
      } satisfies SavedSession),
    )
  }, [state.email, state.hasHydrated, state.isLoggedIn, state.timeZone])

  function isArtistFollowed(artistId: string) {
    return state.followedArtistIds.includes(artistId)
  }

  function getAlertPreference(concertId: string) {
    return (
      state.alertPreferences.find((preference) => preference.concertId === concertId) ??
      null
    )
  }

  function toggleArtistFollow(artistId: string) {
    dispatch({
      type: "toggle-artist-follow",
      artistId,
    })
  }

  function saveAlertPreference(
    concertId: string,
    nextPreference: Pick<
      AlertPreference,
      "remind24h" | "remind1h" | "remind10m" | "emailEnabled" | "pushEnabled"
    >,
  ) {
    dispatch({
      type: "save-alert-preference",
      concertId,
      nextPreference,
    })
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        hasHydrated: state.hasHydrated,
        isLoggedIn: state.isLoggedIn,
        email: state.email,
        timeZone: state.timeZone,
        followedArtistIds: state.followedArtistIds,
        alertPreferences: state.alertPreferences,
        isArtistFollowed,
        getAlertPreference,
        toggleArtistFollow,
        saveAlertPreference,
        setEmail: (email) => dispatch({ type: "set-email", email }),
        setTimeZone: (timeZone) => dispatch({ type: "set-timezone", timeZone }),
        signInDemo: () => dispatch({ type: "set-login", isLoggedIn: true }),
        signOutDemo: () => dispatch({ type: "set-login", isLoggedIn: false }),
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)

  if (!context) {
    throw new Error("useUserPreferences must be used within UserPreferencesProvider")
  }

  return context
}
