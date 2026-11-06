import { createFileRoute, redirect } from "@tanstack/react-router"

import { LoginPage } from "@/pages/login/-views/login-page"
import { getStoredUser } from "@/services/auth/auth.service"

export const Route = createFileRoute("/login/")({
  beforeLoad: () => {
    if (getStoredUser()) {
      throw redirect({ to: "/admin" })
    }
  },
  component: LoginPage,
})
