import { Link } from "@tanstack/react-router"
import { Play, Radio } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayerFrame } from "@/components/streaming/player-frame"
import {
  LIVE_BANNER_DESCRIPTION,
  LIVE_BANNER_SCHEDULE,
  LIVE_BANNER_TITLE,
} from "@/constants/streaming/live"
import type { Stream } from "@/types/streaming/stream"
import { resolveStreamEmbedUrl } from "@/utils/streaming/player"
import { resolveYoutube } from "@/utils/streaming/youtube"
import { cn } from "@/lib/utils"

export function HomeHero({ stream, className }: { stream: Stream; className?: string }) {
  const isLive = stream.kind === "live"
  const embedUrl = isLive ? resolveStreamEmbedUrl(stream) : null
  const yt = resolveYoutube(stream.youtubeUrl)
  const thumb = yt?.thumbnailUrl

  const info = (
    <div className="max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {stream.kind === "live" ? (
          <Badge variant="live" className="gap-1.5">
            <Radio className="size-3.5" />
            AO VIVO
          </Badge>
        ) : (
          <Badge className="bg-white/10 text-white/80 border-white/10">
            {stream.category}
          </Badge>
        )}
        <Badge className="bg-white/10 text-white/70 border-white/10">
          {stream.channelName} {stream.channelHandle}
        </Badge>
      </div>

      <h1 className="text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl lg:text-4xl">
        {isLive ? LIVE_BANNER_TITLE : stream.title}
      </h1>

      {isLive ? (
        <p className="max-w-2xl text-sm leading-relaxed text-white/60">
          {LIVE_BANNER_DESCRIPTION}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="pointer-events-auto gap-2">
          <Link to="/watch/$id" params={{ id: stream.id }}>
            <Play className="size-4" />
            Assistir agora
          </Link>
        </Button>
        {stream.kind === "live" ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 backdrop-blur">
            {LIVE_BANNER_SCHEDULE}
          </div>
        ) : null}
      </div>
    </div>
  )

  const isLiveMedia = isLive && !!embedUrl

  const overlayClass = isLiveMedia
    ? "bg-[radial-gradient(900px_circle_at_20%_20%,rgba(255,255,255,0.10),transparent_50%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.96))]"
    : "bg-[radial-gradient(900px_circle_at_20%_20%,rgba(255,255,255,0.18),transparent_50%),linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.92))]"

  return (
    <section
      className={cn(
        "relative flex overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl min-h-[20rem] sm:min-h-[22rem] lg:min-h-[24rem]",
        className,
      )}
    >
      <div className="absolute inset-0">
        {isLiveMedia ? (
          <PlayerFrame
            fill
            embedUrl={embedUrl}
            title={stream.title}
            className="h-full w-full rounded-none border-0 bg-black"
          />
        ) : thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover opacity-75"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className={cn("pointer-events-none absolute inset-0", overlayClass)} />
      </div>

      <div
        className={cn(
          "relative flex w-full flex-col justify-center p-6 sm:p-8",
          isLiveMedia && "pointer-events-none",
        )}
      >
        {info}
      </div>
    </section>
  )
}
