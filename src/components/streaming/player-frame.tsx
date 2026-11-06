import * as React from "react"

import { cn } from "@/lib/utils"

const PLAYER_PARAMS = {
  autoplay: "1",
  mute: "1",
  rel: "0",
  modestbranding: "1",
} as const

export function PlayerFrame({
  embedUrl,
  title,
  className,
  fill = false,
}: {
  embedUrl: string
  title: string
  className?: string
  fill?: boolean
}) {
  const src = React.useMemo(() => {
    try {
      const url = new URL(embedUrl)
      for (const [key, value] of Object.entries(PLAYER_PARAMS)) {
        url.searchParams.set(key, value)
      }
      return url.toString()
    } catch {
      return embedUrl
    }
  }, [embedUrl])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur",
        className,
      )}
    >
      <div
        className={
          fill
            ? "absolute left-1/2 top-1/2 aspect-video h-auto w-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
            : "aspect-video"
        }
      >
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}
