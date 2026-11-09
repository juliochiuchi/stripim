import * as React from "react"

import { YOUTUBE_API_KEY } from "@/constants/streaming/youtube"
import { listChannelShorts } from "@/services/streaming/youtube.service"
import type { YoutubeShort } from "@/types/streaming/short"

/**
 * Rotina executada ao carregar a página de publicações: busca os Shorts mais
 * recentes do canal. Se a chave da API não estiver configurada, encerra sem
 * carregar nada — evitando estados de loading desnecessários.
 */
export function useYoutubeShorts() {
  const enabled = Boolean(YOUTUBE_API_KEY)
  const [shorts, setShorts] = React.useState<YoutubeShort[]>([])
  const [isLoading, setIsLoading] = React.useState(enabled)

  React.useEffect(() => {
    if (!enabled) return

    let mounted = true

    void (async () => {
      try {
        const result = await listChannelShorts()
        if (mounted) setShorts(result)
      } catch {
        if (mounted) setShorts([])
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [enabled])

  return { shorts, isLoading }
}
