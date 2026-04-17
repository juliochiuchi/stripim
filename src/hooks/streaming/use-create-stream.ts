import * as React from "react"

import type { CreateStreamInput } from "@/schemas/streaming/create-stream"
import { createStream } from "@/services/streaming/streaming.service"
import type { Stream } from "@/types/streaming/stream"

export function useCreateStream() {
  const [isPending, setIsPending] = React.useState(false)
  const [created, setCreated] = React.useState<Stream | null>(null)

  const mutateAsync = React.useCallback(async (input: CreateStreamInput) => {
    setIsPending(true)
    setCreated(null)
    await new Promise((r) => setTimeout(r, 260))
    const res = await createStream(input)
    setCreated(res)
    setIsPending(false)
    return res
  }, [])

  return { mutateAsync, isPending, created }
}

