import { Link } from "@tanstack/react-router"
import { Dot } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Stream } from "@/types/streaming/stream"
import { formatCompactNumber, formatDate, formatDuration } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"

export function StreamCard({
  stream,
  className,
}: {
  stream: Stream
  className?: string
}) {
  const yt = resolveYoutube(stream.youtubeUrl)
  const thumb = yt?.thumbnailUrl

  const meta =
    stream.kind === "live"
      ? `${formatCompactNumber(stream.live?.viewers ?? 0)} assistindo`
      : `${formatCompactNumber(stream.video?.views ?? 0)} views`

  const dateISO =
    stream.kind === "live"
      ? stream.live?.startedAtISO ?? stream.createdAtISO
      : stream.video?.publishedAtISO ?? stream.createdAtISO

  return (
    <Link
      to="/watch/$id"
      params={{ id: stream.id }}
      className={cn(
        "group block w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur transition-colors hover:bg-white/7 hover:ring-1 hover:ring-white/10 sm:w-[320px]",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {stream.kind === "live" ? (
            <Badge variant="live" className="gap-1.5">
              <span className="relative inline-flex size-2">
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
              AO VIVO
            </Badge>
          ) : (
            <Badge className="bg-white/10 text-white/80 border-white/10">
              {stream.category}
            </Badge>
          )}
        </div>

        {stream.kind === "video" ? (
          <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-2 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/10">
            {formatDuration(stream.video?.durationSec ?? 0)}
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-white/90">
          {stream.title}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/55">
          <span className="font-medium text-white/70">{stream.channelName}</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5">
            {stream.channelHandle}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/55">
          <span>{meta}</span>
          <Dot className="size-4" />
          <span>{formatDate(dateISO)}</span>
        </div>
      </div>
    </Link>
  )
}

