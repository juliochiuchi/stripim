import * as React from "react"

import { listVideos } from "@/services/admin/videos.service"
import type { Video } from "@/types/admin/video"

/** Carrega e mantém a lista de vídeos cadastrados. */
export function useVideos() {
  const [videos, setVideos] = React.useState<Video[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(
    () =>
      listVideos()
        .then((data) => {
          setVideos(data)
          setError(null)
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Erro ao carregar vídeos.")
        })
        .finally(() => setIsLoading(false)),
    [],
  )

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  return { videos, isLoading, error, refresh }
}
