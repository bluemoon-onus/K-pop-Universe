import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

function createStorageMock() {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

const localStorageMock = createStorageMock()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  configurable: true,
})

Object.defineProperty(window, "sessionStorage", {
  value: createStorageMock(),
  configurable: true,
})

afterEach(() => {
  cleanup()
  localStorageMock.clear()
  document.documentElement.className = ""
  document.documentElement.removeAttribute("style")
})
