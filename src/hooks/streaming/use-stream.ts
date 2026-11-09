import * as React from "react"

import { refreshVideoStats } from "@/services/streaming/stats.service"
import { getStreamById } from "@/services/streaming/streaming.service"
import type { Stream } from "@/types/streaming/stream"

export function useStream(id: string) {
  const [data, setData] = React.useState<Stream | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    void (async () => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 160))
      const res = await getStreamById(id)
      if (!mounted) return
      setData(res)
      setIsLoading(false)

      // Atualiza as estatísticas reais sob demanda ao abrir um vídeo publicado.
      if (res?.kind !== "video") return
      const stats = await refreshVideoStats(res.id)
      if (!mounted || !stats) return
      setData((prev) =>
        prev?.video
          ? {
            ...prev,
            video: {
              ...prev.video,
              views: stats.views,
              durationSec: stats.durationSec,
            },
          }
          : prev,
      )
    })()

    return () => {
      mounted = false
    }
  }, [id])

  return { data, isLoading }
}

