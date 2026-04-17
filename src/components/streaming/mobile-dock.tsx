import { Link, useRouterState } from "@tanstack/react-router"
import { Flame, Home, Radio, Search } from "lucide-react"

import { cn } from "@/lib/utils"

const dock = [
  { key: "home", label: "Início", icon: Home, to: "/", search: { tab: "for-you" } },
  { key: "live", label: "Ao vivo", icon: Radio, to: "/", search: { tab: "live" } },
  { key: "trend", label: "Alta", icon: Flame, to: "/", search: { tab: "videos" } },
  { key: "search", label: "Buscar", icon: Search, to: "/", search: { tab: "for-you" } },
] as const

export function MobileDock({ className }: { className?: string }) {
  const { location } = useRouterState()
  const activeTab = (location.search as { tab?: string }).tab

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/50 px-3 py-2 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[680px] items-center justify-between gap-2">
        {dock.map((it) => {
          const Icon = it.icon
          const isActive = activeTab ? activeTab === it.search.tab : it.key === "home"
          return (
            <Link
              key={it.key}
              to={it.to}
              search={it.search as never}
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.7rem] font-medium text-white/60 transition-colors",
                isActive && "bg-white/8 text-white ring-1 ring-white/10",
              )}
            >
              <Icon className="size-4" />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
