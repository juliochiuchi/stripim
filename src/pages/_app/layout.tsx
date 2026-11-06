import { createFileRoute, Outlet } from "@tanstack/react-router"

import { AppShell } from "@/components/streaming/app-shell"
import { PageTransition } from "@/components/streaming/page-transition"

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppShell>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </AppShell>
  )
}
