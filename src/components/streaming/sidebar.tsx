import { Link, useRouterState } from "@tanstack/react-router"
import {
  Compass,
  // Flame,
  Home,
  Radio,
} from "lucide-react"

import logoJericoFilms from "@/assets/jericofilms.jpg"
import { MenuMeta } from "@/components/shared/menu-meta"
import { Separator } from "@/components/ui/separator"
import { useSpotlight } from "@/components/streaming/spotlight-search"
import { useStreams } from "@/hooks/streaming/use-streams"
import { cn } from "@/lib/utils"

const items = [
  { key: "home", label: "Publicações", icon: Home, to: "/", search: { tab: "for-you" } },
  { key: "live", label: "Ao vivo", icon: Radio, to: "/", search: { tab: "live" } },
  // { key: "trending", label: "Em alta", icon: Flame, to: "/", search: { tab: "videos" } },
  { key: "discover", label: "Descobrir", icon: Compass },
] as const

export function Sidebar({
  className,
  collapsed = false,
}: {
  className?: string
  collapsed?: boolean
}) {
  const { location } = useRouterState()
  const activeTab = (location.search as { tab?: string }).tab
  const isSearchRoute = location.pathname.startsWith("/search")
  const isWatchRoute = location.pathname.startsWith("/watch")
  const { openSpotlight } = useSpotlight()
  const { data: liveStreams } = useStreams({ kind: "live" })
  const liveId = liveStreams[0]?.id
  const isLiveWatch = !!liveId && location.pathname === `/watch/${liveId}`

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-white/10 bg-black/65 pb-10 pt-6 backdrop-blur-xl transition-[width,padding] duration-300 ease-in-out",
        collapsed ? "w-[88px] px-3" : "w-[280px] px-5",
        className,
      )}
    >
      <div className={cn("flex items-center", collapsed && "justify-center")}>
        <Link
          to="/"
          search={{ tab: "for-you" }}
          title="Stripim"
          className={cn("group flex items-center gap-2 rounded-2xl px-2 py-1", collapsed && "px-0")}
        >
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm">
            <img
              src={logoJericoFilms}
              alt="Jerico Films"
              className="size-9 object-cover"
            />
          </span>
          {!collapsed ? (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white/90">
                Jericó Films
              </div>
              <div className="text-xs text-white/50">Streaming</div>
            </div>
          ) : null}
        </Link>
      </div>

      <Separator className="my-5 bg-white/10" />

      <nav className="space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          const isActive =
            it.key === "discover"
              ? isSearchRoute
              : it.key === "live"
                ? isLiveWatch
                : isSearchRoute || isWatchRoute
                  ? false
                  : activeTab
                    ? activeTab === "for-you"
                      ? it.key === "home"
                      : activeTab === (it as any).search?.tab
                    : it.key === "home"

          const itemClass = cn(
            "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/6 hover:text-white",
            collapsed && "justify-center gap-0 px-0",
            isActive && "bg-white/8 text-white ring-1 ring-white/10",
          )

          const iconBox = (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <Icon className="size-4" />
            </span>
          )

          const label = !collapsed ? (
            <span className="font-medium">{it.label}</span>
          ) : null

          if (it.key === "live") {
            return liveId ? (
              <Link
                key={it.key}
                to="/watch/$id"
                params={{ id: liveId }}
                title={collapsed ? it.label : undefined}
                className={itemClass}
              >
                {iconBox}
                {label}
              </Link>
            ) : (
              <Link
                key={it.key}
                to="/"
                search={{ tab: "live" }}
                title={collapsed ? it.label : undefined}
                className={itemClass}
              >
                {iconBox}
                {label}
              </Link>
            )
          }

          if (it.key === "discover") {
            return (
              <button
                key={it.key}
                type="button"
                onClick={openSpotlight}
                title={collapsed ? it.label : undefined}
                className={cn(itemClass, "w-full cursor-pointer text-left")}
              >
                {iconBox}
                {!collapsed ? (
                  <>
                    <span className="font-medium">{it.label}</span>
                    <span className="ml-auto hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-white/50 lg:inline-flex">
                      ⌘ Space
                    </span>
                  </>
                ) : null}
              </button>
            )
          }

          return (
            <Link
              key={it.key}
              to={(it as any).to}
              search={(it as any).search as never}
              title={collapsed ? it.label : undefined}
              className={itemClass}
            >
              {iconBox}
              {label}
            </Link>
          )
        })}
      </nav>

      {!collapsed ? (
        <div className="mt-auto space-y-4">
          <Separator className="bg-white/10" />
          <MenuMeta />
        </div>
      ) : null}
    </aside>
  )
}
