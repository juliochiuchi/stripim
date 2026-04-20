import { Link } from "@tanstack/react-router"
import { Play, Radio } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Stream } from "@/types/streaming/stream"
import { formatCompactNumber, formatTime } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"
import { cn } from "@/lib/utils"

export function HomeHero({ stream, className }: { stream: Stream; className?: string }) {
  const yt = resolveYoutube(stream.youtubeUrl)
  const thumb = yt?.thumbnailUrl

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="absolute inset-0">
        {thumb ? (
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
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_20%,rgba(255,255,255,0.18),transparent_50%),linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.92))]" />
      </div>

      <div className="relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
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
            {stream.title}
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-white/60">
            Plataforma mock para demonstrar feed estilo Netflix, descoberta estilo YouTube
            e energia de live estilo Twitch — tudo num só lugar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="gap-2">
              <Link to="/watch/$id" params={{ id: stream.id }}>
                <Play className="size-4" />
                Assistir agora
              </Link>
            </Button>
            {stream.kind === "live" ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 backdrop-blur">
                {formatCompactNumber(stream.live?.viewers ?? 0)} assistindo · desde{" "}
                {formatTime(stream.live?.startedAtISO ?? stream.createdAtISO)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4 backdrop-blur">
          <div className="text-xs font-medium tracking-wide text-white/55">
            Próximos blocos
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-sm font-semibold text-white/80">19/04 - 19h30</div>
              <div className="text-xs text-white/50">Efésios 4.11</div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-sm font-semibold text-white/80">21/04 - 19h30</div>
              <div className="text-xs text-white/50">Missöes</div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-sm font-semibold text-white/80">27/04 - 19h30</div>
              <div className="text-xs text-white/50">Humildade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

