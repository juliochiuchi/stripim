import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Check, Dot, Eye, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlayerFrame } from "@/components/streaming/player-frame"
import {
  LIVE_BANNER_DESCRIPTION,
  LIVE_BANNER_SCHEDULE,
  LIVE_BANNER_TITLE,
} from "@/constants/streaming/live"
import { useStream } from "@/hooks/streaming/use-stream"
import { formatCompactNumber, formatDate } from "@/utils/streaming/format"
import { resolveStreamEmbedUrl } from "@/utils/streaming/player"

export function WatchPage({ id }: { id: string }) {
  const { data: stream, isLoading } = useStream(id)
  const [copied, setCopied] = React.useState(false)

  const embedUrl = stream ? resolveStreamEmbedUrl(stream) : null

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-1 lg:items-start">
        <div className="space-y-5">
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
              <div className="flex flex-wrap items-center gap-2">
                {stream.kind === "live" ? (
                  <Badge variant="live">AO VIVO</Badge>
                ) : (
                  <Badge className="bg-white/10 text-white/80 border-white/10">
                    {stream.category}
                  </Badge>
                )}
                <Badge className="bg-white/10 text-white/70 border-white/10">
                  {stream.channelName} {stream.channelHandle}
                </Badge>
              </div>

              <h1 className="text-balance text-xl font-semibold leading-tight tracking-[-0.01em] text-white/90 sm:text-2xl">
                {stream.kind === "live" ? LIVE_BANNER_TITLE : stream.title}
              </h1>

              {stream.kind === "live" ? (
                <p className="max-w-2xl text-sm leading-relaxed text-white/60">
                  {LIVE_BANNER_DESCRIPTION}
                </p>
              ) : stream.video?.description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-white/60">
                  {stream.video.description}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 text-sm text-white/55">
                {stream.kind === "live" ? (
                  <span>{LIVE_BANNER_SCHEDULE}</span>
                ) : (
                  <>
                    <span>{formatDate(stream.video?.publishedAtISO ?? stream.createdAtISO)}</span>
                    {(stream.video?.views ?? 0) > 0 ? (
                      <>
                        <Dot className="size-4" />
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="size-3.5" />
                          {formatCompactNumber(stream.video?.views ?? 0)} visualizações
                        </span>
                      </>
                    ) : null}
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* <Button className="gap-2">
                  <Heart className="size-4" />
                  Curtir
                </Button> */}
                <Button className="gap-2" onClick={handleShare}>
                  {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                  {copied ? "Link copiado" : "Compartilhar"}
                </Button>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {stream.tags.slice(0, 5).map((t) => (
                    <Badge key={t} className="bg-white/10 text-white/70 border-white/10">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* {stream ? (
        <StreamRail
          title="Relacionado"
          subtitle="Mais conteúdos na mesma categoria (mock)."
        >
          {related
            .filter((s) => s.id !== stream.id)
            .slice(0, 10)
            .map((s) => (
              <StreamCard key={s.id} stream={s} />
            ))}
        </StreamRail>
      ) : null} */}
    </div>
  )
}
