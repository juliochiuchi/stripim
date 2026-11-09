// Edge Function: sincroniza os uploads do canal do YouTube com a tabela
// public.strimpim_videos (upsert por "reference"). Atualiza metadados,
// duração e contagem real de visualizações.
//
// Secrets necessários:
//   YOUTUBE_API_KEY        (obrigatório)
//   YOUTUBE_CHANNEL_ID     (opcional; usa o canal da IPI Macaubal por padrão)
//   SYNC_MAX_VIDEOS        (opcional; limite de uploads por execução. Padrão: 300)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (fornecidos automaticamente pelo runtime)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const API_BASE = "https://www.googleapis.com/youtube/v3"
const JSON_HEADERS = { "Content-Type": "application/json" }

const CHANNEL_ID = Deno.env.get("YOUTUBE_CHANNEL_ID") ?? "UCKhKw97cqyvDtaXrljUcL0A"
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY") ?? ""
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const MAX_VIDEOS = Number(Deno.env.get("SYNC_MAX_VIDEOS") ?? "300")

// Limites das colunas da tabela.
const TITLE_MAX = 65
const DESCRIPTION_MAX = 110

type YoutubeVideo = {
  id?: string
  snippet?: {
    title?: string
    description?: string
    publishedAt?: string
  }
  contentDetails?: { duration?: string }
  statistics?: { viewCount?: string }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })
}

async function youtubeGet<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const search = new URLSearchParams({ ...params, key: YOUTUBE_API_KEY })
  const response = await fetch(`${API_BASE}/${path}?${search.toString()}`)
  if (!response.ok) {
    throw new Error(`YouTube API ${response.status}: ${await response.text()}`)
  }
  return (await response.json()) as T
}

/** Converte a duração ISO 8601 do YouTube (ex.: PT1M5S) em segundos. */
function parseIsoDuration(value = ""): number {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, hours, minutes, seconds] = match
  return Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0)
}

function truncate(value: string, max: number) {
  const trimmed = value.trim()
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

Deno.serve(async () => {
  if (!YOUTUBE_API_KEY) {
    return json({ error: "YOUTUBE_API_KEY não configurada." }, 500)
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "Credenciais do Supabase ausentes no runtime." }, 500)
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // 1) Playlist de uploads do canal (1 unidade).
    const channel = await youtubeGet<{
      items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
    }>("channels", { part: "contentDetails", id: CHANNEL_ID })

    const uploadsPlaylistId =
      channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) {
      return json({ error: "Playlist de uploads não encontrada." }, 404)
    }

    // 2) Coleta os ids dos uploads (1 unidade por página de 50).
    const videoIds: string[] = []
    let pageToken: string | undefined
    do {
      const page = await youtubeGet<{
        items?: { contentDetails?: { videoId?: string } }[]
        nextPageToken?: string
      }>("playlistItems", {
        part: "contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
        ...(pageToken ? { pageToken } : {}),
      })

      for (const item of page.items ?? []) {
        const id = item.contentDetails?.videoId
        if (id) videoIds.push(id)
        if (videoIds.length >= MAX_VIDEOS) break
      }

      pageToken = page.nextPageToken
    } while (pageToken && videoIds.length < MAX_VIDEOS)

    if (!videoIds.length) return json({ synced: 0 })

    // 3) Detalhes (título, descrição, data, duração e views) em lotes de 50 (1 unidade por lote).
    const syncedAt = new Date().toISOString()
    const rows: Record<string, unknown>[] = []

    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50)
      const details = await youtubeGet<{ items?: YoutubeVideo[] }>("videos", {
        part: "snippet,contentDetails,statistics",
        id: batch.join(","),
      })

      for (const video of details.items ?? []) {
        if (!video.id) continue
        const description = video.snippet?.description?.trim()
        rows.push({
          title: truncate(video.snippet?.title ?? "Sem título", TITLE_MAX),
          description: description ? truncate(description, DESCRIPTION_MAX) : null,
          reference: video.id,
          link: `https://www.youtube.com/watch?v=${video.id}`,
          publish_date: video.snippet?.publishedAt ?? syncedAt,
          duration_sec: parseIsoDuration(video.contentDetails?.duration),
          views: Number(video.statistics?.viewCount ?? 0),
          views_synced_at: syncedAt,
        })
      }
    }

    if (!rows.length) return json({ synced: 0 })

    // 4) Upsert por reference. category_ids é omitido de propósito para
    // preservar a curadoria de categorias feita no admin.
    const { error } = await supabase
      .from("strimpim_videos")
      .upsert(rows, { onConflict: "reference" })

    if (error) return json({ error: error.message }, 500)

    return json({ synced: rows.length, syncedAt })
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Falha no sync." },
      500,
    )
  }
})
