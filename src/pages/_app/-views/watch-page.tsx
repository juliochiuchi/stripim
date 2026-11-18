import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Check, Eye, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlayerFrame } from "@/components/streaming/player-frame"
import { StreamRelatedCard } from "@/components/streaming/stream-related-card"
import {
  LIVE_BANNER_DESCRIPTION,
  LIVE_BANNER_SCHEDULE,
  LIVE_BANNER_TITLE,
} from "@/constants/streaming/live"
import { useStream } from "@/hooks/streaming/use-stream"
import { useStreams } from "@/hooks/streaming/use-streams"
import { formatCompactNumber, formatDate } from "@/utils/streaming/format"
import { resolveStreamEmbedUrl } from "@/utils/streaming/player"

export function WatchPage({ id }: { id: string }) {
  const { data: stream, isLoading } = useStream(id)
  const { data: streams, isLoading: isLoadingRelated } = useStreams({ kind: "all" })
  const [copied, setCopied] = React.useState(false)

  const embedUrl = stream ? resolveStreamEmbedUrl(stream) : null
  const related = streams.filter((s) => s.id !== id).slice(0, 12)

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
      {/* Coluna principal: player + informações.
          Padrão YouTube: a largura máxima do player é limitada pela altura da
          viewport ((altura disponível) * 16/9), então ele para de crescer ao
          atingir a altura da tela. O excesso horizontal vira margem centralizada. */}
      <div className="min-w-0 w-full space-y-5 lg:max-w-[calc((100vh-9rem)*16/9)] lg:flex-1">
        {isLoading ? (
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <Skeleton className="aspect-video rounded-none bg-white/10" />
          </div>
        ) : stream && embedUrl ? (
          <PlayerFrame embedUrl={embedUrl} title={stream.title} />
        ) : (
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Conteúdo não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              Volte ao feed e selecione outro item.
              <div className="mt-4">
                <Button asChild>
                  <Link to="/" search={{ tab: "for-you" }}>
                    Ir para o início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {stream ? (
          <div className="space-y-4">
            <h1 className="text-balance text-lg font-semibold leading-tight tracking-[-0.01em] text-white/95 sm:text-xl lg:text-2xl">
              {stream.kind === "live" ? LIVE_BANNER_TITLE : stream.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold text-white/80 ring-1 ring-white/10">
                  {stream.channelName.charAt(0)}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                    <span className="truncate">{stream.channelName}</span>
                    <span className="hidden shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60 sm:inline">
                      {stream.channelHandle}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/50">
                    {stream.kind === "live" ? (
                      <Badge variant="live">AO VIVO</Badge>
                    ) : stream.category ? (
                      <Badge className="bg-white/10 text-white/70 border-white/10">
                        {stream.category}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <Button className="gap-2" onClick={handleShare}>
                {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                {copied ? "Link copiado" : "Compartilhar"}
              </Button>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                {stream.kind === "live" ? (
                  <span>{LIVE_BANNER_SCHEDULE}</span>
                ) : (
                  <>
                    <span>{formatDate(stream.video?.publishedAtISO ?? stream.createdAtISO)}</span>
                    {(stream.video?.views ?? 0) > 0 ? (
                      <>
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="size-3.5" />
                          {formatCompactNumber(stream.video?.views ?? 0)} visualizações
                        </span>
                      </>
                    ) : null}
                  </>
                )}
              </div>

              {stream.kind === "live" ? (
                <p className="text-sm leading-relaxed text-white/70">
                  {LIVE_BANNER_DESCRIPTION}
                </p>
              ) : stream.video?.description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                  {stream.video.description}
                </p>
              ) : null}

              {stream.tags.length ? (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {stream.tags.slice(0, 8).map((t) => (
                    <Badge key={t} className="bg-white/10 text-white/70 border-white/10">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Coluna de relacionados: cards empilhados (padrão YouTube).
          Largura fixa ~402px, independente do tamanho da tela. */}
      <aside className="min-w-0 w-full space-y-3 lg:w-[402px] lg:shrink-0">
        <h2 className="text-base font-semibold tracking-wide text-white/90">
          Vídeos relacionados
        </h2>

        {isLoadingRelated ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="aspect-video w-[168px] shrink-0 rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-3.5 w-full bg-white/10" />
                  <Skeleton className="h-3.5 w-2/3 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : related.length ? (
          <div className="space-y-3">
            {related.map((s) => (
              <StreamRelatedCard key={s.id} stream={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/50">
            Nenhum vídeo relacionado no momento.
          </div>
        )}
      </aside>
    </div>
  )
}
