import { Link, useRouterState } from "@tanstack/react-router"
import {
  ChevronsLeft,
  ChevronsRight,
  Compass,
  Flame,
  Home,
  Radio,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSpotlight } from "@/components/streaming/spotlight-search"
import { cn } from "@/lib/utils"

const items = [
  { key: "home", label: "Início", icon: Home, to: "/", search: { tab: "for-you" } },
  { key: "live", label: "Ao vivo", icon: Radio, to: "/", search: { tab: "live" } },
  { key: "trending", label: "Em alta", icon: Flame, to: "/", search: { tab: "videos" } },
  { key: "discover", label: "Descobrir", icon: Compass },
] as const

export function Sidebar({
  className,
  collapsed = false,
  onToggle,
}: {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}) {
  const { location } = useRouterState()
  const activeTab = (location.search as { tab?: string }).tab
  const isSearchRoute = location.pathname.startsWith("/search")
  const { openSpotlight } = useSpotlight()

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-white/10 bg-black/65 pb-10 pt-6 backdrop-blur-xl transition-[width,padding] duration-300 ease-in-out",
        collapsed ? "w-[88px] px-3" : "w-[280px] px-5",
        className,
      )}
    >
      <div className={cn("flex items-center", collapsed ? "flex-col gap-3" : "justify-between")}>
        <Link
          to="/"
          search={{ tab: "for-you" }}
          title="Stripim"
          className={cn("group flex items-center gap-2 rounded-2xl px-2 py-1", collapsed && "px-0")}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm">
            <Sparkles className="size-4 text-white/80" />
          </span>
          {!collapsed ? (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white/90">
                Stripim
              </div>
              <div className="text-xs text-white/50">Streaming hub</div>
            </div>
          ) : null}
        </Link>

        {!collapsed ? (
          <Badge className="bg-white/5 text-white/70 border-white/10">Jerico Films</Badge>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir menu" : "Minimizar menu"}
        title={collapsed ? "Expandir menu" : "Minimizar menu"}
        className={cn(
          "mt-4 flex h-9 w-full cursor-pointer items-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white",
          collapsed ? "justify-center gap-0 px-0" : "gap-2 px-3",
        )}
      >
        {collapsed ? (
          <ChevronsRight className="size-4" />
        ) : (
          <>
            <ChevronsLeft className="size-4" />
            <span className="font-medium">Minimizar</span>
          </>
        )}
      </button>

      <Separator className="my-5 bg-white/10" />

      <nav className="space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          const isActive =
            it.key === "discover"
              ? isSearchRoute
              : isSearchRoute
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
              {!collapsed ? <span className="font-medium">{it.label}</span> : null}
            </Link>
          )
        })}
      </nav>

      {!collapsed ? (
        <>
          <Separator className="my-5 bg-white/10" />

          <div className="space-y-2">
            <div className="text-xs font-medium tracking-wide text-white/50">
              Destaques de hoje
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/5 text-white/70 border-white/10">Ao vivo</Badge>
              <Badge className="bg-white/5 text-white/70 border-white/10">Recomendado</Badge>
              <Badge className="bg-white/5 text-white/70 border-white/10">Louvor e Adoração</Badge>
              <Badge className="bg-white/5 text-white/70 border-white/10">Culto</Badge>
            </div>
          </div>
        </>
      ) : null}
    </aside>
  )
}
