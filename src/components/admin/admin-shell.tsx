import * as React from "react"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { LogOut } from "lucide-react"

import logoJericoFilms from "@/assets/jericofilms.jpg"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { ADMIN_NAV } from "@/constants/admin/nav"
import { cn } from "@/lib/utils"
import { clearStoredUser } from "@/services/auth/auth.service"
import type { AdminUser } from "@/types/auth/user"

function AdminMobileNav({ user }: { user: AdminUser }) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <img
            src={logoJericoFilms}
            alt="Jericó Films"
            className="size-9 object-cover"
          />
        </span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-semibold tracking-wide text-white/90">
            Painel Admin
          </div>
          <div className="truncate text-xs text-white/50">{user.username}</div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Sair"
          className="ml-auto text-white/60 hover:text-white"
          onClick={() => {
            clearStoredUser()
            void navigate({ to: "/login" })
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>

      <nav className="flex items-center gap-2 overflow-x-auto px-4 pb-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.to)
          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/6 hover:text-white",
                isActive && "bg-white/10 text-white ring-1 ring-white/10",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: React.ReactNode
}) {
  React.useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(59,130,246,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1550px] 3xl:max-w-[1840px] 4xl:max-w-none">
        <AdminSidebar user={user} className="hidden lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminMobileNav user={user} />
          <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
