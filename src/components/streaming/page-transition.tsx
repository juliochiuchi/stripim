import type * as React from "react"
import { useRouterState } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div key={pathname} className={cn("animate-page", className)}>
      {children}
    </div>
  )
}
