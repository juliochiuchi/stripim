import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { YoutubeShort } from "@/types/streaming/short"
import { cn } from "@/lib/utils"

/** Player vertical embutido — assiste ao Short dentro do próprio site. */
export function ShortViewer({
  short,
  open,
  onOpenChange,
  className,
}: {
  short: YoutubeShort | null
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}) {
  const embedUrl = short
    ? `https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "w-auto max-w-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none",
          className,
        )}
      >
        {short ? (
          <div className="flex flex-col items-center gap-3">
            <div className="aspect-[9/16] w-[min(92vw,45vh)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <iframe
                className="h-full w-full"
                src={embedUrl}
                title={short.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <DialogTitle className="line-clamp-2 max-w-[min(92vw,45vh)] text-center text-sm font-medium text-white/85">
              {short.title}
            </DialogTitle>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
