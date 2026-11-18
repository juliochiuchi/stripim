import { Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Stream } from "@/types/streaming/stream"
import { formatCompactNumber, formatDate, formatDuration } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"

/** Card horizontal e compacto usado na coluna de vídeos relacionados (padrão YouTube). */
export function StreamRelatedCard({
  stream,
  className,
}: {
  stream: Stream
  className?: string
}) {
  const yt = resolveYoutube(stream.youtubeUrl)
  const thumb = yt?.thumbnailUrl

  const views = stream.video?.views ?? 0
  const viewers = stream.live?.viewers ?? 0
  const durationSec = stream.video?.durationSec ?? 0

  const meta =
    stream.kind === "live"
      ? `${formatCompactNumber(viewers)} assistindo`
      : `${formatCompactNumber(views)} visualizações`

  const dateISO =
    stream.kind === "live"
      ? stream.live?.startedAtISO ?? stream.createdAtISO
      : stream.video?.publishedAtISO ?? stream.createdAtISO

  return (
    <Link
      to="/watch/$id"
      params={{ id: stream.id }}
      className={cn("group flex cursor-pointer gap-3", className)}
    >
      <div className="relative aspect-video w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}

        {stream.kind === "live" ? (
          <div className="absolute bottom-1.5 right-1.5">
            <Badge variant="live">AO VIVO</Badge>
          </div>
        ) : durationSec > 0 ? (
          <div className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white/90 ring-1 ring-white/10">
            {formatDuration(durationSec)}
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="line-clamp-2 text-sm font-medium leading-snug text-white/90 transition-colors group-hover:text-white">
          {stream.title}
        </div>
        <div className="truncate text-xs text-white/55">{stream.channelName}</div>
        <div className="flex items-center gap-1 text-xs text-white/50">
          <span>{meta}</span>
          <span aria-hidden="true">•</span>
          <span>{formatDate(dateISO)}</span>
        </div>
      </div>
    </Link>
  )
}
