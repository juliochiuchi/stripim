import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { ADMIN_NAV } from "@/constants/admin/nav"

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-sm text-white/50">
          Selecione uma janela para começar.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              to={item.to}
              className="group flex cursor-pointer flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.07]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Icon className="size-5 text-white/80" />
              </span>

              <div className="space-y-1">
                <h2 className="text-base font-medium tracking-tight text-white/90">
                  {item.label}
                </h2>
                <p className="text-sm leading-relaxed text-white/50">
                  {item.description}
                </p>
              </div>

              <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors group-hover:text-white/80">
                Acessar
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
