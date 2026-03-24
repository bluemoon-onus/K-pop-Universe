import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("shimmer rounded-[1.5rem] bg-muted/80", className)}
      {...props}
    />
  )
}

export { Skeleton }
