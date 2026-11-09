import * as React from "react"
import { Play } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { ShortViewer } from "@/components/streaming/short-viewer"
import { StreamRail } from "@/components/streaming/stream-rail"
import type { YoutubeShort } from "@/types/streaming/short"
import { cn } from "@/lib/utils"

/** Prateleira horizontal com os Shorts mais recentes do canal. */
export function ShortsRail({
  shorts,
  isLoading = false,
  className,
}: {
  shorts: YoutubeShort[]
  isLoading?: boolean
  className?: string
}) {
  const [active, setActive] = React.useState<YoutubeShort | null>(null)
  if (isLoading) {
    return (
      <section className={cn("space-y-3", className)}>
        <div>
          <h2 className="text-base font-semibold tracking-wide text-white/90">
            Shorts
          </h2>
          <p className="text-sm text-white/50">
            Mais recentes do canal
          </p>
        </div>
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-[9/16] w-[160px] shrink-0 rounded-2xl bg-white/10 sm:w-[180px]"
            />
          ))}
        </div>
      </section>
    )
  }

  if (!shorts.length) return null

  return (
    <>
      <StreamRail
        title="Shorts"
        subtitle="Mais recentes do canal"
        className={className}
      >
        {shorts.map((short) => (
          <ShortCard key={short.id} short={short} onOpen={() => setActive(short)} />
        ))}
      </StreamRail>

      <ShortViewer
        short={active}
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActive(null)
        }}
      />
    </>
  )
}

function ShortCard({ short, onOpen }: { short: YoutubeShort; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title={short.title}
      className="group relative block w-[160px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-sm backdrop-blur transition-colors hover:bg-white/7 hover:ring-1 hover:ring-white/10 sm:w-[180px]"
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        <img
          src={short.thumbnailUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[0.7rem] font-semibold text-white/90 ring-1 ring-white/10">
          <Play className="size-3 fill-current" />
          Short
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="line-clamp-2 text-xs font-semibold leading-snug text-white/90">
            {short.title}
          </div>
        </div>
      </div>
    </button>
  )
}
