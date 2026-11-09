import type * as React from "react"
import { Radio, Sparkles, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { HomeHero, HomeHeroSkeleton } from "@/components/streaming/home-hero"
import { PublishedVideosGrid } from "@/components/streaming/published-videos-grid"
import { ShortsRail } from "@/components/streaming/shorts-rail"
import { StreamCard } from "@/components/streaming/stream-card"
import { StreamRail } from "@/components/streaming/stream-rail"
import { useCategories } from "@/hooks/admin/use-categories"
import { useStreams } from "@/hooks/streaming/use-streams"
import { useYoutubeShorts } from "@/hooks/streaming/use-youtube-shorts"
import type { StreamKind } from "@/types/streaming/stream"
import { cn } from "@/lib/utils"

export type HomeSearch = {
  tab?: "for-you" | "live" | "videos"
  q?: string
  category?: string
}

export function HomePage({
  search,
  onPickCategory,
}: {
  search: HomeSearch
  onPickCategory: (category: string) => void
}) {
  const tab = search.tab ?? "for-you"
  const category = search.category ?? "all"

  const { categories, isLoading: isLoadingCategories } = useCategories()

  const kind: StreamKind | "all" =
    tab === "live" ? "live" : tab === "videos" ? "video" : "all"

  const { data, isLoading } = useStreams({
    q: search.q,
    kind,
    category,
  })

  const { shorts, isLoading: isLoadingShorts } = useYoutubeShorts()

  const live = data.filter((s) => s.kind === "live")
  const videos = data.filter((s) => s.kind === "video")

  const featured = live[0] ?? data[0]

  const discoveryPanel = (
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
  )

  return (
    <div className="space-y-10">
      {tab === "for-you" ? (
        isLoading ? (
          <HomeHeroSkeleton />
        ) : featured ? (
          <HomeHero stream={featured} />
        ) : null
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
          {tab === "live" ? (
            <>
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
              {discoveryPanel}
            </>
          ) : null}

          {tab !== "live" ? (
            <>
              <ShortsRail shorts={shorts} isLoading={isLoadingShorts} />
              {discoveryPanel}
              <PublishedVideosGrid
                key={`${search.q ?? ""}|${category}`}
                streams={videos}
              />
            </>
          ) : null}
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
