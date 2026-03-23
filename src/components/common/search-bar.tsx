import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SearchBar({
  placeholder,
  className,
}: {
  placeholder: string
  className?: string
}) {
  const t = useTranslations("common")

  return (
    <form className={cn("glass-panel flex items-center gap-3 rounded-3xl border border-border/70 p-2", className)}>
      <div className="flex flex-1 items-center gap-3 px-3">
        <SearchIcon className="size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <Button className="rounded-2xl px-4">{t("buttons.search")}</Button>
    </form>
  )
}
