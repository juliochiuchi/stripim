import * as React from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { Search, Sparkles } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { StreamCategory } from "@/types/streaming/stream"
import { cn } from "@/lib/utils"

type HomeTab = "for-you" | "live" | "videos"
type HomeCategory = "all" | StreamCategory

export function Topbar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const currentSearch = location.search as {
    tab?: HomeTab
    q?: string
    category?: HomeCategory
  }

  const tab = currentSearch.tab ?? "for-you"
  const q = currentSearch.q ?? ""

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-white/10 bg-black/25 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1550px] items-center gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <span className="grid size-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Sparkles className="size-4 text-white/80" />
          </span>
          <div className="text-sm font-semibold tracking-wide text-white/90">
            Stripim
          </div>
        </div>

        <div className="hidden lg:block">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              const nextTab = v as HomeTab
              void navigate({
                to: "/",
                search: { ...currentSearch, tab: nextTab },
              })
            }}
          >
            <TabsList className="bg-white/5 border-white/10 text-white/70">
              <TabsTrigger value="for-you">Para você</TabsTrigger>
              <TabsTrigger value="live">Ao vivo</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <form
          className="relative ml-auto w-full max-w-[520px]"
          onSubmit={(e) => {
            e.preventDefault()
            const next = inputRef.current?.value?.trim() ?? ""
            void navigate({
              to: "/",
              search: { ...currentSearch, q: next ? next : undefined },
            })
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <Input
            ref={inputRef}
            defaultValue={q}
            key={q}
            placeholder="Buscar live, canal, categoria..."
            className="h-10 border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-white/20"
          />
        </form>

      </div>
    </header>
  )
}
