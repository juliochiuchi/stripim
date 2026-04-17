import * as React from "react"

import { listStreams } from "@/services/streaming/streaming.service"
import type { ListStreamsParams, Stream } from "@/types/streaming/stream"

export function useStreams(params: ListStreamsParams) {
  const [data, setData] = React.useState<Stream[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    void (async () => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 220))
      const res = await listStreams(params)
      if (!mounted) return
      setData(res)
      setIsLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [params.category, params.kind, params.q])

  return { data, isLoading }
}
