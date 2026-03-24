"use client"

import {
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ToastTone = "success" | "info" | "warning"

type ToastInput = {
  title: string
  description?: string
  tone?: ToastTone
}

type ToastItem = ToastInput & {
  id: string
  tone: ToastTone
}

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void
}

const toneStyles: Record<
  ToastTone,
  { icon: typeof InfoIcon; className: string; iconClassName: string }
> = {
  success: {
    icon: CheckCircle2Icon,
    className: "border-emerald-500/25 bg-emerald-500/10",
    iconClassName: "text-emerald-500",
  },
  info: {
    icon: InfoIcon,
    className: "border-accent/30 bg-accent/10",
    iconClassName: "text-accent",
  },
  warning: {
    icon: TriangleAlertIcon,
    className: "border-primary/30 bg-primary/10",
    iconClassName: "text-primary",
  },
}

const ToastContext = createContext<ToastContextValue | null>(null)

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `toast-${Date.now()}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common.toast")
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function dismissToast(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  function pushToast(toast: ToastInput) {
    const nextToast: ToastItem = {
      id: createToastId(),
      tone: toast.tone ?? "info",
      ...toast,
    }

    setToasts((current) => [...current, nextToast].slice(-4))
    window.setTimeout(() => dismissToast(nextToast.id), 2800)
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:justify-end">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => {
            const tone = toneStyles[toast.tone]
            const Icon = tone.icon

            return (
              <div
                key={toast.id}
                className={cn(
                  "glass-panel pointer-events-auto animate-in slide-in-from-bottom-3 fade-in-0 rounded-[1.5rem] border p-4 shadow-2xl duration-200",
                  tone.className,
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5", tone.iconClassName)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => dismissToast(toast.id)}
                    className="shrink-0"
                  >
                    <XIcon className="size-3.5" />
                    <span className="sr-only">{t("dismiss")}</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}
