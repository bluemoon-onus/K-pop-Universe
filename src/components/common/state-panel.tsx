import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatePanel({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <Card className="glass-panel border border-border/60">
      <CardHeader className="gap-3">
        {icon ? <div className="text-accent">{icon}</div> : null}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  )
}
