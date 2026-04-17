import { Link } from "@tanstack/react-router"
import { Dot, Heart, Share2, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PlayerFrame } from "@/components/streaming/player-frame"
import { StreamCard } from "@/components/streaming/stream-card"
import { StreamRail } from "@/components/streaming/stream-rail"
import { useStream } from "@/hooks/streaming/use-stream"
import { useStreams } from "@/hooks/streaming/use-streams"
import { formatCompactNumber, formatDate, formatTime } from "@/utils/streaming/format"
import { resolveYoutube } from "@/utils/streaming/youtube"

export function WatchPage({ id }: { id: string }) {
  const { data: stream, isLoading } = useStream(id)
  const { data: related } = useStreams({
    kind: "all",
    category: stream?.category ?? "all",
  })

  const yt = stream ? resolveYoutube(stream.youtubeUrl) : null

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-1 lg:items-start">
        <div className="space-y-5">
          {isLoading ? (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <Skeleton className="aspect-video rounded-none bg-white/10" />
            </div>
          ) : stream && yt ? (
            <PlayerFrame embedUrl={yt.embedUrl} title={stream.title} />
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
                {stream.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-white/55">
                {stream.kind === "live" ? (
                  <>
                    <Users className="size-4" />
                    <span>
                      {formatCompactNumber(stream.live?.viewers ?? 0)} assistindo
                    </span>
                    <Dot className="size-4" />
                    <span>
                      desde {formatTime(stream.live?.startedAtISO ?? stream.createdAtISO)}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{formatCompactNumber(stream.video?.views ?? 0)} views</span>
                    <Dot className="size-4" />
                    <span>{formatDate(stream.video?.publishedAtISO ?? stream.createdAtISO)}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button className="gap-2">
                  <Heart className="size-4" />
                  Curtir
                </Button>
                <Button variant="secondary" className="gap-2">
                  <Share2 className="size-4" />
                  Compartilhar
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

          <Separator className="bg-white/10" />

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm text-white/55 backdrop-blur">
            <div className="font-semibold text-white/80">Descrição (mock)</div>
            <div className="mt-2 leading-relaxed">
              Aqui entram informações do vídeo, links e capítulos. Nesta versão de
              apresentação, tudo é mockado e pronto para plugar numa API real.
            </div>
          </div>
        </div>
      </div>

      {stream ? (
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
      ) : null}
    </div>
  )
}
