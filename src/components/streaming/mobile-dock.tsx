import { Link, useRouterState } from "@tanstack/react-router"
import { Flame, Home, Radio } from "lucide-react"

import { useStreams } from "@/hooks/streaming/use-streams"
import { cn } from "@/lib/utils"

const dock = [
  { key: "home", label: "Publicações", icon: Home, to: "/", search: { tab: "for-you" } },
  { key: "live", label: "Ao vivo", icon: Radio },
  { key: "trend", label: "Alta", icon: Flame, to: "/", search: { tab: "videos" } },
] as const

export function MobileDock({ className }: { className?: string }) {
  const { location } = useRouterState()
  const activeTab = (location.search as { tab?: string }).tab
  const isWatchRoute = location.pathname.startsWith("/watch")
  const { data: liveStreams } = useStreams({ kind: "live" })
  const liveId = liveStreams[0]?.id
  const isLiveWatch = !!liveId && location.pathname === `/watch/${liveId}`

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
          const isActive =
            it.key === "live"
              ? isLiveWatch
              : !isWatchRoute && (activeTab ? activeTab === it.search?.tab : it.key === "home")

          const itemClass = cn(
            "flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.7rem] font-medium text-white/60 transition-colors",
            isActive && "bg-white/8 text-white ring-1 ring-white/10",
          )

          if (it.key === "live") {
            return liveId ? (
              <Link
                key={it.key}
                to="/watch/$id"
                params={{ id: liveId }}
                className={itemClass}
              >
                <Icon className="size-4" />
                <span>{it.label}</span>
              </Link>
            ) : (
              <Link
                key={it.key}
                to="/"
                search={{ tab: "live" }}
                className={itemClass}
              >
                <Icon className="size-4" />
                <span>{it.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={it.key}
              to={it.to}
              search={it.search as never}
              className={itemClass}
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
