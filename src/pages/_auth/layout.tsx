import { Outlet } from "@tanstack/react-router"

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Outlet />
    </div>
  )
}

export default AuthLayout
