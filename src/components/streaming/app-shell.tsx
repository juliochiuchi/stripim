import * as React from "react"

import { cn } from "@/lib/utils"
import { MobileDock } from "@/components/streaming/mobile-dock"
import { Sidebar } from "@/components/streaming/sidebar"
import { SpotlightProvider } from "@/components/streaming/spotlight-search"
import { Topbar } from "@/components/streaming/topbar"

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  React.useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <SpotlightProvider>
      <div className={cn("isolate min-h-screen bg-background text-foreground", className)}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(59,130,246,0.22),transparent_55%),radial-gradient(900px_circle_at_35%_75%,rgba(239,68,68,0.18),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.16] mix-blend-soft-light [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22><filter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-[1550px]">
          <Sidebar className="hidden lg:flex" />
          <div className="relative z-10 flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-20 pt-6 lg:px-8 lg:pb-10">
              {children}
            </main>
          </div>
        </div>

        <MobileDock className="lg:hidden" />
      </div>
    </SpotlightProvider>
  )
}
