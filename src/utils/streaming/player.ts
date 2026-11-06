import { LIVE_STREAM_EMBED_URL } from "@/constants/streaming/live"
import type { Stream } from "@/types/streaming/stream"
import { resolveYoutube } from "@/utils/streaming/youtube"

export function resolveStreamEmbedUrl(stream: Stream): string | null {
  if (stream.kind === "live" && LIVE_STREAM_EMBED_URL) {
    return LIVE_STREAM_EMBED_URL
  }

  return resolveYoutube(stream.youtubeUrl)?.embedUrl ?? null
}
