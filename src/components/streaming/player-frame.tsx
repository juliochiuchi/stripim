import { cn } from "@/lib/utils"

export function PlayerFrame({
  embedUrl,
  title,
  className,
}: {
  embedUrl: string
  title: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur",
        className,
      )}
    >
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`${embedUrl}?autoplay=1&mute=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}

