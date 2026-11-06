import * as React from "react"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { LayoutDashboard, LogIn, MonitorPlay, Search, Sparkles } from "lucide-react"

import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { getStoredUser } from "@/services/auth/auth.service"
import type { StreamCategory } from "@/types/streaming/stream"
import { cn } from "@/lib/utils"

type HomeTab = "for-you" | "live" | "videos"
type HomeCategory = "all" | StreamCategory

const YOUTUBE_CHANNEL_URL = "https://youtube.com/ipimacaubal"

export function Topbar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const currentSearch = location.search as {
    tab?: HomeTab
    q?: string
    category?: HomeCategory
  }

  const q = currentSearch.q ?? ""

  // Reavalia a sessão a cada render/navegação, refletindo login/logout.
  const user = getStoredUser()

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-white/10 bg-black/25 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1550px] items-center gap-3 px-4 py-3 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <span className="grid size-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Sparkles className="size-4 text-white/80" />
          </span>
          <div className="text-sm font-semibold tracking-wide text-white/90">
            Stripim
          </div>
        </div>

        <form
          className="relative w-full max-w-[520px] lg:max-w-[640px]"
          onSubmit={(e) => {
            e.preventDefault()
            const next = inputRef.current?.value?.trim() ?? ""
            if (!next) return
            void navigate({ to: "/search", search: { q: next } as never })
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

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Canal no YouTube"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 shrink-0 gap-2 border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <MonitorPlay className="size-4" />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          {user ? (
            <Link
              to="/admin"
              title="Painel administrativo"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-10 shrink-0 gap-2",
              )}
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Painel</span>
            </Link>
          ) : (
            <Link
              to="/login"
              title="Acesso administrativo"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-10 shrink-0 gap-2",
              )}
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}
