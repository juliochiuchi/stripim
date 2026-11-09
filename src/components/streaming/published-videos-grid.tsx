import * as React from "react"
import { Film } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { StreamCard } from "@/components/streaming/stream-card"
import type { Stream } from "@/types/streaming/stream"
import { cn } from "@/lib/utils"

/** Quantidade de vídeos revelados a cada lote do scroll infinito. */
const PAGE_SIZE = 12

export function PublishedVideosGrid({
  streams,
  title = "Vídeos publicados",
  className,
}: {
  streams: Stream[]
  title?: string
  className?: string
}) {
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  const visible = streams.slice(0, visibleCount)
  const canMore = visibleCount < streams.length

  // Scroll infinito: dispara o próximo lote ao aproximar do fim da lista.
  React.useEffect(() => {
    if (!canMore || isLoadingMore) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setIsLoadingMore(true)
      },
      { rootMargin: "600px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [canMore, isLoadingMore])

  // Revela o próximo lote após um feedback visual intencional de ~1s.
  React.useEffect(() => {
    if (!isLoadingMore) return
    const id = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(streams.length, c + PAGE_SIZE))
      setIsLoadingMore(false)
    }, 1000)
    return () => window.clearTimeout(id)
  }, [isLoadingMore, streams.length])

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-base font-semibold tracking-wide text-white/90">
        {title}
      </h2>

      {streams.length ? (
        <>
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((s) => (
              <StreamCard key={s.id} stream={s} className="w-full sm:w-full" />
            ))}
          </div>

          {canMore ? (
            <div
              ref={sentinelRef}
              className="flex h-20 w-full items-center justify-center"
            >
              {isLoadingMore ? (
                <Spinner className="size-5 text-white/70" />
              ) : (
                <span className="text-xs text-white/35">
                  Role para carregar mais
                </span>
              )}
            </div>
          ) : (
            <div className="pt-3 text-center text-xs text-white/45">
              Fim dos vídeos
            </div>
          )}
        </>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <div className="grid size-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Film className="size-4" />
          </div>
          <div className="mt-3 text-sm font-semibold text-white/85">
            Nenhum vídeo encontrado
          </div>
          <div className="mt-1 text-xs text-white/50">
            Experimente outra categoria ou ajuste a busca.
          </div>
        </div>
      )}
    </section>
  )
}
