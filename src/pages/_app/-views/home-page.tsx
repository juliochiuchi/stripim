import type * as React from "react"
import { Film, Radio, Sparkles, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { STREAM_CATEGORIES } from "@/constants/streaming/categories"
import { HomeHero } from "@/components/streaming/home-hero"
import { StreamCard } from "@/components/streaming/stream-card"
import { StreamRail } from "@/components/streaming/stream-rail"
import { useStreams } from "@/hooks/streaming/use-streams"
import type { StreamCategory, StreamKind } from "@/types/streaming/stream"
import { cn } from "@/lib/utils"

export type HomeSearch = {
  tab?: "for-you" | "live" | "videos"
  q?: string
  category?: StreamCategory | "all"
}

export function HomePage({
  search,
  onPickCategory,
}: {
  search: HomeSearch
  onPickCategory: (category: StreamCategory | "all") => void
}) {
  const tab = search.tab ?? "for-you"
  const category = search.category ?? "all"

  const kind: StreamKind | "all" =
    tab === "live" ? "live" : tab === "videos" ? "video" : "all"

  const { data, isLoading } = useStreams({
    q: search.q,
    kind,
    category,
  })

  const live = data.filter((s) => s.kind === "live")
  const videos = data.filter((s) => s.kind === "video")

  const featured = live[0] ?? data[0]

  return (
    <div className="space-y-10">
      {featured ? <HomeHero stream={featured} /> : null}

      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles className="size-4 text-white/70" />
            Descoberta inteligente
          </div>
          <div className="text-sm text-white/55">
            Filtre por categoria e explore conteúdo publicado + ao vivo.
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
          {STREAM_CATEGORIES.map((c) => (
            <Button
              key={c}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onPickCategory(c)}
              className={cn(
                "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                category === c && "bg-white/10 text-white ring-1 ring-white/10",
              )}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Skeleton className="aspect-video rounded-none bg-white/10" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                  <Skeleton className="h-3 w-2/3 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {tab !== "videos" ? (
            <StreamRail
              title="Ao vivo agora"
              subtitle="Entre nas lives e acompanhe o chat (mock)."
            >
              {live.length ? (
                live.map((s) => <StreamCard key={s.id} stream={s} />)
              ) : (
                <EmptyState
                  icon={<Radio className="size-4" />}
                  title="Nenhuma live encontrada"
                  subtitle="Tente remover filtros ou mudar a busca."
                />
              )}
            </StreamRail>
          ) : null}

          {tab !== "live" ? (
            <StreamRail
              title="Vídeos publicados"
              subtitle="Padrão YouTube: foco em títulos e consistência."
            >
              {videos.length ? (
                videos.map((s) => <StreamCard key={s.id} stream={s} />)
              ) : (
                <EmptyState
                  icon={<Film className="size-4" />}
                  title="Nenhum vídeo encontrado"
                  subtitle="Experimente outra categoria ou ajuste a busca."
                />
              )}
            </StreamRail>
          ) : null}

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/10 text-white/80 border-white/10">
                Netflix rails
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/10">
                YouTube discover
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/10">
                Twitch live vibe
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/10">
                Conteúdo mockado
              </Badge>
            </div>
            <div className="mt-3 text-sm leading-relaxed text-white/55">
              O objetivo aqui é apresentar a plataforma ao cliente com uma UI moderna e
              fluida. A camada de service já está isolada para trocar por API real
              depois.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="grid w-[280px] shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/70 sm:w-[320px]">
      <div className="grid size-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold text-white/85">{title}</div>
      <div className="mt-1 text-xs text-white/50">{subtitle}</div>
    </div>
  )
}
