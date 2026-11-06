import { LIVE_BANNER_TITLE, LIVE_STREAM_EMBED_URL } from "@/constants/streaming/live"
import { listCategories } from "@/services/admin/categories.service"
import { searchVideos } from "@/services/admin/videos.service"
import type { Video } from "@/types/admin/video"
import type { ListStreamsParams, Stream } from "@/types/streaming/stream"

const CHANNEL_NAME = "IPI Macaubal"
const CHANNEL_HANDLE = "@ipimacaubal"

/** Live única da igreja, definida pelo link do arquivo .env. */
const LIVE_STREAM: Stream = {
  id: "live",
  kind: "live",
  title: LIVE_BANNER_TITLE,
  channelName: CHANNEL_NAME,
  channelHandle: CHANNEL_HANDLE,
  category: "",
  tags: ["ao vivo", "culto"],
  youtubeUrl: LIVE_STREAM_EMBED_URL,
  createdAtISO: new Date().toISOString(),
  live: {
    startedAtISO: new Date().toISOString(),
    viewers: 0,
  },
}

function toYoutubeUrl(link: string | null, reference: string | null) {
  if (link) return link
  if (reference) return `https://www.youtube.com/watch?v=${reference}`
  return ""
}

function mapVideoToStream(video: Video, categoryNameById: Map<string, string>): Stream {
  const categoryNames = video.categoryIds
    .map((id) => categoryNameById.get(id))
    .filter((name): name is string => Boolean(name))

  return {
    id: video.id,
    kind: "video",
    title: video.title,
    channelName: CHANNEL_NAME,
    channelHandle: CHANNEL_HANDLE,
    category: categoryNames[0] ?? "",
    tags: categoryNames,
    youtubeUrl: toYoutubeUrl(video.link, video.reference),
    createdAtISO: video.publishDateISO,
    video: {
      publishedAtISO: video.publishDateISO,
      durationSec: 0,
      views: 0,
      reference: video.reference,
      description: video.description,
    },
  }
}

/**
 * Carrega os vídeos publicados na tabela strimpim_videos e os converte em itens do feed.
 * Aplica LIKE em título/descrição e/ou filtro por categoria diretamente no banco.
 */
async function listPublishedStreams(
  params: { q?: string; category?: string } = {},
): Promise<Stream[]> {
  const categories = await listCategories()
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))
  const categoryId =
    params.category && params.category !== "all"
      ? categories.find((c) => c.name === params.category)?.id
      : undefined

  const videos = await searchVideos({ q: params.q, categoryId })
  return videos.map((video) => mapVideoToStream(video, categoryNameById))
}

function sortStreams(a: Stream, b: Stream) {
  // A transmissão ao vivo aparece sempre como primeira ocorrência.
  if (a.kind !== b.kind) {
    if (a.kind === "live") return -1
    if (b.kind === "live") return 1
  }
  return new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
}

function includesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase())
}

function matchesQuery(stream: Stream, q: string) {
  return (
    includesQuery(stream.title, q) ||
    includesQuery(stream.channelName, q) ||
    includesQuery(stream.category, q) ||
    stream.tags.some((t) => includesQuery(t, q))
  )
}

export async function listStreams(params: ListStreamsParams = {}) {
  const q = params.q?.trim()
  const category = params.category
  const kind = params.kind ?? "all"

  const results: Stream[] = []

  if (kind === "all" || kind === "live") {
    const categoryOk = !category || category === "all" || LIVE_STREAM.category === category
    const queryOk = !q || matchesQuery(LIVE_STREAM, q)
    if (categoryOk && queryOk) results.push(LIVE_STREAM)
  }

  if (kind === "all" || kind === "video") {
    results.push(...(await listPublishedStreams({ q, category })))
  }

  return results.sort(sortStreams)
}

export async function getStreamById(id: string) {
  if (LIVE_STREAM.id === id) return LIVE_STREAM

  const published = await listPublishedStreams()
  return published.find((s) => s.id === id) ?? null
}

