import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Loader2, Radio, Search, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/hooks/admin/use-categories"
import { listStreams } from "@/services/streaming/streaming.service"
import type { Stream } from "@/types/streaming/stream"
import { formatCompactNumber, formatDate, formatDuration } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

export function SearchPage({
  q,
  category,
  onPickCategory,
}: {
  q: string
  category: string
  onPickCategory: (category: string) => void
}) {
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [results, setResults] = React.useState<Stream[]>([])
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    let mounted = true
    setIsLoading(true)

    void (async () => {
      await new Promise((r) => setTimeout(r, 240))
      const res = await listStreams({ q, category })
      if (!mounted) return
      setResults(res)
      setIsLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [q, category])

  // Reinicia a paginação ao trocar o termo ou a categoria (ajuste durante o render).
  const filterKey = `${q}|${category}`
  const [lastFilterKey, setLastFilterKey] = React.useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
    setIsLoadingMore(false)
  }

  const visible = results.slice(0, visibleCount)
  const canMore = visibleCount < results.length

  // Infinite scroll: sinaliza o carregamento do próximo lote ao aproximar do fim da lista.
  React.useEffect(() => {
    if (isLoading || !canMore || isLoadingMore) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setIsLoadingMore(true)
      },
      { rootMargin: "500px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isLoading, canMore, isLoadingMore])

  // Carrega o próximo lote após um feedback intencional de ~1s.
  React.useEffect(() => {
    if (!isLoadingMore) return
    const id = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(results.length, c + PAGE_SIZE))
      setIsLoadingMore(false)
    }, 1000)
    return () => window.clearTimeout(id)
  }, [isLoadingMore, results.length])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
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
                {results.length} resultados
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Search className="size-4 text-white/60" />
              <span className="text-white/85 font-semibold">
                {q ? `“${q}”` : category !== "all" ? category : "Todos"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onPickCategory("all")}
            className={cn(
              "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
              category === "all" && "bg-white/10 text-white ring-1 ring-white/10",
            )}
          >
            <Tag className="size-4" />
            Todas
          </Button>
          {isLoadingCategories ? (
            <span className="grid h-8 place-items-center px-2">
              <Spinner className="size-4 text-white/50" />
            </span>
          ) : (
            categories.map((c) => (
              <Button
                key={c.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onPickCategory(c.name)}
                className={cn(
                  "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                  category === c.name && "bg-white/10 text-white ring-1 ring-white/10",
                )}
              >
                {c.name}
              </Button>
            ))
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-2 sm:flex-row">
              <Skeleton className="aspect-video w-full shrink-0 rounded-xl bg-white/10 sm:w-60 lg:w-72" />
              <div className="flex-1 space-y-3 py-1">
                <Skeleton className="h-5 w-4/5 bg-white/10" />
                <Skeleton className="h-3 w-2/5 bg-white/10" />
                <Skeleton className="h-3 w-3/5 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <div className="text-sm font-semibold text-white/85">
            Nenhum resultado nesta categoria
          </div>
          <div className="mt-1 text-xs text-white/50">
            Tente outra categoria ou ajuste a busca.
          </div>
        </div>
      ) : (
        <div className="stagger-children space-y-2">
          {visible.map((s) => (
            <SearchResultRow key={s.id} stream={s} />
          ))}

          {canMore ? (
            <div
              ref={sentinelRef}
              className="flex h-16 w-full items-center justify-center"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                  <Loader2 className="size-4 animate-spin text-white/70" />
                  Carregando mais resultados…
                </div>
              ) : (
                <span className="text-xs text-white/35">
                  Role para carregar mais
                </span>
              )}
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

function SearchResultRow({ stream }: { stream: Stream }) {
  const yt = resolveYoutube(stream.youtubeUrl)
  const dateISO =
    stream.kind === "live"
      ? stream.live?.startedAtISO ?? stream.createdAtISO
      : stream.video?.publishedAtISO ?? stream.createdAtISO

  const viewers = stream.live?.viewers ?? 0
  const meta =
    stream.kind === "live" && viewers > 0
      ? `${formatCompactNumber(viewers)} assistindo`
      : null

  return (
    <Link
      to="/watch/$id"
      params={{ id: stream.id } as never}
      className="group flex flex-col gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5 sm:flex-row"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-white/5 sm:w-60 lg:w-72">
        {yt?.thumbnailUrl ? (
          <img
            src={yt.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : stream.kind === "live" ? (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_25%,rgba(239,68,68,0.30),transparent_60%),linear-gradient(to_bottom_right,rgba(30,41,59,0.95),rgba(2,6,23,1))]">
            <Radio className="size-8 text-white/30" />
          </div>
        ) : null}

        {stream.kind === "video" ? (
          <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-semibold text-white/95 ring-1 ring-white/10">
            {formatDuration(stream.video?.durationSec ?? 0)}
          </div>
        ) : (
          <Badge
            variant="live"
            className="absolute left-2 top-2 gap-1.5 rounded-lg"
          >
            <span className="relative inline-flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            AO VIVO
          </Badge>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2 sm:py-0.5">
        <div className="line-clamp-2 text-base font-semibold leading-snug text-white/95 sm:text-lg">
          {stream.title}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
          <span className="font-medium text-white/70">{stream.channelName}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/60 ring-1 ring-white/10">
            {stream.channelHandle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          {meta ? (
            <>
              <span>{meta}</span>
              <span className="text-white/30">·</span>
            </>
          ) : null}
          <span>{formatDate(dateISO)}</span>
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
      </div>
    </Link>
  )
}
