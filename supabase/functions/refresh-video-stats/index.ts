// Edge Function: atualiza sob demanda as estatísticas (views + duração) de um
// único vídeo, na abertura da página de visualização. Custo: 1 unidade por chamada.
//
// Body aceito: { "id": "<uuid>" }  ou  { "reference": "<youtube_video_id>" }
// Secrets: YOUTUBE_API_KEY + (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY automáticos)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const API_BASE = "https://www.googleapis.com/youtube/v3"
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY") ?? ""
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

const YT_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/|shorts\/|embed\/))([a-zA-Z0-9_-]{6,})/

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}

/** Converte a duração ISO 8601 do YouTube (ex.: PT1M5S) em segundos. */
function parseIsoDuration(value = ""): number {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, hours, minutes, seconds] = match
  return Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0)
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS })

  if (!YOUTUBE_API_KEY) return json({ error: "YOUTUBE_API_KEY não configurada." }, 500)
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "Credenciais do Supabase ausentes no runtime." }, 500)
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      id?: string
      reference?: string
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const rowId = body.id ?? null
    let youtubeId = body.reference ?? null

    // Sem o id do YouTube no body: descobre a partir da linha (reference ou link).
    if (!youtubeId && rowId) {
      const { data, error } = await supabase
        .from("strimpim_videos")
        .select("id, reference, link")
        .eq("id", rowId)
        .single()

      if (error) return json({ error: error.message }, 404)

      youtubeId = data.reference ?? data.link?.match(YT_ID_RE)?.[1] ?? null
    }

    if (!youtubeId) return json({ error: "Vídeo sem referência do YouTube." }, 400)

    const details = await fetch(
      `${API_BASE}/videos?part=statistics,contentDetails&id=${encodeURIComponent(youtubeId)}&key=${YOUTUBE_API_KEY}`,
    )
    if (!details.ok) {
      return json({ error: `YouTube API ${details.status}.` }, 502)
    }

    const payload = (await details.json()) as {
      items?: { id?: string; contentDetails?: { duration?: string }; statistics?: { viewCount?: string } }[]
    }
    const item = payload.items?.[0]
    if (!item) return json({ error: "Vídeo não encontrado no YouTube." }, 404)

    const views = Number(item.statistics?.viewCount ?? 0)
    const durationSec = parseIsoDuration(item.contentDetails?.duration)
    const syncedAt = new Date().toISOString()

    const update = supabase
      .from("strimpim_videos")
      .update({ views, duration_sec: durationSec, views_synced_at: syncedAt })

    const { error: updateError } = rowId
      ? await update.eq("id", rowId)
      : await update.eq("reference", youtubeId)

    if (updateError) return json({ error: updateError.message }, 500)

    return json({ views, durationSec, viewsSyncedAt: syncedAt })
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar." },
      500,
    )
  }
})
