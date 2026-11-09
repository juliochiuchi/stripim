import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "@/constants/streaming/youtube"
import type { YoutubeShort } from "@/types/streaming/short"

const API_BASE = "https://www.googleapis.com/youtube/v3"
const MAX_SHORTS = 12
/** Shorts podem durar até 3 minutos — usado como corte de duração. */
const MAX_SHORT_DURATION_SEC = 180
/** Número máximo de páginas de uploads (50 itens cada) varridas por chamada. */
const MAX_UPLOAD_PAGES = 3

type Thumbnails = {
  high?: { url?: string }
  medium?: { url?: string }
  default?: { url?: string }
}

type ChannelsResponse = {
  items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
}

type PlaylistItemsResponse = {
  items?: {
    snippet?: {
      title?: string
      publishedAt?: string
      thumbnails?: Thumbnails
      resourceId?: { videoId?: string }
    }
  }[]
  nextPageToken?: string
}

type VideosResponse = {
  items?: { id?: string; contentDetails?: { duration?: string } }[]
}

/** Executa um GET na YouTube Data API acrescentando a chave. */
async function apiGet<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const search = new URLSearchParams({ ...params, key: YOUTUBE_API_KEY })
  const response = await fetch(`${API_BASE}/${path}?${search.toString()}`)
  if (!response.ok) {
    throw new Error(`Falha na YouTube API (${response.status}).`)
  }
  return (await response.json()) as T
}

/** Converte a duração ISO 8601 do YouTube (ex.: PT1M5S) em segundos. */
function parseIsoDuration(value: string): number {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, hours, minutes, seconds] = match
  return Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0)
}

function pickThumbnail(thumbnails: Thumbnails | undefined, videoId: string) {
  return (
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  )
}

/** Obtém a playlist de uploads do canal (1 unidade). */
async function getUploadsPlaylistId(): Promise<string | null> {
  const data = await apiGet<ChannelsResponse>("channels", {
    part: "contentDetails",
    id: YOUTUBE_CHANNEL_ID,
  })
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null
}

/**
 * Busca os Shorts mais recentes do canal sem usar search.list (100 unidades).
 * Percorre a playlist de uploads (1 unidade/página) e filtra por duração via
 * videos.list (1 unidade/lote), reduzindo o custo para poucas unidades.
 */
export async function listChannelShorts(): Promise<YoutubeShort[]> {
  if (!YOUTUBE_API_KEY) return []

  const uploadsPlaylistId = await getUploadsPlaylistId()
  if (!uploadsPlaylistId) return []

  const shorts: YoutubeShort[] = []
  let pageToken: string | undefined

  for (
    let page = 0;
    page < MAX_UPLOAD_PAGES && shorts.length < MAX_SHORTS;
    page++
  ) {
    const playlist = await apiGet<PlaylistItemsResponse>("playlistItems", {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    })

    const items = (playlist.items ?? [])
      .map((item) => ({
        id: item.snippet?.resourceId?.videoId,
        title: item.snippet?.title ?? "",
        publishedAtISO: item.snippet?.publishedAt ?? "",
        thumbnails: item.snippet?.thumbnails,
      }))
      .filter(
        (
          item,
        ): item is {
          id: string
          title: string
          publishedAtISO: string
          thumbnails: Thumbnails | undefined
        } => Boolean(item.id),
      )

    if (items.length) {
      const details = await apiGet<VideosResponse>("videos", {
        part: "contentDetails",
        id: items.map((item) => item.id).join(","),
      })

      const durationById = new Map(
        (details.items ?? []).map((video) => [
          video.id ?? "",
          parseIsoDuration(video.contentDetails?.duration ?? ""),
        ]),
      )

      for (const item of items) {
        const duration = durationById.get(item.id) ?? 0
        if (duration <= 0 || duration > MAX_SHORT_DURATION_SEC) continue

        shorts.push({
          id: item.id,
          title: item.title,
          thumbnailUrl: pickThumbnail(item.thumbnails, item.id),
          url: `https://www.youtube.com/shorts/${item.id}`,
          publishedAtISO: item.publishedAtISO || new Date().toISOString(),
        })

        if (shorts.length >= MAX_SHORTS) break
      }
    }

    pageToken = playlist.nextPageToken
    if (!pageToken) break
  }

  return shorts
}
