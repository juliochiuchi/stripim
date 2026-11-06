import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { AdminShell } from "@/components/admin/admin-shell"
import { PageTransition } from "@/components/streaming/page-transition"
import { getStoredUser } from "@/services/auth/auth.service"

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const user = getStoredUser()
    if (!user) {
      throw redirect({ to: "/login" })
    }
    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <AdminShell user={user}>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </AdminShell>
  )
}
