import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Dot, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { searchStreamsMock } from "@/services/streaming/streaming.service"
import type { Stream } from "@/types/streaming/stream"
import { formatCompactNumber, formatDate, formatDuration } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"
import { cn } from "@/lib/utils"

export function SearchPage({ q }: { q: string }) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [results, setResults] = React.useState<Stream[]>([])
  const [visibleCount, setVisibleCount] = React.useState(10)

  React.useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setVisibleCount(10)

    void (async () => {
      await new Promise((r) => setTimeout(r, 240))
      const res = await searchStreamsMock(q)
      if (!mounted) return
      setResults(res)
      setIsLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [q])

  const visible = results.slice(0, visibleCount)
  const canMore = visibleCount < results.length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="mt-0.5 border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Link to="/" search={{ tab: "for-you" }}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/10 text-white/80 border-white/10">
                Pesquisa
              </Badge>
              <Badge className="bg-white/10 text-white/70 border-white/10">
                {results.length} resultados (mock)
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Search className="size-4 text-white/60" />
              <span className="text-white/85 font-semibold">“{q}”</span>
              <Dot className="size-4 text-white/40" />
              <span className="text-white/50">Lista única (sem categorias)</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden rounded-[1.75rem] border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="flex gap-4">
                <Skeleton className="h-20 w-36 rounded-2xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-4/5 bg-white/10" />
                  <Skeleton className="h-3 w-2/5 bg-white/10" />
                  <Skeleton className="h-3 w-3/5 bg-white/10" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((s, idx) => (
            <SearchResultRow key={s.id} stream={s} index={idx + 1} />
          ))}

          {canMore ? (
            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full rounded-[1.25rem]"
                onClick={() => setVisibleCount((c) => Math.min(results.length, c + 10))}
              >
                Exibir mais
              </Button>
              <div className="mt-2 text-center text-xs text-white/45">
                Mostrando {visible.length} de {results.length}
              </div>
            </div>
          ) : (
            <div className="pt-3 text-center text-xs text-white/45">
              Fim dos resultados
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SearchResultRow({
  stream,
  index,
}: {
  stream: Stream
  index: number
}) {
  const yt = resolveYoutube(stream.youtubeUrl)
  const dateISO =
    stream.kind === "live"
      ? stream.live?.startedAtISO ?? stream.createdAtISO
      : stream.video?.publishedAtISO ?? stream.createdAtISO

  const meta =
    stream.kind === "live"
      ? `${formatCompactNumber(stream.live?.viewers ?? 0)} assistindo`
      : `${formatCompactNumber(stream.video?.views ?? 0)} views`

  return (
    <Link
      to="/watch/$id"
      params={{ id: stream.id } as never}
      className="block"
    >
      <Card className="group overflow-hidden rounded-[1.75rem] border-white/10 bg-white/5 p-4 backdrop-blur transition-colors hover:bg-white/7 hover:ring-1 hover:ring-white/10">
        <div className="flex gap-4">
          <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            {yt?.thumbnailUrl ? (
              <img
                src={yt.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {stream.kind === "video" ? (
              <div className="absolute bottom-2 right-2 rounded-xl bg-black/65 px-2 py-1 text-[0.7rem] font-semibold text-white/90 ring-1 ring-white/10">
                {formatDuration(stream.video?.durationSec ?? 0)}
              </div>
            ) : (
              <Badge
                variant="live"
                className="absolute left-2 top-2 gap-1.5 rounded-xl"
              >
                <span className="relative inline-flex size-2">
                  <span className="absolute inline-flex size-2 animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                AO VIVO
              </Badge>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 hidden w-8 shrink-0 text-right text-xs text-white/35 sm:block">
                {String(index).padStart(2, "0")}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="line-clamp-2 text-sm font-semibold leading-snug text-white/90">
                  {stream.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                  <span className="font-medium text-white/70">{stream.channelName}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/60 ring-1 ring-white/10">
                    {stream.channelHandle}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 ring-1",
                      stream.kind === "live"
                        ? "bg-red-500/10 text-red-100 ring-red-500/20"
                        : "bg-white/5 text-white/60 ring-white/10",
                    )}
                  >
                    {stream.category}
                  </span>
                </div>
                <div className="text-xs text-white/50">
                  {meta} · {formatDate(dateISO)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

