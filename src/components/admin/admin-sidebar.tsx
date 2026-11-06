import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { ExternalLink, LogOut } from "lucide-react"

import logoJericoFilms from "@/assets/jericofilms.jpg"
import { MenuMeta } from "@/components/shared/menu-meta"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ADMIN_NAV } from "@/constants/admin/nav"
import { cn } from "@/lib/utils"
import { clearStoredUser } from "@/services/auth/auth.service"
import type { AdminUser } from "@/types/auth/user"

export function AdminSidebar({
  user,
  className,
}: {
  user: AdminUser
  className?: string
}) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-black/65 px-5 pb-8 pt-6 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <img
            src={logoJericoFilms}
            alt="Jericó Films"
            className="size-9 object-cover"
          />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-white/90">
            Painel Admin
          </div>
          <div className="text-xs text-white/50">Jericó Films</div>
        </div>
      </div>

      <Separator className="my-5 bg-white/10" />

      <nav className="space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.to)

          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/6 hover:text-white",
                isActive && "bg-white/8 text-white ring-1 ring-white/10",
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon className="size-4" />
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Separator className="bg-white/10" />

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold uppercase text-white/80">
            {user.username.slice(0, 1)}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-white/80">
              {user.username}
            </div>
            <div className="text-[0.7rem] text-white/40">Administrador</div>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/6 hover:text-white"
        >
          <ExternalLink className="size-4 shrink-0" />
          <span className="font-medium">Ver site</span>
        </Link>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-2 text-white/60 hover:bg-white/6 hover:text-white"
          onClick={() => {
            clearStoredUser()
            void navigate({ to: "/login" })
          }}
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </Button>

        <Separator className="bg-white/10" />

        <MenuMeta />
      </div>
    </aside>
  )
}
